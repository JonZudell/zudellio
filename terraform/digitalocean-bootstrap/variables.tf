variable "digitalocean_token" {
  description = "DigitalOcean API token for provider authentication"
  type        = string
  sensitive   = true
}

variable "bucket_name" {
  description = "The Spaces bucket name (created via API)"
  type        = string
}

variable "bucket_endpoint" {
  description = "The bucket endpoint (from API response)"
  type        = string
}

variable "bucket_domain_name" {
  description = "The bucket domain name (from API response)"
  type        = string
}

variable "spaces_region" {
  description = "The DigitalOcean Spaces region"
  type        = string
  default     = "nyc3"
}
