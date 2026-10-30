ScienceGPT Cloudflare Workers version

Files:
- worker.js: Cloudflare Worker API for Gemini
- wrangler.jsonc: Worker + public static assets configuration
- public/: website files

Cloudflare build settings:
Build command: npm install
Deploy command: npx wrangler deploy
Root directory: /

After deploying, add GEMINI_API_KEY as a Worker secret in Cloudflare:
Workers & Pages > scienegpt > Settings > Variables and Secrets > Add > Secret
Name: GEMINI_API_KEY
Value: your Gemini API key

Never put the API key in GitHub or in public files.
