@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;500;700&family=Cinzel:wght@400;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #0a0812;
  --bg2: #110e1f;
  --surface: #1a1530;
  --surface2: #221d3a;
  --border: #2e2850;
  --gold: #c9a84c;
  --gold2: #e8c97a;
  --gold-dim: #7a6230;
  --text: #e8e0d0;
  --text-dim: #8a8090;
  --accent: #9b6fd4;
  --accent2: #c49dff;
  --rose: #d4607a;
}

* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

html, body {
  margin: 0; padding: 0;
  background: var(--bg);
  color: var(--text);
  font-family: 'Noto Serif JP', serif;
  min-height: 100dvh;
  overflow-x: hidden;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(155,111,212,0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(201,168,76,0.06) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.page-container {
  position: relative;
  z-index: 1;
  max-width: 480px;
  margin: 0 auto;
  padding: 0 16px 80px;
  min-height: 100dvh;
}

.app-header { text-align: center; padding: 40px 0 20px; }
.app-title {
  font-family: 'Cinzel', serif;
  font-size: 12px;
  letter-spacing: 0.35em;
  color: var(--gold);
  text-transform: uppercase;
  margin-bottom: 8px;
}
.app-subtitle { font-size: 22px; font-weight: 300; color: var(--text); letter-spacing: 0.1em; }

.gold-divider {
  display: flex; align-items: center; gap: 12px; margin: 16px 0;
}
.gold-divider::before, .gold-divider::after {
  content: ''; flex: 1; height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold-dim), transparent);
}
.gold-divider span { color: var(--gold); font-size: 14px; }

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
}
.card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold-dim), transparent);
}

.btn-primary {
  width: 100%; padding: 16px;
  background: linear-gradient(135deg, #2a2040, #1a1530);
  border: 1px solid var(--gold-dim);
  border-radius: 12px;
  color: var(--gold2);
  font-family: 'Noto Serif JP', serif;
  font-size: 15px; letter-spacing: 0.1em;
  cursor: pointer; transition: all 0.3s ease;
  position: relative; overflow: hidden;
}
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-primary:not(:disabled):active { background: linear-gradient(135deg, #3a3050, #2a2540); }

.btn-gold {
  width: 100%; padding: 18px;
  background: linear-gradient(135deg, #8b6820, #c9a84c, #8b6820);
  border: none; border-radius: 12px;
  color: #1a1208;
  font-family: 'Noto Serif JP', serif;
  font-size: 16px; font-weight: 700; letter-spacing: 0.15em;
  cursor: pointer; transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(201,168,76,0.3);
}
.btn-gold:not(:disabled):active { transform: scale(0.99); }
.btn-gold:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-back {
  background: none; border: none;
  color: var(--text-dim); font-family: 'Noto Serif JP', serif;
  font-size: 13px; letter-spacing: 0.1em;
  cursor: pointer; padding: 8px 0;
  display: flex; align-items: center; gap: 6px;
}

.form-label {
  display: block; font-size: 11px; letter-spacing: 0.2em;
  color: var(--gold); text-transform: uppercase; margin-bottom: 8px;
}
.form-input {
  width: 100%; padding: 12px 14px;
  background: var(--bg2); border: 1px solid var(--border);
  border-radius: 10px; color: var(--text);
  font-family: 'Noto Serif JP', serif; font-size: 15px;
  outline: none; transition: border-color 0.2s;
  -webkit-appearance: none;
}
.form-input:focus { border-color: var(--gold-dim); }
.form-select {
  width: 100%; padding: 12px 14px;
  background: var(--bg2); border: 1px solid var(--border);
  border-radius: 10px; color: var(--text);
  font-family: 'Noto Serif JP', serif; font-size: 15px;
  outline: none; -webkit-appearance: none; cursor: pointer;
}

.upload-area {
  border: 2px dashed var(--border); border-radius: 16px;
  padding: 32px 20px; text-align: center;
  cursor: pointer; transition: all 0.3s ease;
  background: var(--bg2); position: relative; overflow: hidden;
}
.upload-area.has-image { border-color: var(--gold-dim); padding: 0; }
.upload-area.has-image img {
  width: 100%; height: 220px; object-fit: cover;
  border-radius: 14px; display: block;
}

.result-section { margin-bottom: 10px; }
.result-section-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px;
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 10px; cursor: pointer; transition: all 0.2s;
}
.result-section-title { font-size: 13px; letter-spacing: 0.1em; color: var(--gold2); }
.result-section-content {
  padding: 16px; border: 1px solid var(--border); border-top: none;
  border-radius: 0 0 10px 10px; background: var(--bg2);
}
.result-item { margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
.result-item:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
.result-item-name { font-size: 12px; color: var(--gold); letter-spacing: 0.15em; margin-bottom: 6px; }
.result-item-text { font-size: 14px; line-height: 1.9; color: var(--text); }

.result-summary {
  background: linear-gradient(135deg, var(--surface2), var(--surface));
  border: 1px solid var(--gold-dim); border-radius: 12px;
  padding: 20px; margin-top: 20px;
}
.result-summary-title {
  font-size: 11px; letter-spacing: 0.3em; color: var(--gold);
  text-align: center; margin-bottom: 12px;
}
.result-summary-text { font-size: 14px; line-height: 2; color: var(--text); }

.loading-container {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 60px 20px; gap: 20px;
}
.palm-loader {
  width: 80px; height: 80px; position: relative;
}
.palm-loader::before, .palm-loader::after {
  content: ''; position: absolute; border-radius: 50%;
  border: 2px solid transparent;
}
.palm-loader::before { inset: 0; border-top-color: var(--gold); animation: spin 1.2s linear infinite; }
.palm-loader::after { inset: 8px; border-top-color: var(--accent); animation: spin 0.8s linear infinite reverse; }
@keyframes spin { to { transform: rotate(360deg); } }

.loading-text {
  font-size: 13px; color: var(--text-dim); letter-spacing: 0.2em;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }

.compat-score {
  text-align: center; padding: 24px;
  background: linear-gradient(135deg, rgba(155,111,212,0.1), rgba(201,168,76,0.1));
  border: 1px solid var(--border); border-radius: 16px; margin-bottom: 20px;
}
.compat-score-number {
  font-family: 'Cinzel', serif; font-size: 56px; color: var(--gold2); line-height: 1; margin-bottom: 4px;
}
.compat-score-label { font-size: 12px; color: var(--text-dim); letter-spacing: 0.2em; }

.tabs { display: flex; gap: 8px; margin-bottom: 20px; }
.tab {
  flex: 1; padding: 10px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 10px; color: var(--text-dim);
  font-family: 'Noto Serif JP', serif; font-size: 13px; letter-spacing: 0.1em;
  cursor: pointer; transition: all 0.2s; text-align: center;
}
.tab.active { background: var(--surface2); border-color: var(--gold-dim); color: var(--gold2); }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-in { animation: fadeInUp 0.5s ease forwards; }
.fade-in-1 { animation: fadeInUp 0.5s ease 0.1s both; }
.fade-in-2 { animation: fadeInUp 0.5s ease 0.2s both; }
.fade-in-3 { animation: fadeInUp 0.5s ease 0.3s both; }

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
