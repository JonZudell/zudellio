output "state_bucket_name" {
  value = var.bucket_name
}

output "state_bucket_endpoint" {
  value = var.bucket_endpoint
}

output "state_bucket_domain_name" {
  value = var.bucket_domain_name
}

output "state_backend_region" {
  value = "us-east-1"
}

output "state_backend_endpoint" {
  value = "https://${var.bucket_endpoint}"
}
