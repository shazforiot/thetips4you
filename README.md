# Thetips4you

The public site is hosted with GitHub Pages at <https://thetips4you.in/>.

This repository combines a React homepage with static, crawler-readable course and AI coding pages. The homepage highlights full courses, Zero to Hero videos, and AI coding tutorials. Course pages live at /courses/; AI coding guides live at /ai-coding/. A practical GitHub Actions/Vite CI guide lives at /guides/github-actions-vite-ci/.

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

The course generator writes /courses/, twelve course pages, including the Ansible playlist, the GitHub Actions/Vite CI guide, a combined video sitemap, and llms.txt. The Git, GitHub Actions, and Kubernetes course pages include original companion labs from data/course-guides/. The standalone guide content lives in data/guides/. Keep titles, dates, runtimes, descriptions, and links aligned with the videos.

## Discoverability

- /sitemap.xml lists the homepage, course and AI guide pages, the GitHub Actions/Vite CI guide, and fifteen video watch pages with video sitemap metadata; the Ansible playlist page is listed without a video entry.
- /robots.txt points crawlers to the sitemap.
- /llms.txt is a supplementary Markdown index for agents that choose to use it. HTML pages link to it with rel=describedby.
- /agents.txt declares no agent action endpoints for this content-only site and points to the content guide.
- Static HTML links and page descriptions remain visible without JavaScript.

These files help crawlers find the content, but search engines decide when and whether to index it. After deployment, verify the domain in Google Search Console and submit https://thetips4you.in/sitemap.xml.

## YouTube prompt analytics

The popup appears after 15 seconds and stores a 30-day suppression timestamp in the visitor's browser. When GA4 is configured, it sends these events:

- subscribe_prompt_view when the card becomes visible.
- subscribe_prompt_click when the YouTube button is clicked.
- subscribe_prompt_dismiss when the visitor chooses the close button or Not now. The dismiss_method parameter distinguishes those choices.

To activate GA4, create a Web data stream for https://thetips4you.in/ and copy its G- Measurement ID. In this repository, open Settings > Secrets and variables > Actions > Variables and add GA4_MEASUREMENT_ID with that value. Then run the Pages workflow again (or push a commit). The build includes the Google tag on all pages only when this variable is set. The tag loads immediately; there is no analytics consent banner.

Check the events in GA4 Realtime after triggering them, then in Reports > Engagement > Events. The click event counts button clicks; it cannot prove that a visitor reached YouTube or subscribed.
