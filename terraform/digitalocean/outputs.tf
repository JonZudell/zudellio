output "app_id" {
  value = digitalocean_app.website.id
}

output "default_ingress" {
  value = digitalocean_app.website.default_ingress
}

output "live_url" {
  value = digitalocean_app.website.live_url
}
