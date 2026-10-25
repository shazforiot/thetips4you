# Thetips4you

The public site is hosted with GitHub Pages at <https://thetips4you.in/>.

This repository combines a React homepage with static, crawler-readable course and AI coding pages. The homepage highlights full courses, Zero to Hero videos, and AI coding tutorials. Course pages live at /courses/; AI coding guides live at /ai-coding/.

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

## Full courses

Edit data/courses.json to update the twelve selected learning paths and the DevOps playlist. The homepage highlights six videos in a compact layout.

Regenerate the static pages and sitemap after changing either video dataset:

    python scripts/generate_ai_pages.py
    python scripts/generate_course_pages.py

The course generator writes /courses/, twelve course pages, including the Ansible playlist, a combined video sitemap, and llms.txt. Keep titles, dates, runtimes, descriptions, and links aligned with the videos.

## Discoverability

- /sitemap.xml lists the homepage, course and AI guide pages, and fifteen video watch pages with video sitemap metadata; the Ansible playlist page is listed without a video entry.
- /robots.txt points crawlers to the sitemap.
- /llms.txt is a supplementary plain-text guide for agents that choose to use it.
- Static HTML links and page descriptions remain visible without JavaScript.

These files help crawlers find the content, but search engines decide when and whether to index it. After deployment, verify the domain in Google Search Console and submit https://thetips4you.in/sitemap.xml.
