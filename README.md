# zudell.io. Project

This project consists of a React-based static site generator and Terraform configurations for managing infrastructure.

## Framework
This project uses a custom framework that generates the interface, lambdas, and dynamodb tables.

### Interface
Uses a custom static site generation framework.
Hosted on static s3 behind cloudfront.

### Lambdas
Docker images are built for every lambda image. Lambda ECRs are named based on lambda file_path. Lambdas are automatically wired into api-gateway

### Framework Build
Run `./scripts/build.sh`. This will build the static site, generate a manifest, build docker images, and push docker images.

### Release Process
This `terraform.tfvars` needs populated with data. 
```
root_account_id           = ""
infrastructure_account_id = ""
monitoring_account_id     = ""
security_account_id       = ""
development_account_id    = ""
production_account_id     = ""
root_account_name         = ""
profile_suffix            = ""
dist_dir                  = ""
manifest_dir              = ""
image_tag                 = ""
production_image_tag      = ""
```
A manifest for both releases as well as a matching dist directory must be present.
Run `./scripts/idempotent_terraform.sh`. This will init and apply terraform which will have the following effects. Terraform will read the manifest and dist directories. Terraform will update the static site with the contents of dist. Terraform will update lambdas to match the latest image hash. All will be right with the world. 

## Testing
Pytest from root to test lambdas.

Use Storybook for interface tests.

## DigitalOcean Migration

Runbook: [docs/digitalocean-migration-runbook.md](docs/digitalocean-migration-runbook.md)

Backend bootstrap guide: [docs/digitalocean-backend-bootstrap.md](docs/digitalocean-backend-bootstrap.md)

Backend bootstrap helper script: [scripts/bootstrap_do_backend.sh](scripts/bootstrap_do_backend.sh)

DigitalOcean deployment pipeline: [.github/workflows/deploy-digitalocean.yml](.github/workflows/deploy-digitalocean.yml)

Terraform root for DigitalOcean App Platform: [terraform/digitalocean/main.tf](terraform/digitalocean/main.tf)

The GitHub Actions workflow requires this secret:

- `DIGITALOCEAN_TOKEN`

The workflow now bootstraps backend state automatically (bucket + Spaces key) using Terraform in `terraform/digitalocean-bootstrap`.

Optional environment variables in GitHub Environment `digitalocean-production`:

- `DO_STATE_BUCKET_NAME` (default: `zudellio-tf-state`)
- `DO_SPACES_REGION` (default: `nyc3`)
- `DO_SPACES_KEY_NAME` (default: `terraform-backend-key`)