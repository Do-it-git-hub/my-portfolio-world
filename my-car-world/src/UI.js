// src/UI.js
// Controls every HTML overlay:
//   - Loading screen (progress bar + fade-out)
//   - Zone panel (slides in from right with portfolio content)
//   - HUD (speed + zone name)
// ─────────────────────────────────────────────────────────
// ✏️  EDIT YOUR PORTFOLIO CONTENT IN THE ZONE_CONTENT MAP BELOW

const ZONE_CONTENT = {

  // ── HOME ──────────────────────────────────────────────────────────────────
  home: `
    <div class="zone-section zone-home">
      <div class="zone-avatar">👨‍💻</div>
      <h2 class="zone-title">Sai Jeldi</h2>
      <p class="zone-subtitle">Creative Developer &amp; AI Engineer</p>
      <p class="zone-text">Welcome to my 3D portfolio! I build intelligent systems,
        agentic AI architectures, and immersive browser experiences.</p>
      <p class="zone-hint">🚗 Drive into each coloured zone to explore my world</p>
      <div class="zone-map">
        <div class="map-item map-left">🛠️ Skills</div>
        <div class="map-item map-top">📁 Projects</div>
        <div class="map-item map-center">🏠 Here</div>
        <div class="map-item map-bottom">🚀 About</div>
        <div class="map-item map-right">📬 Contact</div>
      </div>
    </div>`,

  // ── SKILLS ────────────────────────────────────────────────────────────────
  skills: `
    <div class="zone-section zone-skills">
      <h2 class="zone-title">Skills</h2>
      <div class="skill-group">
        <h3 class="skill-group-title">Backend</h3>
        <div class="tag-grid">
          <span class="tag tag-blue">Java</span>
          <span class="tag tag-blue">Spring Boot</span>
          <span class="tag tag-blue">Python</span>
          <span class="tag tag-blue">Node.js</span>
          <span class="tag tag-blue">REST APIs</span>
          <span class="tag tag-blue">Microservices</span>
        </div>
      </div>
      <div class="skill-group">
        <h3 class="skill-group-title">AI &amp; Agents</h3>
        <div class="tag-grid">
          <span class="tag tag-purple">LLMs</span>
          <span class="tag tag-purple">AI Agents</span>
          <span class="tag tag-purple">RAG</span>
          <span class="tag tag-purple">Prompt Engineering</span>
          <span class="tag tag-purple">Spring AI</span>
          <span class="tag tag-purple">LangChain</span>
        </div>
      </div>
      <div class="skill-group">
        <h3 class="skill-group-title">Frontend &amp; 3D</h3>
        <div class="tag-grid">
          <span class="tag tag-red">Three.js</span>
          <span class="tag tag-red">React</span>
          <span class="tag tag-red">WebGL</span>
          <span class="tag tag-red">JavaScript</span>
          <span class="tag tag-red">HTML / CSS</span>
        </div>
      </div>
      <div class="skill-group">
        <h3 class="skill-group-title">DevOps &amp; Tools</h3>
        <div class="tag-grid">
          <span class="tag tag-green">Docker</span>
          <span class="tag tag-green">Git</span>
          <span class="tag tag-green">CI/CD</span>
          <span class="tag tag-green">PostgreSQL</span>
          <span class="tag tag-green">Redis</span>
        </div>
      </div>
    </div>`,

  // ── PROJECTS ──────────────────────────────────────────────────────────────
  projects: `
    <div class="zone-section zone-projects">
      <h2 class="zone-title">Projects</h2>

      <div class="project-card">
        <div class="project-header">
          <span class="project-emoji">🤖</span>
          <div>
            <h3>AI Agents Platform</h3>
            <span class="project-year">2025</span>
          </div>
        </div>
        <p>Multi-agent orchestration system with autonomous task decomposition,
           tool use, memory, and human-in-the-loop checkpoints. Built with
           Java 21 + Spring AI.</p>
        <div class="project-tech">
          <span class="tag tag-blue">Java</span>
          <span class="tag tag-blue">Spring AI</span>
          <span class="tag tag-purple">LLMs</span>
          <span class="tag tag-green">Docker</span>
        </div>
      </div>

      <div class="project-card">
        <div class="project-header">
          <span class="project-emoji">🌍</span>
          <div>
            <h3>3D Portfolio World</h3>
            <span class="project-year">2025</span>
          </div>
        </div>
        <p>This very portfolio — an interactive 3D world with physics-based car
           driving. Built with Three.js + Cannon-ES + Vite, inspired by
           bruno-simon.com.</p>
        <div class="project-tech">
          <span class="tag tag-red">Three.js</span>
          <span class="tag tag-red">Cannon-ES</span>
          <span class="tag tag-red">Vite</span>
        </div>
      </div>

      <div class="project-card">
        <div class="project-header">
          <span class="project-emoji">📊</span>
          <div>
            <h3>Knowledge Graph Builder</h3>
            <span class="project-year">2024</span>
          </div>
        </div>
        <p>Turns any folder of documents into a navigable semantic knowledge
           graph using AI-powered relationship extraction and graph visualisation.</p>
        <div class="project-tech">
          <span class="tag tag-blue">Python</span>
          <span class="tag tag-purple">AI</span>
          <span class="tag tag-green">Graph DB</span>
        </div>
      </div>

      <p class="zone-hint" style="margin-top:16px">
        ✏️ Update <code>src/UI.js</code> to add your real projects &amp; links
      </p>
    </div>`,

  // ── ABOUT ─────────────────────────────────────────────────────────────────
  about: `
    <div class="zone-section zone-about">
      <h2 class="zone-title">About Me</h2>
      <p class="zone-text">Hi! I'm <strong>Sai Jeldi</strong>, a developer
        passionate about the intersection of <strong>artificial intelligence</strong>
        and <strong>creative technology</strong>.</p>
      <p class="zone-text">I specialise in building agentic AI systems — autonomous
        software that can reason, plan, and execute complex tasks. I also love
        pushing the limits of the browser with 3D graphics and physics simulations.</p>
      <p class="zone-text">When I'm not coding, I'm exploring new AI research,
        building side projects, or deep-diving into the rapidly evolving world
        of large language models.</p>

      <div class="timeline">
        <div class="timeline-item">
          <span class="timeline-year">2024 – Now</span>
          <span class="timeline-desc">Building AI Agent systems &amp; agentic tooling</span>
        </div>
        <div class="timeline-item">
          <span class="timeline-year">2022 – 2024</span>
          <span class="timeline-desc">Full-stack development with Java &amp; React</span>
        </div>
        <div class="timeline-item">
          <span class="timeline-year">2020 – 2022</span>
          <span class="timeline-desc">Backend engineering — Spring Boot microservices</span>
        </div>
      </div>
    </div>`,

  // ── CONTACT ───────────────────────────────────────────────────────────────
  contact: `
    <div class="zone-section zone-contact">
      <h2 class="zone-title">Get In Touch</h2>
      <p class="zone-text">Want to collaborate, ask something, or just say hello?
        I'd love to hear from you!</p>

      <div class="contact-links">
        <a href="https://github.com/jeldi" target="_blank" rel="noopener"
           class="contact-link">
          <span class="contact-icon">🐙</span>
          <div>
            <strong>GitHub</strong>
            <span>github.com/jeldi</span>
          </div>
        </a>

        <a href="https://linkedin.com/in/jeldi" target="_blank" rel="noopener"
           class="contact-link">
          <span class="contact-icon">💼</span>
          <div>
            <strong>LinkedIn</strong>
            <span>linkedin.com/in/jeldi</span>
          </div>
        </a>

        <a href="mailto:sai@jeldi.dev" class="contact-link">
          <span class="contact-icon">✉️</span>
          <div>
            <strong>Email</strong>
            <span>sai@jeldi.dev</span>
          </div>
        </a>
      </div>

      <p class="zone-hint" style="margin-top:20px">
        ✏️ Update links in <code>src/UI.js</code> → ZONE_CONTENT.contact
      </p>
    </div>`,
}

