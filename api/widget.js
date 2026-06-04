export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  
  res.status(200).send(`
(function() {
  const VERCEL_URL = window.NAUXILIA_API_URL || 'https://nauxilia-chatbot.vercel.app';

  const style = document.createElement('style');
  style.textContent = \`
    #nauxilia-btn {
      position: fixed; bottom: 24px; right: 24px;
      width: 56px; height: 56px; border-radius: 50%;
      background: #1A2640; border: none; cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
      z-index: 9999; transition: transform 0.2s;
    }
    #nauxilia-btn:hover { transform: scale(1.1); }
    #nauxilia-box {
      position: fixed; bottom: 92px; right: 24px;
      width: 340px; height: 480px;
      background: #fff; border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.18);
      display: none; flex-direction: column;
      z-index: 9998; font-family: Arial, sans-serif;
      overflow: hidden;
    }
    #nauxilia-box.open { display: flex; }
    #nauxilia-header {
      background: #1A2640; padding: 16px 20px;
      display: flex; align-items: center; justify-content: space-between;
    }
    #nauxilia-header span { color: #C9A96E; font-weight: bold; font-size: 15px; }
    #nauxilia-header button { background: none; border: none; color: #fff; font-size: 20px; cursor: pointer; }
    #nauxilia-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
    .nauxilia-msg { max-width: 80%; padding: 10px 14px; border-radius: 12px; font-size: 14px; line-height: 1.5; }
    .nauxilia-msg.bot { background: #F3F4F6; color: #111827; align-self: flex-start; }
    .nauxilia-msg.user { background: #1A2640; color: #fff; align-self: flex-end; }
    #nauxilia-input-area { padding: 12px 16px; border-top: 1px solid #E5E7EB; display: flex; gap: 8px; }
    #nauxilia-input { flex: 1; border: 1px solid #E5E7EB; border-radius: 8px; padding: 8px 12px; font-size: 14px; outline: none; }
    #nauxilia-input:focus { border-color: #1A2640; }
    #nauxilia-send { background: #1A2640; color: #C9A96E; border: none; border-radius: 8px; padding: 8px 14px; cursor: pointer; font-size: 18px; }
    #nauxilia-powered { text-align: center; padding: 6px; font-size: 10px; color: #9CA3AF; background: #F9FAFB; }
  \`;
  document.head.appendChild(style);

  document.body.insertAdjacentHTML('beforeend', \`
    <button id="nauxilia-btn" aria-label="Ouvrir l'assistant">
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#C9A96E" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </button>
    <div id="nauxilia-box">
      <div id="nauxilia-header">
        <span>Assistant FAIR</span>
        <button id="nauxilia-close">×</button>
      </div>
      <div id="nauxilia-messages"></div>
      <div id="nauxilia-input-area">
        <input id="nauxilia-input" type="text" placeholder="Posez votre question..." />
        <button id="nauxilia-send">➤</button>
      </div>
      <div id="nauxilia-powered">Powered by Nauxilia</div>
    </div>
  \`);

  const btn = document.getElementById('nauxilia-btn');
  const box = document.getElementById('nauxilia-box');
  const closeBtn = document.getElementById('nauxilia-close');
  const input = document.getElementById('nauxilia-input');
  const send = document.getElementById('nauxilia-send');
  const messages = document.getElementById('nauxilia-messages');
  let history = [];
  let greeted = false;

  function addMsg(text, role) {
    const div = document.createElement('div');
    div.className = 'nauxilia-msg ' + role;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function toggleChat() {
    box.classList.toggle('open');
    if (box.classList.contains('open') && !greeted) {
      greeted = true;
      addMsg("Bonjour ! Je suis l'assistant de FAIR. Comment puis-je vous aider ? (I can also answer in English, Arabic or any language)", 'bot');
    }
    if (box.classList.contains('open')) input.focus();
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMsg(text, 'user');
    history.push({ role: 'user', content: text });
    input.value = '';
    const typing = addMsg('...', 'bot');
    try {
      const res = await fetch(VERCEL_URL + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });
      const data = await res.json();
      typing.remove();
      if (data.reply) {
        addMsg(data.reply, 'bot');
        history.push({ role: 'assistant', content: data.reply });
        if (history.length > 20) history = history.slice(-20);
      } else {
        addMsg("Une erreur est survenue. Veuillez réessayer.", 'bot');
      }
    } catch(e) {
      typing.remove();
      addMsg("Impossible de me connecter. Vérifiez votre connexion.", 'bot');
    }
  }

  btn.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);
  send.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
})();
  `);
}
