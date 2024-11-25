# Zudellio Project

This project consists of a React-based static site generator and Terraform configurations for managing infrastructure.

## Features

### Interface
- **Static Site Generation**: Pre-renders pages to static HTML.
- **Client-Side Hydration**: Hydrates the static HTML with React on the client-side.
- **Dynamic Routing**: Routes are dynamically generated based on the files in the `pages` directory.
- **TailwindCSS**: Utilizes TailwindCSS for styling.
- **React Router**: Manages client-side routing.

### Terraform
Use always set provider for resources, usually target, sometimes development, or production. 
High coupling between between modules. Pass the entire resource instead of an ARN or Name.
Sort variables alphabetically, add descriptions.
Sort outputs alphabetically. Start files with requires stanza.
```
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
      configuration_aliases = [
        aws.target,
      ]
    }
  }
}
```

- **Infrastructure as Code**: Manages AWS resources using Terraform.
- **Modular Configuration**: Uses modules to organize and reuse configurations.
- **Environment Management**: Supports multiple environments (e.g., dev, prod) with separate configurations.

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- Terraform (v1.0 or later)

