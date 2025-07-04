# New Vanilla

The new Vanilla is a boilerplate to help developers create data portals based on piveau quickly.

## Overview

- Vue.js (SPA)
- TailwindCSS 4
- TypeScript
- piveau.kit
- Histoire

## Project Setup

```sh
git clone https://gitlab.com/piveau/ui/vanilla.git
```

### Install dependencies

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Compile and Minify for Production with Piveau Vue components

```sh
pnpm build
```

### Preview components in Histoire

```sh
pnpm story:dev
```

## CI/CD Pipeline

The project uses GitLab CI/CD with the following stages:

### Build Stage
- **build-asset**: Builds the frontend assets
    - Uses Node.js 18 Alpine image
    - Utilizes PNPM for package management
    - Caches dependencies for faster builds
    - Produces distribution artifacts in `dist/` directory

- **build-and-push**: Creates and pushes Docker images
    - Builds Docker image using the latest artifacts
    - Pushes two tags to the registry:
        - Latest commit SHA (`$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA`)
        - Latest version (`$CI_REGISTRY_IMAGE:latest`)

### Deploy Stage
- **deploy**: Deploys to OpenShift
    - imports the latest Docker image 
    - deploys to OpenShift

### Notes
- Pipeline runs on `fokus-runner` tags
- Master branch deployments only
- Caching strategy uses pull-push policy for node_modules and PNPM store
