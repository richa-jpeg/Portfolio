import { createRoot } from 'react-dom/client';

/* Self-hosted variable fonts. The `Variable` suffix in the family name
   is load-bearing — the @font-face rules declare 'Inter Tight Variable'
   and 'JetBrains Mono Variable', and writing the bare name would fall
   back silently with no error. */
import '@fontsource-variable/inter-tight';
import '@fontsource-variable/jetbrains-mono';

/* Lenis ships the rules that make document scrolling work
   (`html.lenis { height: auto }`) and that make stop() visible
   (`.lenis-stopped { overflow: clip }`). Without this import,
   lenis.stop() sets a class and nothing happens. */
import 'lenis/dist/lenis.css';

import './styles/tokens.css';
import './styles/chrome.css';
import './styles/chapters.css';
import './styles/cases.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);
