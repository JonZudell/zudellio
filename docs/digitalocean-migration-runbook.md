# DigitalOcean Migration Runbook for zudellio

This repository currently provisions AWS infrastructure (CloudFront + S3 static site, Route53 DNS, API Gateway, Lambda, ECR, and Terraform S3 backend). This runbook covers moving hosting to DigitalOcean while keeping Google Workspace mail working.

## Current architecture references

- AWS Terraform entrypoint: terraform/main/main.tf
- DNS and Google MX records: terraform/modules/dns/main.tf
- CloudFront + S3 website: terraform/modules/cloudfront/main.tf
- API Gateway + Lambda wiring: terraform/modules/api_gateway/main.tf
- ECR-based image workflow: scripts/build_lambda_images.sh and scripts/build_container_images.sh

## Migration strategy

Use two phases to reduce risk.

1. Phase 1 (recommended):
- Move only website hosting to DigitalOcean.
- Keep API Gateway/Lambda on AWS until website traffic is stable on DigitalOcean.
- Keep Google Workspace DNS mail records unchanged.

2. Phase 2 (optional):
- Migrate API and worker workloads from AWS Lambda/ECR to DigitalOcean services.

## Phase 1: Move website hosting to DigitalOcean

### 1. Prepare DigitalOcean target

Preferred hosting options:

1. App Platform (managed, fastest):
- Product: https://docs.digitalocean.com/products/app-platform/
- Create app: https://docs.digitalocean.com/products/app-platform/how-to/create-apps/
- Domains on app: https://docs.digitalocean.com/products/app-platform/how-to/manage-domains/

2. Droplet + Nginx/Caddy (more control):
- Droplets: https://docs.digitalocean.com/products/droplets/

3. DOKS (if you want Kubernetes):
- Kubernetes: https://docs.digitalocean.com/products/kubernetes/

### 2. Build and deploy static interface

Because this repo uses a custom framework build pipeline, run your normal build process first:

- Build pipeline reference: README.md
- Script reference: scripts/build.sh

Deploy the built interface output to your DigitalOcean hosting target.

### 3. Configure domain records for web only

If migrating DNS management to DigitalOcean DNS:

- DNS overview: https://docs.digitalocean.com/products/networking/dns/
- Manage records: https://docs.digitalocean.com/products/networking/dns/how-to/manage-records/
- Registrar nameserver changes: https://docs.digitalocean.com/products/networking/dns/getting-started/dns-registrars/

Cutover rule:

- Change only website records (root and www) to DigitalOcean targets.
- Do not change mail-related records.

## Google Workspace mail safety checklist

Keep these records intact during and after web cutover.

1. MX:
- 1 ASPMX.L.GOOGLE.COM
- 5 ALT1.ASPMX.L.GOOGLE.COM
- 5 ALT2.ASPMX.L.GOOGLE.COM
- 10 ALT3.ASPMX.L.GOOGLE.COM
- 10 ALT4.ASPMX.L.GOOGLE.COM
- Ref: https://support.google.com/a/answer/140034

2. SPF:
- v=spf1 include:_spf.google.com ~all
- Ref: https://support.google.com/a/answer/33786

3. DKIM:
- Keep selector record from Google Admin (often google._domainkey)
- Ref: https://support.google.com/a/answer/180504

4. DMARC:
- Keep existing _dmarc TXT record
- Ref: https://support.google.com/a/answer/2466580

Validation tools:

- Google MX check: https://toolbox.googleapps.com/apps/checkmx/

## Phase 2: Migrate API/Lambda workloads (optional)

This repo currently depends on AWS API Gateway + Lambda + ECR. If you want to fully leave AWS, pick a target stack:

1. DigitalOcean Functions + App Platform API service
- Functions docs: https://docs.digitalocean.com/products/functions/
- App Platform docs: https://docs.digitalocean.com/products/app-platform/

2. App Platform containerized API services only
- App spec reference: https://docs.digitalocean.com/products/app-platform/reference/app-spec/

3. DOKS microservices
- Kubernetes docs: https://docs.digitalocean.com/products/kubernetes/

You will need to replace:

- API Gateway routing
- Lambda runtime/deployment model
- ECR image hosting workflow
- AWS IAM-auth assumptions

## Cutover run order

1. Reduce TTL for web and mail records 24 hours before cutover.
2. Deploy website to DigitalOcean and validate temporary domain.
3. Snapshot all existing DNS records.
4. Change only web DNS records to DigitalOcean endpoints.
5. Verify website functionality.
6. Verify Google mail send/receive and SPF/DKIM/DMARC in headers.
7. Keep AWS web stack available for quick rollback until stable.

## Rollback plan

1. Revert only web DNS records to previous AWS targets.
2. Keep Google Workspace records unchanged.
3. Re-run validation checks.

## Decision checkpoint

Before Phase 2, decide whether the goal is:

1. Website-only migration to DigitalOcean (fast, low risk), or
2. Full platform migration off AWS (larger re-architecture).
