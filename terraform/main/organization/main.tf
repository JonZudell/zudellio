terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
      configuration_aliases = [
        aws.root,
      ]
    }
  }
}

resource "aws_organizations_organization" "org" {
  aws_service_access_principals = ["sso.amazonaws.com", "cloudtrail.amazonaws.com", "config.amazonaws.com"]
  feature_set                   = "ALL"
}

output "org_id" {
  value = aws_organizations_organization.org.id
}