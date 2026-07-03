# Vacation System — Final Submission Checklist

Go through every item below before submitting.
Mark each one ✅ when done, or ❌ if something is broken.

---

## 1. Pages & Features

### Register page (`/register`)
- [ ] First name field — required, shows error under input
- [ ] Last name field — required, shows error under input
- [ ] Email field — required, valid format, shows error under input
- [ ] Password field — required, min 4 chars, shows error under input
- [ ] Submitting with empty fields shows all errors at once
- [ ] 409 "email taken" response → error shown under email field only
- [ ] Other server errors → banner above submit button
- [ ] Success → navigates to `/vacations`
- [ ] Link to Login page at the bottom
- [ ] Labels are visible above each input (accessibility)

### Login page (`/login`)
- [ ] Email field — required, valid format
- [ ] Password field — required
- [ ] Wrong credentials → error message shown
- [ ] Success → navigates to `/vacations`
- [ ] Link to Register page at the bottom
- [ ] Labels are visible above each input (accessibility)

### About page (`/about`)
- [ ] Page is publicly accessible (no login required)
- [ ] Shows developer name and college
- [ ] Lists tech stack badges
- [ ] Lists feature cards
- [ ] Responsive layout on mobile

### Vacations page (`/vacations`) — logged-in users only
- [ ] Shows vacation cards in a grid
- [ ] Filter buttons: All / Liked / Active / Upcoming
- [ ] Switching filter goes back to page 1
- [ ] Total count shown (e.g. "12 vacations found")
- [ ] Empty state message per filter (e.g. "You haven't liked any vacations yet")
- [ ] Pagination shows when more than 1 page
- [ ] Like button on each card — toggles like/unlike
- [ ] Like button disabled while API call is running (no double-click)
- [ ] Admin users do NOT see Edit/Delete on this page (browse only)
- [ ] Loading spinner shown while fetching
- [ ] Error message shown if fetch fails

### Admin Vacations page (`/admin`) — admin only
- [ ] Shows all vacation cards
- [ ] Each card has Edit and Delete buttons
- [ ] Delete: clicking Delete shows inline "Delete? Yes / No" confirmation
- [ ] Delete: "Yes" calls the API and refreshes the list
- [ ] Delete: "No" cancels and returns to normal
- [ ] Delete: button is disabled and shows loading while API call runs
- [ ] Edit button → navigates to `/edit-vacation/:id`
- [ ] "+ Add Vacation" button → navigates to `/add-vacation`
- [ ] Total count shown
- [ ] Filter bar works
- [ ] Loading spinner while fetching
- [ ] Error message if fetch fails

### Add Vacation page (`/add-vacation`) — admin only
- [ ] Destination — required, error shown under input
- [ ] Description — required, error shown under input
- [ ] Start Date — required, cannot be in the past
- [ ] End Date — required, cannot be before start date
- [ ] Price — required, must be 0–10,000
- [ ] Image — required, error shown if not selected
- [ ] Live image preview appears after file is selected
- [ ] All errors shown at once on submit (not one at a time)
- [ ] Errors clear as user edits that field
- [ ] Submits as `multipart/form-data`
- [ ] Success → navigates to `/admin`
- [ ] Cancel button → navigates to `/admin`
- [ ] Loading state on submit button

### Edit Vacation page (`/edit-vacation/:id`) — admin only
- [ ] Form pre-fills with existing vacation data
- [ ] If opened directly by URL (not nav state), fetches from API
- [ ] Destination — required
- [ ] Description — required
- [ ] Start Date — required, PAST DATES ALLOWED
- [ ] End Date — required, cannot be before start date
- [ ] Price — required, 0–10,000
- [ ] Current image is shown as a thumbnail
- [ ] New image upload is optional (leave blank = keep current)
- [ ] If new image selected → preview shown
- [ ] Submits as `multipart/form-data`
- [ ] Success → navigates to `/admin`
- [ ] Cancel button → navigates to `/admin`
- [ ] Loading state on submit button

