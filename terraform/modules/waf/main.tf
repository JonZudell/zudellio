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

resource "aws_wafv2_web_acl" "application" {
  provider = aws.target

  scope = "CLOUDFRONT"

  name        = "application-waf"
  description = "application WAF"

  default_action {
    allow {}
  }

  rule {
    name     = "application-rule"
    priority = 1

    action {
      block {}
    }

    statement {
      managed_rule_group_statement {
        vendor_name = "AWS"
        name        = "AWSManagedRulesCommonRuleSet"
      }
    }

    visibility_config {
      sampled_requests_enabled = true
      cloudwatch_metrics_enabled = true
      metric_name = "application-rule"
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "application-waf"
    sampled_requests_enabled   = true
  }
}

output "waf_acl" {
  value = aws_wafv2_web_acl.application
}