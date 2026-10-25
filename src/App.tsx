"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowRight, Play, Terminal, GitBranch, Box, Cloud, Pause, RotateCw } from "lucide-react";
import aiVideos from "../data/ai-videos.json";
import coursesData from "../data/courses.json";

const channel = "https://www.youtube.com/@Thetips4you";
const featuredAiVideos = aiVideos.filter(video => video.watch).slice(0, 3);
const featuredSlugs = [
  "docker-full-course",
  "git-beginner-course",
  "github-actions-cicd",
  "kubernetes-crash-course",
  "prometheus-crash-course",
  "gitlab-cicd-zero-to-hero",
];
const featuredCourses = featuredSlugs.map(slug => coursesData.courses.find(course => course.slug === slug)!);
const videos = [
  { id: "ZyWBs0CU2wk", tag: "CONTAINERS", title: "Docker in 10 minutes", description: "Your first step into containers. Understand the essentials, then start building.", number: "01" },
  { id: "IluVqhoCChw", tag: "ORCHESTRATION", title: "Kubernetes: zero to deployed", description: "Connect the pieces and take an application into a Kubernetes cluster.", number: "02" },
  { id: "MTm3cb7qiEo", tag: "AUTOMATION", title: "Jenkins for beginners", description: "Go deeper with a full course on building your CI/CD foundation.", number: "03" },
];

function Orb({ paused }: { paused: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, angle = 0;
    const pointer = { x: 0, y: 0 };
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = (e.clientX - r.left) / r.width - .5;
      pointer.y = (e.clientY - r.top) / r.height - .5;
    };
    canvas.addEventListener("pointermove", move);
    const draw = () => {
      const size = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(size.width * dpr) || canvas.height !== Math.round(size.height * dpr)) {
        canvas.width = Math.round(size.width * dpr); canvas.height = Math.round(size.height * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size.width, size.height);
      if (!paused && !reduced.matches) angle += .003;
      const points: { x: number; y: number; z: number; a: number }[] = [];
      for (let i = 0; i < 100; i++) {
        const u = i / 100 * Math.PI * 2;
        for (let j = 0; j < 26; j++) {
          const v = j / 26 * Math.PI * 2;
          const radius = 1.55 + .57 * Math.cos(v);
          let x = radius * Math.cos(u), y = radius * Math.sin(u), z = .57 * Math.sin(v);
          const a = angle + .6 + pointer.x * .35;
          const nx = x * Math.cos(a) + z * Math.sin(a);
          z = -x * Math.sin(a) + z * Math.cos(a); x = nx;
          const b = 1.02 + pointer.y * .3;
          const ny = y * Math.cos(b) - z * Math.sin(b);
          z = y * Math.sin(b) + z * Math.cos(b); y = ny;
          const perspective = 5 / (5 + z);
          const scale = Math.min(size.width, size.height) * .205;
          points.push({x: size.width * .5 + x * scale * perspective, y: size.height * .46 + y * scale * perspective, z, a: u});
        }
      }
      points.sort((a,b) => b.z-a.z);
      points.forEach(p => {
        const light = Math.max(.12, (.85 - p.z * .23));
        ctx.fillStyle = p.a > 3.4 ? `rgba(236,233,221,${light * .75})` : `rgba(255,112,53,${light})`;
        ctx.beginPath();ctx.arc(p.x,p.y,Math.max(.7,1.7-p.z*.35),0,Math.PI*2);ctx.fill();
      });
      if (!paused && !reduced.matches) frame = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { if (paused || reduced.matches) draw(); };
    window.addEventListener("resize",resize);
    return () => {cancelAnimationFrame(frame);canvas.removeEventListener("pointermove",move);window.removeEventListener("resize",resize);};
  }, [paused]);
  return <canvas ref={ref} className="orb" aria-hidden="true" />;
}