### Reports page (`/reports`) — admin only
- [ ] Summary cards: total vacations, total likes, most popular destination
- [ ] Horizontal bar chart with one bar per destination
- [ ] Bars sorted from most liked to least liked
- [ ] Bars animate from 0 to target width on page load
- [ ] Bar label (destination name) truncated if too long
- [ ] Like count shown inside each bar
- [ ] "Download CSV" button → triggers file download
- [ ] CSV button shows "Downloading…" while in progress
- [ ] CSV download error shown in UI (no `alert()`)
- [ ] Empty state when no likes exist
- [ ] Loading spinner while fetching

### AI Recommendations page (`/ai`) — logged-in users only
- [ ] Input field for destination
- [ ] "Ask AI" button submits the request
- [ ] Empty input → field error shown under the input
- [ ] Animated loading dots while waiting for response
- [ ] Result card shows destination name as heading + recommendation text
- [ ] "New search" button clears result and resets form
- [ ] Server error shown if AI request fails

### MCP Database Query page (`/mcp`) — logged-in users only
- [ ] Textarea for entering a question
- [ ] "Ask" button submits the request
- [ ] Empty textarea → field error shown
- [ ] Animated loading dots while waiting for response
- [ ] Result card shows the question + answer
- [ ] "New question" button clears result and resets form
- [ ] Server error shown if MCP request fails

---

## 2. Routing

- [ ] `/` redirects to `/about`
- [ ] `/*` (any unknown URL) redirects to `/about`
- [ ] `/about` is public — no login required
- [ ] `/login` is public
- [ ] `/register` is public
- [ ] `/vacations` requires login → redirect to `/login` if not logged in
- [ ] `/ai` requires login
- [ ] `/mcp` requires login
- [ ] `/admin` requires admin role → non-admin redirected to `/vacations`
- [ ] `/add-vacation` requires admin role
- [ ] `/edit-vacation/:id` requires admin role
- [ ] `/reports` requires admin role
- [ ] Loading state handled → no flicker (app waits for localStorage read before redirecting)

---

## 3. Validation

| Rule | Page(s) |
|------|---------|
| First/last name required | Register |
| Email format valid | Register, Login |
| Password min 4 chars | Register |
| Email 409 → field error | Register |
| Destination required | Add, Edit Vacation |
| Description required | Add, Edit Vacation |
| Start date required | Add, Edit Vacation |
| Start date not in past | Add Vacation only |
| End date required | Add, Edit Vacation |
| End date ≥ start date | Add, Edit Vacation |
| Price required | Add, Edit Vacation |
| Price 0–10,000 | Add, Edit Vacation |
| Image required | Add Vacation only |
| Destination required | AI page |
| Question required | MCP page |
| All errors shown at once on submit | All forms |
| Each field clears its own error on change | All forms |

---

## 4. Responsive Design

- [ ] Navbar collapses to hamburger menu on mobile (≤768px)
- [ ] Hamburger opens/closes link panel
- [ ] Clicking a link closes the mobile menu
- [ ] Vacation cards switch from 3-column to 1-column on small screens
- [ ] Date fields (Start/End) stack vertically on very small screens (≤420px)
- [ ] About page feature grid goes from 2-column to 1-column on mobile
- [ ] Reports summary cards stack on mobile (≤600px)
- [ ] Bar chart labels shrink on small screens
- [ ] Auth forms (register/login) have comfortable padding on mobile
- [ ] Pagination buttons wrap without breaking layout
- [ ] All buttons and inputs have touch-friendly tap targets

---

## 5. Role-Based Access

| Route | Guest | User | Admin |
|-------|-------|------|-------|
| `/about` | ✅ | ✅ | ✅ |
| `/login` | ✅ | ✅ | ✅ |
| `/register` | ✅ | ✅ | ✅ |
| `/vacations` | ❌ redirect `/login` | ✅ | ✅ |
| `/ai` | ❌ redirect `/login` | ✅ | ✅ |
| `/mcp` | ❌ redirect `/login` | ✅ | ✅ |
| `/admin` | ❌ redirect `/login` | ❌ redirect `/vacations` | ✅ |
| `/add-vacation` | ❌ | ❌ | ✅ |
| `/edit-vacation/:id` | ❌ | ❌ | ✅ |
| `/reports` | ❌ | ❌ | ✅ |

