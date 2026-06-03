import React, { useState } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [filter, setFilter] = useState('ALL');
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [cookieConsentDismissed, setCookieConsentDismissed] = useState(false);

  // Mock Care Plans database
  const [carePlans, setCarePlans] = useState([
    {
      id: 1,
      name: 'Home Transition Care Plan',
      client: 'for Mom (Eleanor)',
      description: "Comprehensive plan for Mom (Eleanor) focusing on Alzheimer's care and mobility support",
      progress: 68,
      status: 'in-progress',
      createdAt: 'February 28, 2026',
    },
    {
      id: 2,
      name: 'Comprehensive Financial & Estate Allocation',
      client: 'for Arthur Pendelton',
      description: 'Retirement allocation structure covering portfolio distribution and tax efficiency directives.',
      progress: 100,
      status: 'completed',
      createdAt: 'February 20, 2026',
    },
    {
      id: 3,
      name: 'Healthcare Proxy & Directive Plan',
      client: 'for Robert & Sarah Johnson',
      description: 'Core legal proxy assignments and customized palliative instructions for medical advisors.',
      progress: 25,
      status: 'draft',
      createdAt: 'February 18, 2026',
    },
    {
      id: 4,
      name: 'Post-Retirement Living Arrangements',
      client: 'for Deborah Miller',
      description: 'Residential transition evaluation and continuous wellness check-in program schedules.',
      progress: 80,
      status: 'in-progress',
      createdAt: 'February 12, 2026',
    }
  ]);

  // Form states for new care plan
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanClient, setNewPlanClient] = useState('');
  const [newPlanDescription, setNewPlanDescription] = useState('');
  const [newPlanStatus, setNewPlanStatus] = useState('in-progress');
  const [newPlanProgress, setNewPlanProgress] = useState(10);

  // Chatbot conversation states
  const [chatStep, setChatStep] = useState(1); // 1 = timeline, 2 = relation, 3 = zip, 4 = situation, 5 = completed
  const [chatInputValue, setChatInputValue] = useState('');
  const [chatTimeline, setChatTimeline] = useState('');
  const [chatRelation, setChatRelation] = useState('');
  const [chatZip, setChatZip] = useState('');
  const [chatSituation, setChatSituation] = useState('');
  const [navigatorScreen, setNavigatorScreen] = useState('STORY'); // 'STORY' (chatbot), 'JOURNEY' (resourcelist)
  const [expandedPillar, setExpandedPillar] = useState('plan'); // 'plan', 'team', 'benefits', 'costs' or null

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I'm your bQuest Navigator. I'm here to help you find the right care and build a personalized plan. Let's start with a few questions so I can understand your needs."
    },
    {
      id: 2,
      sender: 'ai',
      text: "First, help me understand your timeline. Are you dealing with an urgent situation that needs immediate attention, or are you planning ahead?",
      choices: ['Crisis / Urgent', 'Planning Ahead']
    }
  ]);

  const handleChatChoice = (choiceText) => {
    const userMsg = {
      id: chatMessages.length + 1,
      sender: 'user',
      text: choiceText
    };

    let nextMessages = [];
    let nextStep = chatStep;

    if (chatStep === 1) {
      setChatTimeline(choiceText);
      nextStep = 2;
      nextMessages = [
        {
          id: chatMessages.length + 2,
          sender: 'ai',
          text: "Are you planning care for yourself, or are you helping a family member?",
          choices: ['For Myself', 'For a Family Member']
        }
      ];
    } else if (chatStep === 2) {
      setChatRelation(choiceText);
      nextStep = 3;
      nextMessages = [
        {
          id: chatMessages.length + 2,
          sender: 'ai',
          text: "What's your zip code? This helps me find providers in your area."
        }
      ];
    }

    setChatMessages([...chatMessages, userMsg, ...nextMessages]);
    setChatStep(nextStep);
  };

  const handleChatSubmit = (e) => {
    if (e) e.preventDefault();
    if (!chatInputValue.trim()) return;

    const userText = chatInputValue.trim();
    setChatInputValue('');

    const userMsg = {
      id: chatMessages.length + 1,
      sender: 'user',
      text: userText
    };

    let nextMessages = [];
    let nextStep = chatStep;

    if (chatStep === 3) {
      setChatZip(userText);
      nextStep = 4;
      nextMessages = [
        {
          id: chatMessages.length + 2,
          sender: 'ai',
          text: "Finally, tell me about your situation. What kind of care or support are you looking for? Take your time - the more you share, the better I can help."
        }
      ];
      setChatMessages([...chatMessages, userMsg, ...nextMessages]);
      setChatStep(nextStep);
    } else if (chatStep === 4) {
      setChatSituation(userText);
      setChatStep(5);

      const aiResponse = {
        id: chatMessages.length + 2,
        sender: 'ai',
        text: "Thank you for sharing that with me. I have everything I need to create your personalized care plan. Let me analyze your situation and match you with the right providers."
      };

      setChatMessages([...chatMessages, userMsg, aiResponse]);

      // Automatically switch to Your Journey screen after 4 seconds
      setTimeout(() => {
        setNavigatorScreen('JOURNEY');
      }, 4000);
    }
  };

  const handleCompleteJourney = () => {
    setNavigatorScreen('PROVIDERS');
    const container = document.querySelector('.workspace-content');
    if (container) {
      container.scrollTop = 0;
    }
    window.scrollTo(0, 0);
    
    // Reset chatbot navigator states
    setChatStep(1);
    setChatMessages([
      {
        id: 1,
        sender: 'ai',
        text: "Hello! I'm your bQuest Navigator. I'm here to help you find the right care and build a personalized plan. Let's start with a few questions so I can understand your needs."
      },
      {
        id: 2,
        sender: 'ai',
        text: "First, help me understand your timeline. Are you dealing with an urgent situation that needs immediate attention, or are you planning ahead?",
        choices: ['Crisis / Urgent', 'Planning Ahead']
      }
    ]);
  };

  const handleCreatePlan = (e) => {
    e.preventDefault();
    if (!newPlanName || !newPlanClient) return;

    const newPlan = {
      id: carePlans.length + 1,
      name: newPlanName,
      client: newPlanClient.startsWith('for ') ? newPlanClient : `for ${newPlanClient}`,
      description: newPlanDescription || `Custom plan for ${newPlanClient} focusing on comprehensive care and arrangement coordination.`,
      progress: Number(newPlanProgress),
      status: newPlanStatus,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    };

    setCarePlans([newPlan, ...carePlans]);
    setNewPlanName('');
    setNewPlanClient('');
    setNewPlanDescription('');
    setNewPlanStatus('in-progress');
    setNewPlanProgress(10);
    setShowNewPlanModal(false);
  };

  const filteredPlans = carePlans.filter((plan) => {
    if (filter === 'ALL') return true;
    return plan.status === filter.toLowerCase();
  });

  const [activeSection, setActiveSection] = useState('journey');
  const [activePillarTab, setActivePillarTab] = useState('plan');
  const [activeProviderSection, setActiveProviderSection] = useState('prov-group');
  const [matchingActiveTab, setMatchingActiveTab] = useState('memory');
  const [selectedProviders, setSelectedProviders] = useState({});
  const [expandedProviders, setExpandedProviders] = useState({});

  const handleSelectProvider = (category, providerName) => {
    setSelectedProviders(prev => ({
      ...prev,
      [category]: providerName
    }));
  };

  React.useEffect(() => {
    if (activeTab !== 'NAVIGATOR' || (navigatorScreen !== 'JOURNEY' && navigatorScreen !== 'PROVIDERS')) return;

    const handleScroll = () => {
      const containerEl = document.querySelector('.workspace-content');
      if (!containerEl) return;
      const isDesktop = window.innerWidth > 768;

      const getStaticOffsetTop = (el) => {
        if (!el) return 0;
        let top = 0;
        let current = el;
        while (current && current !== containerEl && current !== document.body) {
          top += current.offsetTop;
          current = current.offsetParent;
        }
        return top;
      };

      const getAbsoluteOffsetTop = (el) => el ? el.getBoundingClientRect().top + window.scrollY : 0;

      let scrollPos = isDesktop 
        ? containerEl.scrollTop + (containerEl.clientHeight / 2)
        : window.scrollY + (window.innerHeight / 2);

      // PROVIDERS (Step 3: Provider Types) Scrollspy
      if (navigatorScreen === 'PROVIDERS') {
        const provGroupEl = document.getElementById('section-prov-group');
        const provHomeEl = document.getElementById('section-prov-home');
        const provGeriatricEl = document.getElementById('section-prov-geriatric');
        const provMemoryEl = document.getElementById('section-prov-memory');
        const provNextEl = document.getElementById('section-prov-next');

        if (!provGroupEl || !provHomeEl || !provGeriatricEl || !provMemoryEl) return;

        const groupTop = getStaticOffsetTop(provGroupEl);
        const homeTop = getStaticOffsetTop(provHomeEl);
        const geriatricTop = getStaticOffsetTop(provGeriatricEl);
        const memoryTop = getStaticOffsetTop(provMemoryEl);
        const nextTop = provNextEl ? getStaticOffsetTop(provNextEl) : 99999;

        if (scrollPos >= nextTop) {
          setActiveProviderSection('prov-next');
        } else if (scrollPos >= memoryTop) {
          setActiveProviderSection('prov-memory');
        } else if (scrollPos >= geriatricTop) {
          setActiveProviderSection('prov-geriatric');
        } else if (scrollPos >= homeTop) {
          setActiveProviderSection('prov-home');
        } else {
          setActiveProviderSection('prov-group');
        }

        // Animate the vertical timeline connector progress fill line for the provider page
        const fillLine = document.querySelector('.providers-progress-fill-line');
        if (isDesktop && fillLine) {
          const startOffset = groupTop - (containerEl.clientHeight / 2);
          const endOffset = memoryTop - (containerEl.clientHeight / 2);
          const currentScroll = containerEl.scrollTop;
          
          let progressPercent = 0;
          if (currentScroll >= startOffset) {
            progressPercent = ((currentScroll - startOffset) / (endOffset - startOffset)) * 100;
            progressPercent = Math.max(0, Math.min(100, progressPercent));
          }
          fillLine.style.height = `${progressPercent}%`;
        }
        return;
      }

      // JOURNEY (Step 2: Educational Timeline) Scrollspy
      const journeyEl = document.getElementById('section-journey');
      const sharedEl = document.getElementById('section-shared');
      const stageEl = document.getElementById('section-stage');
      const nextEl = document.getElementById('section-next-steps');
      
      const pPlanEl = document.getElementById('section-pillar-plan');
      const pTeamEl = document.getElementById('section-pillar-team');
      const pBenefitsEl = document.getElementById('section-pillar-benefits');
      const pCostsEl = document.getElementById('section-pillar-costs');

      if (!sharedEl || !stageEl || !nextEl) return;

      let nextTop, pCostsTop, pBenefitsTop, pTeamTop, pPlanTop, stageTop, sharedTop;

      if (isDesktop) {
        nextTop = getStaticOffsetTop(nextEl);
        pCostsTop = getStaticOffsetTop(pCostsEl);
        pBenefitsTop = getStaticOffsetTop(pBenefitsEl);
        pTeamTop = getStaticOffsetTop(pTeamEl);
        pPlanTop = getStaticOffsetTop(pPlanEl);
        stageTop = getStaticOffsetTop(stageEl);
        sharedTop = getStaticOffsetTop(sharedEl);
      } else {
        nextTop = getAbsoluteOffsetTop(nextEl);
        pCostsTop = getAbsoluteOffsetTop(pCostsEl);
        pBenefitsTop = getAbsoluteOffsetTop(pBenefitsEl);
        pTeamTop = getAbsoluteOffsetTop(pTeamEl);
        pPlanTop = getAbsoluteOffsetTop(pPlanEl);
        stageTop = getAbsoluteOffsetTop(stageEl);
        sharedTop = getAbsoluteOffsetTop(sharedEl);
      }

      if (scrollPos >= nextTop) {
        setActiveSection('next-steps');
      } else if (pCostsEl && scrollPos >= pCostsTop) {
        setActiveSection('pillar-costs');
      } else if (pBenefitsEl && scrollPos >= pBenefitsTop) {
        setActiveSection('pillar-benefits');
      } else if (pTeamEl && scrollPos >= pTeamTop) {
        setActiveSection('pillar-team');
      } else if (pPlanEl && scrollPos >= pPlanTop) {
        setActiveSection('pillar-plan');
      } else if (scrollPos >= stageTop) {
        setActiveSection('stage');
      } else if (scrollPos >= sharedTop) {
        setActiveSection('shared');
      } else {
        setActiveSection('journey');
      }

      // Animate vertical timeline filling connector line dynamically
      const fillLine = document.querySelector('.timeline-progress-fill-line');
      if (isDesktop && fillLine && pPlanEl && pCostsEl) {
        const startOffset = getStaticOffsetTop(pPlanEl) - (containerEl.clientHeight / 2);
        const endOffset = getStaticOffsetTop(pCostsEl) - (containerEl.clientHeight / 2);
        const currentScroll = containerEl.scrollTop;
        
        let progressPercent = 0;
        if (currentScroll >= startOffset) {
          progressPercent = ((currentScroll - startOffset) / (endOffset - startOffset)) * 100;
          progressPercent = Math.max(0, Math.min(100, progressPercent));
        }
        fillLine.style.height = `${progressPercent}%`;
      }
    };

    const containerEl = document.querySelector('.workspace-content');
    window.addEventListener('scroll', handleScroll);
    if (containerEl) {
      containerEl.addEventListener('scroll', handleScroll);
    }

    const handleGlobalWheel = (e) => {
      const container = document.querySelector('.workspace-content');
      if (!container) return;

      // Do not forward scroll if the user is scrolling directly inside the essential resources section
      if (e.target.closest('.journey-right-sidebar') || e.target.closest('.journey-right-card')) {
        return;
      }

      // Do not intercept if user is already scrolling directly inside the scrollable content area
      if (e.target.closest('.workspace-content')) {
        return;
      }

      // Scroll the main workspace content panel
      container.scrollTop += e.deltaY;
    };

    window.addEventListener('wheel', handleGlobalWheel, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (containerEl) {
        containerEl.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('wheel', handleGlobalWheel);
    };
  }, [activeTab, navigatorScreen]);

  React.useEffect(() => {
    if (activeTab === 'NAVIGATOR' && navigatorScreen === 'JOURNEY') {
      window.scrollTo(0, 0);
      const container = document.querySelector('.workspace-content');
      if (container) {
        container.scrollTop = 0;
      }
      setActiveSection('journey');
    }
  }, [activeTab, navigatorScreen]);

  React.useEffect(() => {
    const stream = document.querySelector('.chat-message-stream');
    if (stream) {
      setTimeout(() => {
        stream.scrollTo({
          top: stream.scrollHeight,
          behavior: 'smooth'
        });
      }, 50);
    }
  }, [chatMessages]);

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(`section-${sectionId}`);
    if (el) {
      const container = document.querySelector('.workspace-content');
      const isDesktop = window.innerWidth > 768;
      if (isDesktop && container) {
        const relativeTop = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
        // Center the card in the middle of the scroll container viewport
        const targetHeight = sectionId.startsWith('pillar-') ? 240 : el.clientHeight;
        const offset = (container.clientHeight - targetHeight) / 2;
        container.scrollTo({
          top: relativeTop - Math.max(20, offset),
          behavior: 'smooth'
        });
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <header className="navbar-container">
        <div className="navbar">
          <div className="nav-left">
            <div className="logo-group" onClick={() => setActiveTab('DASHBOARD')}>
              <div className="logo-badge">bq</div>
              <span className="logo-text">bQuest.</span>
            </div>
            <div className="logo-divider"></div>
            <span className="portal-tag">Financial Advisor Portal</span>
          </div>

          <nav className="nav-links">
            {['DASHBOARD', 'MESSAGES', 'NAVIGATOR', 'FIND PROVIDERS', 'RESOURCES', 'MY NETWORK'].map((tab) => (
              <button
                key={tab}
                className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="nav-right">
            <button className="nav-icon-btn" onClick={() => setShowNotification(!showNotification)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="badge-dot"></span>
            </button>
            
            <button className="nav-icon-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Progress tracker bar displays if navigator is active */}
      {activeTab === 'NAVIGATOR' && (
        <div className="navigator-steps-wrapper">
          <div className="navigator-steps">
            <div className="step-line" style={{ left: '10%', right: '10%' }}></div>
            <div 
              className="step-line completed" 
              style={{ 
                left: '10%', 
                width: navigatorScreen === 'PLAN' ? '70%' : navigatorScreen === 'MATCHING' ? '58%' : navigatorScreen === 'PROVIDERS' ? '45%' : navigatorScreen === 'JOURNEY' ? '20%' : '0%',
                transition: 'width 0.8s ease'
              }}
            ></div>
            
            {[
              { num: 1, label: 'Your Story', sub: 'Tell us about your situation' },
              { num: 2, label: 'Your Journey', sub: 'Understanding what to expect' },
              { num: 3, label: 'Provider Types', sub: 'Learn about care options' },
              { num: 4, label: 'Find Providers', sub: 'Match with specialists' },
              { num: 5, label: 'Care Plan', sub: 'Your personalized roadmap' }
            ].map((step) => {
              let isActive = false;
              let isCompleted = false;
              
              if (navigatorScreen === 'PLAN') {
                if (step.num < 5) {
                  isCompleted = true;
                  isActive = true;
                } else if (step.num === 5) {
                  isActive = true;
                }
              } else if (navigatorScreen === 'MATCHING') {
                if (step.num < 4) {
                  isCompleted = true;
                  isActive = true;
                } else if (step.num === 4) {
                  isActive = true;
                }
              } else if (navigatorScreen === 'PROVIDERS') {
                if (step.num < 3) {
                  isCompleted = true;
                  isActive = true;
                } else if (step.num === 3) {
                  isActive = true;
                }
              } else if (navigatorScreen === 'JOURNEY') {
                if (step.num === 1) {
                  isCompleted = true;
                  isActive = true;
                } else if (step.num === 2) {
                  isActive = true;
                }
              } else {
                if (step.num === 1) {
                  isActive = true;
                }
              }

              const currentStepNum = navigatorScreen === 'PLAN' ? 5 : navigatorScreen === 'MATCHING' ? 4 : navigatorScreen === 'PROVIDERS' ? 3 : navigatorScreen === 'JOURNEY' ? 2 : 1;
              const isClickable = step.num < currentStepNum;

              return (
                <div 
                  key={step.num} 
                  className={`step-item ${isActive ? 'active' : ''} ${isClickable ? 'clickable' : ''}`}
                  onClick={isClickable ? () => {
                    if (step.num === 1) setNavigatorScreen('STORY');
                    else if (step.num === 2) setNavigatorScreen('JOURNEY');
                    else if (step.num === 3) setNavigatorScreen('PROVIDERS');
                    else if (step.num === 4) setNavigatorScreen('MATCHING');
                    else if (step.num === 5) setNavigatorScreen('PLAN');
                  } : undefined}
                  style={{ cursor: isClickable ? 'pointer' : 'default' }}
                >
                  <div className="step-badge" style={{ backgroundColor: isCompleted ? 'var(--primary-color)' : '', color: isCompleted ? '#ffffff' : '' }}>
                    {isCompleted ? '✓' : step.num}
                  </div>
                  <span className="step-label" style={{ color: isActive ? 'var(--primary-color)' : '', fontWeight: isActive ? '600' : '' }}>
                    {step.label}
                  </span>
                  <span className="step-description">
                    {step.sub}
                  </span>
                </div>
              );
            }) /* end map */}
          </div>
        </div>
      )}

      {/* Main content wrapper */}
      <main className="main-wrapper">
        {activeTab === 'DASHBOARD' ? (
          <>
            {/* Welcome Section */}
            <section className="welcome-section">
              <h1 className="welcome-title">Welcome back, Sarah Johnson</h1>
              <p className="welcome-subtitle">Continue your care planning journey or start a new plan</p>
            </section>

            {/* Action Cards */}
            <section className="cards-grid">
              {/* Card 1: Start a New Care Plan */}
              <div className="action-card primary">
                <div className="card-header-area">
                  <div className="card-icon-box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </div>
                  <div className="card-title-group">
                    <h2 className="card-title">Start a New Care Plan</h2>
                    <p className="card-description">
                      Our AI Navigator will guide you through creating a personalized care plan
                    </p>
                  </div>
                </div>
                <button className="card-action-btn" onClick={() => setActiveTab('NAVIGATOR')}>
                  Begin Now
                </button>
              </div>

              {/* Card 2: Continue Your Plan */}
              <div className="action-card secondary">
                <div className="card-header-area">
                  <div className="card-icon-box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <div className="card-title-group">
                    <h2 className="card-title">Continue Your Plan</h2>
                    <p className="card-description">
                      Resume working on your most recent care plan
                    </p>
                  </div>
                </div>
                <button className="card-action-btn" onClick={() => {
                  const activePlan = carePlans.find(p => p.status === 'in-progress');
                  if (activePlan) {
                    alert(`Resuming: ${activePlan.name} ${activePlan.client}`);
                  } else {
                    alert('No plan in progress found. Please start a new plan!');
                  }
                }}>
                  View Plan
                </button>
              </div>
            </section>

            {/* Your Care Plans Section */}
            <section className="care-plans-section">
              <div className="section-header">
                <h2 className="section-title">Your Care Plans</h2>
                <div className="filter-bar">
                  {['ALL', 'IN-PROGRESS', 'COMPLETED', 'DRAFT'].map((cat) => (
                    <button
                      key={cat}
                      className={`filter-btn ${filter === cat ? 'active' : ''}`}
                      onClick={() => setFilter(cat)}
                    >
                      {cat.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="care-plans-list">
                {filteredPlans.length > 0 ? (
                  filteredPlans.map((plan) => (
                    <div key={plan.id} className="care-plan-card">
                      <div className="care-plan-card-header">
                        <div className="care-plan-card-title-group">
                          <h3 className="care-plan-card-title">{plan.name}</h3>
                          <span className="care-plan-card-client">{plan.client}</span>
                        </div>
                        <button className="care-plan-card-view-btn" onClick={() => alert(`Opening Plan Details: ${plan.name} ${plan.client}`)}>
                          View &rarr;
                        </button>
                      </div>
                      
                      <p className="care-plan-card-description">{plan.description}</p>
                      
                      <div className="care-plan-card-footer">
                        <div className="care-plan-card-date">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="clock-icon">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <span>Created {plan.createdAt}</span>
                        </div>
                        <div className="care-plan-card-meta">
                          <span className={`plan-status-badge ${plan.status}`}>
                            {plan.status.replace('-', ' ')}
                          </span>
                          <div className="mini-progress-pill">
                            Progress: <strong>{plan.progress}%</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '48px',
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px dashed #c2d6d4',
                    color: '#5c6f6d'
                  }}>
                    No plans found in this category. Click "Begin Now" to add a care plan!
                  </div>
                )}
              </div>
            </section>
          </>
        ) : activeTab === 'NAVIGATOR' ? (
          navigatorScreen === 'STORY' ? (
            <section className="navigator-wrapper">
              {/* Logo, Title & Subtitle Area */}
              <div className="navigator-header">
                <div className="navigator-logo-row" style={{ gap: '10px', flexWrap: 'wrap' }}>
                  <svg className="navigator-logo-sparkle" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                  </svg>
                  <h1 className="navigator-title" style={{ fontSize: '17px', fontWeight: '700', margin: '0', letterSpacing: '-0.3px', display: 'inline-flex', alignItems: 'center' }}>bQuest Navigator</h1>
                  <span className="header-divider-bar" style={{ color: '#c2d6d4', margin: '0 6px', fontSize: '15px', userSelect: 'none' }}>|</span>
                  <p className="navigator-subtitle" style={{ fontSize: '13px', margin: '0', color: 'var(--text-gray)', fontWeight: '500' }}>AI-powered care planning assistant</p>
                </div>
              </div>

              {/* Chatbox Stream */}
              <div className="chat-container">
                <div className="chat-message-stream">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`message-row ${msg.sender}`}>
                      <div className={`message-avatar ${msg.sender}`}>
                        {msg.sender === 'ai' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                        )}
                      </div>
                      <div className="message-bubble-wrapper">
                        <div className="message-bubble">
                          {msg.text}
                        </div>

                        {/* Display choices if available and on active step */}
                        {msg.choices && (
                          <div className="chat-choices-row">
                            {msg.choices.map((choice) => {
                              const choiceIndex = chatMessages.findIndex(m => m.sender === 'user' && m.text === choice);
                              const isAnswered = chatMessages.some(m => m.sender === 'user');
                              return (
                                <button
                                  key={choice}
                                  className="chat-choice-btn"
                                  onClick={() => handleChatChoice(choice)}
                                  disabled={choiceIndex !== -1 || (isAnswered && chatMessages[chatMessages.length - 1].sender === 'user')}
                                  style={{
                                    opacity: choiceIndex !== -1 ? 1 : 0.9,
                                    borderColor: choiceIndex !== -1 ? 'var(--primary-color)' : ''
                                  }}
                                >
                                  {choice}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Display Proceed button inside chat stream when step 5 completed */}
                  {chatStep === 5 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', animation: 'fadeIn 0.5s ease' }}>
                      <button className="btn-submit" onClick={() => setNavigatorScreen('JOURNEY')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        Continue to Your Journey
                      </button>
                    </div>
                  )}
                </div>

                {/* Chat Input Footer */}
                <form onSubmit={handleChatSubmit} className="chat-footer">
                  <input
                    type="text"
                    className="chat-input-pill"
                    placeholder="Type your response..."
                    value={chatInputValue}
                    onChange={(e) => setChatInputValue(e.target.value)}
                    disabled={chatStep === 1 || chatStep === 2 || chatStep === 5}
                  />
                  <button
                    type="submit"
                    className={`chat-send-btn ${(chatInputValue.trim() && chatStep !== 1 && chatStep !== 2 && chatStep !== 5) ? 'active' : ''}`}
                    disabled={!chatInputValue.trim() || chatStep === 1 || chatStep === 2 || chatStep === 5}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </form>
              </div>
            </section>
          ) : navigatorScreen === 'JOURNEY' ? (
            /* Redesigned Your Journey Screen */
            <div style={{ width: '100%' }}>

              <div className="journey-layout-three-col">
                {/* Unified Planner Card */}
                <div className="planner-workspace-card">
                  {/* Left Column: Planning Sections list */}
                  <div className="workspace-sidebar">
                    <span className="scrollspy-title" style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px', display: 'block', textTransform: 'none', letterSpacing: 'normal' }}>Planning Sections</span>
                    <ul className="scrollspy-list" style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', padding: '0' }}>
                      <li>
                        <button 
                          className={`scrollspy-item ${activeSection === 'journey' ? 'active' : ''}`}
                          onClick={() => scrollToSection('journey')}
                        >
                          <span className="scrollspy-dot"></span>
                          We Understand Your Journey
                        </button>
                      </li>
                      <li>
                        <button 
                          className={`scrollspy-item ${activeSection === 'shared' ? 'active' : ''}`}
                          onClick={() => scrollToSection('shared')}
                        >
                          <span className="scrollspy-dot"></span>
                          What You've Shared
                        </button>
                      </li>
                      <li>
                        <button 
                          className={`scrollspy-item ${(activeSection === 'stage' || activeSection.startsWith('pillar-')) ? 'active' : ''}`}
                          onClick={() => scrollToSection('stage')}
                        >
                          <span className="scrollspy-dot"></span>
                          Understand Your Care Stage
                        </button>
                        
                        {/* Always-visible Sub-list for 4 sub-stages */}
                        <ul className="scrollspy-sub-list" style={{ animation: 'fadeIn 0.3s ease', listStyle: 'none', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '1.5px solid #edf2f1', marginTop: '8px' }}>
                          <li>
                            <button 
                              className={`scrollspy-sub-item ${activeSection === 'pillar-plan' ? 'active' : ''}`}
                              onClick={() => scrollToSection('pillar-plan')}
                            >
                              <span className="scrollspy-sub-dot"></span>
                              1. Start with a Plan
                            </button>
                          </li>
                          <li>
                            <button 
                              className={`scrollspy-sub-item ${activeSection === 'pillar-team' ? 'active' : ''}`}
                              onClick={() => scrollToSection('pillar-team')}
                            >
                              <span className="scrollspy-sub-dot"></span>
                              2. Build Your Team
                            </button>
                          </li>
                          <li>
                            <button 
                              className={`scrollspy-sub-item ${activeSection === 'pillar-benefits' ? 'active' : ''}`}
                              onClick={() => scrollToSection('pillar-benefits')}
                            >
                              <span className="scrollspy-sub-dot"></span>
                              3. Coverage & Benefits
                            </button>
                          </li>
                          <li>
                            <button 
                              className={`scrollspy-sub-item ${activeSection === 'pillar-costs' ? 'active' : ''}`}
                              onClick={() => scrollToSection('pillar-costs')}
                            >
                              <span className="scrollspy-sub-dot"></span>
                              4. Costs & Financials
                            </button>
                          </li>
                        </ul>
                      </li>
                    </ul>
                    
                    <button 
                      className={`sidebar-meet-btn ${activeSection === 'next-steps' ? 'filled' : 'outline'}`}
                      onClick={() => scrollToSection('next-steps')}
                    >
                      Meet Your Team
                    </button>
                  </div>

                  {/* Right Column: Content area */}
                  <div className="workspace-content">
                    {/* We Understand Your Journey Section (Unified Style) */}
                    <div id="section-journey" style={{ paddingBottom: '32px', borderBottom: '1px solid #edf2f1' }}>
                      <span style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--primary-color)', letterSpacing: '1px' }}>Your Care Planning Journey</span>
                      <h1 className="journey-hero-title" style={{ fontSize: '20px', textAlign: 'left', marginTop: '6px', marginBottom: '8px', fontWeight: '600' }}>We Understand Your Journey</h1>
                      <div className="care-stage-badge" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        backgroundColor: '#eef5f4',
                        color: 'var(--primary-color)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '600',
                        marginBottom: '12px',
                        border: '1.5px solid rgba(61, 120, 114, 0.15)'
                      }}>
                        Your Care stage: Cognitive Decline
                      </div>
                      <p className="journey-hero-subtitle" style={{ textAlign: 'left', margin: '0', fontSize: '13.5px', color: 'var(--text-gray)', maxWidth: '100%', lineHeight: '1.6' }}>
                        Thank you for sharing your story with us. We know this is a challenging time, and we're honored to walk alongside you as you plan for {chatRelation ? chatRelation.toLowerCase() : "your mother"}'s care.
                      </p>
                      {/* Removed Download Care Summary Button */}
                    </div>

                    {/* What You've Shared Summary Section (Unified Style) */}
                    <div id="section-shared" style={{ paddingBottom: '32px', borderBottom: '1px solid #edf2f1' }}>
                      <h2 className="shared-summary-title" style={{ fontSize: '17px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '16px' }}>What You've Shared</h2>
                      <p className="shared-summary-para" style={{ fontSize: '13.5px', lineHeight: '1.6', color: 'var(--text-gray)', marginBottom: '16px' }}>
                        You're planning care <strong>{chatRelation ? chatRelation.toLowerCase() : 'for a family member'}</strong> — your mother, who is showing early signs of memory loss.
                        The fact that you're <strong>{chatTimeline ? chatTimeline.toLowerCase() : 'planning ahead'}</strong> rather than responding to a crisis is a profound gift. It means you have the precious opportunity to make thoughtful decisions, to explore options without urgency clouding your judgment, and to build a support system before the road becomes more difficult.
                      </p>
                      
                      <div className="shared-quote-box" style={{
                        backgroundColor: '#f7f6f2',
                        borderRadius: '10px',
                        padding: '16px 20px',
                        border: '1px solid #e9eceb',
                        margin: '20px 0',
                        fontStyle: 'italic',
                        fontSize: '13.5px',
                        lineHeight: '1.5',
                        color: 'var(--text-dark)',
                        fontWeight: '500',
                        textAlign: 'center'
                      }}>
                        "{chatSituation || "My mother is showing early signs of memory loss and I want to plan ahead for her care needs."}"
                      </div>
                      
                      <p className="shared-summary-para" style={{ fontSize: '13.5px', lineHeight: '1.6', color: 'var(--text-gray)', margin: '0' }}>
                        You're seeking support in the <strong>{chatZip || '80202'}</strong> area. These details help us connect you with the right resources and providers who can meet your mother where she is, with the care and compassion she deserves.
                      </p>
                    </div>

                    {/* Understand Your Care Stage Educational Section (Unified Style) */}
                    <div id="section-stage" style={{ paddingBottom: '32px', borderBottom: '1px solid #edf2f1' }}>
                      <h2 className="care-stage-title" style={{ fontSize: '19px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>Understand Your Care Stage</h2>
                      <span className="care-stage-subtitle" style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: '500', display: 'block', marginBottom: '16px' }}>Explore key areas of your care planning journey.</span>
                      
                      <p className="care-stage-philosophy" style={{ fontSize: '14.5px', lineHeight: '1.6', color: 'var(--text-gray)', fontWeight: '600', marginBottom: '12px' }}>
                        Aging at home doesn't happen by accident—it happens with a plan.
                      </p>
                      <p className="care-stage-detail" style={{ fontSize: '13.5px', lineHeight: '1.65', color: 'var(--text-gray)', marginBottom: '24px' }}>
                        The earlier you think through key decisions, the more control you have over how and where care happens. Below are the core areas to consider when planning to age in place. You don't need to solve everything at once—but understanding what to think about (and when) can help you avoid stress, rushed decisions, and unnecessary costs later.
                      </p>

                      <div className="timeline-journey-container" style={{ position: 'relative', paddingLeft: '36px', marginTop: '24px' }}>
                        {/* Interactive vertical glowing connector line */}
                        <div className="timeline-track-line">
                          <div className="timeline-progress-fill-line"></div>
                        </div>

                        {/* Step 1: Plan */}
                        <div className={`timeline-journey-step ${activeSection === 'pillar-plan' ? 'active' : ''}`} id="section-pillar-plan">
                          <div className="timeline-milestone-dot">1</div>
                          <div className="timeline-journey-card" onClick={() => scrollToSection('pillar-plan')}>
                            <h3 className="timeline-card-title">1. Start with a Plan & Put Protections in Place</h3>
                            
                            <div className="timeline-card-split-row">
                              <div className="timeline-card-left-col">
                                <p className="timeline-card-desc">
                                  Aging in place starts with understanding current needs, anticipating what may change, and making sure protections are in place. This includes legally and financially enabling the right people to step in when needed, and assessing whether the home itself is safe for long-term living.
                                </p>
                                <div className="pillar-why-box">
                                  <strong>Why this matters:</strong>
                                  <span>Without a clear plan and decision-makers in place, families often face delays, confusion, or court involvement during a crisis.</span>
                                </div>
                              </div>
                              
                              <div className="timeline-card-right-col">
                                <div className="pillar-considerations">
                                  <strong>As you think about this, consider:</strong>
                                  <ul>
                                    <li>Do we understand what support may be needed now vs. later?</li>
                                    <li>Is the home safe and adaptable as needs change?</li>
                                    <li>Are the right legal documents and decision-makers in place?</li>
                                  </ul>
                                </div>
                                <div className="pillar-professionals">
                                  <strong>Professionals who support this:</strong>
                                  <div className="professionals-chips">
                                    <span className="professional-chip">Aging Life Care Manager®</span>
                                    <span className="professional-chip">Home Modification Specialist</span>
                                    <span className="professional-chip">Estate Planning Attorney</span>
                                    <span className="professional-chip">Professional Fiduciary & Trustee</span>
                                    <span className="professional-chip">Corporate Trustee</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Step 2: Team */}
                        <div className={`timeline-journey-step ${activeSection === 'pillar-team' ? 'active' : ''}`} id="section-pillar-team">
                          <div className="timeline-milestone-dot">2</div>
                          <div className="timeline-journey-card" onClick={() => scrollToSection('pillar-team')}>
                            <h3 className="timeline-card-title">2. Build Your Care Team</h3>
                            
                            <div className="timeline-card-split-row">
                              <div className="timeline-card-left-col">
                                <p className="timeline-card-desc">
                                  Aging at home often requires a mix of hands-on support, medical care, and professional coordination. Building your care team early helps avoid gaps and ensures you know who to call as needs evolve.
                                </p>
                                <div className="pillar-why-box">
                                  <strong>Why this matters:</strong>
                                  <span>Care needs rarely stay the same. Having trusted providers in place reduces stress and allows you to respond quickly when things change.</span>
                                </div>
                              </div>
                              
                              <div className="timeline-card-right-col">
                                <div className="pillar-considerations">
                                  <strong>As you think about this, consider:</strong>
                                  <ul>
                                    <li>Who will help with daily needs at home?</li>
                                    <li>What medical or nursing care might be needed?</li>
                                    <li>Who will help coordinate care across providers?</li>
                                  </ul>
                                </div>
                                <div className="pillar-professionals">
                                  <strong>Professionals who support this:</strong>
                                  <div className="professionals-chips">
                                    <span className="professional-chip">Home Care Nursing (Agency-Based)</span>
                                    <span className="professional-chip">Home Care Provider (non-medical)</span>
                                    <span className="professional-chip">Transportation Services</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Step 3: Benefits */}
                        <div className={`timeline-journey-step ${activeSection === 'pillar-benefits' ? 'active' : ''}`} id="section-pillar-benefits">
                          <div className="timeline-milestone-dot">3</div>
                          <div className="timeline-journey-card" onClick={() => scrollToSection('pillar-benefits')}>
                            <h3 className="timeline-card-title">3. Coverage & Benefits</h3>
                            
                            <div className="timeline-card-split-row">
                              <div className="timeline-card-left-col">
                                <p className="timeline-card-desc">
                                  Care is only part of the equation—how you pay for it matters just as much. Understanding Medicare, insurance, and long-term care coverage helps you avoid costly surprises and make informed decisions about care.
                                </p>
                                <div className="pillar-why-box">
                                  <strong>Why this matters:</strong>
                                  <span>Many families assume more is covered than actually is. Clarity upfront helps you plan realistically and maximize available benefits.</span>
                                </div>
                              </div>
                              
                              <div className="timeline-card-right-col">
                                <div className="pillar-considerations">
                                  <strong>As you think about this, consider:</strong>
                                  <ul>
                                    <li>What does Medicare cover—and what doesn't it?</li>
                                    <li>Do you have long-term care insurance or other coverage?</li>
                                    <li>When should coverage decisions be made?</li>
                                  </ul>
                                </div>
                                <div className="pillar-professionals">
                                  <strong>Professionals who support this:</strong>
                                  <div className="professionals-chips">
                                    <span className="professional-chip">Independent Medicare Agent/Broker</span>
                                    <span className="professional-chip">Healthcare & LTC Navigator</span>
                                    <span className="professional-chip">Independent Insurance Broker</span>
                                    <span className="professional-chip">LTC Insurance Specialist</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Step 4: Costs */}
                        <div className={`timeline-journey-step ${activeSection === 'pillar-costs' ? 'active' : ''}`} id="section-pillar-costs">
                          <div className="timeline-milestone-dot">4</div>
                          <div className="timeline-journey-card" onClick={() => scrollToSection('pillar-costs')}>
                            <h3 className="timeline-card-title">4. Costs & Financials</h3>
                            
                            <div className="timeline-card-split-row">
                              <div className="timeline-card-left-col">
                                <p className="timeline-card-desc">
                                  Planning to stay at home also means planning how to sustain it financially. Care costs can increase over time, and staying organized financially and administratively helps you make confident, informed decisions.
                                </p>
                                <div className="pillar-why-box">
                                  <strong>Why this matters:</strong>
                                  <span>Without a clear financial picture, families often delay decisions or make reactive choices that impact long-term stability.</span>
                                </div>
                              </div>
                              
                              <div className="timeline-card-right-col">
                                <div className="pillar-considerations">
                                  <strong>As you think about this, consider:</strong>
                                  <ul>
                                    <li>What will care realistically cost over time?</li>
                                    <li>How will those costs be covered?</li>
                                    <li>Are finances, bills, and important documents organized?</li>
                                  </ul>
                                </div>
                                <div className="pillar-professionals">
                                  <strong>Professionals who support this:</strong>
                                  <div className="professionals-chips">
                                    <span className="professional-chip">Financial Advisor</span>
                                    <span className="professional-chip">Daily Money Manager</span>
                                    <span className="professional-chip">Legacy Planning Organizer</span>
                                    <span className="professional-chip">Funeral Pre-Needs Sales</span>
                                    <span className="professional-chip">Reverse Mortgage Specialist</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA Section (Unified Style) */}
                    <div id="section-next-steps" style={{
                      backgroundColor: '#eef5f4',
                      borderRadius: '12px',
                      padding: '28px',
                      border: '1px solid #c2d6d4',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '16px'
                    }}>
                      <p className="journey-cta-text" style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-gray)', maxWidth: '520px', margin: '0' }}>
                        You're not walking this path alone. We're here to help you find the right people — specialists, caregivers, coordinators, and fellow travelers who understand this journey. Together, we'll build a network of support that honors your mother's dignity and your own wellbeing.
                      </p>
                      <span className="journey-cta-subtitle" style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--primary-color)' }}>Let's take the next step together.</span>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button className={`meet-team-btn ${activeSection === 'next-steps' ? 'filled' : 'outline'}`} onClick={handleCompleteJourney}>
                          Meet Your Care Team
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Essential Resources Sidebar Card */}
                <div className="journey-right-sidebar">
                  <div className="journey-right-card">
                    <h2 className="resources-title" style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>Essential Resources</h2>
                    <p className="resources-subtitle" style={{ fontSize: '12px', color: 'var(--text-gray)', lineHeight: '1.5', marginBottom: '16px' }}>
                      Start here for expert guidance and support on your care journey.
                    </p>
                    
                    <div className="resources-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <a href="https://www.alz.org" target="_blank" rel="noopener noreferrer" className="resource-item-card" style={{ padding: '12px 16px' }}>
                        <div className="resource-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span className="resource-name" style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-dark)' }}>Alzheimer's Association</span>
                          <svg className="resource-link-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                          </svg>
                        </div>
                        <p className="resource-desc" style={{ fontSize: '12px', color: 'var(--text-gray)', margin: '0 0 4px 0' }}>24/7 helpline and local support groups</p>
                        <span className="resource-domain" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--primary-color)' }}>alz.org</span>
                      </a>

                      <a href="https://www.caregiver.org" target="_blank" rel="noopener noreferrer" className="resource-item-card" style={{ padding: '12px 16px' }}>
                        <div className="resource-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span className="resource-name" style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-dark)' }}>Family Caregiver Alliance</span>
                          <svg className="resource-link-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                          </svg>
                        </div>
                        <p className="resource-desc" style={{ fontSize: '12px', color: 'var(--text-gray)', margin: '0 0 4px 0' }}>Education and state-by-state resources</p>
                        <span className="resource-domain" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--primary-color)' }}>caregiver.org</span>
                      </a>

                      <a href="https://www.medicare.gov" target="_blank" rel="noopener noreferrer" className="resource-item-card" style={{ padding: '12px 16px' }}>
                        <div className="resource-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span className="resource-name" style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-dark)' }}>Medicare</span>
                          <svg className="resource-link-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                          </svg>
                        </div>
                        <p className="resource-desc" style={{ fontSize: '12px', color: 'var(--text-gray)', margin: '0 0 4px 0' }}>Coverage for care services</p>
                        <span className="resource-domain" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--primary-color)' }}>medicare.gov</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : navigatorScreen === 'PROVIDERS' ? ( // PROVIDERS (Step 3: Provider Types)
            <div style={{ width: '100%' }}>
              {/* Unified Planner Card stretched to full parent width */}
              <div className="planner-workspace-card">
                {/* Left Column: Planning Sections list */}
                <div className="workspace-sidebar">
                  <span className="scrollspy-title" style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px', display: 'block', textTransform: 'none', letterSpacing: 'normal' }}>Provider Types</span>
                  <ul className="scrollspy-list" style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', padding: '0' }}>
                    <li>
                      <button 
                        className={`scrollspy-item ${activeProviderSection === 'prov-group' ? 'active' : ''}`}
                        onClick={() => scrollToSection('prov-group')}
                      >
                        <span className="scrollspy-dot"></span>
                        Support Group Facilitator
                      </button>
                    </li>
                    <li>
                      <button 
                        className={`scrollspy-item ${activeProviderSection === 'prov-home' ? 'active' : ''}`}
                        onClick={() => scrollToSection('prov-home')}
                      >
                        <span className="scrollspy-dot"></span>
                        Home Health Care
                      </button>
                    </li>
                    <li>
                      <button 
                        className={`scrollspy-item ${activeProviderSection === 'prov-geriatric' ? 'active' : ''}`}
                        onClick={() => scrollToSection('prov-geriatric')}
                      >
                        <span className="scrollspy-dot"></span>
                        Geriatric Care Manager
                      </button>
                    </li>
                    <li>
                      <button 
                        className={`scrollspy-item ${activeProviderSection === 'prov-memory' ? 'active' : ''}`}
                        onClick={() => scrollToSection('prov-memory')}
                      >
                        <span className="scrollspy-dot"></span>
                        Memory Care Specialist
                      </button>
                    </li>
                  </ul>
                  
                  <button 
                    className={`sidebar-meet-btn ${activeProviderSection === 'prov-next' ? 'filled' : 'outline'}`}
                    onClick={() => scrollToSection('prov-next')}
                  >
                    Start Matching
                  </button>
                </div>

                {/* Middle Column: Content area (stretched beautifully across the rest of the workspace card) */}
                <div className="workspace-content">
                  {/* Header Summary (Unified Style) */}
                  <div id="section-prov-header" style={{ paddingBottom: '32px', borderBottom: '1px solid #edf2f1' }}>
                    <span style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--primary-color)', letterSpacing: '1px' }}>Step 3 of 4: Your Care Team Overview</span>
                    <h1 className="providers-main-title" style={{ fontSize: '20px', textAlign: 'left', marginTop: '6px', marginBottom: '8px', fontWeight: '600' }}>Your Care Team Overview</h1>
                    <p className="providers-main-subtitle" style={{ textAlign: 'left', margin: '0 0 16px 0', fontSize: '13.5px', color: 'var(--text-gray)', maxWidth: '100%', lineHeight: '1.6' }}>
                      Based on your situation, you'll need to work with several types of service providers. Here's what each one does and why they're important.
                    </p>
                    <button className="download-guide-btn" style={{ cursor: 'pointer' }}>
                      <svg className="download-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      Download Provider Guide
                    </button>
                  </div>

                  {/* Timeline Journey Step Cards Container */}
                  <div className="timeline-journey-container" style={{ position: 'relative', paddingLeft: '36px', marginTop: '24px' }}>
                    {/* Interactive vertical glowing connector line */}
                    <div className="timeline-track-line">
                      <div className="providers-progress-fill-line"></div>
                    </div>

                    {/* Card 1: Support Group Facilitator */}
                    <div className={`timeline-journey-step ${activeProviderSection === 'prov-group' ? 'active' : ''}`} id="section-prov-group">
                      <div className="timeline-milestone-dot">1</div>
                      <div className="timeline-journey-card" onClick={() => scrollToSection('prov-group')}>
                        <div className="provider-premium-row">
                          {/* Left Profile Aside */}
                          <div className="provider-profile-aside">
                            <div className="provider-icon-badge color-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                              </svg>
                            </div>
                            <h3 className="provider-premium-title">Support Group Facilitator</h3>
                            <span className="provider-tag-pill">Caregiver Support</span>
                          </div>

                          {/* Right Content Area */}
                          <div className="provider-content-main">
                            <div className="premium-block-what">
                              <h4 className="provider-section-label" style={{ fontSize: '10px', fontWeight: '750', letterSpacing: '0.8px', color: '#8fa3a0', margin: '0 0 4px 0' }}>WHAT THEY DO</h4>
                              <p className="provider-section-content" style={{ fontSize: '13px', color: 'var(--text-gray)', lineHeight: '1.55', margin: '0' }}>
                                Organizations and professionals who facilitate peer support groups for family caregivers. These groups provide education, emotional support, and community connection with others on similar journeys.
                              </p>
                            </div>
                            <div className="premium-block-why">
                              <h4 className="provider-section-label" style={{ fontSize: '10px', fontWeight: '750', letterSpacing: '0.8px', color: '#8fa3a0', margin: '0 0 4px 0' }}>WHY YOU NEED THEM</h4>
                              <p className="provider-section-content" style={{ fontSize: '13px', color: 'var(--text-gray)', lineHeight: '1.55', margin: '0' }}>
                                Caregiving can be emotionally overwhelming. Support groups help prevent burnout, provide practical coping strategies, and remind you that you're not alone. Research shows caregivers who participate in support groups experience less stress and better health outcomes.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Home Health Care Provider */}
                    <div className={`timeline-journey-step ${activeProviderSection === 'prov-home' ? 'active' : ''}`} id="section-prov-home">
                      <div className="timeline-milestone-dot">2</div>
                      <div className="timeline-journey-card" onClick={() => scrollToSection('prov-home')}>
                        <div className="provider-premium-row">
                          {/* Left Profile Aside */}
                          <div className="provider-profile-aside">
                            <div className="provider-icon-badge color-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                              </svg>
                            </div>
                            <h3 className="provider-premium-title">Home Health Care Provider</h3>
                            <span className="provider-tag-pill">In-Home Safety</span>
                          </div>

                          {/* Right Content Area */}
                          <div className="provider-content-main">
                            <div className="premium-block-what">
                              <h4 className="provider-section-label" style={{ fontSize: '10px', fontWeight: '750', letterSpacing: '0.8px', color: '#8fa3a0', margin: '0 0 4px 0' }}>WHAT THEY DO</h4>
                              <p className="provider-section-content" style={{ fontSize: '13px', color: 'var(--text-gray)', lineHeight: '1.55', margin: '0' }}>
                                Trained caregivers who provide in-home support with daily activities like bathing, dressing, meal preparation, and medication management. They help maintain safety and independence at home.
                              </p>
                            </div>
                            <div className="premium-block-why">
                              <h4 className="provider-section-label" style={{ fontSize: '10px', fontWeight: '750', letterSpacing: '0.8px', color: '#8fa3a0', margin: '0 0 4px 0' }}>WHY YOU NEED THEM</h4>
                              <p className="provider-section-content" style={{ fontSize: '13px', color: 'var(--text-gray)', lineHeight: '1.55', margin: '0' }}>
                                Critical for day-to-day wellbeing and safety. As memory loss progresses, having consistent, trained support helps prevent accidents, ensures proper nutrition and hygiene, and allows your loved one to remain in familiar surroundings.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Geriatric Care Manager */}
                    <div className={`timeline-journey-step ${activeProviderSection === 'prov-geriatric' ? 'active' : ''}`} id="section-prov-geriatric">
                      <div className="timeline-milestone-dot">3</div>
                      <div className="timeline-journey-card" onClick={() => scrollToSection('prov-geriatric')}>
                        <div className="provider-premium-row">
                          {/* Left Profile Aside */}
                          <div className="provider-profile-aside">
                            <div className="provider-icon-badge color-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                              </svg>
                            </div>
                            <h3 className="provider-premium-title">Geriatric Care Manager</h3>
                            <span className="provider-tag-pill">Care Coordination</span>
                          </div>

                          {/* Right Content Area */}
                          <div className="provider-content-main">
                            <div className="premium-block-what">
                              <h4 className="provider-section-label" style={{ fontSize: '10px', fontWeight: '750', letterSpacing: '0.8px', color: '#8fa3a0', margin: '0 0 4px 0' }}>WHAT THEY DO</h4>
                              <p className="provider-section-content" style={{ fontSize: '13px', color: 'var(--text-gray)', lineHeight: '1.55', margin: '0' }}>
                                Professional care coordinators, often nurses or social workers, who oversee all aspects of care. They act as a single point of contact, coordinating between doctors, caregivers, and family members.
                              </p>
                            </div>
                            <div className="premium-block-why">
                              <h4 className="provider-section-label" style={{ fontSize: '10px', fontWeight: '750', letterSpacing: '0.8px', color: '#8fa3a0', margin: '0 0 4px 0' }}>WHY YOU NEED THEM</h4>
                              <p className="provider-section-content" style={{ fontSize: '13px', color: 'var(--text-gray)', lineHeight: '1.55', margin: '0' }}>
                                Your advocate and guide through a complex healthcare system. They help navigate insurance, coordinate appointments, manage transitions between care settings, and ensure all providers are working together effectively. Invaluable if you live far from your loved one or have a demanding schedule.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card 4: Memory Care Specialist */}
                    <div className={`timeline-journey-step ${activeProviderSection === 'prov-memory' ? 'active' : ''}`} id="section-prov-memory">
                      <div className="timeline-milestone-dot">4</div>
                      <div className="timeline-journey-card" onClick={() => scrollToSection('prov-memory')}>
                        <div className="provider-premium-row">
                          {/* Left Profile Aside */}
                          <div className="provider-profile-aside">
                            <div className="provider-icon-badge color-4">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                              </svg>
                            </div>
                            <h3 className="provider-premium-title">Memory Care Specialist</h3>
                            <span className="provider-tag-pill">Cognitive Health</span>
                          </div>

                          {/* Right Content Area */}
                          <div className="provider-content-main">
                            <div className="premium-block-what">
                              <h4 className="provider-section-label" style={{ fontSize: '10px', fontWeight: '750', letterSpacing: '0.8px', color: '#8fa3a0', margin: '0 0 4px 0' }}>WHAT THEY DO</h4>
                              <p className="provider-section-content" style={{ fontSize: '13px', color: 'var(--text-gray)', lineHeight: '1.55', margin: '0' }}>
                                Medical professionals who specialize in cognitive health, Alzheimer's disease, and dementia care. They provide diagnosis, treatment planning, and ongoing management of memory-related conditions.
                              </p>
                            </div>
                            <div className="premium-block-why">
                              <h4 className="provider-section-label" style={{ fontSize: '10px', fontWeight: '750', letterSpacing: '0.8px', color: '#8fa3a0', margin: '0 0 4px 0' }}>WHY YOU NEED THEM</h4>
                              <p className="provider-section-content" style={{ fontSize: '13px', color: 'var(--text-gray)', lineHeight: '1.55', margin: '0' }}>
                                Essential for understanding your loved one's cognitive health, getting an accurate diagnosis, and creating a medical treatment plan. They can recommend interventions and medications that may slow progression and improve quality of life.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Matching CTA Panel */}
                  <div id="section-prov-next" className="providers-matching-cta-panel" style={{ marginTop: '24px' }}>
                    <h2 className="matching-cta-title">Ready to Find Your Providers?</h2>
                    <p className="matching-cta-desc">
                      Now that you understand each role, we'll help you find the right professionals for your specific situation. We'll go through each provider type one at a time.
                    </p>
                    <div className="matching-cta-meta-strip">
                      <span>4 provider types</span>
                      <span className="dot-divider">•</span>
                      <span>~5 minutes</span>
                      <span className="dot-divider">•</span>
                      <span>Personalized recommendations</span>
                    </div>
                    <button className="matching-start-btn" onClick={() => setNavigatorScreen('MATCHING')} style={{ cursor: 'pointer' }}>
                      Start Matching Providers
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : navigatorScreen === 'MATCHING' ? (
            /* STEP 4: FIND PROVIDERS (MATCHING PROCESS) SCREEN */
            (() => {
              const providerData = {
                memory: {
                  num: 1,
                  pct: '25%',
                  label: 'Provider Type 1 of 4',
                  title: 'Memory Care Specialist',
                  desc: 'Essential for navigating Alzheimer\'s care. They provide expertise in cognitive health management and family support strategies.',
                  what: 'Memory Care Specialists are medical professionals who diagnose and manage cognitive conditions like Alzheimer\'s and dementia. They create treatment plans, recommend medications, and monitor disease progression while supporting both patients and families through the journey.',
                  recommendations: [
                    {
                      id: 'chen',
                      name: 'Dr. Patricia Chen',
                      role: 'Geriatric Neuropsychologist',
                      location: 'Denver, CO',
                      rating: '4.9',
                      availability: 'Accepting new patients',
                      availType: 'success',
                      desc: 'Specializing in Alzheimer\'s and dementia care with over 15 years of experience. Known for compassionate, family-centered approach to memory care planning.',
                      initials: 'DPC',
                      phone: '(303) 555-0142',
                      email: 'pchen@denvermemoryplanning.com',
                      exp: '15+ years in neuropsychology',
                      credentials: [
                        'PhD - Stanford University',
                        'Fellowship in Clinical Neuropsychology',
                        'Member, American Board of Professional Psychology'
                      ],
                      focus: ['Dementia Assessment', 'Family Support', 'Behavioral Strategies', 'Cognitive Health']
                    },
                    {
                      id: 'torres',
                      name: 'Dr. Michael Torres',
                      role: 'Memory Care Physician',
                      location: 'Aurora, CO',
                      rating: '4.8',
                      availability: 'Limited availability - 2 month wait',
                      availType: 'warning',
                      desc: 'Board-certified in geriatric medicine with a focus on early intervention and quality of life for memory care patients and their families.',
                      initials: 'DMT',
                      phone: '(303) 555-0198',
                      email: 'mtorres@auroramemorycare.org',
                      exp: '12+ years in geriatric medicine',
                      credentials: [
                        'MD - Johns Hopkins University',
                        'Board Certified in Geriatric Medicine',
                        'Fellowship in Memory Disorders'
                      ],
                      focus: ['Early-Onset Dementia', 'Medication Management', 'Behavioral Symptoms', 'Care Planning']
                    }
                  ]
                },
                home: {
                  num: 2,
                  pct: '50%',
                  label: 'Provider Type 2 of 4',
                  title: 'Home Health Care Provider',
                  desc: 'Provides daily living support and ensures safety at home. Critical for maintaining independence and quality of life.',
                  what: 'Home Health Care Providers offer trained caregivers who assist with daily activities in your loved one\'s home. This includes personal care (bathing, dressing), meal preparation, medication reminders, light housekeeping, and companionship. They help maintain safety, dignity, and independence.',
                  recommendations: [
                    {
                      id: 'comfortcare',
                      name: 'ComfortCare Home Services',
                      role: 'In-Home Personal Care',
                      location: 'Denver Metro Area',
                      rating: '4.7',
                      availability: 'Immediate availability',
                      availType: 'success',
                      desc: 'Comprehensive home care services including personal care, medication management, and mobility assistance. Available 24/7 with highly trained caregivers.',
                      initials: 'CHS',
                      phone: '(303) 555-0211',
                      email: 'care@comfortcaredenver.com',
                      exp: 'Available 24/7 with highly trained caregivers',
                      credentials: [
                        'Licensed Home Services Agency',
                        'Fully Insured & Bonded Staff',
                        'Dementia Care Training Certified'
                      ],
                      focus: ['ADL Support', 'Meal Prep', 'Medication Reminders', 'Companionship']
                    },
                    {
                      id: 'helpinghands',
                      name: 'Helping Hands Healthcare',
                      role: 'Senior Home Care',
                      location: 'Jefferson County',
                      rating: '4.9',
                      availability: 'Accepting new clients',
                      availType: 'success',
                      desc: 'Family-owned agency providing personalized care plans. Specializes in Alzheimer\'s and dementia care with compassionate caregivers.',
                      initials: 'HHH',
                      phone: '(303) 555-0284',
                      email: 'info@helpinghandsdenver.com',
                      exp: '10+ years in senior home care',
                      credentials: [
                        'State Certified Home Care Provider',
                        'Dementia Care Certified',
                        'Background Checked Staff'
                      ],
                      focus: ['Dementia Support', 'Personal Care', 'Companion Care', 'Respite Care']
                    }
                  ]
                },
                geriatric: {
                  num: 3,
                  pct: '75%',
                  label: 'Provider Type 3 of 4',
                  title: 'Geriatric Care Manager',
                  desc: 'Coordinates all aspects of care and helps navigate the healthcare system. Your advocate and guide through the care journey.',
                  what: 'Geriatric Care Managers (often nurses or social workers) coordinate all aspects of your loved one\'s care. They act as a single point of contact, schedule appointments, communicate with all providers, handle insurance and billing questions, and help navigate transitions between care settings.',
                  recommendations: [
                    {
                      id: 'sarah_williams',
                      name: 'Sarah Williams, RN, CMC',
                      role: 'Certified Care Manager',
                      location: 'Denver, CO',
                      rating: '5',
                      availability: 'Taking select new clients',
                      availType: 'success',
                      desc: 'Registered nurse and certified care manager with expertise in complex care coordination. Helps families navigate medical, financial, and legal aspects of caregiving.',
                      initials: 'SWRC',
                      phone: '(303) 555-0320',
                      email: 'sarah@williamsgeriatric.com',
                      exp: '12+ years care management',
                      credentials: [
                        'Registered Nurse (RN) licensure',
                        'Certified Care Manager (CMC)',
                        'MSW - University of Denver'
                      ],
                      focus: ['Crisis Intervention', 'Care Coordination', 'Family Counseling', 'Benefits Navigation']
                    },
                    {
                      id: 'david',
                      name: 'David Vance, RN',
                      role: 'Geriatric Care Case Manager',
                      location: 'Boulder, CO',
                      rating: '4.8',
                      availability: '1-week wait list',
                      availType: 'warning',
                      desc: 'Specialized registered nurse providing comprehensive cognitive assessments and medication oversight.',
                      initials: 'DVR',
                      phone: '(303) 555-0391',
                      email: 'david@vancegeriatric.com',
                      exp: '14+ years in geriatric nursing',
                      credentials: [
                        'BSN - University of Colorado',
                        'Registered Nurse (RN) licensure',
                        'Board Certified Case Manager'
                      ],
                      focus: ['Health Assessments', 'Medication Management', 'Provider Liaison', 'Discharge Planning']
                    }
                  ]
                },
                group: {
                  num: 4,
                  pct: '100%',
                  label: 'Provider Type 4 of 4',
                  title: 'Support Group Facilitator',
                  desc: 'Provides emotional support and community connection for caregivers. Essential for your own wellbeing throughout this journey.',
                  what: 'Support Group Facilitators run peer support programs for family caregivers. They create safe spaces to share experiences, learn coping strategies, and build community with others who understand your journey. Many also offer educational programs and 24/7 helplines.',
                  recommendations: [
                    {
                      id: 'alz_co',
                      name: 'Alzheimer\'s Association Colorado',
                      role: 'Caregiver Support Services',
                      location: 'Multiple Locations',
                      rating: '4.8',
                      availability: 'Open enrollment - multiple group options',
                      availType: 'success',
                      desc: 'Free support groups, education programs, and 24/7 helpline. Connects caregivers with resources and community throughout the care journey.',
                      initials: 'AAC',
                      phone: '(303) 555-0455',
                      email: 'support@alzco.org',
                      exp: 'Weekly structured groups',
                      credentials: [
                        'Affiliated with Alzheimer\'s Association facilitators',
                        'Licensed Marriage and Family Therapists (LMFT)',
                        '20+ years group leadership'
                      ],
                      focus: ['Spouse Support', 'Adult Children Caregivers', 'Stress Management', 'Community Resources']
                    },
                    {
                      id: 'rocky',
                      name: 'Rocky Mountain Caregiver Alliance',
                      role: 'Therapist-Led Support Group',
                      location: 'Aurora, CO',
                      rating: '4.8',
                      availability: 'Online & in-person options',
                      availType: 'success',
                      desc: 'Structured support workshops focused on stress management, behavioral strategies, and peer solidarity.',
                      initials: 'RMC',
                      phone: '(303) 555-0499',
                      email: 'alliance@rmcaregivers.org',
                      exp: 'Bi-weekly therapy groups',
                      credentials: [
                        'Certified Group Psychotherapists',
                        'Specialized Dementia Education Curriculum',
                        'Non-profit sponsored caregiver network'
                      ],
                      focus: ['Grief Counseling', 'Behavioral Strategies', 'Online Support Groups', 'Respite Coordination']
                    }
                  ]
                }
              };

              const currentTabInfo = providerData[matchingActiveTab];

              return (
                <div style={{ width: '100%' }}>
                  {/* Top subheader with progress details */}
                  <div className="matching-header-row">
                    <span>{currentTabInfo.label}</span>
                    <span>{currentTabInfo.pct} Complete</span>
                  </div>
                  <div className="matching-progress-bar-track">
                    <div className="matching-progress-bar-fill" style={{ width: currentTabInfo.pct }}></div>
                  </div>
                  <div className="planner-workspace-card" style={{ marginTop: '16px', display: 'flex' }}>
                    {/* Left Column: Sidebar list of Provider Types */}
                    <div className="workspace-sidebar" style={{ width: '300px', flexShrink: 0, padding: '12px 14px 20px 14px', borderRight: '1px solid #edf2f1', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
                      <span className="scrollspy-title" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '12px', display: 'block', textTransform: 'none', letterSpacing: 'normal' }}>Provider Types</span>
                      <ul className="scrollspy-list" style={{ marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '6px', listStyle: 'none', padding: '0', margin: '0' }}>
                        {Object.keys(providerData).map((key) => {
                          const isSelected = !!selectedProviders[key];
                          const isActive = matchingActiveTab === key;
                          return (
                            <li key={key}>
                              <button 
                                className={`scrollspy-item ${isActive ? 'active' : ''}`}
                                onClick={() => setMatchingActiveTab(key)}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '3px 0', cursor: 'pointer' }}
                              >
                                <span className={`scrollspy-dot ${isActive ? 'active' : ''}`} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isActive ? 'var(--primary-color)' : '#cddbd8', display: 'inline-block', marginRight: '6px' }}></span>
                                {isSelected && (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--primary-color)', marginRight: '2px' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                  </span>
                                )}
                                <span style={{ fontSize: '11.5px', fontWeight: isActive ? '600' : '400', color: isActive ? 'var(--text-dark)' : 'var(--text-gray)' }}>
                                  {providerData[key].title}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>

                      {/* What They Do Section */}
                      <div style={{
                        marginTop: '6px',
                        background: '#f8faf9',
                        borderRadius: '8px',
                        padding: '8px 10px',
                        border: '1px solid #edf2f1'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '11px' }}>💡</span>
                          <span style={{ fontSize: '9px', fontWeight: '700', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>What They Do</span>
                        </div>
                        <p style={{ fontSize: '11px', color: 'var(--text-gray)', lineHeight: '1.4', margin: 0 }}>
                          {currentTabInfo.what}
                        </p>
                      </div>

                      {/* Side buttons for current matching tab */}
                      <div style={{ marginTop: '10px', paddingTop: '6px', borderTop: '1px solid #edf2f1' }}>
                        <button
                          className="matching-primary-cta active"
                          onClick={() => {
                            const topDoc = currentTabInfo.recommendations[0].name;
                            setSelectedProviders(prev => ({ ...prev, [matchingActiveTab]: topDoc }));
                            if (matchingActiveTab === 'memory') setMatchingActiveTab('home');
                            else if (matchingActiveTab === 'home') setMatchingActiveTab('geriatric');
                            else if (matchingActiveTab === 'geriatric') setMatchingActiveTab('group');
                            else setNavigatorScreen('PLAN');
                          }}
                          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px', width: '100%', padding: '6px 8px', fontSize: '11px', whiteSpace: 'nowrap' }}
                        >
                          Use Recommendation &rarr;
                        </button>
                      </div>
                    </div>

                    {/* Right Column: Content area */}
                    <div className="workspace-content" style={{ flex: 1, padding: '20px 24px 40px 24px' }}>
                      <div style={{ marginBottom: '16px' }}>
                        <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '4px' }}>
                          {currentTabInfo.title}
                        </h1>
                        <p style={{ fontSize: '12.5px', color: 'var(--text-gray)', lineHeight: '1.55', margin: 0 }}>
                          {currentTabInfo.desc}
                        </p>
                      </div>

                      <div style={{ borderTop: '1px solid #edf3f2', paddingTop: '16px' }}>
                        <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '4px' }}>
                          Our Recommendations
                        </h2>
                        <p style={{ fontSize: '12.5px', color: 'var(--text-gray)', marginBottom: '16px' }}>
                          Based on your location and needs, here are our top matches:
                        </p>

                      <div className="recommendations-list">
                        {currentTabInfo.recommendations.map((doc, index) => {
                          const isExpanded = expandedProviders[doc.id];
                          const isSelected = selectedProviders[matchingActiveTab] === doc.name;

                          return (
                            <div key={doc.id} className={`matching-recom-card ${isSelected ? 'selected' : ''}`}>
                              {index === 0 && (
                                <div className="matching-top-match-badge">Top Match</div>
                              )}

                              <div className="matching-avatar-circle">
                                {doc.initials}
                              </div>

                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <h3 className="matching-doc-name">{doc.name}</h3>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '700', color: '#b38600' }}>
                                    <span>★</span>
                                    <span>{doc.rating}</span>
                                  </div>
                                </div>

                                <div className="matching-meta-badges">
                                  <span className="matching-role-badge">{doc.role}</span>
                                  <span className={`matching-avail-badge ${doc.availType}`}>
                                    {doc.availability}
                                  </span>
                                </div>

                                <div className="matching-location-info">
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                      <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                                      <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    {doc.location}
                                  </span>
                                </div>

                                <p className="matching-doc-desc">
                                  {doc.desc}
                                </p>

                                <div className="matching-card-actions">
                                  <button
                                    className={`matching-select-btn ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleSelectProvider(matchingActiveTab, doc.name)}
                                  >
                                    {isSelected ? 'Selected' : 'Select Provider'}
                                  </button>

                                  <button
                                    className="matching-more-info-btn"
                                    onClick={() => setExpandedProviders(prev => ({ ...prev, [doc.id]: !prev[doc.id] }))}
                                  >
                                    {isExpanded ? 'Less Info' : 'More Info'}
                                    <svg 
                                      style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} 
                                      xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                    >
                                      <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                  </button>
                                </div>

                                {/* Collapsible detail drawer */}
                                {isExpanded && (
                                  <div className="matching-detail-drawer">
                                    <div className="matching-detail-section">
                                      <span className="matching-detail-label">Contact Information</span>
                                      <span className="matching-detail-val">📞 {doc.phone}</span>
                                      <span className="matching-detail-val">✉️ {doc.email}</span>
                                    </div>
                                    <div className="matching-detail-section">
                                      <span className="matching-detail-label">Credentials</span>
                                      {doc.credentials.map((cred, i) => (
                                        <span key={i} className="matching-detail-val">• {cred}</span>
                                      ))}
                                    </div>
                                    <div className="matching-detail-section" style={{ gridColumn: 'span 2' }}>
                                      <span className="matching-detail-label">Experience</span>
                                      <span className="matching-detail-val">{doc.exp}</span>
                                    </div>
                                    <div className="matching-detail-section" style={{ gridColumn: 'span 2' }}>
                                      <span className="matching-detail-label">Areas of Focus</span>
                                      <div className="matching-detail-pill-grid">
                                        {doc.focus.map((f, i) => (
                                          <span key={i} className="matching-detail-pill">{f}</span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Matching Action button row bottom */}
                      <div className="matching-action-row-bottom">
                        <button
                          className={`matching-primary-cta ${selectedProviders[matchingActiveTab] && selectedProviders[matchingActiveTab] !== 'Skipped' ? 'active' : ''}`}
                          disabled={!selectedProviders[matchingActiveTab] || selectedProviders[matchingActiveTab] === 'Skipped'}
                          onClick={() => {
                            if (matchingActiveTab === 'memory') setMatchingActiveTab('home');
                            else if (matchingActiveTab === 'home') setMatchingActiveTab('geriatric');
                            else if (matchingActiveTab === 'geriatric') setMatchingActiveTab('group');
                            else setNavigatorScreen('PLAN');
                          }}
                        >
                          {matchingActiveTab === 'group' ? 'Build My Care Plan' : 'Continue to Next Provider Type'}
                        </button>
                        <button
                          className="matching-secondary-cta"
                          onClick={() => {
                            if (matchingActiveTab === 'memory') setMatchingActiveTab('home');
                            else if (matchingActiveTab === 'home') setMatchingActiveTab('geriatric');
                            else if (matchingActiveTab === 'geriatric') setMatchingActiveTab('group');
                            else setNavigatorScreen('PLAN');
                          }}
                        >
                          Skip This Provider Type
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          );
        })()
          ) : (
            /* STEP 5: CARE PLAN SCREEN */
            <div style={{ width: '100%', animation: 'fadeIn 0.5s ease', fontFamily: 'Outfit, sans-serif' }}>
              {/* Header */}
              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#2c5e59', margin: '0 0 4px 0' }}>
                  Let's address your care needs
                </h1>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Home Transition for Eleanor
                </p>
              </div>

              {/* Banner Info Card */}
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                marginBottom: '24px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '150px',
                  height: '150px',
                  background: 'rgba(61, 120, 114, 0.03)',
                  borderRadius: '50%'
                }}></div>
                <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.7', margin: '0 0 12px 0' }}>
                  Every aspect of your care is important. Based on your specific situation, bQuest has curated a list of certified Service Providers and educational resources just for you.
                </p>
                <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.7', margin: 0 }}>
                  We've selected a <strong>Primary Specialist</strong> that we suggest connecting with first. Feel free to connect with them or any of the other providers below when you are ready, or just learn more about what they do.
                </p>
              </div>

              {/* Action Buttons Row */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
                <button style={{
                  backgroundColor: '#3d7872',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 9.73v9.19z"></path>
                  </svg>
                  Contact Primary Specialist
                </button>
                <button style={{
                  backgroundColor: '#ffffff',
                  color: '#3d7872',
                  border: '1px solid #3d7872',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>
                  Download Care Plan
                </button>
                <button style={{
                  backgroundColor: '#ffffff',
                  color: '#3d7872',
                  border: '1px solid #3d7872',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>
                  Request Concierge Support
                </button>
              </div>

              {/* Primary Need Heading & Card */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ marginBottom: '10px' }}>
                  <span style={{
                    backgroundColor: '#f55b14',
                    color: '#ffffff',
                    fontSize: '9.5px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    display: 'inline-block'
                  }}>
                    Primary Need
                  </span>
                </div>

                <div style={{
                  background: '#ffffff',
                  border: '1px solid #ccdcd9',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }}>
                  <div style={{
                    backgroundColor: '#4d827a',
                    padding: '10px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700' }}>Memory Care Specialist</span>
                    <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: '600', cursor: 'pointer', opacity: 0.9 }}>Learn More</span>
                  </div>
                  <div style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: '#386862',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '13px'
                      }}>
                        DP
                      </div>
                      <div>
                        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: '0 0 2px 0' }}>Dr. Patricia Chen</h3>
                        <p style={{ fontSize: '11.5px', color: '#64748b', margin: '0 0 4px 0' }}>Neurologist & Memory Care Specialist</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#fbbf24', fontSize: '12px', fontWeight: '700' }}>
                          ★ <span style={{ color: '#475569' }}>4.9</span>
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                      Memory care specialists provide crucial medical expertise in diagnosing and managing Alzheimer's and related dementias. They can prescribe medications, monitor disease progression, and adjust treatment plans as your loved one's needs evolve.
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{
                        backgroundColor: '#ffffff',
                        color: '#3d7872',
                        border: '1px solid #3d7872',
                        borderRadius: '6px',
                        padding: '6px 14px',
                        fontSize: '11px',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer'
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        Message
                      </button>
                      <button style={{
                        backgroundColor: '#3d7872',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 14px',
                        fontSize: '11px',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer'
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 9.73v9.19z"></path>
                        </svg>
                        Schedule Call
                      </button>
                      <button style={{
                        backgroundColor: '#ffffff',
                        color: '#3d7872',
                        border: '1px solid #3d7872',
                        borderRadius: '6px',
                        padding: '6px 14px',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Providers Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                {/* Home Health Care Card */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #ccdcd9',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }}>
                  <div style={{
                    backgroundColor: '#4d827a',
                    padding: '10px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700' }}>Home Health Care</span>
                    <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: '600', cursor: 'pointer', opacity: 0.9 }}>Learn More</span>
                  </div>
                  <div style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: '#386862',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '13px'
                      }}>
                        CH
                      </div>
                      <div>
                        <h3 style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b', margin: '0 0 2px 0' }}>ComfortCare Home Services</h3>
                        <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 4px 0' }}>In-Home Personal Care Provider</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#fbbf24', fontSize: '11.5px', fontWeight: '700' }}>
                          ★ <span style={{ color: '#475569' }}>4.7</span>
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: '11.5px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                      Professional home care providers ensure your loved one receives consistent, compassionate assistance with daily activities while remaining in the comfort of their own home. These services help maintain quality of life and can delay or prevent the need for institutional care.
                    </p>
                  </div>
                </div>

                {/* Care Coordination Card */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #ccdcd9',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }}>
                  <div style={{
                    backgroundColor: '#4d827a',
                    padding: '10px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700' }}>Care Coordination</span>
                    <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: '600', cursor: 'pointer', opacity: 0.9 }}>Learn More</span>
                  </div>
                  <div style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: '#386862',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '13px'
                      }}>
                        SW
                      </div>
                      <div>
                        <h3 style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b', margin: '0 0 2px 0' }}>Sarah Williams, RN, CMC</h3>
                        <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 4px 0' }}>Certified Care Manager</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#fbbf24', fontSize: '11.5px', fontWeight: '700' }}>
                          ★ <span style={{ color: '#475569' }}>5</span>
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: '11.5px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                      Care managers serve as your advocate and guide through the complex healthcare system, helping coordinate multiple providers and services. They can save you countless hours of research and phone calls while ensuring nothing falls through the cracks.
                    </p>
                  </div>
                </div>

                {/* Support Services Card */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #ccdcd9',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }}>
                  <div style={{
                    backgroundColor: '#4d827a',
                    padding: '10px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700' }}>Support Services</span>
                    <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: '600', cursor: 'pointer', opacity: 0.9 }}>Learn More</span>
                  </div>
                  <div style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: '#386862',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '13px'
                      }}>
                        AA
                      </div>
                      <div>
                        <h3 style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b', margin: '0 0 2px 0' }}>Alzheimer's Association Colorado</h3>
                        <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 4px 0' }}>Caregiver Support & Education</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#fbbf24', fontSize: '11.5px', fontWeight: '700' }}>
                          ★ <span style={{ color: '#475569' }}>4.9</span>
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: '11.5px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                      Caregiver support services provide essential emotional support and practical guidance to help you navigate the challenges of caring for a loved one. Connecting with others who understand your experience can reduce stress, prevent burnout, and help you be a better caregiver.
                    </p>
                  </div>
                </div>
              </div>

              {/* Resources Section */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '32px', marginTop: '32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#2c5e59', margin: '0 0 6px 0' }}>
                  Resources about your care stage
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px 0' }}>
                  Educational materials to help you understand and navigate your care journey
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  {/* Resource 1 */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #edf4f3',
                    borderRadius: '10px',
                    padding: '20px',
                    display: 'flex',
                    gap: '14px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#ecf4f3',
                      color: '#3d7872',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      flexShrink: 0
                    }}>
                      📖
                    </div>
                    <div>
                      <span style={{
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        fontSize: '9px',
                        fontWeight: '700',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        display: 'inline-block',
                        marginBottom: '8px'
                      }}>
                        Video Series
                      </span>
                      <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>
                        Communication Techniques for Dementia
                      </h3>
                      <p style={{ fontSize: '11.5px', color: '#64748b', lineHeight: '1.5', margin: '0 0 12px 0' }}>
                        Effective ways to connect and communicate as cognition changes
                      </p>
                      <a href="#" style={{ fontSize: '11.5px', color: '#3d7872', fontWeight: '600', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        Access resource &rarr;
                      </a>
                    </div>
                  </div>

                  {/* Resource 2 */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #edf4f3',
                    borderRadius: '10px',
                    padding: '20px',
                    display: 'flex',
                    gap: '14px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#ecf4f3',
                      color: '#3d7872',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      flexShrink: 0
                    }}>
                      📖
                    </div>
                    <div>
                      <span style={{
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        fontSize: '9px',
                        fontWeight: '700',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        display: 'inline-block',
                        marginBottom: '8px'
                      }}>
                        Guide
                      </span>
                      <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>
                        Daily Routine Strategies
                      </h3>
                      <p style={{ fontSize: '11.5px', color: '#64748b', lineHeight: '1.5', margin: '0 0 12px 0' }}>
                        Establishing structure and consistency for better quality of life
                      </p>
                      <a href="#" style={{ fontSize: '11.5px', color: '#3d7872', fontWeight: '600', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        Access resource &rarr;
                      </a>
                    </div>
                  </div>

                  {/* Resource 3 */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #edf4f3',
                    borderRadius: '10px',
                    padding: '20px',
                    display: 'flex',
                    gap: '14px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#ecf4f3',
                      color: '#3d7872',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      flexShrink: 0
                    }}>
                      📖
                    </div>
                    <div>
                      <span style={{
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        fontSize: '9px',
                        fontWeight: '700',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        display: 'inline-block',
                        marginBottom: '8px'
                      }}>
                        Resource
                      </span>
                      <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>
                        Medicare & Insurance Navigator
                      </h3>
                      <p style={{ fontSize: '11.5px', color: '#64748b', lineHeight: '1.5', margin: '0 0 12px 0' }}>
                        Understanding coverage for home care, medical equipment, and specialized services
                      </p>
                      <a href="#" style={{ fontSize: '11.5px', color: '#3d7872', fontWeight: '600', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        Access resource &rarr;
                      </a>
                    </div>
                  </div>

                  {/* Resource 4 */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #edf4f3',
                    borderRadius: '10px',
                    padding: '20px',
                    display: 'flex',
                    gap: '14px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#ecf4f3',
                      color: '#3d7872',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      flexShrink: 0
                    }}>
                      📖
                    </div>
                    <div>
                      <span style={{
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        fontSize: '9px',
                        fontWeight: '700',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        display: 'inline-block',
                        marginBottom: '8px'
                      }}>
                        Directory
                      </span>
                      <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>
                        Support Group Finder
                      </h3>
                      <p style={{ fontSize: '11.5px', color: '#64748b', lineHeight: '1.5', margin: '0 0 12px 0' }}>
                        Connect with other families navigating similar challenges
                      </p>
                      <a href="#" style={{ fontSize: '11.5px', color: '#3d7872', fontWeight: '600', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        Access resource &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )
        ) : (
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '60px',
            textAlign: 'center',
            boxShadow: 'var(--card-shadow)',
            color: 'var(--text-gray)'
          }}>
            <h2>{activeTab.replace('_', ' ')} Portal</h2>
            <p style={{ marginTop: '12px' }}>This section is currently under planning configuration.</p>
            <button className="btn-submit" style={{ marginTop: '24px' }} onClick={() => setActiveTab('DASHBOARD')}>
              Back to Dashboard
            </button>
          </div>
        )}
      </main>

      {/* Floating help button */}
      <button className="help-fab" title="Help Centre" onClick={() => setShowHelpModal(true)}>?</button>

      {/* Cookie consent banner */}
      {!cookieConsentDismissed && (
        <div className="cookie-banner" onClick={() => setCookieConsentDismissed(true)}>
          Manage cookies or opt out
        </div>
      )}

      {/* AI Care Plan Generator Modal */}
      {showNewPlanModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={() => setShowNewPlanModal(false)}>&times;</button>
            <h3 className="modal-title">Start a New Care Plan</h3>
            <p className="modal-subtitle">Configure the parameters for the new Bequest Care Plan</p>
            
            <form onSubmit={handleCreatePlan}>
              <div className="form-group">
                <label className="form-label">Plan Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Life Transition Care Plan"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Client Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Eleanor Vance"
                  value={newPlanClient}
                  onChange={(e) => setNewPlanClient(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Plan Description</label>
                <textarea
                  className="form-input"
                  placeholder="e.g. Focuses on caregiver respite and physical safety arrangements."
                  rows="3"
                  value={newPlanDescription}
                  onChange={(e) => setNewPlanDescription(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Initial Status</label>
                <select
                  className="form-input"
                  value={newPlanStatus}
                  onChange={(e) => setNewPlanStatus(e.target.value)}
                >
                  <option value="in-progress">In Progress</option>
                  <option value="draft">Draft</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Initial Progress ({newPlanProgress}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  className="form-input"
                  value={newPlanProgress}
                  onChange={(e) => setNewPlanProgress(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowNewPlanModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Generate Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={() => setShowHelpModal(false)}>&times;</button>
            <h3 className="modal-title">bQuest Support Center</h3>
            <p className="modal-subtitle">Need assistance with your financial advisor portal?</p>
            <div style={{ color: '#5c6f6d', fontSize: '14.5px', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p>🟢 <strong>AI Navigator support is online.</strong> You can begin a new Care Plan using our built-in intelligence generator by clicking the "Begin Now" button.</p>
              <p>✉️ Contact our primary help desk at <strong>support@bequest.com</strong> for assistance or details regarding estate setups.</p>
            </div>
            <div className="modal-actions">
              <button className="btn-submit" onClick={() => setShowHelpModal(false)}>
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Notification Toast */}
      {showNotification && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          backgroundColor: '#ffffff',
          borderLeft: '4px solid var(--primary-color)',
          boxShadow: 'var(--hover-shadow)',
          borderRadius: '8px',
          padding: '16px 20px',
          maxWidth: '320px',
          zIndex: 1000,
          animation: 'slideUp 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginBottom: '6px' }}>
            <strong style={{ fontSize: '14px', color: 'var(--text-dark)' }}>Notifications</strong>
            <button onClick={() => setShowNotification(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', fontWeight: 'bold' }}>&times;</button>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-gray)', lineHeight: '1.4' }}>
            Sarah Johnson, 2 care plans have pending client reviews.
          </p>
        </div>
      )}
    </>
  );
}

export default App;
