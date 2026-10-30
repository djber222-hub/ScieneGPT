SCIENCEGPT — full-stack website package

WHAT IT DOES
- First screen closely follows the ScienceGPT reference: header, Install/Fullscreen controls, blue-purple hero headline, only Start Learning Now and Exam Time buttons.
- Start Learning opens a separate AI chat screen.
- Exam Time opens a short science quiz.
- 16 language options plus automatic question-language matching.
- Gemini API powers the science tutor.
- Relevant science illustrations are searched from Wikimedia Commons and shown with source links.
- Installable PWA support once deployed over HTTPS.

SETUP (one time)
1. Install Node.js on a computer/server.
2. Copy .env.example to a file named .env.
3. Create a free Gemini API key in Google AI Studio: https://aistudio.google.com/app/apikey
4. Paste the key into .env after GEMINI_API_KEY= . Do not share this key or put it in frontend files.
5. In this folder run: npm install
6. Run: npm start
7. Open http://localhost:3000

DEPLOYMENT
Deploy this Node app to a Node-compatible HTTPS host. Add GEMINI_API_KEY as a private environment variable in the host dashboard. Do not upload .env or expose your key in public code.
The browser's native Install prompt requires HTTPS and PWA support.

FREE-TIER / IMAGE NOTE
Gemini API has a free tier for selected text models, subject to model availability, rate limits, and Google's terms. Google may use free-tier submitted content to improve its products; check current terms before sending private information.
The image shown with an answer is a relevant Wikimedia Commons image, not an AI-generated image. Wikimedia image availability and licensing vary; the source link is shown. Gemini image-generation models are not included in the free text tier pricing at the time this package was prepared.
