// ---- API Configuration ----
const API_BASE_URL = 'http://127.0.0.1:8000';

// ---- API Service Functions ----
const api = {
  // Role endpoints
  async getRoles() {
    const response = await fetch(`${API_BASE_URL}/roles/`);
    if (!response.ok) throw new Error('Failed to fetch roles');
    return await response.json();
  },

  async createRole(roleData) {
    const response = await fetch(`${API_BASE_URL}/roles/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roleData)
    });
    if (!response.ok) throw new Error('Failed to create role');
    return await response.json();
  },

  // User endpoints
  async getUsers() {
    const response = await fetch(`${API_BASE_URL}/users/`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  },

  async createUser(userData) {
    console.log('Creating user with data:', userData);
    const response = await fetch(`${API_BASE_URL}/users/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Create user error:', errorData);
      throw new Error(JSON.stringify(errorData.detail || errorData) || 'Failed to create user');
    }
    return await response.json();
  },

  async updateUser(userId, userData) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to update user');
    }
    return await response.json();
  },

  async deleteUser(userId) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to delete user');
    }
    return true;
  }
};

// ---- Utility SVGs ----
const WaffleButtonIcon = () => (
  <img src="/waffle_button4.png" alt="Role Selector" className="w-8 h-8" />
);

const WaffleLogo = () => (
  <img src="/waffle_logo.png" alt="WaffleTech Industries Logo" className="h-12 w-auto" />
);

// ---- Role Selector Widget ----
function RoleSelector({ roles, selectedRole, onRoleChange }) {
  const handleClick = () => {
    if (roles.length === 0) return;
    
    const currentIndex = selectedRole ? roles.findIndex(r => r.role_id === selectedRole.role_id) : -1;
    const nextIndex = (currentIndex + 1) % roles.length;
    onRoleChange(roles[nextIndex]);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <div className="text-sm font-medium text-gray-700">
          {selectedRole ? selectedRole.role_name : 'Select Role'}
        </div>
        <div className="text-xs text-gray-400">
          Click to cycle
        </div>
      </div>
      <button
        onClick={handleClick}
        className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black transition-colors"
        aria-label={`Current role: ${selectedRole?.role_name || 'None'}. Click to cycle through roles.`}
        disabled={roles.length === 0}
      >
        <WaffleButtonIcon />
      </button>
    </div>
  );
}

