(() => {
  const storageKey = "tt4y-yt-prompt-next-show-after";
  const readNextShowAfter = () => {
    try { return Number(localStorage.getItem(storageKey) || 0); } catch { return 0; }
  };
  const rememberFor30Days = () => {
    try { localStorage.setItem(storageKey, String(Date.now() + 30 * 24 * 60 * 60 * 1000)); } catch {}
  };
  if (Date.now() < readNextShowAfter()) return;

  const card = document.createElement("aside");
  card.className = "yt-subscribe-card";
  card.setAttribute("aria-labelledby", "yt-subscribe-title");
  card.hidden = true;
  card.innerHTML = `
    <div class="yt-subscribe-top">
      <div class="yt-subscribe-badge"><span class="yt-subscribe-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></span> THETIPS4YOU / YOUTUBE</div>
      <button class="yt-subscribe-close" type="button" aria-label="Close subscription prompt"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg></button>
    </div>
    <h2 id="yt-subscribe-title">Learn it. Build it. Ship it.</h2>
    <p>Turn your next “I should learn that” into “I built that” with hands-on AI coding, DevOps and cloud videos.</p>
    <a class="yt-subscribe-action" href="https://www.youtube.com/@Thetips4you?sub_confirmation=1" target="_blank" rel="noopener noreferrer"><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>Subscribe on YouTube</span><span aria-hidden="true">↗</span></a>
    <div class="yt-subscribe-bottom"><small>Free tutorials from Thetips4you</small><button class="yt-subscribe-later" type="button">Not now</button></div>`;
  document.body.appendChild(card);

  const suppress = () => {
    rememberFor30Days();
    card.hidden = true;
  };
  card.querySelector(".yt-subscribe-close").addEventListener("click", suppress);
  card.querySelector(".yt-subscribe-later").addEventListener("click", suppress);
  card.querySelector(".yt-subscribe-action").addEventListener("click", suppress);


  const show = () => {
    if (Date.now() < readNextShowAfter()) return;
    card.hidden = false;
    // Count an impression even when the visitor ignores the card.
    rememberFor30Days();
  };

  let remaining = 10000;
  let startedAt = 0;
  let timer;
  const schedule = () => {
    if (document.hidden || !card.hidden) return;
    startedAt = Date.now();
    timer = setTimeout(() => { show(); timer = null; }, remaining);
  };
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && timer) {
      clearTimeout(timer);
      timer = null;
      remaining = Math.max(0, remaining - (Date.now() - startedAt));
    } else if (!document.hidden) schedule();
  });
  schedule();
})();
