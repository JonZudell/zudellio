output "state_bucket_name" {
  value = digitalocean_spaces_bucket.terraform_state.name
}

output "state_bucket_endpoint" {
  value = digitalocean_spaces_bucket.terraform_state.endpoint
}

output "state_bucket_domain_name" {
  value = digitalocean_spaces_bucket.terraform_state.bucket_domain_name
}

output "spaces_access_key_id" {
  value     = digitalocean_spaces_key.terraform_state.access_key
  sensitive = true
}

output "spaces_secret_access_key" {
  value     = digitalocean_spaces_key.terraform_state.secret_key
  sensitive = true
}

output "state_backend_region" {
  value = "us-east-1"
}

output "state_backend_endpoint" {
  value = "https://${digitalocean_spaces_bucket.terraform_state.endpoint}"
}
