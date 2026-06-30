/**
 * OmniAI Nexus - Single Page Application Core Engine
 * -------------------------------------------------------------
 * Architected with modular state handlers, responsive layout toggles,
 * dashboard metrics animations, Chart.js integrations, simulated AI text
 * synthesis with typewriter effects, and settings synchronization.
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. STATE MANAGEMENT
  // =========================================================================
  const AppState = {
    currentPage: 'dashboard',
    user: null,
    isAuthenticated: false,
    sidebarOpen: true,
    charts: {},
    ai: {
      model: 'openai',
      contentType: 'post',
      tone: 'professional'
    },
    campaigns: [
      { id: 1, name: 'Summer Sale 2026', desc: 'Multi-platform promotional campaign targeting tech hubs with exclusive discount rates.', platforms: ['instagram', 'facebook', 'twitter'], budget: 5000, spent: 3240, leads: 1847, roi: '340%', progress: 65, status: 'active', date: 'May 1 - Jun 15, 2026' },
      { id: 2, name: 'Product Launch - Nexus AI Suite', desc: 'Universal launch sequence introducing our local orchestration node APIs to target agencies.', platforms: ['linkedin', 'twitter', 'youtube'], budget: 12000, spent: 8450, leads: 3562, roi: '285%', progress: 70, status: 'active', date: 'May 15 - Jul 1, 2026' },
      { id: 3, name: 'Brand Awareness Q3', desc: 'Ongoing newsletter promotion highlighting customer case studies and integration tutorials.', platforms: ['linkedin', 'email'], budget: 3500, spent: 1200, leads: 892, roi: '156%', progress: 34, status: 'paused', date: 'Jun 1 - Aug 30, 2026' },
      { id: 4, name: 'Influencer Collaboration', desc: 'Short-form video series sponsored placement with prominent creators across TikTok.', platforms: ['tiktok', 'instagram', 'youtube'], budget: 8000, spent: 5600, leads: 2341, roi: '412%', progress: 70, status: 'active', date: 'May 10 - Jun 30, 2026' },
      { id: 5, name: 'Email Nurture Sequence', desc: 'Structured lifecycle emails utilizing smart trigger points following user signup.', platforms: ['email'], budget: 1500, spent: 1500, leads: 4521, roi: '890%', progress: 100, status: 'completed', date: 'Jan 1 - Apr 30, 2026' },
      { id: 6, name: 'Black Friday Warmup', desc: 'Strategic preparation sequences driving pre-registrations for upcoming seasonal offers.', platforms: ['instagram', 'email'], budget: 15000, spent: 0, leads: 0, roi: '-', progress: 0, status: 'draft', date: 'Nov 1 - Dec 1, 2026' }
    ],
    apiKeys: [
      { id: 'k1', name: 'Production Sync Node', value: 'sk_nexus_7c8d92a8f89e248b11a9', date: 'Created May 10, 2026' }
    ],
    team: [
      { name: 'Kamran Ahmad', email: 'kamran@omniai.nexus', role: 'owner' },
      { name: 'Alice Smith', email: 'alice@omniai.nexus', role: 'admin' },
      { name: 'John Doe', email: 'john@omniai.nexus', role: 'editor' }
    ]
  };

  // =========================================================================
  // 2. ROUTER & VIEW SWITCHER
  // =========================================================================
  window.handleRouteChange = function(forcePage) {
    let hash = forcePage || window.location.pathname.replace('/', '') || 'dashboard';
    
    // Validate if the requested page exists in sidebar
    const validPages = ['dashboard', 'ai-studio', 'social', 'campaigns', 'analytics', 'settings', 'crm', 'integrations'];
    if (!validPages.includes(hash)) {
      hash = 'dashboard';
    }

    // Next.js handles authentication via middleware
    // We do not need the old auth overlay here.
    AppState.isAuthenticated = true;

    AppState.currentPage = hash;
    
    // Update Sidebar Navigation state is now handled by Next.js usePathname in sidebar.tsx
    /*
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('data-page') === hash) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    */

    // Toggle active view panel
    document.querySelectorAll('.page').forEach(page => {
      const pageId = page.getAttribute('id');
      if (pageId === `page-${hash}`) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    // Run view specific trigger handles
    onViewActivated(hash);
  }

  function onViewActivated(pageName) {
    switch (pageName) {
      case 'dashboard':
        initDashboardStats();
        initDashboardCharts();
        break;
      case 'ai-studio':
        // Setup initial studio view
        break;
      case 'social':
        initSocialCharts();
        break;
      case 'campaigns':
        renderCampaignCards();
        break;
      case 'analytics':
        initAnalyticsCharts();
        break;
      case 'settings':
        // Setup settings panel defaults
        break;
    }
  }

  function navigateTo(page) {
    window.location.hash = page;
  }

  // =========================================================================
  // 3. AUTHENTICATION CONTROLLER
  // =========================================================================
  function checkAuthSession() {
    const session = localStorage.getItem('nexus_session');
    if (session) {
      try {
        const userData = JSON.parse(session);
        AppState.user = userData;
        AppState.isAuthenticated = true;
        
        // Sync user visuals
        syncUserInterface(userData);
        showAuthOverlay(false);
        window.handleRouteChange();
      } catch (e) {
        localStorage.removeItem('nexus_session');
        showAuthOverlay(true);
      }
    } else {
      showAuthOverlay(true);
    }
  }

  function showAuthOverlay(shouldShow) {
    const overlay = document.getElementById('auth-overlay');
    const appEl = document.getElementById('app');

    if (shouldShow) {
      overlay.style.display = 'flex';
      appEl.style.display = 'none';
    } else {
      overlay.style.display = 'none';
      appEl.style.display = 'flex';
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;

    if (!email || !pass) {
      showToast('Please enter your email and password.', 'error');
      return;
    }

    // Mock Login Process
    const mockUser = {
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email: email,
      token: 'jwt_nexus_token_mock_' + Math.random().toString(36).substring(7)
    };

    localStorage.setItem('nexus_session', JSON.stringify(mockUser));
    AppState.user = mockUser;
    AppState.isAuthenticated = true;

    showToast('Login successful! Welcome to OmniAI Nexus.', 'success');
    syncUserInterface(mockUser);
    showAuthOverlay(false);
    navigateTo('dashboard');
  }

  function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const pass = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const terms = document.getElementById('signup-terms').checked;

    if (pass !== confirm) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    if (!terms) {
      showToast('You must agree to the Terms of Service.', 'error');
      return;
    }

    // Mock Signup Process
    const mockUser = {
      name: name,
      email: email,
      token: 'jwt_nexus_token_mock_' + Math.random().toString(36).substring(7)
    };

    localStorage.setItem('nexus_session', JSON.stringify(mockUser));
    AppState.user = mockUser;
    AppState.isAuthenticated = true;

    // Insert user to team list mockup
    AppState.team.push({ name: name, email: email, role: 'editor' });

    showToast('Registration successful! Launching command center.', 'success');
    syncUserInterface(mockUser);
    showAuthOverlay(false);
    navigateTo('dashboard');
  }

  function handleLogout() {
    localStorage.removeItem('nexus_session');
    AppState.user = null;
    AppState.isAuthenticated = false;
    showToast('Successfully logged out of command center.', 'info');
    showAuthOverlay(true);
  }

  function syncUserInterface(user) {
    const avatarLabels = document.querySelectorAll('.user-avatar, .topbar-avatar-btn, .profile-avatar-large');
    const nameLabels = document.querySelectorAll('#profile-name-display, #dashboard-welcome');
    const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2);

    avatarLabels.forEach(el => { el.textContent = initials; });
    
    // Set greetings and name fields
    if (document.getElementById('dashboard-welcome')) {
      document.getElementById('dashboard-welcome').textContent = `Welcome back, ${user.name.split(' ')[0]}`;
    }
    if (document.getElementById('profile-name-display')) {
      document.getElementById('profile-name-display').textContent = user.name;
    }
    
    // Sync settings profile forms
    const profNameInput = document.getElementById('prof-name');
    const profEmailInput = document.getElementById('prof-email');
    if (profNameInput) profNameInput.value = user.name;
    if (profEmailInput) profEmailInput.value = user.email;
  }

  // =========================================================================
  // 4. SIDEBAR RESPONSIVE ACTIONS
  // =========================================================================
  function setupLayoutControls() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');

    toggleBtn.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.toggle('open');
      } else {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('sidebar-collapsed');
        AppState.sidebarOpen = !sidebar.classList.contains('collapsed');
      }
    });

    // Close sidebar clicking a navigation element on mobile devices
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove('open');
        }
      });
    });

    // Auto Collapse rules on screen resize
    window.addEventListener('resize', debounce(() => {
      if (window.innerWidth <= 992 && window.innerWidth > 768) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('sidebar-collapsed');
      } else if (window.innerWidth > 992) {
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('sidebar-collapsed');
      } else {
        sidebar.classList.remove('collapsed');
        sidebar.classList.remove('open');
        mainContent.classList.remove('sidebar-collapsed');
      }
    }, 200));
  }

  // =========================================================================
  // 5. DASHBOARD VIEWS & COUNTERS
  // =========================================================================
  let dashboardStatsInitialized = false;
  
  function initDashboardStats() {
    if (dashboardStatsInitialized) return;
    dashboardStatsInitialized = true;

    animateCounter('stat-reach', 2420000, 1500, '', 'M', true);
    animateCounter('stat-engagement', 4.8, 1200, '', '%', false);
    animateCounter('stat-generations', 1247, 1800, '', '', false);
    animateCounter('stat-campaigns', 12, 1000, '', '', false);
  }

  function animateCounter(id, target, duration, prefix = '', suffix = '', isFloatWithM = false) {
    const element = document.getElementById(id);
    if (!element) return;

    let start = 0;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing Function: OutQuad
      const easedProgress = progress * (2 - progress);
      const currentVal = start + easedProgress * (target - start);

      if (isFloatWithM) {
        element.textContent = prefix + (currentVal / 1000000).toFixed(1) + suffix;
      } else if (target % 1 !== 0) {
        element.textContent = prefix + currentVal.toFixed(1) + suffix;
      } else {
        element.textContent = prefix + Math.floor(currentVal).toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  // =========================================================================
  // 6. AI CONTENT STUDIO ENGINE
  // =========================================================================
  const MOCK_AI_TEMPLATES = {
    post: {
      professional: `🚀 Unlocking business velocity isn't about working harder; it is about scaling your automation systems. 

At OmniAI Nexus, we have integrated multi-AI orchestration layers with real-time campaign monitors, ensuring you publish content exactly when engagement metrics hit their peak values.

Maximize your organic yield, connect target CRM lists, and deploy resources efficiently. Learn how OmniAI Nexus simplifies operations.

#AIAutomation #B2BMarketing #TechScale #BusinessOptimization`,
      casual: `We've all been there: staring at a blank document, trying to make social copy sound "perfect" while switching between ChatGPT, Gemini, and different platforms. 😩

What if you had one unified board where all AI nodes could work together? 🧠 That's OmniAI Nexus. We automate the boring scheduling stuff so you can build real audience connections.

Drop a comment below if you want early workspace access! 👇

#WorkSmart #AIMarketing #ProductivityHack`,
      humorous: `Hot take: If you are still manual-copy-pasting text across five different SaaS dashboards in 2026, you deserve that wrist cramp. 🤖💼

We built OmniAI Nexus because we were tired of SaaS bills looking like a CVS receipt. Now you can get GPT-4o, Claude, and Gemini to fight over who writes your blog posts while you drink coffee.

Save your fingers. Get Nexus. 🦾

#AutomateEverything #SaaSProblems #AIStartup`,
      inspirational: `Every breakthrough begins with a single connection. The technology landscape is moving fast, but our goal remains constant: empowering human creators to scale their vision. ✨

OmniAI Nexus bridges the gap between complex model layers and direct audience engagement, helping teams drive sustainable, value-based growth.

Dream larger. Automate smarter. Unleash your brand's potential. 🌎

#InnovateNow #Leadership #FutureOfWork`
    },
    blog: {
      professional: `## The Paradigm Shift in Cross-Platform Automation and AI Integration

In today's fast-moving business climate, SaaS sprawl is a critical friction point. Modern marketing teams find themselves managing separate billing cycles and configurations for various language, vector, and image generators.

### Why Orchestration Nodes Matter
Orchestration systems represent the next tier of intelligent software. By routing analytical workloads through optimized LLMs depending on complexity, companies can slash API operating costs while improving conversion accuracy.

### Conclusion
By unifying content authoring, automated CRM triggers, and cross-platform publishing parameters, systems like OmniAI Nexus are redefining digital operational velocity.`
    },
    ad: {
      professional: `🔥 Scale Your Business with a Unified AI Workspace!
Tired of jumping between OpenAI, Google Gemini, and social schedulers? Get OmniAI Nexus — the all-in-one marketing command center.

✅ Multi-AI Orchestration
✅ Dynamic Social Scheduling
✅ High-Impact Video Scripts

Click below and start your 14-day free trial today! 👇`
    },
    email: {
      professional: `Subject: Centralize your AI workflows with OmniAI Nexus

Hi {{Contact.FirstName}},

As marketing organizations scale, tool fragmentation becomes a significant bottleneck. Teams struggle to align copy styles, and API budgets balloon from uncoordinated setups.

OmniAI Nexus resolves this friction by introducing a unified AI engine gateway.

Connect HubSpot, scale campaigns, and execute content assets across platforms automatically.

Ready to explore? Book a custom workspace demo:
[Link: Book Command Demo]

Best regards,
Kamran Ahmad
CEO, Ahmad Agency Inc.`
    },
    video: {
      professional: `[SCENE 1: Close up of professional working with multiple browser tabs. Text on screen: Tool Overload?]
NARRATOR (Voiceover): "Are you tired of switching between five different AI tools to create one campaign?"

[SCENE 2: Cut to OmniAI Nexus Dashboard dashboard layout displaying sleek analytics graphics]
NARRATOR: "Say hello to OmniAI Nexus. The world's first unified command center orchestrating OpenAI, Gemini, and Claude."

[SCENE 3: Dynamic close-up showing typewriter content completion in AI Studio]
NARRATOR: "Automate scheduling, compile smart CRM triggers, and boost conversions instantly."

[SCENE 4: CTA screen with branding logo]
NARRATOR: "Click the link to get Pro access now."`
    }
  };

  function setupAIStudio() {
    const contentTypeBtns = document.querySelectorAll('#content-type-group .btn-option');
    const toneBtns = document.querySelectorAll('#tone-group .btn-option');
    const advancedToggle = document.getElementById('advanced-toggle-btn');
    const advancedPanel = document.getElementById('advanced-options-panel');
    const lengthSlider = document.getElementById('adv-length');
    const lengthVal = document.getElementById('length-val');
    const promptArea = document.getElementById('ai-prompt');
    const charCounter = document.getElementById('prompt-char-count');
    const generateBtn = document.getElementById('btn-generate');
    const placeholder = document.getElementById('output-placeholder-panel');
    const aiOutput = document.getElementById('ai-output');
    const actionsToolbar = document.getElementById('output-actions-toolbar');

    // Content Type selector
    contentTypeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        contentTypeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        AppState.ai.contentType = btn.getAttribute('data-type');
      });
    });

    // Tone selector
    toneBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        toneBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        AppState.ai.tone = btn.getAttribute('data-tone');
      });
    });

    // Advanced settings panel toggle
    advancedToggle.addEventListener('click', () => {
      advancedToggle.classList.toggle('open');
      const isOpen = advancedToggle.classList.contains('open');
      advancedPanel.style.display = isOpen ? 'block' : 'none';
    });

    // Slider token updating
    lengthSlider.addEventListener('input', (e) => {
      lengthVal.textContent = `${e.target.value} tokens`;
    });

    // Character counter for Prompt
    promptArea.addEventListener('input', () => {
      charCounter.textContent = `${promptArea.value.length} / 1000`;
    });

    // AI Generation Trigger
    generateBtn.addEventListener('click', () => {
      const prompt = promptArea.value.trim();
      if (!prompt) {
        showToast('Please type a descriptive prompt to guide the AI generator.', 'error');
        return;
      }

      // Transition generating state
      generateBtn.disabled = true;
      generateBtn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Generating copy...`;
      actionsToolbar.style.display = 'none';

      // Load mock template data matching current choices
      let mockResult = '';
      const type = AppState.ai.contentType;
      const tone = AppState.ai.tone;

      if (MOCK_AI_TEMPLATES[type]) {
        mockResult = MOCK_AI_TEMPLATES[type][tone] || MOCK_AI_TEMPLATES[type]['professional'] || MOCK_AI_TEMPLATES['post']['professional'];
      } else {
        mockResult = MOCK_AI_TEMPLATES['post']['professional'];
      }

      // Simulate network request delays
      setTimeout(() => {
        placeholder.style.display = 'none';
        aiOutput.style.display = 'block';
        aiOutput.textContent = '';
        
        // Typewriter Effect logic
        let charIndex = 0;
        function typeWriter() {
          if (charIndex < mockResult.length) {
            aiOutput.textContent += mockResult.charAt(charIndex);
            charIndex++;
            // Auto scroll container
            const container = aiOutput.parentElement;
            container.scrollTop = container.scrollHeight;
            setTimeout(typeWriter, 12);
          } else {
            // Completed typewriter sequence
            generateBtn.disabled = false;
            generateBtn.innerHTML = `<i class='bx bx-wand'></i> Generate Content`;
            actionsToolbar.style.display = 'flex';
            showToast('AI content assets built successfully.', 'success');
            
            // Increment Stats counter in AppState
            const currentGens = parseInt(localStorage.getItem('nexus_stat_gens') || '1247');
            localStorage.setItem('nexus_stat_gens', (currentGens + 1).toString());
            document.getElementById('stat-generations').textContent = (currentGens + 1).toLocaleString();
          }
        }

        typeWriter();
      }, 1000);
    });

    // Toolbar actions listeners
    const btnOutCopy = document.getElementById('btn-out-copy');
    const btnCopyAll = document.getElementById('btn-copy-all');
    const btnOutEdit = document.getElementById('btn-out-edit');
    const btnOutRegen = document.getElementById('btn-out-regen');
    const btnOutSchedule = document.getElementById('btn-out-schedule');

    function copyOutputToClipboard() {
      const text = aiOutput.textContent;
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        showToast('Content successfully copied to clipboard.', 'success');
      }).catch(err => {
        showToast('Failed to copy text asset.', 'error');
      });
    }

    btnOutCopy.addEventListener('click', copyOutputToClipboard);
    btnCopyAll.addEventListener('click', copyOutputToClipboard);

    btnOutEdit.addEventListener('click', () => {
      // Toggle back text block to editable field mockup
      const currentVal = aiOutput.textContent;
      const editableArea = document.createElement('textarea');
      editableArea.value = currentVal;
      editableArea.rows = 14;
      editableArea.className = 'form-control-edit-area';
      editableArea.style.background = 'var(--bg-tertiary)';
      editableArea.style.color = 'var(--text-primary)';
      editableArea.style.border = '1px solid var(--border)';
      editableArea.style.width = '100%';
      editableArea.style.height = '100%';

      aiOutput.style.display = 'none';
      aiOutput.parentElement.appendChild(editableArea);
      editableArea.focus();

      btnOutEdit.innerHTML = `<i class='bx bx-save'></i> Save`;
      
      // Setup save handler toggle
      btnOutEdit.onclick = function() {
        aiOutput.textContent = editableArea.value;
        editableArea.remove();
        aiOutput.style.display = 'block';
        btnOutEdit.innerHTML = `<i class='bx bx-edit'></i> Edit`;
        showToast('Edits saved locally.', 'success');
        setupAIStudio(); // Rebind original events
      };
    });

    btnOutRegen.addEventListener('click', () => {
      generateBtn.click();
    });

    btnOutSchedule.addEventListener('click', () => {
      showToast('Redirecting draft copy to Social Media Content Calendar Queue...', 'info');
      setTimeout(() => {
        navigateTo('social');
      }, 1000);
    });
  }

  // =========================================================================
  // 7. SOCIAL PLATFORMS INTERACTIVE TOGGLES
  // =========================================================================
  function setupSocialDashboard() {
    const switches = ['toggle-yt', 'toggle-ig', 'toggle-x', 'toggle-li', 'toggle-tt', 'toggle-fb'];
    
    switches.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', (e) => {
          const action = e.target.checked ? 'Enabled' : 'Disabled';
          const platform = id.split('-')[1].toUpperCase();
          showToast(`Auto-publishing configurations ${action} for ${platform}.`, 'info');
        });
      }
    });

    const connectBtn = document.getElementById('btn-connect-account');
    if (connectBtn) {
      connectBtn.addEventListener('click', () => {
        showToast('OAuth handshakes simulated. Redirecting to platform login providers...', 'info');
      });
    }
  }

  // =========================================================================
  // 8. CAMPAIGNS CONTROLLER
  // =========================================================================
  function renderCampaignCards() {
    const container = document.getElementById('campaigns-grid-container');
    if (!container) return;

    container.innerHTML = '';

    AppState.campaigns.forEach(c => {
      const card = document.createElement('div');
      card.className = 'campaign-card';
      card.setAttribute('data-status', c.status);
      
      // Build channels markup
      const platformBadges = c.platforms.map(p => {
        let classLabel = p === 'twitter' ? 'tw' : p === 'email' ? 'mail' : p;
        let iconName = p === 'twitter' ? 'bxl-twitter' : p === 'email' ? 'bx-envelope' : p === 'linkedin' ? 'bxl-linkedin-square' : `bxl-${p}`;
        return `<span class="plat-badge ${classLabel}" title="${p}"><i class="bx ${iconName}"></i></span>`;
      }).join(' ');

      const statusClass = c.status;
      const budgetFmt = c.budget.toLocaleString();
      const spentFmt = c.spent.toLocaleString();
      const leadsFmt = c.leads.toLocaleString();

      card.innerHTML = `
        <div class="campaign-card-header">
          <span class="campaign-status ${statusClass}">${c.status}</span>
          <div class="campaign-menu"><i class="bx bx-dots-horizontal-rounded"></i></div>
        </div>
        <h3>${c.name}</h3>
        <p class="campaign-desc">${c.desc}</p>
        
        <div class="campaign-platforms">
          ${platformBadges}
        </div>

        <div class="campaign-stats-block">
          <div class="cmp-stat">
            <span>Budget</span>
            <h4>$${budgetFmt}</h4>
          </div>
          <div class="cmp-stat">
            <span>Spent</span>
            <h4>$${spentFmt}</h4>
          </div>
          <div class="cmp-stat">
            <span>Leads Generated</span>
            <h4>${leadsFmt}</h4>
          </div>
          <div class="cmp-stat">
            <span>Est. ROI</span>
            <h4 style="color: #10B981;">${c.roi}</h4>
          </div>
        </div>

        <div class="campaign-progress">
          <div class="progress-label">
            <span>Completion Progress</span>
            <span>${c.progress}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${c.progress}%;"></div>
          </div>
        </div>

        <div class="campaign-card-footer">
          <span class="date-range">${c.date}</span>
          <div class="card-action-btns">
            <button class="btn btn-secondary btn-icon-only btn-pause-campaign" data-id="${c.id}" title="${c.status === 'paused' ? 'Resume' : 'Pause'}">
              <i class="bx ${c.status === 'paused' ? 'bx-play' : 'bx-pause'}"></i>
            </button>
            <button class="btn btn-secondary btn-icon-only" title="Settings"><i class="bx bx-edit"></i></button>
            <button class="btn btn-secondary btn-icon-only btn-delete-campaign" data-id="${c.id}" title="Delete"><i class="bx bx-trash"></i></button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    // Bind item buttons
    bindCampaignActions();
  }

  function bindCampaignActions() {
    // Delete Button triggers
    document.querySelectorAll('.btn-delete-campaign').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'));
        if (confirm('Are you sure you want to delete this campaign? This action is permanent.')) {
          AppState.campaigns = AppState.campaigns.filter(c => c.id !== id);
          showToast('Campaign successfully deleted from registry.', 'info');
          renderCampaignCards();
          updateDashboardStatsCount();
        }
      });
    });

    // Pause/Resume toggling trigger
    document.querySelectorAll('.btn-pause-campaign').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'));
        const campaign = AppState.campaigns.find(c => c.id === id);
        
        if (campaign) {
          if (campaign.status === 'active') {
            campaign.status = 'paused';
            showToast(`Campaign "${campaign.name}" paused.`, 'info');
          } else if (campaign.status === 'paused') {
            campaign.status = 'active';
            showToast(`Campaign "${campaign.name}" resumed.`, 'success');
          }
          renderCampaignCards();
        }
      });
    });
  }

  function updateDashboardStatsCount() {
    const activeCount = AppState.campaigns.filter(c => c.status === 'active').length;
    const countEl = document.getElementById('stat-campaigns');
    if (countEl) {
      countEl.textContent = activeCount.toString();
    }
  }

  function setupCampaignManager() {
    const newBtn = document.getElementById('btn-new-campaign');
    const modal = document.getElementById('campaign-modal');
    const closeBtn = document.getElementById('btn-close-modal');
    const cancelBtn = document.getElementById('btn-cancel-modal');
    const overlay = document.getElementById('campaign-modal-overlay');
    const form = document.getElementById('new-campaign-form');

    // Open Modal
    newBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
      
      // Preset default date limits in form
      const startEl = document.getElementById('new-cmp-start');
      const endEl = document.getElementById('new-cmp-end');
      const todayStr = new Date().toISOString().split('T')[0];
      startEl.value = todayStr;
      
      const future = new Date();
      future.setDate(future.getDate() + 30);
      endEl.value = future.toISOString().split('T')[0];
    });

    // Close Modal actions
    const hideModal = () => { modal.style.display = 'none'; };
    closeBtn.addEventListener('click', hideModal);
    cancelBtn.addEventListener('click', hideModal);
    overlay.addEventListener('click', hideModal);

    // Form submission processing
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('new-cmp-name').value;
      const desc = document.getElementById('new-cmp-desc').value;
      const type = document.getElementById('new-cmp-type').value;
      const budget = parseFloat(document.getElementById('new-cmp-budget').value);
      const start = document.getElementById('new-cmp-start').value;
      const end = document.getElementById('new-cmp-end').value;

      // Extract checked platforms
      const checkedBoxes = document.querySelectorAll('input[name="channels"]:checked');
      const platforms = Array.from(checkedBoxes).map(cb => cb.value);

      if (platforms.length === 0) {
        showToast('Please select at least one channel for the campaign.', 'error');
        return;
      }

      // Generate date format
      const startFmt = new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const endFmt = new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      const newCampaign = {
        id: AppState.campaigns.length + 1,
        name: name,
        desc: desc,
        platforms: platforms,
        budget: budget,
        spent: 0,
        leads: 0,
        roi: '-',
        progress: 0,
        status: 'active',
        date: `${startFmt} - ${endFmt}`
      };

      AppState.campaigns.unshift(newCampaign);
      showToast(`Campaign "${name}" has been launched!`, 'success');
      hideModal();
      form.reset();

      renderCampaignCards();
      updateDashboardStatsCount();
    });

    // Filter Buttons logic
    document.querySelectorAll('#campaign-filter-tabs button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#campaign-filter-tabs button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        filterCampaigns(filter, document.getElementById('campaign-search-input').value.trim());
      });
    });

    // Search campaign logic
    const searchInput = document.getElementById('campaign-search-input');
    searchInput.addEventListener('input', () => {
      const activeTab = document.querySelector('#campaign-filter-tabs button.active');
      const filter = activeTab ? activeTab.getAttribute('data-filter') : 'all';
      filterCampaigns(filter, searchInput.value.trim());
    });
  }

  function filterCampaigns(statusFilter, searchQuery) {
    const cards = document.querySelectorAll('#campaigns-grid-container .campaign-card');
    const query = searchQuery.toLowerCase();

    cards.forEach(card => {
      const status = card.getAttribute('data-status');
      const title = card.querySelector('h3').textContent.toLowerCase();
      
      const matchesStatus = (statusFilter === 'all' || status === statusFilter);
      const matchesSearch = (title.includes(query));

      if (matchesStatus && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // =========================================================================
  // 9. SETTINGS PANEL LOGIC
  // =========================================================================
  function setupSettings() {
    // Tab switching setup
    const tabs = document.querySelectorAll('.settings-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const targetPanel = tab.getAttribute('data-tab');
        document.querySelectorAll('.settings-panel').forEach(panel => {
          if (panel.getAttribute('id') === `tab-${targetPanel}`) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      });
    });

    // Profile update submission
    const profileForm = document.getElementById('profile-settings-form');
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const updatedName = document.getElementById('prof-name').value;
      const updatedEmail = document.getElementById('prof-email').value;

      AppState.user.name = updatedName;
      AppState.user.email = updatedEmail;

      localStorage.setItem('nexus_session', JSON.stringify(AppState.user));
      syncUserInterface(AppState.user);
      
      showToast('Profile credentials saved successfully.', 'success');
    });

    // API Key generation
    const keyInput = document.getElementById('api-key-name');
    const genKeyBtn = document.getElementById('btn-generate-api-key');

    genKeyBtn.addEventListener('click', () => {
      const name = keyInput.value.trim();
      if (!name) {
        showToast('Please type a recognizable label name for the script key.', 'error');
        return;
      }

      const randomVal = 'sk_nexus_' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
      const newKey = {
        id: 'k' + (AppState.apiKeys.length + 1),
        name: name,
        value: randomVal,
        date: 'Created ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      AppState.apiKeys.push(newKey);
      keyInput.value = '';
      showToast(`API Access token generated for ${name}`, 'success');
      renderAPIKeys();
    });

    // Team management invites
    const teamForm = document.getElementById('invite-team-form');
    teamForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('invite-email').value;
      const role = document.getElementById('invite-role').value;

      const newMember = {
        name: email.split('@')[0].toUpperCase(),
        email: email,
        role: role
      };

      AppState.team.push(newMember);
      document.getElementById('invite-email').value = '';
      showToast(`Workspace invitation sent to ${email}`, 'success');
      renderTeamMembers();
    });

    // Initial render
    renderAPIKeys();
    renderTeamMembers();
  }

  function renderAPIKeys() {
    const list = document.getElementById('api-keys-list-container');
    if (!list) return;

    list.innerHTML = '';
    AppState.apiKeys.forEach(k => {
      const item = document.createElement('div');
      item.className = 'key-item';
      const maskedVal = k.value.substring(0, 12) + '...';

      item.innerHTML = `
        <div class="key-details">
          <h4>${k.name}</h4>
          <span title="${k.value}">${maskedVal}</span>
        </div>
        <div class="key-actions">
          <span class="key-date">${k.date}</span>
          <button class="btn btn-secondary btn-icon-only btn-copy-key" data-key="${k.value}"><i class="bx bx-copy"></i></button>
          <button class="btn btn-secondary btn-icon-only btn-delete-key" data-id="${k.id}" style="color: #EF4444;"><i class="bx bx-trash"></i></button>
        </div>
      `;

      list.appendChild(item);
    });

    // Copy to clipboard actions
    document.querySelectorAll('.btn-copy-key').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-key');
        navigator.clipboard.writeText(key).then(() => {
          showToast('API key successfully copied to clipboard.', 'success');
        });
      });
    });

    // Delete api key action
    document.querySelectorAll('.btn-delete-key').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        AppState.apiKeys = AppState.apiKeys.filter(k => k.id !== id);
        showToast('API Access Token deleted from workspace permissions.', 'info');
        renderAPIKeys();
      });
    });
  }

  function renderTeamMembers() {
    const container = document.getElementById('team-list-container');
    if (!container) return;

    container.innerHTML = '';
    AppState.team.forEach(m => {
      const item = document.createElement('div');
      item.className = 'team-member-item';
      
      const initials = m.name.split(' ').map(n => n[0]).join('').substring(0, 2);
      const roleLabel = m.role.charAt(0).toUpperCase() + m.role.slice(1);

      item.innerHTML = `
        <div class="team-avatar">${initials}</div>
        <div class="team-details">
          <h4>${m.name}</h4>
          <p>${m.email}</p>
        </div>
        <span class="role-badge ${m.role}">${roleLabel}</span>
      `;

      container.appendChild(item);
    });
  }

  // =========================================================================
  // 10. CHARTING INTERFACES (Chart.js Integration)
  // =========================================================================
  const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94A3B8',
          font: { family: 'Inter', size: 11 }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#64748B', font: { family: 'Inter', size: 10 } },
        grid: { color: 'rgba(255, 255, 255, 0.03)' }
      },
      y: {
        ticks: { color: '#64748B', font: { family: 'Inter', size: 10 } },
        grid: { color: 'rgba(255, 255, 255, 0.03)' }
      }
    }
  };

  function initDashboardCharts() {
    // Engagement line graph setup
    const engCtx = document.getElementById('engagementChart')?.getContext('2d');
    if (engCtx) {
      if (AppState.charts.engagement) AppState.charts.engagement.destroy();

      const likesGrad = engCtx.createLinearGradient(0, 0, 0, 250);
      likesGrad.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
      likesGrad.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

      const commsGrad = engCtx.createLinearGradient(0, 0, 0, 250);
      commsGrad.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
      commsGrad.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

      AppState.charts.engagement = new Chart(engCtx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            { label: 'Likes', data: [2400, 1398, 4800, 3908, 4800, 3490, 5200], borderColor: '#6366F1', backgroundColor: likesGrad, fill: true, tension: 0.4 },
            { label: 'Comments', data: [1200, 980, 2200, 1600, 2400, 1800, 2800], borderColor: '#06B6D4', backgroundColor: commsGrad, fill: true, tension: 0.4 }
          ]
        },
        options: chartDefaults
      });
    }

    // Revenue bar graph setup
    const revCtx = document.getElementById('revenueChart')?.getContext('2d');
    if (revCtx) {
      if (AppState.charts.revenue) AppState.charts.revenue.destroy();

      AppState.charts.revenue = new Chart(revCtx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            { label: 'Revenue', data: [4200, 5800, 4900, 6200, 7100, 8400], backgroundColor: '#6366F1', borderRadius: 6 },
            { label: 'Expenses', data: [2800, 3200, 3000, 3400, 3800, 4200], backgroundColor: '#1C2640', borderRadius: 6 }
          ]
        },
        options: chartDefaults
      });
    }
  }

  function initSocialCharts() {
    const socialCtx = document.getElementById('socialChart')?.getContext('2d');
    if (socialCtx) {
      if (AppState.charts.social) AppState.charts.social.destroy();

      AppState.charts.social = new Chart(socialCtx, {
        type: 'bar',
        data: {
          labels: ['YouTube', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'Facebook'],
          datasets: [{
            label: 'Engagement Rate (%)',
            data: [7.8, 9.2, 6.5, 5.4, 8.8, 7.1],
            backgroundColor: ['#FF0000', '#EC4899', '#94A3B8', '#0A66C2', '#00F2FE', '#1877F2'],
            borderRadius: 8
          }]
        },
        options: chartDefaults
      });
    }
  }

  function initAnalyticsCharts() {
    // 1. Audience Growth
    const audCtx = document.getElementById('audienceChart')?.getContext('2d');
    if (audCtx) {
      if (AppState.charts.audience) AppState.charts.audience.destroy();

      const grad = audCtx.createLinearGradient(0, 0, 0, 250);
      grad.addColorStop(0, 'rgba(139, 92, 246, 0.25)');
      grad.addColorStop(1, 'rgba(139, 92, 246, 0.0)');

      AppState.charts.audience = new Chart(audCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [{
            label: 'Net Audience base',
            data: [12000, 18000, 28000, 48000, 71000],
            borderColor: '#8B5CF6',
            backgroundColor: grad,
            fill: true,
            tension: 0.4
          }]
        },
        options: chartDefaults
      });
    }

    // 2. Content Distribution Doughnut
    const conCtx = document.getElementById('contentChart')?.getContext('2d');
    if (conCtx) {
      if (AppState.charts.content) AppState.charts.content.destroy();

      AppState.charts.content = new Chart(conCtx, {
        type: 'doughnut',
        data: {
          labels: ['Video', 'Images', 'Carousel', 'Stories', 'Blogs'],
          datasets: [{
            data: [35, 25, 20, 12, 8],
            backgroundColor: ['#6366F1', '#06B6D4', '#8B5CF6', '#EC4899', '#10B981'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: { color: '#94A3B8', font: { family: 'Inter', size: 10 } }
            }
          }
        }
      });
    }

    // 3. Traffic sources Doughnut
    const trafCtx = document.getElementById('trafficChart')?.getContext('2d');
    if (trafCtx) {
      if (AppState.charts.traffic) AppState.charts.traffic.destroy();

      AppState.charts.traffic = new Chart(trafCtx, {
        type: 'doughnut',
        data: {
          labels: ['Social Media', 'Organic SEO', 'Paid Advertising', 'Direct Links', 'Referrals'],
          datasets: [{
            data: [40, 25, 20, 10, 5],
            backgroundColor: ['#6366F1', '#10B981', '#F59E0B', '#06B6D4', '#8B5CF6'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: { color: '#94A3B8', font: { family: 'Inter', size: 10 } }
            }
          }
        }
      });
    }

    // 4. Horizontal click volumes
    const platCtx = document.getElementById('platformChart')?.getContext('2d');
    if (platCtx) {
      if (AppState.charts.platformClick) AppState.charts.platformClick.destroy();

      AppState.charts.platformClick = new Chart(platCtx, {
        type: 'bar',
        indexAxis: 'y',
        data: {
          labels: ['TikTok', 'Instagram', 'YouTube', 'Facebook', 'Twitter', 'LinkedIn'],
          datasets: [{
            label: 'Clicks Registered',
            data: [110000, 95000, 82000, 67000, 43000, 28000],
            backgroundColor: '#06B6D4',
            borderRadius: 4
          }]
        },
        options: chartDefaults
      });
    }
  }

  // =========================================================================
  // 11. TOAST NOTIFICATION UTILITIES
  // =========================================================================
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconMap = {
      success: 'bx-check-circle',
      error: 'bx-x-circle',
      info: 'bx-info-circle'
    };

    const icon = iconMap[type] || 'bx-info-circle';

    toast.innerHTML = `
      <i class="bx ${icon}"></i>
      <span>${message}</span>
      <button class="toast-close"><i class="bx bx-x"></i></button>
    `;

    container.appendChild(toast);

    // Bind Close action
    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.classList.add('toast-exit');
      setTimeout(() => { toast.remove(); }, 300);
    });

    // Self destroy trigger after 4s
    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.add('toast-exit');
        setTimeout(() => { toast.remove(); }, 300);
      }
    }, 4000);
  }

  // =========================================================================
  // 12. HELPER UTILITIES
  // =========================================================================
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Set current date string labels
  function syncDateLabels() {
    const el = document.getElementById('current-date');
    if (!el) return;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const now = new Date();
    el.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  }

  // =========================================================================
  // 13. INITIALIZATION BINDINGS
  // =========================================================================
  function setupEventListeners() {
    // Auth Panel switcher
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (showSignupLink && showLoginLink) {
      showSignupLink.addEventListener('click', () => {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
      });

      showLoginLink.addEventListener('click', () => {
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
      });
    }

    // Forms triggers
    loginForm?.addEventListener('submit', handleLogin);
    signupForm?.addEventListener('submit', handleSignup);
    document.getElementById('btn-logout')?.addEventListener('click', handleLogout);

    // Filter Apply in Analytics
    document.getElementById('btn-analytics-filter')?.addEventListener('click', () => {
      showToast('Date range updated. Compiling metric indicators...', 'success');
      initAnalyticsCharts();
    });

    // Hash routers
    window.addEventListener('hashchange', window.handleRouteChange);
  }

  window.reinitApp = function() {
    setupAIStudio();
    setupSocialDashboard();
    setupCampaignManager();
    setupSettings();
  };

  document.addEventListener('DOMContentLoaded', () => {
    // Bind Event listeners
    setupEventListeners();
    setupLayoutControls();
    
    // Check credentials session
    checkAuthSession();

    // Initial Date syncing
    syncDateLabels();

    // Setup interactive component handlers
    window.reinitApp();
  });
})();
