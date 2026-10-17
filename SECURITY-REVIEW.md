# Security review — 2026-10-17

Scope: the e-map-services repository at e38ff13, all 127 unique blobs in locally available Git history, and the current static application. Hosting account configuration and remote-only/deleted Git history were not inspected. This is a code review, not a penetration test or a guarantee that every possible secret pattern is detectable.

## Findings by requested control

1. Rate limiting: no application endpoints, authentication, accounts, or authenticated actions exist. The host serves public static files. There is no trusted server-side process in which to enforce configurable per-IP/per-account limits or exponential backoff. Do not implement a browser-side limiter: visitors could bypass it. Hosting-level abuse controls must be configured in the hosting account; they were not changed in this review. If a backend is added, implement separate configurable policies for authentication, public APIs, and authenticated actions there.

2. Input validation: no forms, input elements, request handlers, query-string processing, or user-provided data ingestion exist. Filters and photo selection use fixed, authored DOM data. Text is rendered via textContent, not innerHTML; no eval or dynamic code execution is used. projects.json is static publishing data, not an incoming API request. No server input schema is applicable today. Any future contact form/API must reject invalid types, lengths, formats, and unknown fields server-side.

3. Secrets: scanned all 127 Git blobs across locally available refs for private keys, common AWS/GitHub/API token formats, and quoted credential assignments. No matches found. No tracked environment files or credential manifests were present. Public business contact details are intentionally published. No secrets are required by the site, so no environment variables were invented. Added .gitignore and .vercelignore credential exclusions. These are preventive safeguards, not a substitute for secret scanning; ignore rules cannot remove previously tracked files. Never put secrets into frontend code, frontend environment variables, or static JSON.

4. Dependencies: no package manifests, lockfiles, installed application packages, third-party JavaScript libraries, or build dependencies are present. Therefore npm/pip dependency audits have no dependency graph to audit; there are no package vulnerability severity entries or upgrades to report. External Google Fonts styles/fonts remain a third-party runtime dependency, outside package-manager vulnerability auditing. No claim is made about vulnerabilities in the hosting platform or browser.

5. Error handling: no server, database, or server error responses exist. No application code renders exception messages, stack traces, internal paths, or database errors to visitors. No server-side logging facility exists. Browser/extension console messages are not server error responses. Do not suppress all console errors to conceal defects. Future backend handlers should log full details server-side and return generic messages with a correlation ID.

6. Uploads: no visitor upload functionality exists. Images and videos are owner-supplied static assets committed during development. Their presence in the public assets directory is intentional and does not constitute an upload endpoint. Future uploads require server-side size limits, file-content and MIME inspection, an allowlist, generated filenames, and isolated non-executable storage.

## Changes and checks

- Added Git and Vercel deployment exclusions for local credentials, private-key files, environment files, logs, and tool metadata.
- JavaScript syntax validation: node --check script.js passed.
- Whitespace validation: git diff --check passed.
- Verified representative .env, private-key, and .vercel paths are ignored by Git while public source files remain trackable.
- No rate limiting, authentication, server logging, or upload controls were claimed as implemented for this static site.
