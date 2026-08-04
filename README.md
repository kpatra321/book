# OpenBook AI – Open Source AI Book Builder 📖🌲

OpenBook AI is a **100% client-side Progressive Web Application (PWA)** built with React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, and Dexie (IndexedDB). It allows anyone to create professional books, technical manuals, annual reports, and **Forest Beat Handbooks** directly in their web browser.

No server required. No authentication. No user accounts. No paid backend.

---

## 🌟 Key Features

* **100% Client-Side Architecture**: Everything runs locally in your browser. Complete privacy with zero remote tracking or server storage.
* **Pluggable AI Engine**:
  * Local WebLLM (runs inside browser via WebGPU)
  * Connect custom OpenAI, Gemini, Claude, or Ollama API keys
  * Disable AI for 100% manual editing & automated format tools
* **RAG Knowledge Base**: Index PDF, DOCX, CSV, Excel, Images (with OCR via Tesseract.js), and Google Drive files. Every AI answer includes exact source evidence citations.
* **Forest Beat Handbook Mode**: Dedicated specialized template for Forest Beat Handbooks with 30+ pre-configured chapters (Beat intro, RF/PRF details, year-wise & species-wise plantation registers, ANR, offences, fire lines, staff, and GPS boundary pillars).
* **Multi-Format Export Engine**: Export clean, publication-ready files to PDF (with CMYK readiness, customizable A4/Letter/Legal margins, TOC, headers, footers, watermarks), DOCX, XLSX, EPUB, HTML, Markdown, and JSON.
* **Extensible Plugin Architecture**: Add custom parsers, templates, exporters, and AI providers without altering core code.
* **Offline PWA Support**: Installable on desktop, tablet, and mobile with full offline functionality.
* **GitHub Pages Ready**: Out-of-the-box GitHub Actions workflow (`.github/workflows/deploy.yml`) for automated deployment.

---

## 🚀 Quick Start (Local Development)

Prerequisites: Node.js v18+ and pnpm (or npm / yarn).

```bash
# Clone the repository
git clone https://github.com/your-username/openbook-ai.git

# Navigate into the project folder
cd openbook-ai

# Install dependencies
pnpm install

# Start the Vite local development server
pnpm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🏗️ Project Architecture

```
src/
├── components/          # Reusable UI components (GlassCard, Modal, Layout, Editor, AI)
├── contexts/            # React Context providers (Theme)
├── hooks/               # Custom React hooks (useBooks, useFiles, useRAG)
├── pages/               # Application routes (Landing, Dashboard, Library, Editor, Templates, Settings)
├── services/
│   ├── ai/              # AI Service, RAG Knowledge Base engine & pluggable providers
│   ├── db/              # Dexie IndexedDB storage engine
│   ├── export/          # Multi-format export engine (PDF, DOCX, XLSX, EPUB, HTML, Markdown)
│   ├── google-drive/    # Client-side OAuth & Google Drive REST API reader
│   ├── parsers/         # PDF, DOCX, Excel/CSV, OCR, and Markdown parsers
│   └── plugins/         # Extensible plugin registry system
├── store/               # Zustand state stores (Book, File, Settings)
├── templates/           # Preset book templates (Forest Beat Handbook, Range Handbook, Annual Report, etc.)
└── types/               # TypeScript interfaces & definitions
```

---

## 🔌 Plugin Architecture

OpenBook AI includes a dynamic plugin registry:

```typescript
import { pluginRegistry } from './services/plugins/pluginRegistry';

// Register custom parser plugin
pluginRegistry.registerParser({
  id: 'custom_xml_parser',
  name: 'Custom XML Parser',
  version: '1.0.0',
  type: 'parser',
  fileExtensions: ['xml'],
  parse: async (file, filename) => {
    // Custom extraction logic
  }
});
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
