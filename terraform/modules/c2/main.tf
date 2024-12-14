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
variable "c2_username" {}
variable "c2_password" {}
variable "c2_license" {}

resource "aws_vpc" "main" {
  provider = aws.target
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "main-vpc"
  }
}
resource "aws_secretsmanager_secret" "c2_secret" {
  provider = aws.target
  name = "c2-secret"
}

resource "aws_secretsmanager_secret_version" "c2_secret_version" {
  provider = aws.target
  secret_id = aws_secretsmanager_secret.c2_secret.id
  secret_string = jsonencode({
    C2_USERNAME = var.c2_username,
    C2_PASSWORD = var.c2_password,
    C2_LICENSE = var.c2_license
  })
}

resource "aws_ecs_task_definition" "main" {
  provider = aws.target
  family = "main-task"
  network_mode = "awsvpc"

  container_definitions = jsonencode([
    {
      name = "c2-container"
      image = "585768141523.dkr.ecr.us-east-1.amazonaws.com/c2:20241214143105-9f22b6cb"
      essential = true
      memory = 512
      cpu = 256
      portMappings = [
        {
          containerPort = 80
          hostPort = 80
        }
      ]
      environment = [
        {
          name = "C2_SECRETS"
          valueFrom = aws_secretsmanager_secret.c2_secret.arn
        }
      ]
    }
  ])
}

resource "aws_subnet" "main" {
  provider = aws.target
  vpc_id = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "us-west-2a"

  tags = {
    Name = "main-subnet"
  }
}

resource "aws_ecs_cluster" "main" {
  provider = aws.target
  name = "main-cluster"
}

resource "aws_ecs_service" "main" {
  provider = aws.target
  name = "main-service"
  cluster = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.main.arn
  desired_count = 1
  launch_type = "FARGATE"

  network_configuration {
    subnets = [aws_subnet.main.id]
    assign_public_ip = true
  }
}