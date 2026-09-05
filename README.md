# Thetips4you — GitHub Pages

Public destination after deployment: https://shazforiot.github.io/thetips4you/

This static React website preserves the 3D animation, responsive layout and working tutorial links. It does not depend on the private Sites host.

## Publish

1. Create a public repository named thetips4you under shazforiot. Do not initialize it with a README.
2. Upload this folder's source files, including .github/workflows/deploy.yml, to its main branch. Do not upload node_modules.
3. In the repository, choose Settings → Pages → Build and deployment → Source → GitHub Actions.
4. In Actions, select "Deploy website to GitHub Pages" and choose Run workflow if the first run happened before Pages was enabled.
5. Wait for a successful deployment, then visit the public destination above.

For command-line upload, run these inside this extracted source folder after signing into GitHub CLI:

    git init -b main
    git add .
    git commit -m "Publish Thetips4you website"
    gh repo create shazforiot/thetips4you --public --source=. --remote=origin --push

If the repository already exists, use its existing Git history; do not force-push or overwrite it.

## Develop

Node.js 22.13 or newer is required.

    npm ci
    npm run dev

## Build

    npm run build
    npm run preview

The dist/ folder contains the static website. The /thetips4you/ base path is configured in vite.config.ts for this repository. Update that setting if moving to a root domain or a different repository name.
