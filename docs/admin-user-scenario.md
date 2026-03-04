# BlackAnt / LaSu Admin + User Walkthrough

This guide gives you a **simple role-play scenario** you can follow.

> Important: in this codebase, login is implemented with **Google sign-in** (NextAuth Google provider), not a username/password form. If your production site `https://blackant.app` has username/password, keep using your real admin account there. The workflow below still applies conceptually.  

---

## 1) Admin scenario: create a user

### Goal
As admin, create a learner account for a team member/student.

### Scenario steps
1. Sign in as **Admin** on `https://blackant.app`.
2. Go to user/account management.
3. Click **Create user**.
4. Fill user details:
   - Full name
   - Email (or username if your deployment uses username/password)
   - Temporary password (if required)
   - Initial settings (languages, translation style)
5. Save.
6. Share credentials securely with the user and force password reset on first login (best practice).

### What success looks like
- New user appears in the users list.
- User can log in.
- User profile/settings are initialized.

---

## 2) User scenario: first-time use

### Goal
User logs in and performs the first learning activity.

### Scenario steps
1. Open `https://blackant.app`.
2. Log in with the credentials provided by admin.
3. Open **Dashboard**.
4. Go to **Settings** and select preferred language pair + translation type.
5. Use the **Translate** tool:
   - Enter a source word/sentence.
   - Select translation direction/type.
   - Submit translation.
6. Confirm translation is saved into **History**.
7. Open **Stats** to verify activity is tracked.
8. (Optional) Join/use **Community** features.

### What success looks like
- Translation result is displayed.
- A history record exists.
- Stats/community counters update.

---

## 3) Ongoing user flow (later)

Use this weekly cycle:
1. Add new words/sentences in Translate.
2. Review recent entries in History.
3. Check Stats progress.
4. Practice in Practice Hub.
5. Update Settings as learning goals change.

---

## 4) Notes for this repository (technical reality)

From current source code:
- Authentication uses **Google Provider** with NextAuth.
- A user document is auto-created on first successful login.
- Sidebar and dashboard include modules for Overview, Community, Practice Hub, History, Stats, and Settings.

So if you need strict username/password admin provisioning, that is a **product requirement gap** to implement separately in this codebase.
