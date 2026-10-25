# Thetips4you

The public site is hosted with GitHub Pages at <https://thetips4you.in/>.

This repository combines a React homepage with static, crawler-readable AI coding pages. The homepage highlights Claude Code, OpenCode, and Codex tutorials. The AI coding guide lives at /ai-coding/, with dedicated watch pages for four videos.

## Local development

Use Node.js 22.13 or newer.

    npm ci
    npm run dev

Build the GitHub Pages artifact with:

    npm run build

The output is in dist/. GitHub Actions deploys it when changes are pushed to main.

## AI coding content

Edit data/ai-videos.json to change the curated video list. The first two videos are featured on the guide page; the first three watch pages are featured on the homepage.

Regenerate the static guide, watch pages, sitemap, robots file, and llms.txt after changing the data:

    python scripts/generate_ai_pages.py

Four watch pages include embedded YouTube players and video structured data. Keep titles, upload dates, descriptions, and links aligned with the actual videos. scripts/generate_og.py creates the social sharing image if it needs to be refreshed.

## Discoverability

- /sitemap.xml lists the homepage, guide, and watch pages.
- /robots.txt points crawlers to the sitemap.
- /llms.txt is a supplementary plain-text guide for agents that choose to use it.
- Static HTML links and page descriptions remain visible without JavaScript.

These files help crawlers find the content, but search engines decide when and whether to index it. After deployment, verify the domain in Google Search Console and submit https://thetips4you.in/sitemap.xml.
