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
    const newPlan = {
      id: carePlans.length + 1,
      name: chatTimeline === 'Crisis / Urgent' ? 'Urgent Response Care Plan' : 'Home Transition Care Plan',
      client: chatRelation === 'For Myself' ? 'for Myself' : 'for Mom (Eleanor)',
      description: chatSituation || "Comprehensive plan focusing on custom care directive structures, provider coordination and support services.",
      progress: 25,
      status: 'in-progress',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };

    setCarePlans([newPlan, ...carePlans]);
    setActiveTab('DASHBOARD');
    
    // Reset chatbot navigator states
    setNavigatorScreen('STORY');
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

  React.useEffect(() => {
    if (activeTab !== 'NAVIGATOR' || navigatorScreen !== 'JOURNEY') return;

    const getAbsoluteOffsetTop = (el) => {
      if (!el) return 0;
      return el.getBoundingClientRect().top + window.scrollY;
    };

    const handleScroll = () => {
      const journeyEl = document.getElementById('section-journey');
      const sharedEl = document.getElementById('section-shared');
      const stageEl = document.getElementById('section-stage');
      const nextEl = document.getElementById('section-next-steps');
      
      const pPlanEl = document.getElementById('section-pillar-plan');
      const pTeamEl = document.getElementById('section-pillar-team');
      const pBenefitsEl = document.getElementById('section-pillar-benefits');
      const pCostsEl = document.getElementById('section-pillar-costs');

      if (!sharedEl || !stageEl || !nextEl) return;

      const scrollPos = window.scrollY + 250; // offset adjustment for better trigger matching

      const nextTop = getAbsoluteOffsetTop(nextEl);
      const pCostsTop = getAbsoluteOffsetTop(pCostsEl);
      const pBenefitsTop = getAbsoluteOffsetTop(pBenefitsEl);
      const pTeamTop = getAbsoluteOffsetTop(pTeamEl);
      const pPlanTop = getAbsoluteOffsetTop(pPlanEl);
      const stageTop = getAbsoluteOffsetTop(stageEl);
      const sharedTop = getAbsoluteOffsetTop(sharedEl);

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
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab, navigatorScreen]);

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(`section-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                width: navigatorScreen === 'JOURNEY' ? '20%' : '0%',
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

              if (navigatorScreen === 'JOURNEY') {
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

              return (
                <div key={step.num} className={`step-item ${isActive ? 'active' : ''}`}>
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
                <div className="navigator-logo-row">
                  <svg className="navigator-logo-sparkle" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                  </svg>
                  <h1 className="navigator-title">bQuest Navigator</h1>
                </div>
                <p className="navigator-subtitle">AI-powered care planning assistant</p>
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
          ) : (
            /* Redesigned Your Journey Screen */
            <div style={{ width: '100%' }}>

              <div className="journey-layout" style={{ marginTop: '16px' }}>
                {/* Left Column Sidebar (Floating Essential Resources) */}
                <div className="journey-left-sidebar">
                  {/* Scrollspy Sidebar Indicator Menu */}
                  <div className="scrollspy-card">
                    <span className="scrollspy-title" style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px', display: 'block', textTransform: 'none', letterSpacing: 'normal' }}>Planning Sections</span>
                    <ul className="scrollspy-list" style={{ marginBottom: '16px' }}>
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
                        
                        {/* Dynamic Collapsible Sub-list for 4 sub-stages */}
                        {(activeSection === 'stage' || activeSection.startsWith('pillar-')) && (
                          <ul className="scrollspy-sub-list" style={{ animation: 'fadeIn 0.3s ease' }}>
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
                        )}
                      </li>
                    </ul>
                    
                    <button 
                      className={`sidebar-meet-btn ${activeSection === 'next-steps' ? 'filled' : 'outline'}`}
                      onClick={() => scrollToSection('next-steps')}
                    >
                      Meet Your Team
                    </button>
                  </div>

                  <div className="journey-right-card">
                    <h2 className="resources-title">Essential Resources</h2>
                    <p className="resources-subtitle">
                      Start here for expert guidance and support on your care journey.
                    </p>
                    
                    <div className="resources-list">
                      <a href="https://www.alz.org" target="_blank" rel="noopener noreferrer" className="resource-item-card">
                        <div className="resource-header-row">
                          <span className="resource-name">Alzheimer's Association</span>
                          <svg className="resource-link-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                          </svg>
                        </div>
                        <p className="resource-desc">24/7 helpline and local support groups</p>
                        <span className="resource-domain">alz.org</span>
                      </a>

                      <a href="https://www.caregiver.org" target="_blank" rel="noopener noreferrer" className="resource-item-card">
                        <div className="resource-header-row">
                          <span className="resource-name">Family Caregiver Alliance</span>
                          <svg className="resource-link-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                          </svg>
                        </div>
                        <p className="resource-desc">Education and state-by-state resources</p>
                        <span className="resource-domain">caregiver.org</span>
                      </a>

                      <a href="https://www.medicare.gov" target="_blank" rel="noopener noreferrer" className="resource-item-card">
                        <div className="resource-header-row">
                          <span className="resource-name">Medicare</span>
                          <svg className="resource-link-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                          </svg>
                        </div>
                        <p className="resource-desc">Coverage for care services</p>
                        <span className="resource-domain">medicare.gov</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right Column (Scrollable details content) */}
                <div className="journey-scrollable-content">
                  
                  {/* We Understand Your Journey Section */}
                  <div className="shared-summary-card" id="section-journey">
                    <div style={{ marginBottom: '0' }}>
                      <span style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--primary-color)', letterSpacing: '1px' }}>Your Care Planning Journey</span>
                      <h1 className="journey-hero-title" style={{ fontSize: '20px', textAlign: 'left', marginTop: '6px', marginBottom: '10px', fontWeight: '600' }}>We Understand Your Journey</h1>
                      <p className="journey-hero-subtitle" style={{ textAlign: 'left', margin: '0 0 16px 0', fontSize: '13.5px', color: 'var(--text-gray)', maxWidth: '100%' }}>
                        Thank you for sharing your story with us. We know this is a challenging time, and we're honored to walk alongside you as you plan for {chatRelation ? chatRelation.toLowerCase() : "your mother"}'s care.
                      </p>
                      <button className="journey-download-btn" style={{ padding: '10px 24px', fontSize: '13.5px' }} onClick={() => {
                        const element = document.createElement("a");
                        const file = new Blob([
                          `BQUEST CARE PLANNING PORTAL SUMMARY\n`,
                          `===================================\n\n`,
                          `You are planning care for your mother who is showing early signs of memory loss.\n`,
                          `Location Zip Code: ${chatZip || '80202'}\n`,
                          `Planning Timeline: ${chatTimeline || 'Planning ahead'}\n`,
                          `Family Situation Note:\n"${chatSituation || "Planning early signs of memory loss care options."}"\n\n`,
                          `Thank you for using bQuest Financial Advisor Portal.\n`
                        ], { type: 'text/plain' });
                        element.href = URL.createObjectURL(file);
                        element.download = "bQuest_Care_Planning_Summary.txt";
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Download Care Summary
                      </button>
                    </div>
                  </div>

                  {/* What You've Shared Summary Section */}
                  <div className="shared-summary-card" id="section-shared">
                    <h2 className="shared-summary-title">What You've Shared</h2>
                    <p className="shared-summary-para">
                      You're planning care <strong>{chatRelation ? chatRelation.toLowerCase() : 'for a family member'}</strong> — your mother, who is showing early signs of memory loss.
                      The fact that you're <strong>{chatTimeline ? chatTimeline.toLowerCase() : 'planning ahead'}</strong> rather than responding to a crisis is a profound gift. It means you have the precious opportunity to make thoughtful decisions, to explore options without urgency clouding your judgment, and to build a support system before the road becomes more difficult.
                    </p>
                    
                    {/* Exact chatbot response situation note quote callout */}
                    <div className="shared-quote-box">
                      "{chatSituation || "My mother is showing early signs of memory loss and I want to plan ahead for her care needs."}"
                    </div>
                    
                    <p className="shared-summary-para">
                      You're seeking support in the <strong>{chatZip || '80202'}</strong> area. These details help us connect you with the right resources and providers who can meet your mother where she is, with the care and compassion she deserves.
                    </p>
                  </div>

                  {/* Understand Your Care Stage Educational Section */}
                  <div className="care-stage-hub" id="section-stage">
                    <h2 className="care-stage-title">Understand Your Care Stage</h2>
                    <span className="care-stage-subtitle">Explore key areas of your care planning journey.</span>
                    
                    <p className="care-stage-philosophy">
                      Aging at home doesn't happen by accident—it happens with a plan.
                    </p>
                    <p className="care-stage-detail">
                      The earlier you think through key decisions, the more control you have over how and where care happens. Below are the core areas to consider when planning to age in place. You don't need to solve everything at once—but understanding what to think about (and when) can help you avoid stress, rushed decisions, and unnecessary costs later.
                    </p>

                    {/* Vertically stacked scrollable cards */}
                    <div className="pillars-vertical-list">
                      <div className={`pillar-card ${activeSection === 'pillar-plan' ? 'active' : ''}`} id="section-pillar-plan">
                        <h3 className="pillar-card-title">Start with a Plan & Put Protections in Place</h3>
                        <p className="pillar-card-desc">
                          Before anything else, step back and look at the full picture.
                        </p>
                      </div>

                      <div className={`pillar-card ${activeSection === 'pillar-team' ? 'active' : ''}`} id="section-pillar-team">
                        <h3 className="pillar-card-title">Build Your Care Team</h3>
                        <p className="pillar-card-desc">
                          Once you have a plan, the next step is putting the right care in place.
                        </p>
                      </div>

                      <div className={`pillar-card ${activeSection === 'pillar-benefits' ? 'active' : ''}`} id="section-pillar-benefits">
                        <h3 className="pillar-card-title">Understand Coverage & Benefits</h3>
                        <p className="pillar-card-desc">
                          Care is only part of the equation—how you pay for it matters just as much.
                        </p>
                      </div>

                      <div className={`pillar-card ${activeSection === 'pillar-costs' ? 'active' : ''}`} id="section-pillar-costs">
                        <h3 className="pillar-card-title">Understand Costs & Get Financially Organized</h3>
                        <p className="pillar-card-desc">
                          Planning to stay at home also means planning how to sustain it financially.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Call-to-action banner panel */}
                  <div className="journey-cta-panel" id="section-next-steps">
                    <p className="journey-cta-text">
                      You're not walking this path alone. We're here to help you find the right people — specialists, caregivers, coordinators, and fellow travelers who understand this journey. Together, we'll build a network of support that honors your mother's dignity and your own wellbeing.
                    </p>
                    <span className="journey-cta-subtitle">Let's take the next step together.</span>
                    
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <button className={`meet-team-btn ${activeSection === 'next-steps' ? 'filled' : 'outline'}`} onClick={handleCompleteJourney}>
                        Meet Your Care Team
                      </button>
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