// ---- Role-Based Content Display ----
function RoleBasedContent({ selectedRole }) {
  const getRoleContent = (role) => {
    if (!role) {
      return {
        title: "Welcome to Waffle Suite",
        description: "Select a role using the waffle button in the top right to see specific training and resources.",
        training: [],
        tasks: [],
        resources: []
      };
    }

    const roleContentMap = {
      "Software Engineer": {
        title: "Software Engineering Onboarding",
        description: "Welcome to the engineering team! Here's everything you need to get started with our development processes and coding standards.",
        training: [
          "Programming Languages & Frameworks",
          "Code Review Process Training",
          "Git Version Control & Best Practices", 
          "Software Architecture Patterns",
          "Testing & Debugging Techniques",
          "API Design & Documentation"
        ],
        tasks: [
          "Set up development environment",
          "Complete first code review",
          "Write unit tests for assigned module",
          "Deploy a feature to staging environment",
          "Participate in architecture review meeting",
          "Complete security coding guidelines training"
        ],
        resources: [
          { name: "Engineering Handbook", link: "/resources/eng-handbook.pdf" },
          { name: "Codebase Overview", link: "/resources/engineer-codebase.pdf" },
          { name: "API Documentation", link: "/docs/api" },
          { name: "Development Tools Guide", link: "/resources/dev-tools.pdf" },
          { name: "Coding Standards", link: "/resources/coding-standards.pdf" }
        ]
      },
      "HR Manager": {
        title: "Human Resources Management Onboarding", 
        description: "Welcome to the HR team! Learn about our people processes, policies, and employee management systems.",
        training: [
          "HRIS System Administration",
          "Employment Law & Compliance",
          "Recruitment & Talent Acquisition",
          "Performance Management Systems",
          "Benefits Administration",
          "Employee Relations & Conflict Resolution"
        ],
        tasks: [
          "Complete HRIS system certification",
          "Review current employee policies",
          "Conduct first employee interview",
          "Set up onboarding process for new hire",
          "Review performance evaluation procedures",
          "Update employee handbook sections"
        ],
        resources: [
          { name: "HR Policy Manual", link: "/resources/hr-policies.pdf" },
          { name: "HRIS Admin Guide", link: "/resources/hris-admin.pdf" },
          { name: "Legal Compliance Checklist", link: "/resources/legal-compliance.pdf" },
          { name: "Recruitment Templates", link: "/resources/recruitment-templates.pdf" },
          { name: "Performance Review Forms", link: "/resources/performance-forms.pdf" }
        ]
      },
      "Project Manager": {
        title: "Project Management Onboarding",
        description: "Welcome to project management! Learn our methodologies, tools, and processes for successful project delivery.",
        training: [
          "Agile & Scrum Methodologies",
          "Project Planning & Scheduling", 
          "Risk Management & Mitigation",
          "Stakeholder Communication",
          "Budget & Resource Management",
          "Quality Assurance Processes"
        ],
        tasks: [
          "Create first project plan",
          "Facilitate daily standup meeting",
          "Set up project tracking dashboard",
          "Conduct stakeholder requirements session",
          "Complete risk assessment for assigned project",
          "Review and approve project deliverables"
        ],
        resources: [
          { name: "Project Management Handbook", link: "/resources/pm-handbook.pdf" },
          { name: "Agile Best Practices", link: "/resources/agile-practices.pdf" },
          { name: "Project Templates", link: "/resources/project-templates.xlsx" },
          { name: "Risk Management Guide", link: "/resources/risk-management.pdf" },
          { name: "Stakeholder Communication Plan", link: "/resources/communication-plan.pdf" }
        ]
      },
      "Product Owner": {
        title: "Product Owner Onboarding",
        description: "Welcome to product ownership! Learn how to define product vision, manage backlogs, and deliver user value.",
        training: [
          "Product Strategy & Vision",
          "User Story Writing & Acceptance Criteria",
          "Backlog Management & Prioritization",
          "User Research & Analytics",
          "Stakeholder Management",
          "Product Roadmap Planning"
        ],
        tasks: [
          "Define product vision statement",
          "Create and prioritize product backlog",
          "Write first set of user stories",
          "Conduct user research session",
          "Review product analytics dashboard",
          "Present product roadmap to stakeholders"
        ],
        resources: [
          { name: "Product Owner Guide", link: "/resources/product-owner-guide.pdf" },
          { name: "User Story Templates", link: "/resources/user-story-templates.pdf" },
          { name: "Analytics Dashboard Guide", link: "/resources/analytics-guide.pdf" },
          { name: "Product Roadmap Template", link: "/resources/roadmap-template.xlsx" },
          { name: "User Research Methods", link: "/resources/user-research.pdf" }
        ]
      },
      "Data Analyst": {
        title: "Data Analysis Onboarding",
        description: "Welcome to data analysis! Learn our data tools, analysis methods, and reporting standards.",
        training: [
          "SQL & Database Querying",
          "Data Visualization Tools",
          "Statistical Analysis Methods",
          "Business Intelligence Platforms",
          "Data Quality & Validation",
          "Report Writing & Presentation"
        ],
        tasks: [
          "Complete first data analysis project",
          "Create dashboard for key metrics",
          "Write SQL queries for business requirements",
          "Present findings to stakeholders",
          "Validate data quality in key datasets",
          "Set up automated reporting process"
        ],
        resources: [
          { name: "Data Analysis Handbook", link: "/resources/data-analysis-guide.pdf" },
          { name: "SQL Reference Guide", link: "/resources/sql-reference.pdf" },
          { name: "Visualization Best Practices", link: "/resources/viz-best-practices.pdf" },
          { name: "BI Tools Documentation", link: "/resources/bi-tools.pdf" },
          { name: "Statistical Methods Guide", link: "/resources/statistical-methods.pdf" }
        ]
      },
      "Designer": {
        title: "🧇 Waffle Design Studio Onboarding",
        description: "Welcome to the Waffle Design team! Dive into our sweet, grid-based design philosophy and create deliciously beautiful experiences.",
        training: [
          "Waffle Grid Design Principles",
          "Golden-Brown Color Theory", 
          "Syrup Flow & User Experience",
          "Crispy Typography Standards",
          "Stack & Layer Design Systems"
        ],
        tasks: [
          "Design your first waffle-grid layout",
          "Create a syrup-smooth user journey",
          "Stack design components like perfect layers",
          "Add that golden-brown finishing touch",
          "Present your crispy-fresh design concepts"
        ],
        resources: [
          { name: "🧇 Waffle Design System Guide", link: "/resources/waffle-design-system.pdf" },
          { name: "🍯 Brand Syrup Guidelines", link: "/resources/waffle-brand-guide.pdf" },
          { name: "📐 Grid Pattern Library", link: "/resources/waffle-grids.pdf" },
          { name: "🎨 Golden Color Palette", link: "/resources/waffle-colors.pdf" }
        ]
      },
      "QA Engineer": {
        title: "Quality Assurance Engineering Onboarding",
        description: "Welcome to QA! Learn our testing methodologies, tools, and quality standards to ensure excellent software delivery.",
        training: [
          "Manual Testing Techniques",
          "Automated Testing Frameworks",
          "Bug Tracking & Reporting",
          "Test Case Design & Management",
          "Performance & Load Testing",
          "Security Testing Fundamentals"
        ],
        tasks: [
          "Execute test cases for assigned feature",
          "Set up automated test suite",
          "Report and track bugs in system",
          "Create comprehensive test plan",
          "Perform regression testing",
          "Review code for quality standards"
        ],
        resources: [
          { name: "QA Testing Handbook", link: "/resources/qa-handbook.pdf" },
          { name: "Test Automation Guide", link: "/resources/test-automation.pdf" },
          { name: "Bug Reporting Templates", link: "/resources/bug-templates.pdf" },
          { name: "Testing Tools Reference", link: "/resources/testing-tools.pdf" },
          { name: "Quality Standards Checklist", link: "/resources/quality-checklist.pdf" }
        ]
      },
      "Marketing Specialist": {
        title: "Marketing Specialist Onboarding",
        description: "Welcome to marketing! Get familiar with our brand, campaigns, marketing tools, and customer engagement strategies.",
        training: [
          "Brand Guidelines & Messaging",
          "Digital Marketing Strategies",
          "Content Creation & Management", 
          "Social Media Marketing",
          "Email Campaign Management",
          "Marketing Analytics & ROI"
        ],
        tasks: [
          "Create first marketing campaign",
          "Set up social media content calendar",
          "Analyze marketing metrics dashboard",
          "Design promotional materials",
          "Write engaging blog content",
          "Collaborate on lead generation strategy"
        ],
        resources: [
          { name: "Brand Style Guide", link: "/resources/brand-guide.pdf" },
          { name: "Marketing Playbook", link: "/resources/marketing-playbook.pdf" },
          { name: "Content Creation Templates", link: "/resources/content-templates.pdf" },
          { name: "Social Media Guidelines", link: "/resources/social-media-guide.pdf" },
          { name: "Analytics Dashboard Guide", link: "/resources/marketing-analytics.pdf" }
        ]
      },
      "Sales Representative": {
        title: "Sales Representative Onboarding",
        description: "Welcome to sales! Learn our sales process, customer relationship management, and techniques for building lasting client relationships.",
        training: [
          "Sales Process & Methodology",
          "CRM System Training",
          "Product Knowledge Deep-Dive",
          "Customer Relationship Building",
          "Negotiation Techniques",
          "Sales Analytics & Forecasting"
        ],
        tasks: [
          "Complete first customer call",
          "Set up CRM for assigned territory",
          "Prepare product demonstration",
          "Follow up on qualified leads",
          "Create sales forecast report",
          "Attend client relationship meeting"
        ],
        resources: [
          { name: "Sales Playbook", link: "/resources/sales-playbook.pdf" },
          { name: "CRM User Guide", link: "/resources/crm-guide.pdf" },
          { name: "Product Catalog", link: "/resources/product-catalog.pdf" },
          { name: "Sales Scripts & Templates", link: "/resources/sales-scripts.pdf" },
          { name: "Customer Objection Handling", link: "/resources/objection-handling.pdf" }
        ]
      },
      "Customer Support": {
        title: "Customer Support Onboarding",
        description: "Welcome to customer support! Learn our support processes, tools, and best practices for delivering exceptional customer service.",
        training: [
          "Customer Service Excellence",
          "Support Ticket System Training",
          "Product Troubleshooting",
          "Communication & De-escalation",
          "Knowledge Base Management",
          "Customer Satisfaction Metrics"
        ],
        tasks: [
          "Handle first customer support ticket",
          "Complete product knowledge assessment",
          "Set up support desk workspace",
          "Practice call handling procedures",
          "Update knowledge base articles",
          "Review customer feedback reports"
        ],
        resources: [
          { name: "Customer Support Handbook", link: "/resources/support-handbook.pdf" },
          { name: "Troubleshooting Guide", link: "/resources/troubleshooting.pdf" },
          { name: "Communication Scripts", link: "/resources/support-scripts.pdf" },
          { name: "Knowledge Base Templates", link: "/resources/kb-templates.pdf" },
          { name: "Customer Service Metrics", link: "/resources/service-metrics.pdf" }
        ]
      }
    };

    return roleContentMap[role.role_name] || {
      title: `${role.role_name} Onboarding`,
      description: `Welcome to the ${role.role_name} team! We're setting up your specific training materials.`,
      training: [
        "General Company Orientation",
        "Role-specific Training (Coming Soon)",
        "Team Introduction Session"
      ],
      tasks: [
        "Complete general onboarding checklist",
        "Meet with team members",
        "Review role-specific documentation",
        "Set up workspace and tools"
      ],
      resources: [
        { name: "Employee Handbook", link: "/resources/employee-handbook.pdf" },
        { name: "Company Overview", link: "/resources/company-overview.pdf" }
      ]
    };
  };

  const content = getRoleContent(selectedRole);
  const isDesigner = selectedRole?.role_name === "Designer";

  return (
    <div className={`space-y-6 ${isDesigner ? 'waffle-designer-theme' : ''}`} style={isDesigner ? {
      background: 'linear-gradient(45deg, #fef3c7 25%, #fbbf24 25%, #fbbf24 50%, #fef3c7 50%, #fef3c7 75%, #fbbf24 75%, #fbbf24)',
      backgroundSize: '20px 20px',
      borderRadius: '1rem',
      padding: '2rem',
      boxShadow: '0 10px 25px rgba(251, 191, 36, 0.3)'
    } : {}}>
      {/* Role Title and Description */}
      <div className="text-center">
        <h2 className={`text-3xl font-bold mb-3 ${isDesigner ? 'text-amber-900' : 'text-gray-900'}`}>{content.title}</h2>
        <p className={`text-lg max-w-3xl mx-auto ${isDesigner ? 'text-amber-800' : 'text-gray-600'}`}>{content.description}</p>
      </div>

      {/* Training, Tasks and Resources Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Training Section */}
        <div className={`${isDesigner ? 'bg-amber-100 border-2 border-amber-300' : 'bg-blue-50'} rounded-xl p-6`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 ${isDesigner ? 'bg-amber-600' : 'bg-blue-600'} rounded-lg flex items-center justify-center`}>
              {isDesigner ? (
                <span className="text-white text-xl">🧇</span>
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              )}
            </div>
            <h3 className={`text-xl font-semibold ${isDesigner ? 'text-amber-900' : 'text-gray-900'}`}>Required Training</h3>
          </div>
          <ul className="space-y-3">
            {content.training.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className={`w-2 h-2 ${isDesigner ? 'bg-amber-600' : 'bg-blue-600'} rounded-full mt-2 flex-shrink-0`}></div>
                <span className={`${isDesigner ? 'text-amber-800' : 'text-gray-700'}`}>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tasks Section */}
        <div className={`${isDesigner ? 'bg-yellow-100 border-2 border-yellow-300' : 'bg-purple-50'} rounded-xl p-6`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 ${isDesigner ? 'bg-yellow-600' : 'bg-purple-600'} rounded-lg flex items-center justify-center`}>
              {isDesigner ? (
                <span className="text-white text-xl">🍯</span>
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              )}
            </div>
            <h3 className={`text-xl font-semibold ${isDesigner ? 'text-yellow-900' : 'text-gray-900'}`}>Key Tasks</h3>
          </div>
          <ul className="space-y-3">
            {content.tasks.map((task, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className={`w-2 h-2 ${isDesigner ? 'bg-yellow-600' : 'bg-purple-600'} rounded-full mt-2 flex-shrink-0`}></div>
                <span className={`${isDesigner ? 'text-yellow-800' : 'text-gray-700'}`}>{task}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources Section */}
        <div className={`${isDesigner ? 'bg-orange-100 border-2 border-orange-300' : 'bg-green-50'} rounded-xl p-6`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 ${isDesigner ? 'bg-orange-600' : 'bg-green-600'} rounded-lg flex items-center justify-center`}>
              {isDesigner ? (
                <span className="text-white text-xl">📐</span>
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              )}
            </div>
            <h3 className={`text-xl font-semibold ${isDesigner ? 'text-orange-900' : 'text-gray-900'}`}>Resources & Documents</h3>
          </div>
          <ul className="space-y-3">
            {content.resources.map((resource, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className={`w-2 h-2 ${isDesigner ? 'bg-orange-600' : 'bg-green-600'} rounded-full mt-2 flex-shrink-0`}></div>
                <a 
                  href={resource.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`${isDesigner ? 'text-orange-800 hover:text-orange-900' : 'text-gray-700 hover:text-green-700'} hover:underline transition-colors`}
                >
                  {resource.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ---- Hamburger Role Menu ----
function RoleMenu({ roles, selectedRoleId, onSelect, open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity"
          onClick={onClose}
          aria-label="Close role selection menu"
        />
      )}
      <div
        className={`fixed top-0 left-0 z-50 w-72 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Role selection menu"
      >
        <div className="flex items-center p-4 border-b">
          <WaffleLogo />
          <span className="ml-3 text-lg font-semibold text-gray-800">
            Select Role
          </span>
          <button
            className="ml-auto p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
            onClick={onClose}
            aria-label="Close"
            tabIndex={0}
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <ul className="divide-y">
          {roles.map(role => (
            <li key={role.role_id}>
              <button
                className={`w-full text-left px-6 py-4 hover:bg-gray-50 focus:outline-none focus:bg-gray-100 ${
                  selectedRoleId === role.role_id ? "bg-gray-100 font-bold" : ""
                }`}
                onClick={() => {
                  onSelect(role);
                  onClose();
                }}
              >
                {role.role_name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

// ---- Header ----
function AppHeader({ roles, selectedRole, onRoleChange, userName }) {
  return (
    <header className="flex items-center justify-between py-6 px-4 md:px-12 bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <WaffleLogo />
        <span className="ml-2 text-xl font-bold tracking-tight text-black hidden md:inline">Waffle Suite Onboarding</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-base text-gray-700 font-medium">
            {userName ? `Welcome, ${userName}!` : "Welcome!"}
          </span>
          <span className="text-xs text-gray-400 font-light tracking-wide">
            WaffleTech Industries
          </span>
        </div>
        <RoleSelector 
          roles={roles} 
          selectedRole={selectedRole} 
          onRoleChange={onRoleChange} 
        />
      </div>
    </header>
  );
}

// ---- Main Navigation ----
function MainNav({ currentPage, onNav }) {
  const navItems = [
    { label: "Dashboard", icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
      </svg>
    ) },
    { label: "Users" },
    { label: "Analytics" },
    { label: "Settings" },
  ];
  return (
    <nav className="flex items-center justify-between px-4 md:px-12 h-16 bg-white border-b">
      <ul className="flex gap-x-1 items-center">
        {navItems.map((item) => (
          <li key={item.label}>
            <button
              className={`flex items-center px-4 py-2 rounded-lg transition-colors font-medium ${
                currentPage === item.label
                  ? "bg-black text-white focus:ring-2 focus:ring-black"
                  : "bg-gray-100 text-gray-700 hover:bg-black hover:text-white focus:ring-2 focus:ring-gray-200"
              }`}
              aria-current={currentPage === item.label ? "page" : undefined}
              onClick={() => onNav(item.label)}
            >
              {item.icon}
              {item.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <button
          aria-label="Notifications"
          className="rounded-lg p-2 bg-gray-100 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <button
          aria-label="Account"
          className="rounded-lg p-2 bg-black hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-black"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9.004 9.004 0 0012 21a9.004 9.004 0 006.879-3.196M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

// ---- Stats Widgets ----
function StatCard({ icon, value, label }) {
  return (
    <div className="flex flex-col items-center py-4 rounded-lg transition-shadow hover:shadow-md bg-white">
      <div className="rounded-full bg-gray-100 w-16 h-16 flex items-center justify-center mb-4">{icon}</div>
      <div className="text-3xl font-light text-gray-900">{value}</div>
      <div className="text-gray-400 mt-1">{label}</div>
    </div>
  );
}

function StatsOverview({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>
  );
}

// ---- Onboarding Form ----
function OnboardingForm({ roles, selectedRole, onSubmit, formState, setFormState, errors, resources, loading, editingUser }) {
  // Fields always present
  const baseFields = [
    { name: "first_name", label: "First Name", type: "text", required: true },
    { name: "last_name", label: "Last Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "hire_date", label: "Hire Date", type: "date", required: true },
    { name: "bio", label: "Short Bio", type: "textarea", required: false },
  ];

  // Per-role dynamic fields
  const roleFields = {
    // Example: add more fields per business logic
    // Engineer: [{ name: "github", label: "GitHub Username", type: "text" }],
    // HR: [{ name: "employee_files", label: "Upload Employee Docs", type: "file" }],
  };

  const dynamicFields = selectedRole ? (roleFields[selectedRole.role_name] || []) : [];

  return (
    <form
      className="space-y-5"
      autoComplete="off"
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Onboarding New User</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {baseFields.map((f) => (
          <div key={f.name} className="flex flex-col">
            <label htmlFor={f.name} className="text-sm font-medium text-gray-700 mb-1">
              {f.label} {f.required && <span className="text-red-500">*</span>}
            </label>
            {f.type === "textarea" ? (
              <textarea
                id={f.name}
                name={f.name}
                className={`rounded border p-2 text-gray-800 focus:ring-2 focus:ring-black ${errors[f.name] ? "border-red-400" : "border-gray-300"}`}
                value={formState[f.name] || ""}
                onChange={e => setFormState(fs => ({ ...fs, [f.name]: e.target.value }))}
                rows={3}
              />
            ) : (
              <input
                id={f.name}
                name={f.name}
                type={f.type}
                className={`rounded border p-2 text-gray-800 focus:ring-2 focus:ring-black ${errors[f.name] ? "border-red-400" : "border-gray-300"}`}
                value={formState[f.name] || ""}
                onChange={e => setFormState(fs => ({ ...fs, [f.name]: e.target.value }))}
                required={f.required}
                autoComplete="off"
              />
            )}
            {errors[f.name] && <span className="text-xs text-red-500 mt-1">{errors[f.name]}</span>}
          </div>
        ))}
        {dynamicFields.map((f) => (
          <div key={f.name} className="flex flex-col">
            <label htmlFor={f.name} className="text-sm font-medium text-gray-700 mb-1">
              {f.label}
            </label>
            <input
              id={f.name}
              name={f.name}
              type={f.type}
              className="rounded border border-gray-300 p-2 text-gray-800 focus:ring-2 focus:ring-black"
              value={formState[f.name] || ""}
              onChange={e => setFormState(fs => ({ ...fs, [f.name]: e.target.value }))}
            />
          </div>
        ))}
        <div className="flex flex-col">
          <label htmlFor="role_id" className="text-sm font-medium text-gray-700 mb-1">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            id="role_id"
            name="role_id"
            className={`rounded border p-2 text-gray-800 focus:ring-2 focus:ring-black ${errors.role_id ? "border-red-400" : "border-gray-300"}`}
            value={formState.role_id || ""}
            onChange={e => setFormState(fs => ({ ...fs, role_id: e.target.value }))}
            required
          >
            <option value="">Select a role</option>
            {roles.map((r) => (
              <option key={r.role_id} value={r.role_id}>{r.role_name}</option>
            ))}
          </select>
          {errors.role_id && <span className="text-xs text-red-500 mt-1">{errors.role_id}</span>}
        </div>
      </div>
      {resources && resources.length > 0 && (
        <div className="rounded bg-blue-50 p-3 text-blue-700 text-sm flex flex-col gap-1 animate-fade-in">
          <span className="font-semibold">Training Resources for <span className="capitalize">{selectedRole?.role_name}</span>:</span>
          <ul className="list-disc list-inside">
            {resources.map((res, idx) => (
              <li key={idx}><a href={res.link} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">{res.name}</a></li>
            ))}
          </ul>
        </div>
      )}
      <button
        className="w-full md:w-auto bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-black"
        type="submit"
        disabled={loading.creating || loading.updating}
      >
        {loading.creating ? 'Creating User...' : 
         loading.updating ? 'Updating User...' : 
         editingUser ? 'Update User' : 'Add User'}
      </button>
    </form>
  );
}

// ---- Users Table ----
function UsersTable({ users, roles, onEdit, onDelete, loading }) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Role</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Hire Date</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Bio</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y">
          {loading.users ? (
            <tr>
              <td colSpan={6} className="px-4 py-4 text-center text-gray-400 italic">Loading users...</td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-4 text-center text-gray-400 italic">No users to display.</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.user_id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">{user.first_name} {user.last_name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{roles.find(r => r.role_id === user.role_id)?.role_name || "—"}</td>
                <td className="px-4 py-3">{user.hire_date}</td>
                <td className="px-4 py-3">{user.bio || "—"}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    className="px-2 py-1 rounded hover:bg-blue-100 text-blue-600 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => onEdit(user)}
                    disabled={loading.deleting}
                    aria-label="Edit user"
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 rounded hover:bg-red-100 text-red-600 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => onDelete(user)}
                    disabled={loading.deleting}
                    aria-label="Delete user"
                  >
                    {loading.deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ---- Footer ----
function AppFooter() {
  return (
    <footer className="bg-gray-50 mt-12 border-t py-6 px-4 md:px-12 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
      <div className="flex gap-4 mb-2 md:mb-0">
        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-black transition">Privacy Policy</a>
        <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-black transition">Terms of Service</a>
        <a href="/contact" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-black transition">Contact</a>
      </div>
      <div className="text-xs text-gray-400">&copy; {new Date().getFullYear()} WaffleTech Industries. All rights reserved.</div>
    </footer>
  );
}

// ---- Dashboard Stats Data ----
const dashboardStats = [
  {
    icon: (
      <svg className="w-7 h-7 mx-auto text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 21a7.5 7.5 0 0115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75V21z" />
      </svg>
    ),
    value: "2,847",
    label: "Users",
  },
  {
    icon: (
      <svg className="w-7 h-7 mx-auto text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    value: "1,234",
    label: "Active",
  },
  {
    icon: (
      <svg className="w-7 h-7 mx-auto text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h8M8 15h8M10 7h4" />
      </svg>
    ),
    value: "45.2K",
    label: "Requests",
  },
  {
    icon: (
      <svg className="w-7 h-7 mx-auto text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 12l1.75 1.75 3.5-3.5" />
      </svg>
    ),
    value: "99.2%",
    label: "Uptime",
  },
];

// ---- Main App ----
function WaffleOnboardingDashboard() {
  const { useState, useEffect } = React;
  
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [formState, setFormState] = useState({});
  const [errors, setErrors] = useState({});
  const [resources, setResources] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  
  // Loading and error states
  const [loading, setLoading] = useState({
    roles: false,
    users: false,
    creating: false,
    updating: false,
    deleting: false
  });
  const [apiError, setApiError] = useState('');

  // ---- API Calls ----
  useEffect(() => {
    loadRoles();
    loadUsers();
  }, []);

  async function loadRoles() {
    setLoading(prev => ({ ...prev, roles: true }));
    setApiError('');
    try {
      const rolesData = await api.getRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error('Failed to load roles:', error);
      setApiError('Failed to load roles. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, roles: false }));
    }
  }

  async function loadUsers() {
    setLoading(prev => ({ ...prev, users: true }));
    setApiError('');
    try {
      const usersData = await api.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load users:', error);
      setApiError('Failed to load users. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  }

  // ---- Role change: onboarding form fields and resources ----
  useEffect(() => {
    if (!formState.role_id) {
      setSelectedRole(null);
      setResources([]);
      return;
    }
    const role = roles.find(r => String(r.role_id) === String(formState.role_id));
    setSelectedRole(role);
    // Fetch resources for role (simulate)
    setTimeout(() => {
      if (role?.role_name === "Engineer") setResources([
        { name: "Codebase Overview", link: "/resources/engineer-codebase.pdf" },
        { name: "Engineering Handbook", link: "/resources/eng-handbook.pdf" }
      ]);
      else if (role?.role_name === "HR") setResources([
        { name: "HR Onboarding Checklist", link: "/resources/hr-checklist.pdf" }
      ]);
      else setResources([]);
    }, 200);
  }, [formState.role_id, roles]);

  // ---- Handle role selection from waffle button ----
  function handleRoleChange(role) {
    setSelectedRole(role);
    setFormState(fs => ({ ...fs, role_id: role.role_id }));
  }

  // ---- Add/Edit User ----
  function validateForm() {
    const errs = {};
    if (!formState.first_name || formState.first_name.length < 2) errs.first_name = "First name required (min 2 characters).";
    if (!formState.last_name || formState.last_name.length < 2) errs.last_name = "Last name required (min 2 characters).";
    if (!formState.email || formState.email.length < 6) errs.email = "Email required (min 6 characters).";
    else if (!formState.email.includes("@")) errs.email = "Invalid email format.";
    if (!formState.hire_date) errs.hire_date = "Hire date required.";
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(formState.hire_date)) errs.hire_date = "Hire date must be in YYYY-MM-DD format.";
    if (!formState.role_id) errs.role_id = "Role required.";
    if (formState.bio && formState.bio.length > 500) errs.bio = "Bio must be 500 characters or less.";
    return errs;
  }

  async function handleFormSubmit() {
    console.log('Form state before validation:', formState);
    const errs = validateForm();
    setErrors(errs);
    setApiError('');
    
    if (Object.keys(errs).length === 0) {
      try {
        if (editingUser) {
          // Update existing user
          setLoading(prev => ({ ...prev, updating: true }));
          const updatedUser = await api.updateUser(editingUser.user_id, formState);
          setUsers(users => users.map(u => 
            u.user_id === editingUser.user_id ? updatedUser : u
          ));
        } else {
          // Create new user
          setLoading(prev => ({ ...prev, creating: true }));
          
          // Prepare user data with proper types
          const userData = {
            first_name: formState.first_name.trim(),
            last_name: formState.last_name.trim(),
            email: formState.email.trim().toLowerCase(),
            hire_date: formState.hire_date,
            role_id: parseInt(formState.role_id, 10),
            bio: formState.bio ? formState.bio.trim() : null
          };
          
          console.log('Submitting user data:', userData);
          const newUser = await api.createUser(userData);
          setUsers(users => [...users, newUser]);
        }
        
        // Reset form
        setEditingUser(null);
        setFormState({});
        setErrors({});
        
      } catch (error) {
        console.error('Failed to save user:', error);
        setApiError(error.message || 'Failed to save user. Please try again.');
      } finally {
        setLoading(prev => ({ ...prev, creating: false, updating: false }));
      }
    }
  }

  function handleEditUser(user) {
    setEditingUser(user);
    setFormState({ ...user });
    setErrors({});
    setApiError('');
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDeleteUser(user) {
    if (window.confirm(`Delete ${user.first_name} ${user.last_name}?`)) {
      setLoading(prev => ({ ...prev, deleting: true }));
      setApiError('');
      
      try {
        await api.deleteUser(user.user_id);
        setUsers(users => users.filter(u => u.user_id !== user.user_id));
        
        if (editingUser && editingUser.user_id === user.user_id) {
          setEditingUser(null);
          setFormState({});
        }
      } catch (error) {
        console.error('Failed to delete user:', error);
        setApiError(error.message || 'Failed to delete user. Please try again.');
      } finally {
        setLoading(prev => ({ ...prev, deleting: false }));
      }
    }
  }

  // ---- Welcome message (personalized) ----
  const welcomeName = users.length ? users[users.length - 1].first_name : "";

  // ---- Responsive layout/animation classes ----
  // Tailwind's group-hover and animate-fade-in used in relevant places

  return (
    <div 
      className="min-h-screen flex flex-col font-sans bg-gray-50"
      style={{
        backgroundImage: `
          linear-gradient(45deg, rgba(251, 191, 36, 0.03) 25%, transparent 25%, transparent 50%, rgba(251, 191, 36, 0.03) 50%, rgba(251, 191, 36, 0.03) 75%, transparent 75%, transparent),
          linear-gradient(-45deg, rgba(245, 158, 11, 0.02) 25%, transparent 25%, transparent 50%, rgba(245, 158, 11, 0.02) 50%, rgba(245, 158, 11, 0.02) 75%, transparent 75%, transparent)
        `,
        backgroundSize: '40px 40px, 40px 40px',
        backgroundPosition: '0 0, 20px 20px'
      }}
    >
      {/* Header */}
      <AppHeader 
        roles={roles} 
        selectedRole={selectedRole} 
        onRoleChange={handleRoleChange} 
        userName={welcomeName} 
      />
      {/* Main Navigation */}
      <MainNav currentPage={currentPage} onNav={setCurrentPage} />
      
      {/* Error Display */}
      {apiError && (
        <div className="mx-2 md:mx-12 mb-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 text-sm">{apiError}</p>
            <button 
              className="ml-auto text-red-400 hover:text-red-600"
              onClick={() => setApiError('')}
              aria-label="Close error"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-1 px-2 md:px-12 py-6 transition-colors duration-200">
        {/* Role-Based Content Section */}
        <section className="max-w-6xl mx-auto mb-8">
          <RoleBasedContent selectedRole={selectedRole} />
        </section>
        {/* Dashboard Stats */}
        <StatsOverview stats={dashboardStats} />
        {/* Main Widgets */}
        <div className="grid grid-cols-1 gap-8 mt-10">
          {/* Onboarding Form Widget */}
          <section className="rounded-xl bg-white shadow-md p-6 transition hover:shadow-lg animate-fade-in">
            <OnboardingForm
              roles={roles}
              selectedRole={selectedRole}
              onSubmit={handleFormSubmit}
              formState={formState}
              setFormState={setFormState}
              errors={errors}
              resources={resources}
              loading={loading}
              editingUser={editingUser}
            />
          </section>
          {/* Users Table Widget */}
          <section className="rounded-xl bg-white shadow-md p-6 transition hover:shadow-lg animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a4 4 0 018 0M3 7v10a4 4 0 008 0V7m-8 0h16" />
              </svg>
              <span className="text-gray-700 font-medium">Users</span>
              <span className="text-gray-400 ml-2 text-sm">{users.length} total</span>
            </div>
            <UsersTable users={users} roles={roles} onEdit={handleEditUser} onDelete={handleDeleteUser} loading={loading} />
          </section>
        </div>
      </main>
      {/* Footer */}
      <AppFooter />
    </div>
  );
}

// Render the component to the DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<WaffleOnboardingDashboard />);