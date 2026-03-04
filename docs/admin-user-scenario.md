# BlackAnt / LaSu Access Guide (Important Login Reality)

If you tried **username/password = `admin` / `admin`** and could not do anything, that behavior is expected for this repository.

## Why `admin/admin` does not work here

This app currently authenticates with **Google Sign-In (NextAuth Google provider)**. There is no credentials-based login form, no built-in admin password account, and no admin role management UI in the current codebase.

So in this implementation:
- `admin/admin` is **not** a valid built-in account.
- users are created automatically when someone signs in with Google for the first time.
- there is no "admin creates user with username/password" flow yet.

---

## What works right now

### 1) Sign in
1. Open the app.
2. Click **Login with Google**.
3. Complete Google authentication.

### 2) First-time user flow
1. Open **Dashboard**.
2. Configure **Settings** (languages + translation type).
3. Use **Translate** with a sample word/sentence.
4. Check **History** for saved translations.
5. Check **Stats** for progress.
6. Optionally use **Community** and **Practice Hub**.

---

## If you need a real admin workflow

To support "admin creates users" with username/password, you need new features:
- credentials auth provider (email/username + password)
- password hashing/reset flow
- role field (admin/user)
- admin-only user management UI + APIs

Until those are implemented, use Google login for all accounts.
