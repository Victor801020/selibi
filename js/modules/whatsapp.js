import { playWhatsAppRingSound, playWhatsAppConnectSound } from '../audio.js';

let callInterval = null;
let isMuted = false;
let isSpeakerOn = false;
let isVideoCall = false;

// Banco de contatos com falas estendidas e avatares
export const waContacts = {
  cr7: {
    name: 'Cristiano Ronaldo',
    phrase: 'SIIIIUUU! A dedicação e o trabalho duro vencem o talento quando o talento não trabalha duro! Vamos com tudo!',
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    lang: 'pt-PT'
  },
  shakira: {
    name: 'Shakira',
    phrase: 'Hola mi amor! A tecnologia e a comunicação conectam o mundo e aproximam as pessoas de todos os países!',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    lang: 'es-ES'
  }
};

export let currentWAContact = waContacts.cr7;

export function switchWAContact(contactKey) {
  endPhoneCall();
  if (waContacts[contactKey]) {
    currentWAContact = waContacts[contactKey];
  }
  
  const nameElem = document.getElementById('waContactName');
  if (nameElem) nameElem.textContent = currentWAContact.name;

  const history = document.getElementById('waChatHistory');
  if (history) {
    history.innerHTML += `
      <div class="bg-[#202c33] self-start p-1.5 rounded-md text-[9px] text-emerald-400 font-bold max-w-[90%] shadow my-0.5">
        📲 Conversa alterada para ${currentWAContact.name}
      </div>
    `;
    history.scrollTop = history.scrollHeight;
  }
}

export function sendWAMessage() {
  const input = document.getElementById('waInputMessage');
  const history = document.getElementById('waChatHistory');
  if (!input || !history) return;

  const text = input.value.trim();
  if (!text) return;

  history.innerHTML += `
    <div class="bg-[#005c4b] self-end p-2 rounded-lg text-xs text-white max-w-[85%] shadow ml-auto my-0.5 font-medium">
      ${text}
    </div>
  `;
  input.value = '';
  history.scrollTop = history.scrollHeight;

  setTimeout(() => {
    history.innerHTML += `
      <div id="waTyping" class="bg-[#202c33] self-start p-1.5 rounded-md text-[10px] text-slate-400 italic my-0.5">
        ${currentWAContact.name} está digitando...
      </div>
    `;
    history.scrollTop = history.scrollHeight;
  }, 500);

  setTimeout(() => {
    const typing = document.getElementById('waTyping');
    if (typing) typing.remove();

    history.innerHTML += `
      <div class="bg-[#202c33] self-start p-2 rounded-lg text-xs text-slate-100 max-w-[85%] shadow my-0.5 border border-slate-700/50">
        <span class="font-extrabold text-emerald-400 block text-[10px]">${currentWAContact.name}</span>
        ${currentWAContact.phrase}
      </div>
    `;
    history.scrollTop = history.scrollHeight;

    if (!isMuted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentWAContact.phrase);
      utterance.lang = currentWAContact.lang;
      utterance.rate = 0.95;
      utterance.pitch = currentWAContact.name === 'Shakira' ? 1.25 : 0.85;
      window.speechSynthesis.speak(utterance);
    }
  }, 1600);
}

export function startWhatsAppCall() {
  endPhoneCall();
  const chatHistory = document.getElementById('waChatHistory');
  const inputBar = document.getElementById('waInputBar');
  const callOverlay = document.getElementById('whatsappCallOverlay');
  
  const nameElem = document.getElementById('whatsappContactName');
  const statusElem = document.getElementById('whatsappCallStatus');
  const textElem = document.getElementById('whatsappSpeechText');

  if (!callOverlay || !chatHistory) return;

  chatHistory.classList.add('hidden');
  if (inputBar) inputBar.classList.add('hidden');
  callOverlay.classList.remove('hidden');

  nameElem.textContent = currentWAContact.name;
  statusElem.textContent = "Chamando...";
  textElem.textContent = "";

  playWhatsAppRingSound();
  callInterval = setInterval(() => { playWhatsAppRingSound(); }, 1800);

  setTimeout(() => {
    clearInterval(callInterval);
    playWhatsAppConnectSound();
    statusElem.textContent = "00:12 • Conectado";
    textElem.textContent = `"${currentWAContact.phrase}"`;

    if (!isMuted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentWAContact.phrase);
      utterance.lang = currentWAContact.lang;
      utterance.rate = 0.95;
      utterance.pitch = currentWAContact.name === 'Shakira' ? 1.25 : 0.85;
      window.speechSynthesis.speak(utterance);
    }
  }, 2500);
}

export function toggleMuteCall() {
  isMuted = !isMuted;
  const btn = document.getElementById('btnMuteCall');
  if (btn) {
    btn.classList.toggle('bg-slate-700', !isMuted);
    btn.classList.toggle('bg-red-500', isMuted);
  }
  if (isMuted && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function toggleSpeakerCall() {
  isSpeakerOn = !isSpeakerOn;
  const btn = document.getElementById('btnSpeakerCall');
  if (btn) {
    btn.classList.toggle('bg-slate-700', !isSpeakerOn);
    btn.classList.toggle('bg-emerald-500', isSpeakerOn);
  }
}

export function toggleVideoCall() {
  isVideoCall = !isVideoCall;
  const btn = document.getElementById('btnVideoCall');
  const avatar = document.getElementById('whatsappAvatarContainer');
  
  if (btn) {
    btn.classList.toggle('bg-slate-700', !isVideoCall);
    btn.classList.toggle('bg-blue-500', isVideoCall);
  }

  if (avatar) {
    if (isVideoCall) {
      avatar.innerHTML = `<img src="${currentWAContact.avatarUrl}" class="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-xl animate-pulse">`;
    } else {
      avatar.innerHTML = `<i class="fa-solid fa-user text-emerald-400 text-3xl"></i>`;
    }
  }
}

export function endPhoneCall() {
  if (callInterval) clearInterval(callInterval);
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  
  isMuted = false;
  isSpeakerOn = false;
  isVideoCall = false;

  const chatHistory = document.getElementById('waChatHistory');
  const inputBar = document.getElementById('waInputBar');
  const callOverlay = document.getElementById('whatsappCallOverlay');

  if (callOverlay) callOverlay.classList.add('hidden');
  if (chatHistory) chatHistory.classList.remove('hidden');
  if (inputBar) inputBar.classList.remove('hidden');
}