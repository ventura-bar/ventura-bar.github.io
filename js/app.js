/* Bar Ventura — portfolio · IDE behavior */
(function () {
  "use strict";

  document.body.classList.add("js-enabled");

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const P = window.PORTFOLIO || {};
  const EMAIL = P.email || "barven.dev@gmail.com";
  const RESUME_PDF = P.resumePdf || "assets/Bar-Ventura-Resume.pdf";
  const FILES = ["readme", "experience", "skills", "education", "contact"];
  const sections = Object.fromEntries(FILES.map((id) => [id, $("#" + id)]));
  const editor = $("#editor");
  const sbLang = $("#sbLang");
  const crumbFile = $("#crumbFile");
  const emptyState = $("#empty-state");

  /* ── open / close files ───────────────────── */
  function openFile(id, pushHash = true) {
    if (!sections[id]) return;

    $$(".editor-section").forEach((s) => s.classList.remove("active"));
    sections[id].classList.add("active");

    $$(".tab").forEach((t) => {
      const on = t.dataset.file === id;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on);
      if (on) t.classList.remove("closed");
    });
    $$(".filetree .file").forEach((f) =>
      f.classList.toggle("active", f.dataset.file === id)
    );

    const name = sections[id].dataset.name;
    crumbFile.textContent = name;
    sbLang.textContent = sections[id].dataset.lang;
    document.title = "Bar Ventura — " + name;

    editor.scrollTop = 0;
    if (pushHash) history.replaceState(null, "", "#" + id);

    // auto-close sidebar overlay on mobile
    if (window.matchMedia("(max-width: 768px)").matches) {
      $("#sidebar").classList.remove("open");
    }
  }

  function closeTab(id) {
    const tab = $('.tab[data-file="' + id + '"]');
    const wasActive = tab.classList.contains("active");
    tab.classList.add("closed");
    tab.classList.remove("active");

    if (!wasActive) return;
    sections[id].classList.remove("active");
    $$(".filetree .file").forEach((f) => f.classList.remove("active"));

    const next = $$(".tab:not(.closed)").pop();
    if (next) {
      openFile(next.dataset.file);
    } else {
      emptyState.classList.add("active");
      crumbFile.textContent = "—";
      sbLang.textContent = "Plain Text";
    }
  }

  /* tabs: click to open, × to close */
  $("#tabs").addEventListener("click", (e) => {
    const tab = e.target.closest(".tab");
    if (!tab) return;
    if (e.target.classList.contains("tab-close")) closeTab(tab.dataset.file);
    else openFile(tab.dataset.file);
  });

  /* explorer files */
  $$(".filetree .file").forEach((f) =>
    f.addEventListener("click", () => openFile(f.dataset.file))
  );

  /* in-content links like [experience.yaml](#experience) */
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-open]");
    if (!link) return;
    e.preventDefault();
    openFile(link.dataset.open);
  });

  /* ── email: copy + toast (mailto fails silently without a mail app) ── */
  const toast = $("#toast");
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

  function copyEmail() {
    const done = () => showToast("✓ " + EMAIL + " copied to clipboard");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL).then(done, () => legacyCopy(done));
    } else {
      legacyCopy(done);
    }
  }
  function legacyCopy(done) {
    const ta = document.createElement("textarea");
    ta.value = EMAIL;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* clipboard unavailable */ }
    ta.remove();
    done();
  }

  /* every mailto link copies instead (href stays as no-JS fallback) */
  document.addEventListener("click", (e) => {
    const mail = e.target.closest('a[href^="mailto:"]');
    if (!mail) return;
    e.preventDefault();
    copyEmail();
  });

  /* ── download resume (the real PDF) ───────── */
  function downloadResume() {
    const a = document.createElement("a");
    a.href = RESUME_PDF;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  /* ── themes ───────────────────────────────── */
  const THEMES = ["dark-plus", "light-plus", "monokai", "github-dark"];
  const themeOverlay = $("#themeOverlay");

  function applyTheme(name) {
    if (!THEMES.includes(name)) name = "dark-plus";
    if (name === "dark-plus") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", name);
    try { localStorage.setItem("theme", name); } catch (e) { /* private mode */ }
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

  /* ── activity bar actions ─────────────────── */
  $$("[data-action]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      if (action === "toggle-sidebar") {
        const sb = $("#sidebar");
        if (window.matchMedia("(max-width: 768px)").matches) sb.classList.toggle("open");
        else sb.classList.toggle("collapsed");
      } else if (action === "palette") togglePalette(true);
      else if (action === "toggle-terminal") toggleTerminal();
      else if (action === "open-file") openFile(btn.dataset.file);
      else if (action === "theme-menu") toggleThemeMenu(themeOverlay.hidden);
    })
  );

  /* ── command palette ──────────────────────── */
  const overlay = $("#paletteOverlay");
  const palInput = $("#paletteInput");
  const palItems = $$("#paletteList li");

  function togglePalette(show) {
    overlay.hidden = !show;
    if (show) {
      palInput.value = "";
      palItems.forEach((li) => li.classList.remove("hidden", "selected"));
      palItems[0].classList.add("selected");
      palInput.focus();
    }
  }

  function runPaletteItem(li) {
    togglePalette(false);
    if (li.dataset.open) openFile(li.dataset.open);
    else if (li.dataset.cmd === "terminal") toggleTerminal();
    else if (li.dataset.cmd === "email") copyEmail();
    else if (li.dataset.cmd === "theme") toggleThemeMenu(true);
    else if (li.dataset.cmd === "resume") downloadResume();
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
      const next =
        (idx + (e.key === "ArrowDown" ? 1 : -1) + visible.length) % visible.length;
      visible.forEach((li) => li.classList.remove("selected"));
      visible[next].classList.add("selected");
    } else if (e.key === "Enter") {
      if (visible[idx >= 0 ? idx : 0]) runPaletteItem(visible[idx >= 0 ? idx : 0]);
    } else if (e.key === "Escape") togglePalette(false);
  });

  palItems.forEach((li) => li.addEventListener("click", () => runPaletteItem(li)));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) togglePalette(false);
  });

  /* ── terminal ─────────────────────────────── */
  const terminal = $("#terminal");
  const termOut = $("#termOut");
  const termIn = $("#termIn");
  const termBody = $("#termBody");

  function toggleTerminal() {
    terminal.hidden = !terminal.hidden;
    if (!terminal.hidden) termIn.focus();
  }

  function print(text, cls) {
    const div = document.createElement("div");
    div.className = "term-line-out" + (cls ? " " + cls : "");
    div.textContent = text;
    termOut.appendChild(div);
    termBody.scrollTop = termBody.scrollHeight;
  }

  function echoCmd(cmd) {
    const div = document.createElement("div");
    div.className = "term-line-out";
    div.innerHTML =
      '<span class="t-prompt">bar@portfolio<span class="t-dim">:</span><span class="t-path">~</span><span class="t-dim">$</span></span> ';
    div.appendChild(document.createTextNode(cmd));
    termOut.appendChild(div);
  }

  const fileAliases = {};
  FILES.forEach((id) => {
    fileAliases[id] = id;
    fileAliases[sections[id].dataset.name.toLowerCase()] = id;
    const cli = sections[id].dataset.cli;
    if (cli) fileAliases[cli.toLowerCase()] = id;
  });
  fileAliases["skills.json"] = "skills";

  const COMMANDS = {
    help() {
      print("available commands:");
      print("  whoami            who am I");
      print("  ls                list my files");
      print("  cat <file>        open a file (e.g. cat skills)");
      print("  theme <name>      dark-plus | light-plus | monokai | github-dark");
      print("  resume            download my resume (PDF)");
      print("  contact           copy my email to your clipboard");
      print("  sudo hire-me      you know you want to");
      print("  clear             clear terminal");
      print("  exit              close terminal");
    },
    whoami() {
      print("Bar Ventura — DevOps Team Leader & Full-Stack Engineer");
      print("Rehovot, Israel · " + EMAIL);
    },
    ls() {
      print(FILES.map((id) => sections[id].dataset.cli || sections[id].dataset.name).join("  "));
    },
    contact() {
      copyEmail();
      print("✓ " + EMAIL + " copied to clipboard — paste it anywhere");
    },
    resume() {
      print("downloading Bar-Ventura-Resume.pdf ✓");
      downloadResume();
    },
    clear() {
      termOut.innerHTML = "";
    },
    exit() {
      toggleTerminal();
    },
  };

  function runCommand(raw) {
    const input = raw.trim();
    echoCmd(input);
    if (!input) return;
    const [cmd, ...args] = input.split(/\s+/);
    const arg = args.join(" ").toLowerCase();

    if (cmd === "sudo" && arg === "hire-me") {
      print("[sudo] password for recruiter: ********");
      print("permission granted ✓ — email copied, Gmail compose opened");
      copyEmail();
      window.open("https://mail.google.com/mail/?view=cm&fm=1&to=" + EMAIL, "_blank");
    } else if (cmd === "cat" || cmd === "open" || cmd === "vim" || cmd === "code") {
      const id = fileAliases[arg];
      if (id) {
        print("opening " + sections[id].dataset.name + " in editor ✓");
        openFile(id);
      } else {
        print(cmd + ": " + (arg || "<file>") + ": No such file. Try `ls`.", "t-err");
      }
    } else if (cmd === "theme") {
      if (THEMES.includes(arg)) {
        applyTheme(arg);
        print("theme set to " + arg + " ✓");
      } else {
        print("usage: theme <" + THEMES.join(" | ") + ">", "t-err");
      }
    } else if (cmd === "skills") {
      openFile("skills");
      print("opening Extensions: Skills ✓");
    } else if (cmd === "rm") {
      print("rm: nice try. This career is immutable infrastructure.", "t-err");
    } else if (COMMANDS[cmd]) {
      COMMANDS[cmd]();
    } else {
      print(cmd + ": command not found. Try `help`.", "t-err");
    }
    termBody.scrollTop = termBody.scrollHeight;
  }

  termIn.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      runCommand(termIn.value);
      termIn.value = "";
    }
  });
  termBody.addEventListener("click", () => termIn.focus());

  /* ── global shortcuts ─────────────────────── */
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "p") {
      e.preventDefault();
      togglePalette(overlay.hidden);
    } else if (e.ctrlKey && e.key === "`") {
      e.preventDefault();
      toggleTerminal();
    } else if (e.key === "Escape") {
      if (!overlay.hidden) togglePalette(false);
      if (!themeOverlay.hidden) toggleThemeMenu(false);
    }
  });

  /* ── hero typing (once, ~1s, respects reduced motion) ── */
  const heroName = $("#heroName");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced && heroName) {
    const text = heroName.dataset.text;
    heroName.textContent = "";
    let i = 0;
    const tick = setInterval(() => {
      heroName.textContent = text.slice(0, ++i);
      if (i >= text.length) clearInterval(tick);
    }, 70);
  }

  /* ── deep link: #experience etc. ──────────── */
  const hash = location.hash.replace("#", "");
  if (FILES.includes(hash)) openFile(hash, false);
})();
