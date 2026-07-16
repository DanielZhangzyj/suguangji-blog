# Deployment

Production source of truth: the local repository and its `main` branch on GitHub.

- Repository: DanielZhangzyj/suguangji-blog
- Cloudflare Pages: danielsdailynote
- CloudBase environment: personalblog-d7ggzu6pz6dc10743
- CloudBase static hosting: personalblog-d7ggzu6pz6dc10743-1321560445.tcloudbaseapp.com
- CloudBase CloudRun service: blog
- Lighthouse site root: /var/www/suguangji-blog

Use `scripts/deploy-direct.ps1` for releases. It builds once locally, syncs the release to GitHub, then publishes the same artifact directly to Cloudflare Pages, CloudBase hosting, CloudBase CloudRun, and the Lighthouse nginx site. GitHub is retained as the code backup and review history, not as the deployment trigger.

The GitHub Actions workflow is kept as a manual quality-check fallback only. It is intentionally not triggered by a push to `main`.

## Direct release

```powershell
.\scripts\deploy-direct.ps1
```

The script expects the local Cloudflare Wrangler login, CloudBase CLI login, and SSH alias `daniel-lighthouse-root` to be available. It stops immediately if any publishing target fails, so a failed deployment is never silently ignored.
