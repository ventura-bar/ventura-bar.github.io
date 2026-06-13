/* portfolio · terminal panel
   Exposes window.App.toggleTerminal. */
(function () {
  "use strict";

  const $ = (sel, root) => (root || document).querySelector(sel);

  const P   = window.PORTFOLIO || {};
  const App = window.App;

  const terminal = $("#terminal");
  const termOut  = $("#termOut");
  const termIn   = $("#termIn");
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
    const user = (P.name || "user").split(" ")[0].toLowerCase();
    const div = document.createElement("div");
    div.className = "term-line-out";
    div.innerHTML =
      '<span class="t-prompt">' + user +
      '@portfolio<span class="t-dim">:</span><span class="t-path">~</span><span class="t-dim">$</span></span> ';
    div.appendChild(document.createTextNode(cmd));
    termOut.appendChild(div);
  }

  /* build aliases so `cat readme`, `cat README.md`, `cat skills.json` etc. all work */
  const fileAliases = {};
  App.files.forEach((id) => {
    fileAliases[id] = id;
    fileAliases[App.sections[id].dataset.name.toLowerCase()] = id;
    const cli = App.sections[id].dataset.cli;
    if (cli) fileAliases[cli.toLowerCase()] = id;
  });
  fileAliases["skills.json"] = "skills";

  const THEMES = ["dark-plus", "light-plus", "monokai", "github-dark"];

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
      print((P.name || "Portfolio owner") + " — " + (P.title || "Engineer"));
      const loc = [P.location, P.email].filter(Boolean).join(" · ");
      if (loc) print(loc);
    },
    ls() {
      print(App.files
        .map((id) => App.sections[id].dataset.cli || App.sections[id].dataset.name)
        .join("  ")
      );
    },
    contact() {
      window.App.copyEmail?.();
      print("✓ " + (P.email || "email") + " copied to clipboard — paste it anywhere");
    },
    resume() {
      print("downloading resume ✓");
      window.App.downloadResume?.();
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

    const [cmd, ...rest] = input.split(/\s+/);
    const arg = rest.join(" ").toLowerCase();

    if (cmd === "sudo" && arg === "hire-me") {
      print("[sudo] password for recruiter: ********");
      print("permission granted ✓ — email copied, Gmail compose opened");
      window.App.copyEmail?.();
      if (P.email) {
        window.open("https://mail.google.com/mail/?view=cm&fm=1&to=" + P.email, "_blank");
      }
    } else if (["cat", "open", "vim", "code"].includes(cmd)) {
      const id = fileAliases[arg];
      if (id) {
        print("opening " + App.sections[id].dataset.name + " in editor ✓");
        App.openFile(id);
      } else {
        print(cmd + ": " + (arg || "<file>") + ": No such file. Try `ls`.", "t-err");
      }
    } else if (cmd === "theme") {
      if (THEMES.includes(arg)) {
        window.App.applyTheme?.(arg);
        print("theme set to " + arg + " ✓");
      } else {
        print("usage: theme <" + THEMES.join(" | ") + ">", "t-err");
      }
    } else if (cmd === "skills") {
      App.openFile("skills");
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
    if (e.key !== "Enter") return;
    runCommand(termIn.value);
    termIn.value = "";
  });
  termBody.addEventListener("click", () => termIn.focus());

  window.App.toggleTerminal = toggleTerminal;
})();
