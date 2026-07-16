[CmdletBinding()]
param(
    [switch] $SkipCloudflare,
    [switch] $SkipCloudBaseHosting,
    [switch] $SkipCloudRun,
    [switch] $SkipLighthouse,
    [switch] $SkipGitHub
)

$ErrorActionPreference = 'Stop'

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$Dist = Join-Path $RepoRoot 'dist'
$CloudRunTemplate = Join-Path $RepoRoot 'cloudrun\blog'
$CloudRunSource = Join-Path $env:TEMP 'suguangji-blog-cloudrun-release'
$EnvId = 'personalblog-d7ggzu6pz6dc10743'
$PagesProject = 'danielsdailynote'
$LighthouseAlias = 'daniel-lighthouse-root'
$LighthouseRoot = '/var/www/suguangji-blog'
$Node = (Get-Command node -ErrorAction Stop).Source
$Npx = (Get-Command npx.cmd -ErrorAction Stop).Source

function Invoke-Native {
    param(
        [string] $FilePath,
        [string[]] $Arguments
    )

    & $FilePath @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "$FilePath failed with exit code $LASTEXITCODE."
    }
}

function Invoke-ReleaseStep {
    param([string] $Name, [scriptblock] $Action)
    Write-Host "`n==> $Name" -ForegroundColor Cyan
    & $Action
}

Set-Location $RepoRoot

Invoke-ReleaseStep 'Lint' {
    Invoke-Native $Node @('.\node_modules\eslint\bin\eslint.js', '.')
}
Invoke-ReleaseStep 'Build' {
    Invoke-Native $Node @('.\node_modules\typescript\bin\tsc', '-b')
    Invoke-Native $Node @('.\node_modules\vite\bin\vite.js', 'build')
}

if (-not (Test-Path (Join-Path $Dist 'index.html'))) {
    throw "Build output is missing: $Dist"
}

if (-not $SkipGitHub) {
    Invoke-ReleaseStep 'GitHub sync' {
        Invoke-Native 'git' @('-c', "safe.directory=$RepoRoot", 'add', '-A')
        $pending = Invoke-Native 'git' @('-c', "safe.directory=$RepoRoot", 'status', '--porcelain')
        if ($pending) {
            Invoke-Native 'git' @('-c', "safe.directory=$RepoRoot", 'commit', '-m', 'chore: sync direct production release')
        }
        Invoke-Native 'git' @('-c', "safe.directory=$RepoRoot", 'push', 'origin', 'main')
    }
}

if (-not $SkipCloudflare) {
    Invoke-ReleaseStep 'Cloudflare Pages' {
        Invoke-Native $Npx @('--registry=https://registry.npmjs.org', '--yes', 'wrangler@latest', 'pages', 'deploy', $Dist, '--project-name', $PagesProject, '--branch', 'main')
    }
}

if (-not $SkipCloudBaseHosting) {
    Invoke-ReleaseStep 'CloudBase static hosting' {
        Invoke-Native $Npx @('--registry=https://registry.npmjs.org', '--yes', '--package', '@cloudbase/cli', 'tcb', 'hosting', 'deploy', $Dist, '--env-id', $EnvId, '--json')
    }
}

if (-not $SkipCloudRun) {
    Invoke-ReleaseStep 'Prepare CloudRun source' {
        Remove-Item -LiteralPath $CloudRunSource -Recurse -Force -ErrorAction SilentlyContinue
        New-Item -ItemType Directory -Path $CloudRunSource -Force | Out-Null
        Copy-Item -Path (Join-Path $CloudRunTemplate '*') -Destination $CloudRunSource -Recurse -Force
        New-Item -ItemType Directory -Path (Join-Path $CloudRunSource 'public') -Force | Out-Null
        Copy-Item -Path (Join-Path $Dist '*') -Destination (Join-Path $CloudRunSource 'public') -Recurse -Force
    }
    Invoke-ReleaseStep 'CloudBase CloudRun' {
        Invoke-Native $Npx @('--registry=https://registry.npmjs.org', '--yes', '--package', '@cloudbase/cli', 'tcb', 'env', 'use', $EnvId)
        Invoke-Native $Npx @('--registry=https://registry.npmjs.org', '--yes', '--package', '@cloudbase/cli', 'tcb', 'cloudrun', 'deploy', '--serviceName', 'blog', '--source', $CloudRunSource, '--port', '8080', '--traffic', '--force', '--json')
        Invoke-Native $Npx @('--registry=https://registry.npmjs.org', '--yes', '--package', '@cloudbase/cli', 'tcb', 'cloudrun', 'traffic', 'promote', '--serviceName', 'blog', '--json')
        Invoke-Native $Npx @('--registry=https://registry.npmjs.org', '--yes', '--package', '@cloudbase/cli', 'tcb', 'cloudrun', 'list', '--serviceName', 'blog')
    }
}

if (-not $SkipLighthouse) {
    Invoke-ReleaseStep 'Tencent Lighthouse' {
        $Archive = Join-Path $env:TEMP ("suguangji-blog-{0}.tar.gz" -f ([Guid]::NewGuid().ToString('N')))
        try {
            Invoke-Native 'tar' @('-czf', $Archive, '-C', $Dist, '.')
            Invoke-Native 'scp' @('-O', $Archive, ("{0}:/tmp/suguangji-blog-release.tar.gz" -f $LighthouseAlias))
            @"
set -euo pipefail
target='$LighthouseRoot'
[ "`$target" = '/var/www/suguangji-blog' ]
release=/tmp/suguangji-blog-release
rm -rf "`$release"
mkdir -p "`$release" "`$target"
tar -xzf /tmp/suguangji-blog-release.tar.gz -C "`$release"
find "`$target" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
cp -a "`$release/." "`$target/"
nginx -t
systemctl reload nginx
rm -rf "`$release" /tmp/suguangji-blog-release.tar.gz
"@ | ssh $LighthouseAlias "tr -d '\r' | bash -s"
            if ($LASTEXITCODE -ne 0) {
                throw "ssh deployment failed with exit code $LASTEXITCODE."
            }
        }
        finally {
            Remove-Item -LiteralPath $Archive -Force -ErrorAction SilentlyContinue
        }
    }
}

Write-Host "`nRelease completed." -ForegroundColor Green
