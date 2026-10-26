from pathlib import Path
import html
import json
from generate_llms import generate_llms

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
COURSES_DIR = PUBLIC / "courses"
COURSES_DIR.mkdir(exist_ok=True)
DOMAIN = "https://thetips4you.in"
data = json.loads((ROOT / "data/courses.json").read_text(encoding="utf-8-sig"))
courses = data["courses"]
roadmap = data["roadmap"]
ai_videos = json.loads((ROOT / "data/ai-videos.json").read_text(encoding="utf-8-sig"))
def esc(value):
    return html.escape(str(value), quote=True)
def course_url(course):
    return f"/courses/{course['slug']}/"
def yt(course):
    return course["playlistUrl"] if course.get("type") == "playlist" else f"https://www.youtube.com/watch?v={course['id']}"
def thumb(course):
    return f"https://i.ytimg.com/vi/{course['id']}/hqdefault.jpg"
def json_ld(value):
    return json.dumps(value, ensure_ascii=False).replace("<", "\\u003c")
def head(title, description, path, image=None, schema=None):
    canonical = DOMAIN + path
    image = image or DOMAIN + "/og-cover.png"
    structured = f'<script type="application/ld+json">{json_ld(schema)}</script>' if schema else ""
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="index,follow,max-video-preview:-1"><title>{esc(title)}</title><meta name="description" content="{esc(description)}"><link rel="canonical" href="{esc(canonical)}"><link rel="describedby" href="/llms.txt" type="text/markdown"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><meta name="theme-color" content="#111310"><meta property="og:type" content="website"><meta property="og:site_name" content="Thetips4you"><meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(description)}"><meta property="og:url" content="{esc(canonical)}"><meta property="og:image" content="{esc(image)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="{esc(image)}"><link rel="stylesheet" href="/courses/style.css">{structured}</head><body><a class="skip" href="#main">Skip to content</a><header><div class="wrap head"><a class="brand" href="/">thetips<span>4</span>you.</a><nav aria-label="Main navigation"><a href="/">Home</a><a href="/courses/" aria-current="page">Full courses</a><a href="/ai-coding/">AI coding</a></nav><a class="channel" href="https://www.youtube.com/@Thetips4you" target="_blank" rel="noopener noreferrer">YouTube ↗</a></div></header><main id="main">'''
def foot():
    return '</main><footer><div class="wrap foot"><a class="brand" href="/">thetips<span>4</span>you.</a><p>Practical DevOps, cloud and AI coding tutorials.</p><a href="https://www.youtube.com/@Thetips4you" target="_blank" rel="noopener noreferrer">Visit the channel ↗</a></div></footer></body></html>'
def breadcrumbs(course=None):
    items = [("Home", DOMAIN + "/"), ("Full courses", DOMAIN + "/courses/")]
    if course:
        items.append((course["title"], DOMAIN + course_url(course)))
    return {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":i+1,"name":name,"item":url} for i,(name,url) in enumerate(items)]}
def card(course):
    label = "Open playlist on YouTube" if course.get("type") == "playlist" else "Watch on YouTube"
    return f'''<article class="course-card"><a class="thumb" href="{esc(course_url(course))}" aria-label="View {esc(course['title'])}"><img src="{esc(thumb(course))}" alt="{esc(course['title'])} video thumbnail" loading="lazy" width="480" height="360"><span class="play" aria-hidden="true">▶</span><span class="length">{esc(course['duration'])}</span></a><div class="course-card-body"><p class="kicker">{esc(course['category'])} / {esc(course['format'])}</p><h3><a href="{esc(course_url(course))}">{esc(course['title'])}</a></h3><p>{esc(course['summary'])}</p><div class="course-card-actions"><a href="{esc(course_url(course))}">Course details →</a><a href="{esc(yt(course))}" target="_blank" rel="noopener noreferrer">{label} ↗</a></div></div></article>'''

description = "Explore Thetips4you full courses, crash courses and learning series for Linux, Git, Docker, Kubernetes, GitHub Actions, Jenkins, AWS, Ansible, Prometheus and more."
schema = [{"@context":"https://schema.org","@type":"CollectionPage","name":"Full Courses & Zero to Hero | Thetips4you","description":description,"url":DOMAIN+"/courses/","publisher":{"@type":"Organization","name":"Thetips4you","url":DOMAIN+"/"}},breadcrumbs()]
hub = f'''<section class="course-hero wrap"><p class="kicker">THETIPS4YOU / THE COURSE LIBRARY</p><h1>Learn the whole <em>workflow.</em></h1><p class="lead">Full courses, crash courses and guided series from the Thetips4you YouTube channel. Choose a skill, press play and keep building.</p><div class="actions"><a class="button" href="#course-list">Explore {len(courses)} learning paths ↓</a><a href="{esc(roadmap['url'])}" target="_blank" rel="noopener noreferrer">Follow the DevOps playlist ↗</a></div><div class="course-index"><span>01 / FOUNDATIONS</span><span>02 / BUILD &amp; AUTOMATE</span><span>03 / OPERATE</span></div></section><section class="wrap section" id="course-list"><div class="section-heading"><div><p class="kicker">PICK YOUR NEXT SKILL</p><h2>Find your next deep dive.</h2></div><p>Browse complete videos and guided series, each with a dedicated page and a direct YouTube link.</p></div><div class="course-grid">{''.join(card(c) for c in courses)}</div></section><section class="wrap playlist-banner"><div><p class="kicker">PREFER A LEARNING PATH?</p><h2>{esc(roadmap['title'])}</h2><p>{esc(roadmap['summary'])}</p></div><a class="button" href="{esc(roadmap['url'])}" target="_blank" rel="noopener noreferrer">Open {esc(roadmap['count'])} on YouTube ↗</a></section><section class="wrap bridge"><div><p class="kicker">KEEP EXPLORING</p><h2>Build with AI coding agents.</h2></div><div><p>After the foundations, try practical Claude Code, OpenCode and Codex tutorials.</p><a href="/ai-coding/">Browse AI coding guides ↗</a></div></section>'''
(COURSES_DIR/"index.html").write_text(head("Full Courses & Zero to Hero | Thetips4you",description,"/courses/",schema=schema)+hub+foot(),encoding="utf-8")

for course in courses:
    folder = COURSES_DIR / course["slug"]
    folder.mkdir(exist_ok=True)
    path = course_url(course)
    points = "".join(f"<li>{esc(point)}</li>" for point in course["points"])
    related = "".join(f'<a href="{esc(course_url(other))}">{esc(other["title"])} →</a>' for other in courses if other["id"] != course["id"] and other in courses[:4])
    page = f'''<div class="wrap breadcrumbs"><a href="/">Home</a> / <a href="/courses/">Full courses</a> / <span>{esc(course['title'])}</span></div><article class="wrap watch"><p class="kicker">{esc(course['category'])} / {esc(course['format'])} / {esc(course['duration'])}</p><h1>{esc(course['title'])}</h1><p class="lead">{esc(course['summary'])}</p><div class="watch-grid"><div><div class="player"><iframe src="https://www.youtube-nocookie.com/embed/{esc(course['id'])}" title="{esc(course['title'])}" width="960" height="540" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><p class="caption">Want to watch on the channel? <a href="{esc(yt(course))}" target="_blank" rel="noopener noreferrer">Open this course on YouTube ↗</a></p><a class="watch-cta button" href="{esc(yt(course))}" target="_blank" rel="noopener noreferrer">▶ Watch on YouTube ↗</a></div><aside class="lesson"><p class="kicker">IN THIS COURSE</p><h2>What you'll explore</h2><ul>{points}</ul><p class="lesson-duration">Runtime: {esc(course['duration'])}</p></aside></div><div class="related"><div><p class="kicker">CONTINUE LEARNING</p><h2>Choose another course.</h2></div><div>{related}<a href="/courses/">All full courses and Zero to Hero videos →</a></div></div></article>'''
    if course.get("type") == "playlist":
        playlist_id = course["playlistUrl"].split("list=", 1)[1]
        page = page.replace(
            f"https://www.youtube-nocookie.com/embed/{course['id']}",
            f"https://www.youtube-nocookie.com/embed/videoseries?list={playlist_id}"
        ).replace("Runtime:", "Series:").replace("Open this course on YouTube ↗", "Open the full playlist on YouTube ↗").replace("▶ Watch on YouTube ↗", "▶ Open all lessons on YouTube ↗")
        schema = [
            {"@context":"https://schema.org","@type":"CollectionPage","name":course["title"],"description":course["summary"],"url":DOMAIN+path,"sameAs":course["playlistUrl"],"publisher":{"@type":"Organization","name":"Thetips4you","url":DOMAIN+"/"}},
            breadcrumbs(course)
        ]
    else:
        video = {"@context":"https://schema.org","@type":"VideoObject","name":course["youtubeTitle"],"description":course["summary"],"thumbnailUrl":thumb(course),"uploadDate":course["published"],"embedUrl":f"https://www.youtube.com/embed/{course['id']}","url":DOMAIN+path,"publisher":{"@type":"Organization","name":"Thetips4you","url":DOMAIN+"/"}}
        schema = [video,breadcrumbs(course)]
        if course.get("playlistUrl"):
            extra = f'<a class="series-link" href="{esc(course["playlistUrl"])}" target="_blank" rel="noopener noreferrer">Continue with the six-lesson AWS course ↗</a>'
            page = page.replace('</div><aside class="lesson">', extra+'</div><aside class="lesson">')
    (folder/"index.html").write_text(head(course["title"]+" | Thetips4you",course["summary"],path,thumb(course),schema)+page+foot(),encoding="utf-8")

ai_watch = [x for x in ai_videos if x["watch"]]
locations = [("/",None),("/ai-coding/",None)] + [(f"/ai-coding/{x['slug']}/",x) for x in ai_watch] + [("/courses/",None)] + [(course_url(c),c) for c in courses]
lines = ['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">']
for path, item in locations:
    video = ""
    if item and item.get("type") != "playlist":
        video = f'<video:video><video:thumbnail_loc>{esc(thumb(item))}</video:thumbnail_loc><video:title>{esc(item.get("youtubeTitle",item["title"]))}</video:title><video:description>{esc(item["summary"])}</video:description><video:player_loc>https://www.youtube.com/embed/{esc(item["id"])}</video:player_loc></video:video>'
    lines.append(f'  <url><loc>{DOMAIN}{esc(path)}</loc>{video}</url>')
lines.append("</urlset>")
(PUBLIC/"sitemap.xml").write_text("\n".join(lines)+"\n",encoding="utf-8")
generate_llms()
print(f"Generated {len(courses)} course pages and {len(locations)} sitemap URLs")
