# ⚡️ Zerops Actions

A GitHub Action for streamlining Zerops deployment workflows in your projects.

## 🧐 Usage

To implement the Zerops deployment workflow, add the following GitHub Actions
configuration to `.github/workflows/deploy.yml` and modify it as per your needs:

```yaml
name: Deploy to Zerops

on:
  push:
    # Make sure to set this to the branch you want to deploy from
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy with Zerops
        uses: zeropsio/actions@main
        with:
          access-token: ${{ secrets.ZEROPS_TOKEN }} # Make sure to set this in your repository secrets
          service-id: EjmDVbL0QMuemLJ2hSO6zw # Replace it with your own Service ID
```

See a live example in the
[Zerops GitHub Action repository](https://github.com/nermalcat69/Site/blob/main/.github/workflows/deploy.yml).

## ⚙️ Environment Setup

### 🔑 Zerops Token Generation

A personal access token is required to authenticate the Zerops CLI. This token
has admin privileges, so handle it with care.

1. Navigate to
   [Settings > Access Token Management](https://app.zerops.io/settings/token-management)
   in the Zerops application.
2. Generate a new access token.

### 🔍 Retrieving the Service ID

The service ID is used to identify your Zerops service.

1. Access your service dashboard at
   `https://app.zerops.io/service-stack/<your-service-id>/dashboard`.
2. The service ID is the alphanumeric string in the URL (e.g.,
   `EjmDVbL0QMuemLJ2hSO6zw`).

### 🔒 Configuring Repository Secrets

Store the Zerops token and service ID as secrets in your GitHub repository:

1. Go to your GitHub repository.
2. Navigate to Settings > Secrets and variables > Actions > Repository secrets.
3. Add the following secret:
   - `ZEROPS_TOKEN`: Your Zerops access token
