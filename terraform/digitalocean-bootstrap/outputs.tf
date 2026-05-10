output "state_bucket_name" {
  value = digitalocean_spaces_bucket.terraform_state.name
}

output "state_bucket_endpoint" {
  value = digitalocean_spaces_bucket.terraform_state.endpoint
}

output "state_bucket_domain_name" {
  value = digitalocean_spaces_bucket.terraform_state.bucket_domain_name
}

output "state_backend_region" {
  value = "us-east-1"
}

output "state_backend_endpoint" {
  value = "https://${digitalocean_spaces_bucket.terraform_state.endpoint}"
}
