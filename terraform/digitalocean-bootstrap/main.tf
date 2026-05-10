terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

resource "digitalocean_spaces_bucket" "terraform_state" {
  name   = var.bucket_name
  region = var.spaces_region
  acl    = "private"
}
