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

variable "development_cloudfront_distribution" {
  description = "The CloudFront distribution ID to route to"
  type        = object({
    domain_name    = string
    hosted_zone_id = string
  })
}

variable "production_cloudfront_distribution" {
  description = "The CloudFront distribution ID to route to"
  type        = object({
    domain_name    = string
    hosted_zone_id = string
  })
}
variable "development_account_id" {
  description = "AWS Account ID of the target account"
  type        = string
}

resource "aws_route53_zone" "zone" {
  provider = aws.target
  name = "zudell.io"
}

resource "aws_route53_record" "mx_records" {
  provider = aws.target
  zone_id = aws_route53_zone.zone.zone_id
  name    = ""
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
  zone_id = aws_route53_zone.zone.zone_id
  name    = ""
  type    = "A"

  alias {
    name                   = var.production_cloudfront_distribution.domain_name
    zone_id                = var.production_cloudfront_distribution.hosted_zone_id
    evaluate_target_health = false
  }
  allow_overwrite = true
}

resource "aws_route53_record" "www_alias" {
  provider = aws.target
  zone_id = aws_route53_zone.zone.zone_id
  name    = "www"
  type    = "A"

  alias {
    name                   = aws_route53_record.root_alias.fqdn
    zone_id                = aws_route53_zone.zone.zone_id
    evaluate_target_health = false
  }
  allow_overwrite = true
}

resource "aws_route53_record" "dev_alias" {
  provider = aws.target
  zone_id = aws_route53_zone.zone.zone_id
  name    = "dev"
  type    = "A"

  alias {
    name                   = var.development_cloudfront_distribution.domain_name
    zone_id                = var.development_cloudfront_distribution.hosted_zone_id
    evaluate_target_health = false
  }
  allow_overwrite = true
}

resource "aws_route53_record" "alias" {
  provider = aws.target
  zone_id = aws_route53_zone.zone.zone_id
  name    = "zudell.io"
  type    = "A"

  alias {
    name                   = var.production_cloudfront_distribution.domain_name
    zone_id                = var.production_cloudfront_distribution.hosted_zone_id
    evaluate_target_health = false
  }
  allow_overwrite = true
}
resource "aws_acm_certificate" "zone_cert" {
  provider = aws.target
  domain_name = "zudell.io"
  validation_method = "DNS"

  subject_alternative_names = [
    "www.zudell.io",
    "dev.zudell.io",
  ]

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "zone_cert_validation" {
  provider = aws.target
  for_each = {
    for dvo in aws_acm_certificate.zone_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }

  zone_id = aws_route53_zone.zone.zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "zone_cert_validation" {
  provider = aws.target
  certificate_arn         = aws_acm_certificate.zone_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.zone_cert_validation : record.fqdn]
}

output "cloudfront_distribution_certificate" {
  description = "The ARN of the ACM certificate"
  value       = aws_acm_certificate.zone_cert
}

output "name_servers" {
  description = "The list of name servers for the Route 53 hosted zone"
  value       = aws_route53_zone.zone.name_servers
}