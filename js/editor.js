/* portfolio · file & tab management
   Exposes window.App.openFile for other modules. */
(function () {
  "use strict";

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const P = window.PORTFOLIO || {};
  const FILES = ["readme", "experience", "skills", "education", "contact"];
  const sections = Object.fromEntries(FILES.map((id) => [id, $("#" + id)]));

  const editor    = $("#editor");
  const sbLang    = $("#sbLang");
  const crumbFile = $("#crumbFile");
  const emptyState = $("#empty-state");

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
    document.title = (P.name || "Portfolio") + " — " + name;

    editor.scrollTop = 0;
    if (pushHash) history.replaceState(null, "", "#" + id);

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

  /* in-content links like <a data-open="experience"> */
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-open]");
    if (!link) return;
    e.preventDefault();
    openFile(link.dataset.open);
  });

  document.body.classList.add("js-enabled");

  window.App = { openFile, files: FILES, sections };
})();
