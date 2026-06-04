# Project Collaboration & Sign-Off System

Adds document management, scope of work, renovation checklists, client sign-off, email notifications, and a project-aware support bot to each project in the dashboard.

## 1. Database (new tables)

- **project_documents** — uploaded files (PDFs, Google Docs links, photos)
  - `project_id`, `title`, `description`, `file_url` (Storage), `external_url` (Google Doc link), `mime_type`, `kind` (`document` | `photo` | `google_doc`), `uploaded_by`, `visible_to_client` (bool), `client_signed_off` (bool), `client_signed_off_at`, `signed_off_by_name`
- **project_scope** — one row per project: `client_needs` (rich text), `notes`
- **project_checklist_items** — `project_id`, `title`, `description`, `category`, `done`, `done_at`, `sort_order`, `requires_client_signoff`, `client_signed_off_at`, `signed_off_by_name`
- **project_updates** — timeline updates posted by the team
  - `project_id`, `title`, `body`, `author_id`, `notify_client` (bool), `created_at`
- **project_update_photos** — `update_id`, `photo_url`, `caption`, `sort_order`
- **project_knowledge** — support-bot memory per project
  - `project_id`, `content`, `source` (`manual` | `document` | `update`), `created_by`, `created_at`

RLS: admins manage everything; clients (via `user_has_project_access`) can read items where `visible_to_client = true`, and can update sign-off fields on docs/checklist items for their project.

Storage: `project-files` (private) bucket with signed URLs.

## 2. Backend (server functions + one server route)

`src/server/projects.functions.ts`:
- `listProjectDocuments`, `uploadProjectDocument`, `addGoogleDocLink`, `deleteProjectDocument`
- `getProjectScope`, `updateProjectScope`
- `listChecklist`, `upsertChecklistItem`, `toggleChecklistDone`, `deleteChecklistItem`
- `listUpdates`, `createUpdate` (with photos), `deleteUpdate`
- `clientSignOffDocument`, `clientSignOffChecklistItem`
- `listProjectKnowledge`, `addProjectKnowledge`
- `askProjectBot` — calls Lovable AI Gateway (`google/gemini-2.5-flash`) with system prompt built from project + scope + checklist + recent updates + knowledge entries

`src/server/google-docs.functions.ts` — fetch Google Doc content via the Google Docs connector when a `docs.google.com` URL is added (so the bot can read it).

## 3. Emails

Use Lovable Emails (built-in). Templates:
- `project-update` — "New update on {project}" with first photo + link to portal
- `signoff-request` — "Please review and sign off: {item}" with portal link

Triggered from `createUpdate` (when `notify_client=true`) and when admin marks a doc/checklist item as `awaiting client sign-off`. Requires email domain setup — will prompt user.

## 4. UI

**Dashboard › Project detail** (`/dashboard/projects/$projectId`) — add tabs:
- Overview (existing)
- Scope & Checklist — edit client needs + checklist
- Documents — upload, paste Google Doc URL, toggle "visible to client"
- Updates — compose update + drag/drop photos, "Notify client" toggle
- Knowledge — view/add support-bot knowledge entries
- Ask Bot — chat interface scoped to this project

**Client portal** (`/portal/$projectId`) — add:
- Scope summary + checklist with sign-off buttons
- Documents list with "I approve" sign-off
- Updates timeline with photos
- "Ask about my project" chat (uses same bot)

## 5. Connectors / Secrets needed
- Google Docs connector (for reading Google Doc content) — will prompt during setup
- Lovable Email domain (for notifications) — will prompt during setup
- `LOVABLE_API_KEY` already present for the bot

## Execution order
1. Create migration (tables, RLS, storage bucket)
2. Server functions + Google Docs integration
3. Email setup + templates
4. Dashboard tabs UI
5. Client portal updates
6. Bot chat UI

This is a large feature (~15–20 files). Approve and I'll execute step by step, pausing only for the email-domain and Google Docs connector prompts.