// ─────────────────────────────────────────────────────────────────────────────

export class UI {
  constructor() {
    this.panel        = document.getElementById('zone-panel')
    this.panelContent = document.getElementById('panel-content')
    this.panelClose   = document.getElementById('panel-close')
    this.hudSpeed     = document.getElementById('hud-speed')
    this.hudZone      = document.getElementById('hud-zone')
    this.loadingEl    = document.getElementById('loading-screen')
    this.loadingBar   = document.getElementById('loading-bar-fill')
    this.loadingPct   = document.getElementById('loading-text')

    // Close button
    if (this.panelClose) {
      this.panelClose.addEventListener('click', () => this.hidePanel())
    }

    // Press Escape to close panel
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') this.hidePanel()
    })
  }

  /** Display a zone's content panel. */
  showZone(zone) {
    const html = ZONE_CONTENT[zone.id]
    if (!html) return
    this.panelContent.innerHTML = html
    this.panel.classList.add('is-visible')
  }

  /** Hide the zone content panel. */
  hidePanel() {
    this.panel.classList.remove('is-visible')
  }

  /** Update the speed/zone HUD. */
  updateHUD(speedKmh, zoneName) {
    if (this.hudSpeed) this.hudSpeed.textContent = Math.round(speedKmh)
    if (this.hudZone)  this.hudZone.textContent  = zoneName ? zoneName.toUpperCase() : ''
  }

  /** Update the loading bar (progress 0→1). */
  setLoadingProgress(progress) {
    if (this.loadingBar) this.loadingBar.style.width = (progress * 100) + '%'
    if (this.loadingPct) this.loadingPct.textContent  = Math.round(progress * 100) + '%'
  }

  /** Fade out and remove the loading screen. */
  hideLoadingScreen() {
    if (!this.loadingEl) return
    this.loadingEl.classList.add('fade-out')
    setTimeout(() => { this.loadingEl.style.display = 'none' }, 900)
  }
}
