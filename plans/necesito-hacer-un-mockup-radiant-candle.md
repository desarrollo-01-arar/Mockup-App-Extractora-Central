# Plan: Mockup Mobile App — Extractora Central

## Context

The user needs a complete interactive mobile app mockup for **Extractora Central**, a palm oil extraction company. The app replaces manual Excel-based quality evaluation forms used by field technicians during farm visits. The mockup must cover all mobile screens (ignoring the Intranet web module) with realistic UI and navigation.

---

## Screens to Build

1. **Login** – credentials + company branding
2. **Calendar View** – main home screen with monthly calendar, visit markers, view toggle, filters
3. **List View** – chronological visit list with filters
4. **Evaluation Form** – multi-section form opened from a visit (sections: header, harvest quality, fruit quality, photos, observations)
5. **Synchronization** – pending/completed/error queue of forms awaiting upload
6. **Profile & Settings** – user info, change password, offline mode, notifications, theme toggle

---

## Implementation Approach

### Presentation Layer
- Render the app inside a **phone frame** (375×812px, with notch/status bar) centered in the browser window to simulate a mobile device
- Support both light and dark themes (toggle in settings)

### Navigation
- Use `react-router` (already installed v7.13.0) for client-side navigation between screens
- **Bottom tab bar** with 4 tabs: Home (Calendar/List), Sync, Settings/Profile
- React Router routes: `/login`, `/home`, `/visit/:id`, `/sync`, `/settings`

### Design Tokens (from functional doc branding)
| Token | Color | Usage |
|---|---|---|
| `--primary` | `#1F4E79` (dark blue) | App bar, primary actions |
| `--primary-light` | `#2E75B6` (medium blue) | Accents, tabs |
| `--primary-bg` | `#D6E4F0` (light blue) | Subtle backgrounds |
| `--success` | `#2E7D32` (green) | Completed visits, synced |
| `--danger` | `#C62828` (red) | Errors, overdue |

### Components to Create (in `src/app/components/`)
- `MobileFrame.tsx` – phone shell wrapper
- `BottomNav.tsx` – tab bar with icons
- `screens/LoginScreen.tsx`
- `screens/CalendarScreen.tsx` – calendar grid + list toggle + filter drawer
- `screens/VisitFormScreen.tsx` – evaluation form with crew sections
- `screens/SyncScreen.tsx`
- `screens/SettingsScreen.tsx`

### Mock Data
- 3 field technicians, 5 providers, 8 farms, 2 operation centers
- ~15 visits distributed across current month with mixed statuses (pending/completed)
- 4 pending sync items (2 pending, 1 synced, 1 error)

### Key UI Details per Screen

#### Login
- Extractora Central logo/wordmark (palm oil green + dark blue)
- Username + password inputs (shadcn `Input`)
- "Ingresar" button
- Offline notice banner

#### Calendar
- Header: month/year navigation arrows + filter icon + list/calendar toggle
- Calendar grid: days with color-coded dots (pending = blue, completed = green)
- Selected day panel slides up showing visits for that day
- Filters drawer: by technician, provider, farm, operation center (shadcn `Select`)

#### List View
- Same filter access
- Visit cards with: farm name, date, provider, status badge (Pendiente / Completada)

#### Evaluation Form
- Pre-filled header (provider, farm, date, operation center)
- User fields: material type, planting year, lot, accompanying person
- Section 1 — Harvest Quality: per-crew table with manual inputs + auto-calculated fields, "+ Add Crew" button
- Section 2 — Fruit Quality: per-crew counts + auto-calculated percentages
- Final: observations textarea, suggestions textarea, photo attachment UI (camera icon only)
- Save button

#### Sync
- Stats bar: total pending, synced today
- List of forms with status chip: Pendiente / Sincronizado / Error
- "Sincronizar ahora" CTA button
- Offline mode banner when simulated offline

#### Settings
- Profile card (name, role)
- List sections: Cuenta (change password, logout), Conectividad (offline mode switch), Notificaciones (new visit toggle), Apariencia (dark/light theme toggle)
- shadcn `Switch` components for toggles

---

## Files to Create/Modify

- **Modify**: `src/app/App.tsx` – set up Router, routes, theme provider
- **Modify**: `src/styles/theme.css` – add brand color tokens
- **Create**: `src/app/components/MobileFrame.tsx`
- **Create**: `src/app/components/BottomNav.tsx`
- **Create**: `src/app/components/screens/LoginScreen.tsx`
- **Create**: `src/app/components/screens/CalendarScreen.tsx`
- **Create**: `src/app/components/screens/VisitFormScreen.tsx`
- **Create**: `src/app/components/screens/SyncScreen.tsx`
- **Create**: `src/app/components/screens/SettingsScreen.tsx`
- **Create**: `src/app/data/mockData.ts` – all mock data

### Existing utilities to reuse
- `src/app/components/ui/button.tsx` – buttons
- `src/app/components/ui/input.tsx` – form inputs
- `src/app/components/ui/badge.tsx` – status badges
- `src/app/components/ui/switch.tsx` – settings toggles
- `src/app/components/ui/select.tsx` – filter dropdowns
- `src/app/components/ui/tabs.tsx` – calendar/list toggle
- `src/app/components/ui/scroll-area.tsx` – scrollable panels
- `src/app/components/ui/dialog.tsx` – filter drawer / password modal
- `src/app/components/ui/card.tsx` – visit cards
- `lucide-react` – all icons

---

## Verification

1. Login screen renders with form, clicking "Ingresar" navigates to Calendar
2. Calendar shows current month with color-coded visits, month navigation works
3. Toggling calendar/list view switches between both views
4. Filter button opens drawer with working dropdowns
5. Clicking a visit opens the full evaluation form
6. Form's Section 1 auto-calculates values when manual fields are entered
7. "+ Agregar cuadrilla" adds a new crew section
8. Sync screen shows queue list, "Sincronizar ahora" button triggers mock progress
9. Settings all toggles work (theme switches dark/light, offline mode, notifications)
10. Bottom nav correctly switches between all main sections
