import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({limit:"1mb"}));
app.use(express.static(path.join(__dirname,"public")));

const MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
const LANGS = ["English","Urdu","Hindi","Arabic","Bengali","Punjabi","Spanish","French","German","Chinese","Japanese","Korean","Turkish","Portuguese","Russian","Indonesian"];

async function findImage(query) {
  try {
    const url = new URL("https://commons.wikimedia.org/w/api.php");
    url.search = new URLSearchParams({
      action:"query",format:"json",origin:"*",generator:"search",
      gsrsearch:query+" science",gsrnamespace:"6",gsrlimit:"1",
      prop:"imageinfo",iiprop:"url",iiurlwidth:"900"
    }).toString();
    const r = await fetch(url, {headers:{"User-Agent":"ScienceGPTLearningDemo/1.0 (educational website)"}});
    if (!r.ok) return null;
    const j = await r.json();
    const page = Object.values(j?.query?.pages || {})[0];
    const info = page?.imageinfo?.[0];
    if (!info) return null;
    return {url:info.thumburl || info.url, page:info.descriptionurl || "https://commons.wikimedia.org/", title:page.title};
  } catch { return null; }
}

app.post("/api/chat", async (req,res) => {
  const question = String(req.body?.question || "").trim();
  const requestedLanguage = String(req.body?.language || "auto");
  if (!question) return res.status(400).json({error:"Please enter a question."});
  if (!process.env.GEMINI_API_KEY) return res.status(503).json({error:"Server admin must add GEMINI_API_KEY to the .env file."});
  if (requestedLanguage !== "auto" && !LANGS.includes(requestedLanguage)) return res.status(400).json({error:"Unsupported language."});

  const prompt = `You are ScienceGPT, a careful, friendly science tutor for a student. Answer the user's science question accurately, clearly, and at an appropriate level. If the question is ambiguous, ask a short clarification. Explain step by step when useful. Never fabricate facts, sources, experiments, or certainty. For dangerous experiments, chemicals, electricity, or tools, give safety-first guidance and recommend adult/qualified supervision. Use simple language and headings/bullets where helpful. IMPORTANT LANGUAGE RULE: If answer language is "${requestedLanguage}", respond in that language. If it is "auto", detect the language of the user's question and answer in that same language. The supported language choices are ${LANGS.join(", ")}. If the user asks in Roman Urdu, answer in Roman Urdu. At the end, add one short line beginning exactly "IMAGE_QUERY:" followed by a concise English search phrase for a relevant educational illustration, or "none" if no image would help. Do not include markdown code fences.\n\nUser question: ${question}`;
  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`;
    const response = await fetch(endpoint, {
      method:"POST",
      headers:{"Content-Type":"application/json","x-goog-api-key":process.env.GEMINI_API_KEY},
      body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:0.35,maxOutputTokens:1400}})
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({error:data?.error?.message || "Gemini API request failed."});
    let answer = (data?.candidates?.[0]?.content?.parts || []).map(p=>p.text || "").join("\n").trim();
    const match = answer.match(/IMAGE_QUERY:\s*(.+)$/im);
    let image = null;
    if (match) {
      const term = match[1].trim();
      answer = answer.replace(/\n?IMAGE_QUERY:\s*.+$/im,"").trim();
      if (term.toLowerCase() !== "none") image = await findImage(term);
    }
    res.json({answer,image});
  } catch (e) {
    res.status(500).json({error:"Could not reach the AI service. Check server internet connection."});
  }
});

app.get("/manifest.webmanifest",(req,res)=>res.sendFile(path.join(__dirname,"public","manifest.webmanifest")));
app.get("/sw.js",(req,res)=>res.sendFile(path.join(__dirname,"public","sw.js")));
const port = Number(process.env.PORT || 3000);
app.listen(port,()=>console.log(`ScienceGPT running on http://localhost:${port}`));
