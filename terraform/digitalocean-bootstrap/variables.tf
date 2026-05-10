variable "bucket_name" {
  description = "The Spaces bucket name for Terraform state"
  type        = string
}

variable "spaces_region" {
  description = "The DigitalOcean Spaces region"
  type        = string
  default     = "nyc3"
}
