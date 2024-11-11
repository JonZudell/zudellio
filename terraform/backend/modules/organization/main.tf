variable "monitoring_account_number" {
  description = "The account number of the monitoring account"
}

resource "aws_organizations_organization" "org" {
  aws_service_access_principals = ["sso.amazonaws.com","cloudtrail.amazonaws.com", "config.amazonaws.com"]
  feature_set                   = "ALL"
}

resource "aws_organizations_account" "monitoring_account" {
  depends_on = [aws_organizations_organization.org]
  name      = "MonitoringAccount"
  email     = "jon+monitoring@zudell.io"
}

provider "aws" {
  alias  = "monitoring"
  region = "us-east-1"
}

resource "aws_iam_role" "monitoring_role" {
  provider = aws.monitoring
  depends_on = [aws_organizations_organization.org]
  name     = "MonitoringRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS =  "arn:aws:iam::${var.monitoring_account_number}:root"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy" "monitoring_policy" {
  provider = aws.monitoring
  depends_on = [aws_organizations_organization.org]
  name     = "MonitoringPolicy"
  role     = aws_iam_role.monitoring_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "cloudwatch:PutMetricData",
          "cloudwatch:GetMetricData",
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_cloudwatch_log_group" "monitoring_log_group" {
  provider = aws.monitoring
  depends_on = [aws_organizations_organization.org]
  name     = "/aws/monitoring/logs"
  retention_in_days = 7
}

output "monitoring_role_arn" {
  value = aws_iam_role.monitoring_role.arn
}