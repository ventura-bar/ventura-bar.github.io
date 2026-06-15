/* ═══════════════════════════════════════════════════════════════════
   ✏️  EDIT ME — all the site's content lives in this one file.
   Change anything below, save, and refresh. That's it.

   Also remember to update the <head> meta tags in index.html
   (title, og:description, og:image) to match what you put here.
   ═══════════════════════════════════════════════════════════════════ */

window.PORTFOLIO = {
  name: "Bar Ventura",
  title: "DevOps & Full-Stack Engineer",
  email: "barven.dev@gmail.com",
  location: "Rehovot, Israel",
  status: "🟢 Open to opportunities",
  resumePdf: "assets/Bar-Ventura-Resume.pdf",

  /* your deployed URL — used for canonical & og:url meta tags */
  siteUrl: "https://ventura-bar.github.io/",
  /* og:image — relative path or full URL */
  ogImage: "assets/og-image.png",

  /* add your URLs here — they appear automatically in contact.sh */
  socials: {
    linkedin: "https://www.linkedin.com/in/bar-ventura-a96b68253/",
    github: "https://github.com/ventura-bar",
  },

  /* the "> quote" paragraph on the README — one string per line */
  summary: [
    "DevOps Team Leader and Full-Stack Developer. Experienced in managing complex",
    "multi-cluster architectures, automating pipelines, and leading cross-functional",
    "engineering teams in high-stakes environments. Combines deep technical expertise",
    "with strong leadership fundamentals cultivated through military training",
    "and instructional roles.",
  ],

  /* README bullet points — **text** renders bold */
  highlights: [
    "🧭 Leading a team of **12 engineers** (dev, QA & DevOps)",
    "🤖 Architected internal **AI platforms** & automation pipelines that cut manual ops overhead",
    "☸️ Orchestrated **multi-cluster migrations** & disaster-recovery with **zero data loss**",
    "🎓 Mentored **hundreds of students** as a core programming instructor",
    "🥋 Black-belt Jiu-Jitsu instructor — 5 years of volunteering, ages 4 to 15",
  ],

  /* experience.yaml — newest first. `note` is an optional yaml comment. */
  experience: [
    {
      title: "DevOps Team Leader",
      company: "",
      period: "Jan 2024 → present",
      highlights: [
        "Led a team of **12 developers, QA & DevOps engineers** managing an enterprise-grade, developer-facing SaaS platform (GitLab, Artifactory, Jira, Qlik Sense, Matomo)",
        "**Platform engineering & DevEx:** managed and optimized critical development infrastructure to streamline the organizational developer experience",
        "**AI & automation:** architected and deployed internal AI platforms and automation pipelines — significantly accelerating dev workflows and cutting manual operational overhead",
        "**Infrastructure scale:** orchestrated large-scale multi-cluster migrations, version upgrades and automated disaster-recovery strategies — absolute resilience, zero data loss",
        "**Technical leadership:** mentored and upskilled personnel via targeted initiatives, incl. Jira administration seminars and advanced AI-capability workshops",
      ],
    },
    {
      title: "Fullstack Developer",
      company: "",
      period: "Feb 2023 → Sep 2023",
      highlights: [
        "Core fullstack developer on the internal management systems supporting the academy's training programs",
      ],
    },
    {
      title: "Development Course Instructor",
      company: "",
      period: "Jul 2021 → Feb 2023",
      highlights: [
        "Core instructor for intensive technical training programs",
        "Educated, mentored and evaluated **hundreds of students**, ensuring technical readiness",
        "Evaluated and updated course materials to match modern industry standards",
      ],
    },
    {
      title: "Martial Arts Instructor",
      company: "DSJJ Rehovot",
      period: "2017 → 2021",
      note: "volunteer",
      highlights: [
        "5 years of voluntary service as a certified Dennis Survival Jiu-Jitsu instructor (**black belt**), managing and training diverse groups from ages 4 to 15",
      ],
    },
  ],

  /* Extensions: Skills — each pack is one card */
  skills: [
    { icon: "☸️", pack: "Cloud & Orchestration", pub: "production-grade since 2024",
      items: ["Google Cloud Platform", "OpenShift", "Kubernetes", "Linux & Windows VMs"] },
    { icon: "⚡", pack: "IaC & Automation", pub: "everything as code",
      items: ["Terraform", "Ansible", "Helm", "ArgoCD", "GitLab CI/CD", "GitHub Actions"] },
    { icon: "🤖", pack: "AI Platforms", pub: "built & shipped internally",
      items: ["RAG Architecture", "Data Pipelines", "Code Assistants"] },
    { icon: "🧰", pack: "Platform Tools — DevEx", pub: "admin level, served 100s of devs",
      items: ["GitLab", "Artifactory", "Jira", "Confluence", "QlikSense", "Matomo"] },
    { icon: "💬", pack: "Languages", pub: "from assembly to async",
      items: ["Python", "Bash", "JavaScript", "Java", "C#", "C", "Assembly"] },
    { icon: "🧩", pack: "Full-Stack", pub: "front to back",
      items: ["Vue.js", "React", "Express", "Java Spring"] },
    { icon: "🗄️", pack: "Databases & Caching", pub: "relational, document & in-memory",
      items: ["PostgreSQL", "MongoDB", "Redis", "MariaDB"] },
    { icon: "📈", pack: "Observability", pub: "if it moves, it's monitored",
      items: ["Splunk", "Loki", "Grafana", "Tempo", "Mimir"] },
    { icon: "🧭", pack: "Leadership & Mentoring", pub: "Officer training · LTL certified",
      items: ["Team leadership (12 engineers)", "Instruction", "Mentoring", "Working under pressure"] },
  ],

  /* education.md */
  education: [
    { degree: "B.Sc. Computer Science", org: "College of Management Academic Studies", period: "Jan 2024 – Jan 2027 · ongoing" },
    { degree: "Team Leadership Course (LTL)", org: "Leadership & Team Leadership Certification", period: "Jan 2025" },
    { degree: "Practical Software Engineering — Technician Degree", org: "ORT Rehovot", period: "Jan 2020 – Jan 2021" },
    { degree: "Full-Stack Development Course Bootcamp", org: "", period: "Jan 2021 – May 2021" },
  ],
  highschool: {
    title: "🏫 High school — extended STEM track (2020)",
    note: [
      "**5 units each:**",
      "💻 Computer Science",
      "📱 Android Development",
      "🔬 Physics",
      "📐 Mathematics",
      "📚 English",
    ],
  },
};
