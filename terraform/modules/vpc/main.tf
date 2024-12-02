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
  default     = "10.0.0.0/16"
}

variable "subnet_cidr_block" {
  description = "The CIDR block for the subnet"
  type        = string
  default     = "10.0.1.0/24"
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
  map_public_ip_on_launch = true
  tags = {
    Name = "subnet"
  }
}

resource "aws_security_group" "main" {
  provider = aws.target
  vpc_id = aws_vpc.main.id
  name = "sg"
  description = "Main security group"
  ingress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Name = "sg"
  }
}
