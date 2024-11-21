terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
      configuration_aliases = [
        aws.target,
      ]
    }
  }
}

variable "cloudfront_distribution" {
  description = "The CloudFront distribution ID to route to"
}

resource "aws_route53_zone" "zudellio" {
  provider = aws.target
  name = "zudell.io"
}

resource "aws_route53_record" "mx_records" {
  provider = aws.target
  zone_id = aws_route53_zone.zudellio.zone_id
  name    = "@"
  type    = "MX"
  ttl     = 300
  records = [
    "1 aspmx.l.google.com",
    "5 alt1.aspmx.l.google.com",
    "5 alt2.aspmx.l.google.com",
    "10 alt3.aspmx.l.google.com",
    "10 alt4.aspmx.l.google.com"
  ]
  allow_overwrite = true
}
resource "aws_route53_record" "root_alias" {
  provider = aws.target
  zone_id = aws_route53_zone.zudellio.zone_id
  name    = ""
  type    = "A"

  alias {
    name                   = var.cloudfront_distribution.domain_name
    zone_id                = var.cloudfront_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "alias" {
  provider = aws.target
  zone_id = aws_route53_zone.zudellio.zone_id
  name    = "www"
  type    = "A"

  alias {
    name                   = var.cloudfront_distribution.domain_name
    zone_id                = var.cloudfront_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

output "name_servers" {
  description = "The list of name servers for the Route 53 hosted zone"
  value       = aws_route53_zone.zudellio.name_servers
}