variable "aws_endpoint_url" {
  description = "The AWS region to create resources in."
  default     = "http://localhost:5000"
}

variable "region" {
  description = "The AWS region to create resources in."
  default     = "us-east-1"
}

variable "access_key" {
  description = "The AWS access key to use for creating resources"
  default     = "mock_access_key"
}

variable "secret_key" {
  description = "The AWS secret key to use for creating resources"
  default     = "mock_secret_key"
}