(() => {
  const searchParams = new URLSearchParams(location.search);
  const forcePreview = searchParams.get("showInstall") === "1";
  const localPreview = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  const previewPlatform = forcePreview && localPreview ? searchParams.get("platform") : null;
  const previewIos = previewPlatform === "ios";
  const isMobileDevice = previewIos || previewPlatform === "android" ||
    navigator.userAgentData?.mobile === true ||
    /Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const storageKey = "tt4y-pwa-install-next-show-after";
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  const isIos = previewIos || /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isInstalled = matchMedia("(display-mode: standalone)").matches ||
    navigator.standalone === true;
  const track = (eventName, params = {}) => {
    if (localPreview && forcePreview) return;
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, {
        prompt_name: "pwa_install",
        install_platform: isIos ? "ios" : "android",
        ...params
      });
    }
  };

  if (isMobileDevice && isInstalled) {
    let alreadyTracked = false;
    try {
      const key = "tt4y-pwa-standalone-open-tracked";
      alreadyTracked = sessionStorage.getItem(key) === "1";
      if (!alreadyTracked) sessionStorage.setItem(key, "1");
    } catch {}
    if (!alreadyTracked) track("pwa_standalone_open");
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  }

  if (!isMobileDevice || isInstalled) return;

  window.addEventListener("appinstalled", () => {
    track("pwa_app_installed");
    try { localStorage.setItem(storageKey, String(Date.now() + thirtyDays)); } catch {}
  });

  let nextShowAfter = 0;
  try { nextShowAfter = Number(localStorage.getItem(storageKey) || 0); } catch {}
  if (!forcePreview && Date.now() < nextShowAfter) return;

  const region = document.createElement("div");
  region.className = "pwa-install-region";
  region.setAttribute("role", "region");
  region.setAttribute("aria-label", "Add Thetips4you to Home Screen");
  region.hidden = true;
  region.innerHTML = `
    <div class="pwa-install-card">
      <div class="pwa-install-head">
        <img class="pwa-install-mark" src="/favicon.svg" alt="" width="29" height="29">
        <div class="pwa-install-copy">
          <strong>Add Thetips4you</strong>
          <span>${isIos ? "Your courses, one tap away." : "Keep courses and guides one tap away."}</span>
        </div>
        <button class="pwa-install-close" type="button" aria-label="Dismiss install invitation">×</button>
      </div>
      <div class="pwa-install-actions">
        <button class="pwa-install-action" type="button">Add to Home Screen</button>
      </div>
      <p class="pwa-install-help" hidden></p>
    </div>`;
  document.body.prepend(region);

  const remember = () => {
    if (forcePreview) return;
    try { localStorage.setItem(storageKey, String(Date.now() + thirtyDays)); } catch {}
  };
  let autoHideTimer;
  const hide = () => {
    clearTimeout(autoHideTimer);
    region.hidden = true;
    remember();
  };
  region.querySelector(".pwa-install-close").addEventListener("click", () => {
    track("pwa_prompt_dismiss", { dismiss_method: "close_button" });
    hide();
  });

  let installPrompt = null;
  let delayPassed = false;
  let hasShown = false;
  const maybeShow = () => {
    if (!delayPassed || document.hidden || hasShown) return;
    if (!isIos && !installPrompt && !forcePreview) return;
    hasShown = true;
    region.hidden = false;
    track("pwa_prompt_view");
    remember();
    if (!forcePreview) autoHideTimer = setTimeout(() => {
      track("pwa_prompt_dismiss", { dismiss_method: "timeout" });
      hide();
    }, 9000);
  };

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    maybeShow();
  });
  window.addEventListener("appinstalled", hide);

  region.querySelector(".pwa-install-action").addEventListener("click", () => {
    clearTimeout(autoHideTimer);
    track("pwa_prompt_click");
    if (isIos) {
      const help = region.querySelector(".pwa-install-help");
      help.textContent = "In Safari, tap Share, choose Add to Home Screen, then tap Add.";
      help.hidden = false;
      track("pwa_ios_instructions_view");
      return;
    }
    if (installPrompt) {
      const prompt = installPrompt;
      installPrompt = null;
      prompt.prompt();
      prompt.userChoice.then(({ outcome }) => {
        if (outcome === "accepted") track("pwa_install_accepted");
        if (outcome === "dismissed") track("pwa_install_dismissed");
        hide();
      }).catch(hide);
      return;
    }
    const help = region.querySelector(".pwa-install-help");
    help.textContent = "This preview browser cannot open an install dialog. Try the published site in Chrome on Android.";
    help.hidden = false;
  });

  let remaining = 5000;
  let startedAt = 0;
  let timer = null;
  const schedule = () => {
    if (document.hidden || delayPassed || timer !== null) return;
    startedAt = Date.now();
    timer = setTimeout(() => {
      timer = null;
      remaining = 0;
      delayPassed = true;
      maybeShow();
    }, remaining);
  };
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && timer !== null) {
      clearTimeout(timer);
      timer = null;
      remaining = Math.max(0, remaining - (Date.now() - startedAt));
    } else if (!document.hidden) {
      schedule();
      maybeShow();
    }
  });
  schedule();
})();
