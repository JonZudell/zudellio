variable "region" {
  description = "The AWS region to create resources in."
  default     = "us-east-1"
}
variable "account_number" {
  description = "The AWS account ID to create resources in"
}

variable "account_name" {
  description = "The AWS account name to create resources in"
}

variable "profile" {
  description = "The AWS profile to use"
}