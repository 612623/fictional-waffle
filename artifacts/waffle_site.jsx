// ---- Utility SVGs ----
const WaffleButtonIcon = () => (
  <img src="/waffle_button4.png" alt="Open Role Menu" className="w-8 h-8" />
);

const WaffleLogo = () => (
  <img src="/waffle_logo.png" alt="WaffleTech Industries Logo" className="h-12 w-auto" />
);

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
function AppHeader({ onHamburger, userName }) {
  return (
    <header className="flex items-center justify-between py-6 px-4 md:px-12 bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <button
          aria-label="Open role menu"
          className="md:hidden rounded-lg p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
          onClick={onHamburger}
        >
          <WaffleButtonIcon />
        </button>
        <WaffleLogo />
        <span className="ml-2 text-xl font-bold tracking-tight text-black hidden md:inline">Waffle Suite Onboarding</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-base text-gray-700 font-medium">
          {userName ? `Welcome, ${userName}!` : "Welcome!"}
        </span>
        <span className="text-xs text-gray-400 font-light tracking-wide">
          WaffleTech Industries
        </span>
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
function OnboardingForm({ roles, selectedRole, onSubmit, formState, setFormState, errors, resources }) {
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
        className="w-full md:w-auto bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-black"
        type="submit"
      >
        Add User
      </button>
    </form>
  );
}

// ---- Users Table ----
function UsersTable({ users, roles, onEdit, onDelete }) {
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
          {users.length === 0 ? (
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
                <td className="px-4 py-3">{user.bio}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    className="px-2 py-1 rounded hover:bg-blue-100 text-blue-600 font-semibold transition"
                    onClick={() => onEdit(user)}
                    aria-label="Edit user"
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 rounded hover:bg-red-100 text-red-600 font-semibold transition"
                    onClick={() => onDelete(user)}
                    aria-label="Delete user"
                  >
                    Delete
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
export default function WaffleOnboardingDashboard() {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [formState, setFormState] = useState({});
  const [errors, setErrors] = useState({});
  const [resources, setResources] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  // ---- Simulated API Calls ----
  useEffect(() => {
    // Fetch roles
    setTimeout(() => {
      setRoles([
        { role_id: 1, role_name: "Engineer" },
        { role_id: 2, role_name: "HR" },
        { role_id: 3, role_name: "Manager" },
        { role_id: 4, role_name: "Marketing" },
      ]);
    }, 300);
    // Fetch users
    setTimeout(() => {
      setUsers([
        {
          user_id: 1,
          first_name: "Emily",
          last_name: "Johnson",
          email: "emily.johnson@waffletech.com",
          hire_date: "2024-03-12",
          role_id: 1,
          bio: "Excited to join the engineering team!",
        },
        {
          user_id: 2,
          first_name: "Michael",
          last_name: "Smith",
          email: "michael.smith@waffletech.com",
          hire_date: "2024-03-01",
          role_id: 2,
          bio: "Passionate about people ops.",
        }
      ]);
    }, 300);
  }, []);

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

  // ---- Hamburger selects a role for onboarding form ----
  function handleRoleMenuSelect(role) {
    setFormState(fs => ({ ...fs, role_id: role.role_id }));
    setSelectedRole(role);
  }

  // ---- Add/Edit User ----
  function validateForm() {
    const errs = {};
    if (!formState.first_name) errs.first_name = "First name required.";
    if (!formState.last_name) errs.last_name = "Last name required.";
    if (!formState.email) errs.email = "Email required.";
    else if (!formState.email.includes("@")) errs.email = "Invalid email.";
    if (!formState.hire_date) errs.hire_date = "Hire date required.";
    if (!formState.role_id) errs.role_id = "Role required.";
    return errs;
  }
  function handleFormSubmit() {
    const errs = validateForm();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      if (editingUser) {
        setUsers(users =>
          users.map(u => (u.user_id === editingUser.user_id ? { ...editingUser, ...formState } : u))
        );
      } else {
        setUsers(users => [
          ...users,
          {
            user_id: users.length ? Math.max(...users.map(u => u.user_id)) + 1 : 1,
            ...formState,
          },
        ]);
      }
      setEditingUser(null);
      setFormState({});
      setErrors({});
    }
  }
  function handleEditUser(user) {
    setEditingUser(user);
    setFormState({ ...user });
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function handleDeleteUser(user) {
    if (window.confirm(`Delete ${user.first_name} ${user.last_name}?`)) {
      setUsers(users => users.filter(u => u.user_id !== user.user_id));
      if (editingUser && editingUser.user_id === user.user_id) {
        setEditingUser(null);
        setFormState({});
      }
    }
  }

  // ---- Welcome message (personalized) ----
  const welcomeName = users.length ? users[users.length - 1].first_name : "";

  // ---- Responsive layout/animation classes ----
  // Tailwind's group-hover and animate-fade-in used in relevant places

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      {/* Role menu (hamburger) */}
      <RoleMenu
        roles={roles}
        selectedRoleId={formState.role_id}
        onSelect={handleRoleMenuSelect}
        open={roleMenuOpen}
        onClose={() => setRoleMenuOpen(false)}
      />
      {/* Header */}
      <AppHeader onHamburger={() => setRoleMenuOpen(true)} userName={welcomeName} />
      {/* Main Navigation */}
      <MainNav currentPage={currentPage} onNav={setCurrentPage} />
      {/* Main Content */}
      <main className="flex-1 px-2 md:px-12 py-6 transition-colors duration-200">
        {/* Welcome Section */}
        <section className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
            Welcome to Waffle Suite!
          </h2>
          <p className="text-lg text-gray-500 mb-2">
            Clean, efficient, and powerful onboarding for every role.<br />
            <span className="text-black font-semibold">
              {welcomeName ? `Let's get started, ${welcomeName}!` : "Let's get started!"}
            </span>
          </p>
          <p className="text-gray-400">
            Manage your team with clarity and ease. Select a role from the <span className="inline-flex items-center"><WaffleButtonIcon /><span className="ml-1">menu</span></span> to tailor the onboarding experience.
          </p>
        </section>
        {/* Dashboard Stats */}
        <StatsOverview stats={dashboardStats} />
        {/* Main Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
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
            <UsersTable users={users} roles={roles} onEdit={handleEditUser} onDelete={handleDeleteUser} />
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
root.render(<UserManagementApp />);