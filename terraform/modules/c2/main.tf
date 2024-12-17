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
variable "c2_image" {}
variable "c2_secrets" {
  default = "c2_secrets"
}
resource "aws_secretsmanager_secret" "c2_secrets" {
  provider = aws.target
  name = var.c2_secrets
}

resource "aws_secretsmanager_secret_version" "c2_secrets_version" {
  provider = aws.target
  secret_id     = aws_secretsmanager_secret.c2_secrets.id
  secret_string = jsonencode({
    username = var.c2_username
    password = var.c2_password
    license  = var.c2_license
  })
}
resource "aws_eip" "c2_eip" {
  provider = aws.target
  instance = aws_instance.c2_instance.id
}

resource "aws_eip_association" "c2_eip_association" {
  provider = aws.target
  instance_id   = aws_instance.c2_instance.id
  allocation_id = aws_eip.c2_eip.id
}

resource "aws_security_group_rule" "allow_http" {
  provider = aws.target
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.c2_sg.id
}

resource "aws_security_group" "c2_sg" {
  provider = aws.target
  name        = "c2_sg"
  description = "Allow SSH inbound traffic"
  vpc_id      = aws_vpc.c2_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_network_interface_sg_attachment" "c2_sg_attachment" {
  provider = aws.target
  security_group_id    = aws_security_group.c2_sg.id
  network_interface_id = aws_instance.c2_instance.primary_network_interface_id
}

resource "aws_vpc" "c2_vpc" {
  provider = aws.target
  cidr_block = "10.0.0.0/16"
  enable_dns_support = true
  enable_dns_hostnames = true
  tags = {
    Name = "c2-vpc"
  }
}

resource "aws_subnet" "c2_subnet" {
  provider = aws.target
  vpc_id = aws_vpc.c2_vpc.id
  cidr_block = "10.0.1.0/24"
    availability_zone = "us-east-1a"
  tags = {
    Name = "c2-subnet"
  }
}

resource "aws_internet_gateway" "c2_igw" {
  provider = aws.target
  vpc_id = aws_vpc.c2_vpc.id
  tags = {
    Name = "c2-igw"
  }
}

resource "aws_route_table" "c2_route_table" {
  provider = aws.target
  vpc_id = aws_vpc.c2_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.c2_igw.id
  }
  tags = {
    Name = "c2-route-table"
  }
}
resource "aws_iam_role" "c2_instance_role" {
  provider = aws.target
  name = "c2_instance_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_policy" "c2_instance_policy" {
  provider = aws.target
  name = "c2_instance_policy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetAuthorizationToken",
          "ecr:DescribeRepositories",
          "ecr:ListImages",
          "ecr:DescribeImages"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "c2_instance_role_attachment" {
  provider = aws.target
  role = aws_iam_role.c2_instance_role.name
  policy_arn = aws_iam_policy.c2_instance_policy.arn
}

resource "aws_iam_instance_profile" "c2_instance_profile" {
  provider = aws.target
  name = "c2_instance_profile"
  role = aws_iam_role.c2_instance_role.name
}
resource "aws_route_table_association" "c2_route_table_association" {
  provider = aws.target
  subnet_id = aws_subnet.c2_subnet.id
  route_table_id = aws_route_table.c2_route_table.id
}

resource "aws_instance" "c2_instance" {
  provider = aws.target
  depends_on = [aws_key_pair.c2_key_pair, aws_secretsmanager_secret_version.c2_secrets_version]
  disable_api_termination = false
  ami           = "ami-0bf0565838358789b"
  iam_instance_profile = aws_iam_instance_profile.c2_instance_profile.name
  instance_type = "t4g.micro"
  key_name      = "c2-key-pair"
  subnet_id     = aws_subnet.c2_subnet.id
  user_data = <<-EOF
              yum install -y polkit jq
              yum update -y
              amazon-linux-extras install docker -y
              systemctl enable docker
              systemctl start docker
              usermod -a -G docker ec2-user

              AWS_DEFAULT_REGION=$(curl -s http://169.254.169.254/latest/dynamic/instance-identity/document | jq -r .region)
              aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 585768141523.dkr.ecr.us-east-1.amazonaws.com
              aws secretsmanager get-secret-value --secret-id ${var.c2_secrets} --query 'SecretString' --output text --region $AWS_DEFAULT_REGION | jq -r 'to_entries|map("\(.key)=\(.value|tostring)")|.[]' > /tmp/c2_secrets.env
              # Allow Docker container to access instance metadata
              iptables -t nat -A OUTPUT -d 169.254.169.254 -j DNAT --to-destination 169.254.169.254
              # Run your Docker container
              docker run --env-file /tmp/c2_secrets.env -d -p 8080:8080 ${var.c2_image}

              # Set up port forwarding
              iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
              iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 8080

              # Save iptables rules
              service iptables save
              EOF

  tags = {
    Name = "c2-instance"
  }
}

resource "aws_key_pair" "c2_key_pair" {
  provider = aws.target
  key_name   = "c2-key-pair"
  public_key = file("../../.sensitive/id_rsa.pub")
}

output "c2_instance_public_ip" {
  value = aws_eip.c2_eip.public_ip
}