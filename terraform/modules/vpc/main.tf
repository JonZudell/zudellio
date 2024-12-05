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

variable "vpc_cidr_block" {
  description = "The CIDR block for the VPC"
  type        = string
}

variable "subnet_cidr_block" {
  description = "The CIDR block for the subnet"
  type        = string
}

variable "availability_zone" {
  description = "The availability zone for the subnet"
  type        = string
  default     = "us-east-1a"
}

resource "aws_vpc" "main" {
  provider = aws.target
  cidr_block = var.vpc_cidr_block
  enable_dns_support = true
  enable_dns_hostnames = true
  tags = {
    Name = "vpc"
  }
}

resource "aws_subnet" "main" {
  provider = aws.target
  vpc_id = aws_vpc.main.id
  cidr_block = var.subnet_cidr_block
  availability_zone = var.availability_zone
  map_public_ip_on_launch = false
  tags = {
    Name = "lambda-subnet"
  }
}

resource "aws_security_group" "main" {
  provider = aws.target
  vpc_id = aws_vpc.main.id
  name = "lambda-sg"
  description = "Security group for Lambda functions"
  tags = {
    Name = "lambda-sg"
  }
}

resource "aws_security_group_rule" "no_ingress_80" {
  provider = aws.target
  type = "ingress"
  from_port = 80
  to_port = 80
  protocol = "tcp"
  cidr_blocks = [var.subnet_cidr_block]
  security_group_id = aws_security_group.main.id
  description = "Disallow ingress from subnet CIDR block to port 80"
}

resource "aws_security_group_rule" "no_ingress_22" {
  provider = aws.target
  type = "ingress"
  from_port = 22
  to_port = 22
  protocol = "tcp"
  cidr_blocks = [var.subnet_cidr_block]
  security_group_id = aws_security_group.main.id
  description = "Disallow ingress from subnet CIDR block to port 22"
}

resource "aws_security_group_rule" "no_ingress_-1" {
  provider = aws.target
  type = "ingress"
  from_port = -1
  to_port = -1
  protocol = "-1"
  cidr_blocks = [var.subnet_cidr_block]
  security_group_id = aws_security_group.main.id
  description = "Disallow ingress from subnet CIDR block to port -1"
}

resource "aws_security_group_rule" "no_ingress_3389" {
  provider = aws.target
  type = "ingress"
  from_port = 3389
  to_port = 3389
  protocol = "tcp"
  cidr_blocks = [var.subnet_cidr_block]
  security_group_id = aws_security_group.main.id
  description = "Disallow ingress from subnet CIDR block to port 3389"
}

output "subnet" {
  description = "The ID of the subnet"
  value       = aws_subnet.main
}

output "security_group" {
  value = aws_security_group.main
}