export default function Home() {
  const [paused, setPaused] = useState(false);
  return (
    <div className="site-shell">
      <a className="skip" href="#main">Skip to content</a>
      <header className="header">
        <a className="brand" href="#" aria-label="Thetips4you home"><span className="brand-mark"><Terminal size={22}/></span>thetips<span className="brand-four">4</span>you<span className="brand-dot">.</span></a>
        <nav aria-label="Main navigation"><a href="#ai-coding">AI coding agents</a><a href="#courses">Full courses</a><a href="#tutorials">DevOps tutorials</a><a href="#roadmap">Learning path</a><a href="#about">About</a></nav>
        <a className="youtube-link" href={channel} target="_blank" rel="noreferrer"><Play size={18}/><span>Visit channel</span><ArrowUpRight size={15}/></a>
      </header>
      <div className="ai-ribbon"><span className="ribbon-new">NEW / AI CODING</span><span>Claude Code, OpenCode, Codex and agent workflows</span><a href="/ai-coding/">Explore the field guide <ArrowUpRight size={15}/></a></div>

      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="status-dot"/> YOUR NEXT SKILL STARTS HERE</div>
            <h1>Less theory.<br/>More <span className="outline-word">building.</span></h1>
            <p className="hero-description">Make sense of DevOps, cloud, and AI coding agents.<br/>Practical tutorials. Real workflows.<br/>One breakthrough at a time.</p>
            <div className="hero-actions"><a className="button primary" href="#ai-coding"><Play size={17} fill="currentColor"/>Explore AI coding<ArrowRight size={18}/></a><a className="text-link" href="#courses">Watch full courses <ArrowUpRight size={17}/></a></div>
            <div className="hero-note"><span className="note-line"/><span>CODE. COMMIT. COLLABORATE.</span></div>
          </div>
          <div className="hero-visual">
            <div className="visual-top"><span>THE BUILD LOOP</span><span>01 — ∞</span></div>
            <Orb paused={paused}/>
            <div className="orbit-label label-code"><Terminal size={16}/><span>code</span><i/></div>
            <div className="orbit-label label-deploy"><Cloud size={17}/><span>deploy</span><i/></div>
            <div className="terminal-card"><div className="terminal-top"><span><i/><i/><i/></span><span>thetips4you / learn</span><Terminal size={14}/></div><code><span className="dim">$</span> git push origin your-next-skill<br/><span className="success">✓</span> Curiosity detected<br/><span className="success">✓</span> Building confidence<br/><span className="orange">→</span> Ready for what’s next<span className="cursor">_</span></code></div>
            <div className="visual-bottom"><span><span className="crosshair">+</span> KEEP LEARNING. KEEP SHIPPING.</span><button className="motion-control" aria-label={paused ? "Play 3D animation" : "Pause 3D animation"} aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused ? <RotateCw size={14}/> : <Pause size={14}/>}</button></div>
          </div>
        </section>
        <div className="tool-strip" aria-label="Topics covered"><span>YOUR TOOLKIT,<br/><b>EXPANDED.</b></span><div>Linux</div><div><Box/>Docker</div><div>Kubernetes</div><div><GitBranch/>Jenkins</div><div>Terraform</div><div><Cloud/>Cloud & AI</div></div>

        <section className="ai-section section" id="ai-coding" aria-labelledby="ai-heading">
          <div className="ai-intro">
            <div><p className="eyebrow muted">01 / THE AI CODING FIELD GUIDE</p><h2 id="ai-heading">Put an AI coding agent <span>on your team.</span></h2></div>
            <div><p>Start with a real setup, compare your options, then learn how agent skills and tools fit together. These are practical Thetips4you videos for developers who want to build with AI.</p><a className="text-link" href="/ai-coding/">Browse the complete AI coding guide <ArrowUpRight size={18}/></a></div>
          </div>
          <div className="ai-feature-grid">{featuredAiVideos.map((video,index)=><a key={video.id} className="ai-feature-card" href={"/ai-coding/"+video.slug+"/"} aria-label={video.title+" — watch guide"}><div className="ai-feature-thumb"><img src={"https://i.ytimg.com/vi/"+video.id+"/hqdefault.jpg"} alt="" loading="lazy"/><span className="ai-play"><Play size={18} fill="currentColor"/></span><span className="ai-number">0{index+1}</span></div><div className="ai-feature-body"><span className="ai-tag">{video.category}</span><h3>{video.title}</h3><p>{video.summary}</p><span className="ai-card-link">Watch the guide <ArrowUpRight size={17}/></span></div></a>)}</div>
          <div className="ai-bottom"><span>Claude Code · OpenCode · Codex · agent skills · MCP</span><a href="/ai-coding/">All AI coding videos <ArrowUpRight size={17}/></a></div>
        </section>

        <section className="courses-section section" id="courses" aria-labelledby="courses-heading">
          <div className="courses-intro"><div><p className="eyebrow muted">02 / DEEP DIVES FROM THE CHANNEL</p><h2 id="courses-heading">Go from curious to <span>confident.</span></h2></div><div><p>Go deeper with practical videos on containers, cloud, CI/CD and observability. Start with a featured guide, then explore the full learning library.</p><a className="text-link" href="/courses/">Explore all {coursesData.courses.length} learning paths <ArrowUpRight size={18}/></a></div></div>
          <div className="course-feature-grid">
            <article className="course-lead"><a className="course-lead-image" href={"/courses/"+featuredCourses[0].slug+"/"} aria-label={"Explore "+featuredCourses[0].title}><img src={"https://i.ytimg.com/vi/"+featuredCourses[0].id+"/hqdefault.jpg"} alt="Docker full course video thumbnail" loading="lazy"/><span className="course-play"><Play size={23} fill="currentColor"/></span><span className="course-image-label">START HERE / FULL COURSE</span></a><div className="course-lead-body"><div className="course-meta"><span>{featuredCourses[0].category}</span><span>{featuredCourses[0].duration}</span></div><h3>{featuredCourses[0].title}</h3><p>{featuredCourses[0].summary}</p><div className="course-actions"><a className="button primary" href={"https://www.youtube.com/watch?v="+featuredCourses[0].id} target="_blank" rel="noopener noreferrer"><Play size={15} fill="currentColor"/>Watch on YouTube <ArrowUpRight size={16}/></a><a className="text-link" href={"/courses/"+featuredCourses[0].slug+"/"}>Course details <ArrowRight size={16}/></a></div></div></article>
            <div className="course-side-list">{featuredCourses.slice(1).map((course,index)=><article className="course-mini" key={course.id}><a className="course-mini-image" href={"/courses/"+course.slug+"/"} aria-label={"Explore "+course.title}><img src={"https://i.ytimg.com/vi/"+course.id+"/hqdefault.jpg"} alt={course.title+" thumbnail"} loading="lazy"/><span><Play size={15} fill="currentColor"/></span></a><div className="course-mini-copy"><div className="course-meta"><span>{course.format}</span><span>{course.duration}</span></div><h3><a href={"/courses/"+course.slug+"/"}>{course.title}</a></h3><a className="course-mini-link" href={"https://www.youtube.com/watch?v="+course.id} target="_blank" rel="noopener noreferrer">Watch on YouTube <ArrowUpRight size={14}/></a></div><span className="course-mini-number">0{index+2}</span></article>)}<a className="course-mini-cta" href="/courses/"><span>THE COMPLETE LIBRARY</span><strong>{coursesData.courses.length} learning paths.<br/>One place to start.</strong><span>Browse every course <ArrowUpRight size={16}/></span></a></div>
          </div>
          <div className="course-section-footer"><span>{coursesData.courses.length} curated videos and series · Foundations to observability</span><a href="/courses/">Open the full course library <ArrowUpRight size={16}/></a></div>
        </section>
        <section className="tutorials section" id="tutorials">
          <div className="section-top"><div><p className="eyebrow muted">03 / WATCH. TRY. UNDERSTAND.</p><h2>Build your next skill.</h2></div><a className="text-link" href={channel+"/videos"} target="_blank" rel="noreferrer">All videos <ArrowUpRight size={18}/></a></div>
          <div className="video-grid">{videos.map(video=><a key={video.id} className="video-card" href={"https://www.youtube.com/watch?v="+video.id} target="_blank" rel="noreferrer"><div className="thumbnail"><img src={"https://i.ytimg.com/vi/"+video.id+"/hqdefault.jpg"} alt="" loading="lazy"/><span className="play-badge"><Play size={21} fill="currentColor"/></span><span className="video-index">{video.number}</span></div><div className="video-meta">{video.tag}<ArrowUpRight size={17}/></div><h3>{video.title}</h3><p>{video.description}</p></a>)}</div>
        </section>

        <section className="roadmap section" id="roadmap">
          <div className="roadmap-intro"><p className="eyebrow muted">04 / CONNECT THE DOTS</p><h2>A direction.<br/>Not another<br/><span>rabbit hole.</span></h2><p>Start with the foundations. Connect the tools. Build a workflow you understand from end to end.</p><a className="button secondary" href="https://www.thetips4you.com/devops-roadmap-2026-8-skills-to-master-with-free-videos/" target="_blank" rel="noreferrer">Explore the DevOps roadmap <ArrowUpRight size={18}/></a></div>
          <div className="path-list">{[
            ["01","Find your footing","Linux · Git · Scripting",Terminal,"xEckAK9pYyY","Linux full course"],
            ["02","Package & automate","Docker · Jenkins · CI/CD",Box,"ZyWBs0CU2wk","Docker beginner tutorial"],
            ["03","Deploy with confidence","Kubernetes · Terraform · Cloud",Cloud,"IluVqhoCChw","Kubernetes deployment tutorial"],
            ["04","See the whole system","Prometheus · Grafana · Observability",GitBranch,"_F1ulJWsipc","Prometheus crash course"]
          ].map(([n,title,sub,Icon,videoId,videoTitle])=>{const I=Icon as typeof Terminal;return <a className="path-step" key={String(n)} href={"https://www.youtube.com/watch?v="+videoId} target="_blank" rel="noreferrer" aria-label={String(title)+": watch "+String(videoTitle)+" on YouTube (opens in a new tab)"}><span className="step-num">{String(n)}</span><I size={22}/><div><h3>{String(title)}</h3><p>{String(sub)}</p></div><ArrowUpRight className="step-arrow" size={20} aria-hidden="true"/></a>})}</div>
        </section>

        <section className="about section" id="about"><div className="eyebrow muted">05 / THE IDEA BEHIND THETIPS4YOU</div><div className="about-content"><h2>Technology moves fast.<br/>Let’s figure it out <em>together.</em></h2><div><p>Thetips4you is a place to turn technical curiosity into practical skills. From your first container to a complete delivery pipeline, there’s always something new to build.</p><a className="text-link" href={channel+"?sub_confirmation=1"} target="_blank" rel="noreferrer">Join us on YouTube <ArrowUpRight size={18}/></a></div></div></section>
      </main>
      <footer><a className="brand" href="#">thetips<span className="brand-four">4</span>you.</a><span>Code. Commit. Collaborate.</span><div><a href="/courses/">Full courses <ArrowUpRight size={14}/></a><a href="/ai-coding/">AI coding <ArrowUpRight size={14}/></a><a href="https://www.thetips4you.com/" target="_blank" rel="noreferrer">Read the blog <ArrowUpRight size={14}/></a><a href={channel} target="_blank" rel="noreferrer">YouTube <ArrowUpRight size={14}/></a></div></footer>
    </div>
  );
}
