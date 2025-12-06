# Netlify File Manager (REST Blobs Version)

Questa versione usa le API REST di Netlify Blobs,
quindi funziona al 100% anche con il runtime Function v1.

---

# 🔧 Variabili da creare in Netlify

Vai su:
Netlify → Site Settings → Build & Deploy → Environment → Environment Variables → Add variable

## 1️⃣ NETLIFY_API_TOKEN
Valore = il token che hai generato in:
User Settings → Applications → Personal Access Tokens

## 2️⃣ NETLIFY_SITE_ID
❗ NON serve aggiungerla manualmente  
Netlify la fornisce automaticamente alle functions.

---

# 🚀 Deploy
Fai push su GitHub → Netlify ricostruisce automaticamente.

# 🧪 Test endpoint funzionante
/.netlify/functions/list
/.netlify/functions/upload

Buon lavoro!
