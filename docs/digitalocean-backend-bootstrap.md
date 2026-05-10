# DigitalOcean Terraform Backend Bootstrap

Use this flow to bootstrap the Terraform backend bucket in DigitalOcean Spaces, then migrate the website stack state to that backend.

## Prerequisites

- A DigitalOcean personal access token (`DIGITALOCEAN_TOKEN`)

Set this environment variable in your shell before running Terraform:

```bash
export DIGITALOCEAN_TOKEN="..."
```

Note: Depending on your local provider auth configuration, DigitalOcean may also require Spaces API credentials to create bucket resources. If prompted, set `SPACES_ACCESS_KEY_ID` and `SPACES_SECRET_ACCESS_KEY` and rerun.

## GitHub Actions behavior

The deployment workflow now bootstraps backend state automatically before running the main stack.

Required GitHub Environment secret:

- `DIGITALOCEAN_TOKEN`

Optional GitHub Environment variables:

- `DO_STATE_BUCKET_NAME` (default: `zudellio-tf-state`)
- `DO_SPACES_REGION` (default: `nyc3`)
- `DO_SPACES_KEY_NAME` (default: `terraform-backend-key`)

The workflow creates temporary Spaces credentials from the DigitalOcean token for backend bootstrap.

## 1) Bootstrap the state bucket and Spaces key (local state)

Use the helper script. It is idempotent for the bucket (imports if it already exists), then applies Terraform:

```bash
./scripts/bootstrap_do_backend.sh <your-state-bucket-name> [spaces-region]
```

Example:

```bash
./scripts/bootstrap_do_backend.sh zudellio-tf-state nyc3
```

The script prints values to use for backend configuration and GitHub variables:

- `DO_STATE_BUCKET`
- `DO_STATE_REGION`
- `DO_STATE_ENDPOINT`

## 2) Create backend.hcl for the website stack

Create `terraform/digitalocean/backend.hcl` with your values:

```hcl
bucket     = "<your-state-bucket-name>"
key        = "terraform/digitalocean/website.tfstate"
region     = "us-east-1"
endpoints = {
  s3 = "https://nyc3.digitaloceanspaces.com"
}
access_key = "<DO_SPACES_ACCESS_KEY_ID>"
secret_key = "<DO_SPACES_SECRET_ACCESS_KEY>"

skip_credentials_validation = true
skip_metadata_api_check     = true
skip_region_validation      = true
force_path_style            = true
```

## 3) Initialize and migrate state

If this is a new stack:

```bash
cd terraform/digitalocean
terraform init -backend-config=backend.hcl
```

If local state already exists and you need to move it into Spaces:

```bash
cd terraform/digitalocean
terraform init -migrate-state -backend-config=backend.hcl
```

## 4) Keep CI secrets aligned

Set the same values in GitHub Actions secrets:

- `DO_STATE_BUCKET`
- `DO_STATE_REGION` (use `us-east-1` for backend compatibility)
- `DO_STATE_ENDPOINT` (for example `https://nyc3.digitaloceanspaces.com`)
- `DO_SPACES_ACCESS_KEY_ID`
- `DO_SPACES_SECRET_ACCESS_KEY`
