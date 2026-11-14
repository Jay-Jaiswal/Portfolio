# Jay Jaiswal — Creative Engineering Portfolio

An experimental, responsive portfolio built as a dependency-free static site. It presents verified information from Jay's AI/ML and software-development resumes across role-based exploration, project filtering, case studies, a technical toolkit, education/research timeline, interactive terminal and contact flow.

## Local development

From the repository root:

```powershell
python -m http.server 8000
```

Open `http://localhost:8000`. A web server is required so directory routes such as `/projects/qair/` resolve correctly.

## Checks and production build

```powershell
npm run check
npm run build
```

The production build is written to `dist/`.

## Contact form

The form validates all required fields and opens the visitor's email application with a prepared message. It does not claim a message was sent. To send directly from the website, replace the `mailto:` handoff in `script.js` with a configured provider such as Resend, Formspree or a serverless endpoint; no service credentials are currently present.

## Deployment

### Vercel

1. Import the repository into Vercel.
2. Keep the included `vercel.json`; it runs `npm run build` and deploys `dist/`.
3. Add `jayjaiswal.codes` in Project Settings → Domains and apply the DNS records Vercel provides.
4. No environment variables are required for the current build.

### GitHub Pages

The included `CNAME` points Pages to `jayjaiswal.codes`. Deploy either the repository root or the generated `dist/` folder through a Pages workflow. The native GitHub Pages URL remains `https://jay-jaiswal.github.io/` while the custom domain is configured.

## Content sources and known gaps

- Role-specific resume PDFs are stored in `resumes/`.
- Project facts are centralized in `data.js`.
- No complete project catalogue or project screenshots were available in this checkout. The case studies intentionally omit unsupported metrics, deployment links and unverified implementation detail.
