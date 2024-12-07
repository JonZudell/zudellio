# zudell.io. Project

This project consists of a React-based static site generator and Terraform configurations for managing infrastructure.

## Build Static Site
Run `./scripts/build.sh`. This will build the static site, generate a manifest, build docker images, and push docker images.

## Release Process
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

## Interface
Uses a custom static site generation framework.
Hosted on static s3 behind cloudfront.

## Terraform
Executed as user with SSO admin permission. Some bootstrapping of the environment must take place.

## Testing
Pytest from root to test lambdas.

Use Storybook for interface tests.