**Navbar items by role:**
- [ ] Guest sees: About, Login, Register
- [ ] User sees: About, Vacations, AI, MCP, 👤 Name, Logout
- [ ] Admin sees: About, Admin, + Add Vacation, Reports, ⬇ CSV, 👤 Name, Logout
- [ ] Like buttons visible to users, NOT to admins on browse page
- [ ] Edit/Delete buttons visible only on `/admin` page, NOT on `/vacations`

---

## 6. Backend Integration

### API endpoints
- [ ] `POST /auth/register` — registration works, token returned
- [ ] `POST /auth/login` — login works, token returned
- [ ] `GET /vacations` — returns paginated list with filter support
- [ ] `GET /vacations/:id` — returns single vacation (used in Edit if no nav state)
- [ ] `POST /vacations` — create vacation with image upload
- [ ] `PUT /vacations/:id` — update vacation (image optional)
- [ ] `DELETE /vacations/:id` — delete vacation
- [ ] `POST /vacations/:id/like` — like a vacation
- [ ] `DELETE /vacations/:id/like` — unlike a vacation
- [ ] `GET /reports` — returns likes per destination
- [ ] `GET /reports/csv` — triggers file download
- [ ] `POST /ai` — returns AI recommendation
- [ ] `POST /mcp` — returns MCP query result

### Auth & tokens
- [ ] JWT token saved to `localStorage` on login/register
- [ ] Token attached as `Authorization: Bearer …` on all protected requests
- [ ] Expired token rejected on page load (exp claim checked)
- [ ] 401 response → token cleared from localStorage automatically
- [ ] `signOut` clears token and user from state and localStorage

### Docker backend
- [ ] `docker compose -f "docker-compose .yml" up -d --build` starts the backend
- [ ] Backend accessible at `http://localhost:3001`
- [ ] `VITE_API_URL=http://localhost:3001/api` set in `frontend/.env`
- [ ] `VITE_IMAGES_HOST=http://localhost:3001` set in `frontend/.env`
- [ ] Vacation images load correctly (check one image on the card)

---

## 7. Code Cleanup Before Submission

### Console & debugging
- [ ] No `console.log()` left in source files
- [ ] No commented-out code blocks
- [ ] No `TODO` or `FIXME` comments that weren't resolved

### TypeScript
- [ ] `npm run build` completes with **0 errors**
- [ ] No TypeScript `any` types used (check with `grep -r ": any" src/`)
- [ ] All component props have proper interfaces

### React
- [ ] No unused imports in any file
- [ ] No unused state variables
- [ ] All `useEffect` dependencies are correct

### CSS
- [ ] No inline `style={{ }}` used for layout (only for CSS custom properties like `--bar-width`)
- [ ] No `!important` rules
- [ ] All class names used in JSX exist in a CSS file

### Security
- [ ] No hardcoded passwords or API keys in source files
- [ ] No `alert()` or `confirm()` calls — all replaced with in-UI feedback
- [ ] Passwords never logged or displayed

### Project structure
- [ ] `frontend/.env` file exists with correct values
- [ ] `frontend/node_modules/` is in `.gitignore`
- [ ] `frontend/dist/` is in `.gitignore`
- [ ] `docker-compose .yml` starts correctly
- [ ] All source files are saved (no unsaved changes in VS Code)

### Final check
- [ ] Register a new user → verify login redirects to vacations
- [ ] Like a vacation → verify heart fills and count increases
- [ ] Admin: add a vacation with image → verify it appears in the list
- [ ] Admin: edit a vacation → verify changes saved
- [ ] Admin: delete a vacation → verify it disappears after confirmation
- [ ] Admin: download CSV → verify file downloaded
- [ ] Reports page: verify bars appear and animate
- [ ] AI page: ask about a destination → verify response appears
- [ ] MCP page: ask a question → verify answer appears
- [ ] Log out → verify redirect to login and protected pages are blocked
