variable "bucket_name" {
  description = "The Spaces bucket name for Terraform state"
  type        = string
}

variable "spaces_region" {
  description = "The DigitalOcean Spaces region"
  type        = string
  default     = "nyc3"
}

variable "spaces_key_name" {
  description = "The Spaces access key name for Terraform backend access"
  type        = string
  default     = "terraform-backend-key"
}
