"""Generate the optional site map for agents that use the llms.txt convention."""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOMAIN = "https://thetips4you.in"


def label(value):
    return value.replace("\\", "\\\\").replace("[", "\\[").replace("]", "\\]")


def entry(title, url, description):
    return f"- [{label(title)}]({url}): {description}"


def generate_llms():
    courses = json.loads((ROOT / "data/courses.json").read_text(encoding="utf-8-sig"))["courses"]
    guides = json.loads((ROOT / "data/ai-videos.json").read_text(encoding="utf-8-sig"))
    lines = [
        "# Thetips4you",
        "",
        "> Free, practical DevOps, cloud, and AI coding video tutorials from the Thetips4you YouTube channel.",
        "",
        "The linked pages provide topic summaries, embedded videos, and direct links to the original YouTube videos. They are not full video transcripts. Use the linked page for the current course details and attribution. Product features, pricing, and free-tier availability may change.",
        "",
        "## Start here",
        entry("Home", DOMAIN + "/", "Overview and featured tutorials."),
        entry("Full courses and Zero to Hero", DOMAIN + "/courses/", "Browse the DevOps, cloud, and observability learning paths."),
        entry("AI coding guides", DOMAIN + "/ai-coding/", "Browse practical AI coding agent tutorials."),
        "",
        "## Full courses",
    ]
    for course in courses:
        lines.append(entry(course["title"], f"{DOMAIN}/courses/{course['slug']}/", course["summary"]))
    lines += [
        "",
        "## Practical guide",
        entry("GitHub Actions CI for a Vite site", DOMAIN + "/guides/github-actions-vite-ci/", "A complete Node/Vite build workflow and troubleshooting steps."),
    ]
    lines += ["", "## AI coding guides"]
    for guide in guides:
        if guide["watch"]:
            lines.append(entry(guide["title"], f"{DOMAIN}/ai-coding/{guide['slug']}/", guide["summary"]))
    lines += [
        "",
        "## Other resources",
        entry("YouTube channel", "https://www.youtube.com/@Thetips4you", "Original videos and playlists."),
        entry("XML sitemap", DOMAIN + "/sitemap.xml", "Canonical page URLs and video sitemap entries."),
        "",
    ]
    (ROOT / "public/llms.txt").write_text("\n".join(lines), encoding="utf-8")


if __name__ == "__main__":
    generate_llms()
