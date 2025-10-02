## Summary  
Admin dashboard “UserAdmin” overview screen focused on user management, statistics, and quick actions.

## Visual Breakdown  
1. **Header (top-center):**
   - Circular logo with gear icon (~64×64 px)
   - App name: “UserAdmin” (large, bold)
   - Subtitle: “Elegant User Management”
   - Descriptive tagline beneath

2. **Main Navigation Bar (horizontal, below header):**
   - Left-aligned: Dashboard icon and label (filled, indicating selection)
   - Center: Tab navigation (“Dashboard”, “Users” [active], “Analytics”, “Settings”)
   - Right-aligned: Notification (bell icon), User/profile icon (active)

3. **Statistics Overview (grid beneath nav, ~4 columns):**
   - Four cards, each with circular icon, large stat, and label:
     1. Users (icon: user, count: 2,847)
     2. Active (icon: broadcast, count: 1,234)
     3. Requests (icon: grid, count: 45.2K)
     4. Uptime (icon: check, %: 99.2)

4. **Actions Card (below stats):**
   - Left: “Actions” label (icon),  
   - Right: “Refresh” button (primary/black), “Add User” button (secondary/light)

5. **Users Card (below actions):**
   - Title/label: “Users” with icon.
   - (No visible content within, likely placeholder)

## Style Details  
- **Typography:**  
  - Large app name: bold, sans-serif, ~40px  
  - Subtitles/descriptions: lighter weight, gray text (~18px tagline, ~14-16px stats/labels)
- **Colors:**  
  - Predominantly white (#fff) backgrounds and light gray (#f8fafc) sections
  - Black for key actions, highlights, and active tab/user icons
  - Medium/dark grays for secondary text and outlines
  - Accent icons: muted blue/gray circles
- **Spacing & Layout:**  
  - ~64px top margin before logo, generous vertical padding between sections (~32-48px)
  - Horizontal spacings of ~24px between stats, nav items, and card content
  - Uniform card padding (~24px) and border-radius (~16px)
- **Shadows & Radii:**  
  - Cards: subtle drop shadow (~2-4px blur, low opacity)
  - Buttons: pill or rounded (~8px radius), clear focus/hover differentiation
- **Alignment:**  
  - Centered for header; left-aligned for nav and card content; grid-aligned statistics and cards

## Interaction & Behavior  
- Navigation bar supports tab switching (active tab is visibly highlighted)
- “Refresh” is a primary button, likely triggers data reload
- “Add User” is secondary; opens modal or navigates to form
- Stats cards may be non-interactive (no visible affordances)
- Notification/user icons are clickable for actions/menus
- Button and tab hovers increase contrast or slightly elevate
- Cards/sections likely have subtle elevation or border-highlight on hover/focus

## Accessibility Notes  
- Sufficient color contrast overall, but confirm black-on-light buttons are AA/AAA compliant
- Ensure tab order prioritizes navigation, main stats, then actions
- All icons should have `aria-label` or title for screen readers
- Buttons require visible focus states
- Tagline and stat cards need sufficient text size for readability (~16px+)
- Consider alternatives for colorblind users (icons + text labels)
- Headings should use semantic tags (`h1`, `h2`)

## Implementation Plan (React + Tailwind)  
- `<AdminHeader>` – `flex flex-col items-center py-10 bg-white`
  - Logo: `w-16 h-16 rounded-full flex items-center justify-center bg-neutral-100`
  - Title: `text-4xl font-bold`
  - Subtitle/tagline: `text-lg text-gray-500 mt-2`
- `<MainNav>` – `flex items-center justify-between px-10 py-4 bg-white border-b`
  - Nav list: `flex gap-6`
    - Active: `bg-gray-100 rounded px-4 py-2 font-semibold shadow`
  - Icons: `flex gap-3` (with `aria-label`)
- `<StatsGrid>` – `grid grid-cols-4 gap-8 py-8`
  - `<StatCard>` – `flex flex-col items-center bg-white rounded-xl shadow p-6`
    - Icon: `w-12 h-12 mb-2 rounded-full bg-gray-100 flex items-center justify-center`
    - Stat: `text-3xl font-medium`
    - Label: `text-gray-500 mt-1`
- `<ActionsCard>` – `bg-white rounded-xl shadow p-6 mt-8 flex items-center justify-between`
  - Label/icon: `flex items-center gap-2`
  - Buttons:  
    - “Refresh”: `bg-black text-white rounded px-4 py-2 hover:bg-gray-800 focus:ring`
    - “Add User”: `bg-gray-100 text-black rounded px-4 py-2 hover:bg-gray-200 focus:ring`
- `<UsersCard>` – `bg-white rounded-xl shadow p-6 mt-6`
  - Heading/icon: `flex items-center gap-2 mb-4`
- Apply utility classes for consistent spacing, focus, and contrast.  
- Ensure all buttons/interactive elements have focus and hover states.  
- Use semantic headings: `<h1>`, `<h2>` where appropriate.