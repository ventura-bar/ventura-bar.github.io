/* portfolio · palette, theme, toast, shortcuts & boot */
(function () {
  "use strict";

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const P   = window.PORTFOLIO || {};
  const App = window.App;

  /* ── email copy ───────────────────────────────────────────── */
  function copyEmail() {
    if (!P.email) return;
    const done = () => showToast("✓ " + P.email + " copied to clipboard");
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(P.email).then(done, () => legacyCopy(done));
    } else {
      legacyCopy(done);
    }
  }

  function legacyCopy(done) {
    const ta = document.createElement("textarea");
    ta.value = P.email;
    ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (_) { /* clipboard unavailable */ }
    ta.remove();
    done();
  }

  /* every mailto link copies instead of opening a mail client */
  document.addEventListener("click", (e) => {
    const mail = e.target.closest('a[href^="mailto:"]');
    if (!mail) return;
    e.preventDefault();
    copyEmail();
  });

  /* ── resume download ──────────────────────────────────────── */
  function downloadResume() {
    if (!P.resumePdf) return;
    const a = document.createElement("a");
    a.href = P.resumePdf;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  /* ── toast ────────────────────────────────────────────────── */
  const toast    = $("#toast");
  const toastMsg = $("#toastMsg");
  let toastTimer = null;

  function showToast(msg) {
    toastMsg.textContent = msg;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (toast.hidden = true), 6000);
  }

  $("#toastClose").addEventListener("click", () => {
    clearTimeout(toastTimer);
    toast.hidden = true;
  });

  /* ── themes ───────────────────────────────────────────────── */
  const THEMES = ["dark-plus", "light-plus", "monokai", "github-dark"];
  const themeOverlay = $("#themeOverlay");

  function applyTheme(name) {
    if (!THEMES.includes(name)) name = "dark-plus";
    if (name === "dark-plus") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", name);
    try { localStorage.setItem("theme", name); } catch (_) { /* private mode */ }
  }

  function toggleThemeMenu(show) {
    themeOverlay.hidden = !show;
    if (show) {
      const current = document.documentElement.getAttribute("data-theme") || "dark-plus";
      $$("#themeList li").forEach((li) =>
        li.classList.toggle("selected", li.dataset.theme === current)
      );
    }
  }

  $$("#themeList li").forEach((li) =>
    li.addEventListener("click", () => {
      applyTheme(li.dataset.theme);
      toggleThemeMenu(false);
    })
  );
  themeOverlay.addEventListener("click", (e) => {
    if (e.target === themeOverlay) toggleThemeMenu(false);
  });

  /* ── activity bar actions ─────────────────────────────────── */
  $$("[data-action]").forEach((btn) =>
    btn.addEventListener("click", () => {
      switch (btn.dataset.action) {
        case "toggle-sidebar": {
          const sb = $("#sidebar");
          if (window.matchMedia("(max-width: 768px)").matches) sb.classList.toggle("open");
          else sb.classList.toggle("collapsed");
          break;
        }
        case "palette":         togglePalette(true); break;
        case "toggle-terminal": App.toggleTerminal?.(); break;
        case "open-file":       App.openFile(btn.dataset.file); break;
        case "theme-menu":      toggleThemeMenu(themeOverlay.hidden); break;
      }
    })
  );

  /* ── command palette ──────────────────────────────────────── */
  const overlay  = $("#paletteOverlay");
  const palInput = $("#paletteInput");
  const palItems = $$("#paletteList li");

  function togglePalette(show) {
    overlay.hidden = !show;
    if (show) {
      palInput.value = "";
      palItems.forEach((li) => li.classList.remove("hidden", "selected"));
      if (palItems[0]) palItems[0].classList.add("selected");
      palInput.focus();
    }
  }

  function runPaletteItem(li) {
    togglePalette(false);
    if      (li.dataset.open)              App.openFile(li.dataset.open);
    else if (li.dataset.cmd === "terminal") App.toggleTerminal?.();
    else if (li.dataset.cmd === "email")    copyEmail();
    else if (li.dataset.cmd === "theme")    toggleThemeMenu(true);
    else if (li.dataset.cmd === "resume")   downloadResume();
  }

  palInput.addEventListener("input", () => {
    const q = palInput.value.toLowerCase();
    let first = null;
    palItems.forEach((li) => {
      const hit = li.textContent.toLowerCase().includes(q);
      li.classList.toggle("hidden", !hit);
      li.classList.remove("selected");
      if (hit && !first) first = li;
    });
    if (first) first.classList.add("selected");
  });

  palInput.addEventListener("keydown", (e) => {
    const visible = palItems.filter((li) => !li.classList.contains("hidden"));
    const idx = visible.findIndex((li) => li.classList.contains("selected"));
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!visible.length) return;
      const next = (idx + (e.key === "ArrowDown" ? 1 : -1) + visible.length) % visible.length;
      visible.forEach((li) => li.classList.remove("selected"));
      visible[next].classList.add("selected");
    } else if (e.key === "Enter") {
      const target = visible[idx >= 0 ? idx : 0];
      if (target) runPaletteItem(target);
    } else if (e.key === "Escape") {
      togglePalette(false);
    }
  });

  palItems.forEach((li) => li.addEventListener("click", () => runPaletteItem(li)));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) togglePalette(false);
  });

  /* ── global keyboard shortcuts ────────────────────────────── */
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "p") {
      e.preventDefault();
      togglePalette(overlay.hidden);
    } else if (e.ctrlKey && e.key === "`") {
      e.preventDefault();
      App.toggleTerminal?.();
    } else if (e.key === "Escape") {
      if (!overlay.hidden)       togglePalette(false);
      if (!themeOverlay.hidden)  toggleThemeMenu(false);
    }
  });

  /* ── hero typing (once, respects reduced motion) ──────────── */
  const heroName = $("#heroName");
  if (heroName && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const text = heroName.dataset.text;
    heroName.textContent = "";
    let i = 0;
    const tick = setInterval(() => {
      heroName.textContent = text.slice(0, ++i);
      if (i >= text.length) clearInterval(tick);
    }, 70);
  }

  /* ── deep link: #experience etc. ─────────────────────────── */
  const hash = location.hash.replace("#", "");
  if (App.files.includes(hash)) App.openFile(hash, false);

  /* ── expose for terminal and other modules ────────────────── */
  Object.assign(window.App, { copyEmail, downloadResume, showToast, applyTheme, togglePalette });
})();
