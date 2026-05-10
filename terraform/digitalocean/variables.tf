variable "app_name" {
  description = "The DigitalOcean App Platform app name"
  type        = string
  default     = "zudellio"
}

variable "static_site_name" {
  description = "The static site component name"
  type        = string
  default     = "website"
}

variable "region" {
  description = "The DigitalOcean App Platform region"
  type        = string
  default     = "nyc"
}

variable "github_repo" {
  description = "The GitHub repository in owner/repo format"
  type        = string
}

variable "github_branch" {
  description = "The Git branch DigitalOcean should deploy from"
  type        = string
  default     = "main"
}

variable "source_dir" {
  description = "The monorepo directory that contains the static site"
  type        = string
  default     = "interface"
}

variable "build_command" {
  description = "The build command DigitalOcean should run for the static site"
  type        = string
  default     = "npm ci && npm run build"
}
