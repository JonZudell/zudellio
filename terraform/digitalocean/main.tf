terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }

  backend "s3" {}
}

resource "digitalocean_app" "website" {
  spec {
    name   = var.app_name
    region = var.region

    static_site {
      name              = var.static_site_name
      build_command     = var.build_command
      source_dir        = var.source_dir
      index_document    = "index.html"
      catchall_document = "index.html"

      github {
        repo           = var.github_repo
        branch         = var.github_branch
        deploy_on_push = true
      }
    }
  }
}
