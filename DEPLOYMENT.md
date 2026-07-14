# Deployment

Production source of truth: the main branch of GitHub.

- Repository: DanielZhangzyj/suguangji-blog
- Cloudflare Pages: danielsdailynote (GitHub integration enabled)
- CloudBase environment: personalblog-d7ggzu6pz6dc10743
- CloudBase static hosting: personalblog-d7ggzu6pz6dc10743-1321560445.tcloudbaseapp.com
- CloudBase CloudRun service: blog
- Lighthouse site root: /var/www/suguangji-blog

Every push to main runs .github/workflows/deploy.yml. The workflow builds once, then publishes the same artifact to CloudBase hosting, CloudBase CloudRun, and the Lighthouse nginx site. Cloudflare Pages deploys automatically from the same GitHub push through its existing Git integration.

## GitHub Actions secrets

Configure these repository secrets in GitHub Settings > Secrets and variables > Actions:

- TCB_ENV_ID: personalblog-d7ggzu6pz6dc10743
- TCB_API_KEY_ID: CloudBase API key ID for CI
- TCB_API_KEY: CloudBase API key for CI
- LIGHTHOUSE_HOST: 115.159.67.196
- LIGHTHOUSE_USER: the SSH user authorized for deployment
- LIGHTHOUSE_PORT: 22
- LIGHTHOUSE_SSH_PRIVATE_KEY: private key matching the public key installed on the server

Never commit API keys or private keys. After these secrets are configured, a push to main is the only release action needed.