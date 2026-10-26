import { blocksData } from './modules/data.js';
import { 
  switchWAContact, 
  sendWAMessage, 
  startWhatsAppCall, 
  endPhoneCall, 
  toggleMuteCall, 
  toggleSpeakerCall, 
  toggleVideoCall 
} from './modules/whatsapp.js';
import { toggleBalanceVisibility, togglePixForm, processPixSubmission, requestPixCobrança, closeWebPixNotif } from './modules/banco.js';
import { handleTypewriterInput, handleTypewriterKeydown } from './modules/typewriter.js';
import { switchSmartphoneApp, selectSenaiSize, buySenaiUniform, searchAndOpenGoogleMaps, stopCameraStream } from './modules/smartphone.js';
import { executeMiniSearch } from './modules/google.js';

let currentIndex = 0;
let hideTimer = null;
let isLightOnPermanently = false;
const totalCards = blocksData.length;

const stage = document.getElementById('carouselStage');
const bgTimeline = document.getElementById('bgTimeline');
const epochTitle = document.getElementById('epochTitle');
const welcomeScreen = document.getElementById('welcomeScreen');
const btnEnter = document.getElementById('btnEnter');
const btnCloseNotif = document.getElementById('btnCloseWebPixNotif');

// Vinculação de funções ao escopo global (Window)
window.switchWAContact = switchWAContact;
window.sendWAMessage = sendWAMessage;
window.startWhatsAppCall = startWhatsAppCall;
window.endPhoneCall = endPhoneCall;
window.toggleMuteCall = toggleMuteCall;
window.toggleSpeakerCall = toggleSpeakerCall;
window.toggleVideoCall = toggleVideoCall;
window.toggleBalanceVisibility = toggleBalanceVisibility;
window.togglePixForm = togglePixForm;
window.processPixSubmission = processPixSubmission;
window.requestPixCobrança = requestPixCobrança;
window.closeWebPixNotif = closeWebPixNotif;
window.handleTypewriterInput = handleTypewriterInput;
window.handleTypewriterKeydown = handleTypewriterKeydown;
window.switchSmartphoneApp = switchSmartphoneApp;
window.selectSenaiSize = selectSenaiSize;
window.buySenaiUniform = buySenaiUniform;
window.searchAndOpenGoogleMaps = searchAndOpenGoogleMaps;
window.executeMiniSearch = executeMiniSearch;
window.toggleVintageLamp = toggleVintageLamp;

btnEnter.addEventListener('click', () => {
  // Ativa a iluminação e revela o conteúdo da linha do tempo.
  // Sem esta classe, o CSS mantém os cartões e o título invisíveis.
  document.body.classList.add('lamp-on');
  welcomeScreen.style.opacity = '0';
  welcomeScreen.style.pointerEvents = 'none';
  setTimeout(() => {
    welcomeScreen.style.display = 'none';
    welcomeScreen.setAttribute('aria-hidden', 'true');
  }, 700);

  // Garante que os cartões sejam desenhados ao entrar.
  if (stage && stage.children.length === 0) renderCards();
});

if (btnCloseNotif) {
  btnCloseNotif.addEventListener('click', closeWebPixNotif);
}

function toggleVintageLamp() {
  isLightOnPermanently = !isLightOnPermanently;
  if (isLightOnPermanently) {
    document.body.classList.add('lamp-on');
  } else {
    document.body.classList.remove('lamp-on');
  }
}

function renderCards() {
  stage.innerHTML = '';

  blocksData.forEach((block, index) => {
    const card = document.createElement('div');
    
    let cardClasses = `carousel-card ${index === currentIndex ? 'active-card' : ''}`;
    if (block.isWoodStyle) cardClasses += ' wood-theme-card';
    if (block.hasTypewriter) cardClasses += ' typewriter-card';
    if (block.hasSmartphone) cardClasses += ' smartphone-card';
    card.className = cardClasses;

    let switchHTML = block.hasVintageSwitch ? `
      <button onclick="event.stopPropagation(); toggleVintageLamp();" class="btn-vintage-switch" title="Acender / Apagar Luz">
        <i class="fa-solid fa-power-off text-2xl md:text-3xl"></i>
      </button>
    ` : '';

    let typewriterHTML = block.hasTypewriter ? `
      <div class="typewriter-paper-container w-full my-auto" onclick="event.stopPropagation();">
        <div class="typewriter-paper">
          <textarea 
            class="typewriter-input" 
            placeholder="Digite aqui como em 1870..." 
            rows="4"
            oninput="handleTypewriterInput(event);"
            onkeydown="handleTypewriterKeydown(event);"
          ></textarea>
        </div>
      </div>
    ` : '';

    let whatsAppHTML = block.hasWhatsAppCalls ? `
      <div class="whatsapp-calls-container w-full h-full my-auto flex flex-col justify-between p-3.5 bg-[#0b141a] text-white rounded-2xl border border-emerald-500/30 shadow-2xl relative overflow-hidden" onclick="event.stopPropagation();">
        <!-- Topo do Chat -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
          <div class="flex items-center gap-2">
            <div class="relative">
              <div class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                <i class="fa-solid fa-user"></i>
              </div>
              <span class="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute bottom-0 right-0 border border-[#0b141a]"></span>
            </div>
            <div class="flex flex-col">
              <span id="waContactName" class="text-xs font-black text-slate-100 leading-none">Cristiano Ronaldo</span>
              <span class="text-[9px] text-emerald-400 font-bold">Online</span>
            </div>
          </div>
          
          <div class="flex gap-1">
            <button onclick="switchWAContact('cr7')" class="px-2 py-1 bg-emerald-800 hover:bg-emerald-700 text-[10px] font-black rounded text-white transition-all">CR7</button>
            <button onclick="switchWAContact('shakira')" class="px-2 py-1 bg-emerald-800 hover:bg-emerald-700 text-[10px] font-black rounded text-white transition-all">Shakira</button>
          </div>
        </div>

        <!-- Histórico de Mensagens -->
        <div id="waChatHistory" class="flex-1 flex flex-col gap-1 overflow-y-auto p-1 bg-[#0b141a]/90 rounded-lg my-2">
          <div class="bg-[#202c33] self-start p-2 rounded-lg text-xs text-slate-200 max-w-[85%] shadow">
            👋 Envie uma mensagem ou inicie uma chamada!
          </div>
        </div>

        <!-- TELA DE LIGAÇÃO COM BOTÕES MUDO, VÍDEO E ALTO-FALANTE -->
        <div id="whatsappCallOverlay" class="hidden flex-1 flex flex-col items-center justify-between bg-[#0b141a] text-white rounded-xl border border-emerald-500/30 p-4 text-center my-1 shadow-2xl">
          <div class="flex flex-col items-center mt-2">
            <div id="whatsappAvatarContainer" class="w-16 h-16 rounded-full bg-slate-800 border-2 border-emerald-500/50 flex items-center justify-center mb-2 shadow-lg overflow-hidden">
              <i class="fa-solid fa-user text-emerald-400 text-3xl"></i>
            </div>
            <div id="whatsappContactName" class="text-base font-bold text-slate-100"></div>
            <div id="whatsappCallStatus" class="text-xs text-emerald-400 font-bold mt-0.5">Chamando...</div>
          </div>

          <div id="whatsappSpeechText" class="text-xs italic text-amber-200 font-serif min-h-[36px] px-2 leading-relaxed"></div>

          <div class="flex items-center justify-center gap-3 w-full border-t border-slate-800/80 pt-3">
            <button id="btnSpeakerCall" onclick="toggleSpeakerCall()" class="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center shadow transition-all" title="Alto-falante">
              <i class="fa-solid fa-volume-high text-xs"></i>
            </button>

            <button id="btnVideoCall" onclick="toggleVideoCall()" class="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center shadow transition-all" title="Alternar Vídeo">
              <i class="fa-solid fa-video text-xs"></i>
            </button>

            <button id="btnMuteCall" onclick="toggleMuteCall()" class="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center shadow transition-all" title="Silenciar Microfone">
              <i class="fa-solid fa-microphone-slash text-xs"></i>
            </button>

            <button onclick="endPhoneCall()" class="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition-all active:scale-95" title="Encerrar Chamada">
              <i class="fa-solid fa-phone-slash text-xs"></i>
            </button>
          </div>
        </div>

        <!-- Barra de Input -->
        <div id="waInputBar" class="flex gap-1.5 pt-1.5 border-t border-slate-800 shrink-0">
          <input 
            id="waInputMessage" 
            type="text" 
            placeholder="Digite uma mensagem..." 
            class="w-full px-3 py-2 text-xs bg-[#2a3942] text-white rounded-lg outline-none focus:ring-1 focus:ring-emerald-500 font-medium placeholder-slate-400"
            onkeydown="if(event.key==='Enter') sendWAMessage();"
          >
          <button onclick="sendWAMessage();" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black shadow transition-all shrink-0">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
          <button onclick="startWhatsAppCall()" class="px-3 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-black shadow transition-all shrink-0" title="Ligação de Voz">
            <i class="fa-solid fa-phone"></i>
          </button>
        </div>
      </div>
    ` : '';

    let googleSearchHTML = block.hasGoogleSearch ? `
      <div class="google-search-container w-full my-auto flex flex-col gap-2 p-3 bg-slate-100 rounded-xl border border-slate-300 shadow-lg" onclick="event.stopPropagation();">
        <div class="flex items-center justify-center gap-1 text-xl font-black">
          <span class="text-blue-500">G</span><span class="text-red-500">o</span><span class="text-yellow-500">o</span><span class="text-blue-500">g</span><span class="text-green-500">l</span><span class="text-red-500">e</span>
        </div>
        <div class="flex gap-1.5">
          <input 
            id="googleSearchInput" 
            type="text" 
            placeholder="Pesquisar algo no Google..." 
            class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-blue-500 bg-white shadow-inner font-medium"
            onkeydown="if(event.key==='Enter') executeMiniSearch();"
          >
          <button onclick="executeMiniSearch();" class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
        <div id="googleSearchResults" class="bg-white p-2.5 rounded-lg border border-slate-200 min-h-[60px] flex flex-col justify-center shadow-inner">
          <span class="text-xs text-slate-400 italic text-center">Digite algo acima para pesquisar...</span>
        </div>
      </div>
    ` : '';

    let smartphoneHTML = block.hasSmartphone ? `
      <div class="smartphone-frame w-full h-full flex flex-col justify-between bg-black text-white p-3 rounded-2xl border border-slate-700 shadow-2xl relative overflow-hidden" onclick="event.stopPropagation();">
        <div class="flex items-center justify-between text-[10px] font-bold text-slate-300 px-1 pt-0.5 pb-0.5 border-b border-slate-800">
          <span>09:41</span>
          <div class="w-8 h-1 bg-slate-800 rounded-full"></div>
          <div class="flex items-center gap-1">
            <i class="fa-solid fa-wifi text-[9px]"></i>
            <i class="fa-solid fa-battery-full text-[9px]"></i>
          </div>
        </div>

        <div class="flex-1 my-1.5 relative overflow-hidden rounded-xl bg-slate-950 flex flex-col justify-center">
          <div id="appYoutube" class="w-full h-full flex flex-col justify-center items-center p-2 bg-zinc-900">
            <div class="flex items-center gap-1.5 mb-2 text-red-500 font-black text-sm">
              <i class="fa-brands fa-youtube text-lg"></i>
              <span class="text-white font-bold">YouTube</span>
            </div>
            <a href="${block.youtubeUrl}" data-mini-video="1" data-video-title="${block.periodo}" onclick="event.preventDefault(); event.stopPropagation();" class="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow transition-all">
              <i class="fa-solid fa-play text-xs"></i>
              <span>Abrir Vídeo</span>
            </a>
          </div>

          <div id="appCamera" class="hidden w-full h-full flex flex-col justify-center items-center bg-black">
            <video id="smartphoneCameraFeed" class="w-full h-36 bg-zinc-900 rounded-lg object-cover" autoplay playsinline muted></video>
          </div>

          <div id="appMercadoLivre" class="hidden w-full h-full p-2.5 bg-yellow-400 text-slate-900 flex flex-col justify-between rounded-xl overflow-y-auto">
            <div class="flex items-center justify-between font-black text-xs uppercase border-b border-slate-900/20 pb-1">
              <span class="flex items-center gap-1"><i class="fa-solid fa-bag-shopping"></i> Mercado Livre</span>
              <span class="text-[9px] bg-slate-900 text-yellow-400 px-1.5 py-0.5 rounded-full font-bold">SENAI</span>
            </div>

            <div class="bg-white p-2.5 rounded-xl shadow-lg flex flex-col gap-2 my-1">
              <div class="text-xs font-black text-slate-800 leading-snug">
                Camiseta Uniforme SENAI Oficial
              </div>
              <div class="text-sm font-black text-emerald-600">
                R$ 89,90 <span class="text-[9px] text-slate-400 font-normal">em 3x sem juros</span>
              </div>

              <div class="flex flex-col gap-1">
                <span class="text-[9px] font-bold text-slate-600 uppercase">Tamanho:</span>
                <div class="flex gap-1.5">
                  <button onclick="selectSenaiSize(this, 'P')" class="btn-senai-size flex-1 py-1 border border-slate-300 rounded-md text-xs font-black bg-white text-slate-800 hover:bg-slate-100">P</button>
                  <button onclick="selectSenaiSize(this, 'M')" class="btn-senai-size flex-1 py-1 border border-slate-300 rounded-md text-xs font-black bg-slate-900 text-white">M</button>
                  <button onclick="selectSenaiSize(this, 'G')" class="btn-senai-size flex-1 py-1 border border-slate-300 rounded-md text-xs font-black bg-white text-slate-800 hover:bg-slate-100">G</button>
                  <button onclick="selectSenaiSize(this, 'GG')" class="btn-senai-size flex-1 py-1 border border-slate-300 rounded-md text-xs font-black bg-white text-slate-800 hover:bg-slate-100">GG</button>
                </div>
              </div>

              <div class="flex items-center justify-between gap-1 mt-0.5">
                <span class="text-[9px] font-bold text-slate-600 uppercase">Quantidade:</span>
                <input id="senaiQtyInput" type="number" min="1" max="10" value="1" class="w-12 px-1.5 py-0.5 text-xs font-bold border border-slate-300 rounded-md text-center">
              </div>
            </div>

            <button onclick="buySenaiUniform()" class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-lg shadow-md uppercase tracking-wider transition-all">
              Comprar Agora
            </button>
          </div>

          <div id="appMaps" class="hidden w-full h-full p-2.5 bg-slate-900 text-white flex flex-col justify-between rounded-xl">
            <div class="flex items-center gap-1 font-black text-xs text-emerald-400 uppercase">
              <i class="fa-solid fa-map-location-dot"></i> Google Maps
            </div>

            <div class="bg-slate-800 p-2.5 rounded-xl border border-slate-700 flex flex-col gap-2 my-1">
              <label class="text-[9px] font-bold text-slate-300 uppercase">Digite a rua ou local:</label>
              <input 
                id="mapsStreetSearchInput" 
                type="text" 
                placeholder="Ex: Av. Paulista, SP" 
                class="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-600 rounded-lg text-white outline-none focus:border-emerald-400 font-medium"
                onkeydown="if(event.key==='Enter') searchAndOpenGoogleMaps();"
              >
            </div>

            <button onclick="searchAndOpenGoogleMaps()" class="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-lg shadow uppercase tracking-wider transition-all flex items-center justify-center gap-1.5">
              <i class="fa-solid fa-magnifying-glass text-xs"></i>
              <span>Procurar no Maps</span>
            </button>
          </div>
        </div>

        <div class="flex justify-around items-center pt-1.5 border-t border-slate-800 bg-slate-900/80 rounded-b-xl">
          <button onclick="switchSmartphoneApp('youtube');" class="text-red-500 hover:scale-110 transition-transform"><i class="fa-brands fa-youtube text-sm"></i></button>
          <button onclick="switchSmartphoneApp('camera');" class="text-blue-400 hover:scale-110 transition-transform"><i class="fa-solid fa-camera text-sm"></i></button>
          <button onclick="switchSmartphoneApp('ml');" class="text-yellow-400 hover:scale-110 transition-transform"><i class="fa-solid fa-cart-shopping text-sm"></i></button>
          <button onclick="switchSmartphoneApp('maps');" class="text-emerald-400 hover:scale-110 transition-transform"><i class="fa-solid fa-map-location-dot text-sm"></i></button>
        </div>
      </div>
    ` : '';

    let onlineBankHTML = block.hasOnlineBank ? `
      <div class="nubank-container w-full my-auto flex flex-col gap-3 p-5 bg-[#8A19D6] text-white rounded-2xl shadow-2xl border border-purple-300/30" onclick="event.stopPropagation();">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shadow-md">
              <i class="fa-solid fa-user text-base text-white"></i>
            </div>
            <span class="text-base font-extrabold tracking-tight">Olá, Usuário</span>
          </div>
          <button onclick="toggleBalanceVisibility();" class="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
            <i id="bankEyeIcon" class="fa-solid fa-eye text-white text-base"></i>
          </button>
        </div>

        <div class="bg-white text-slate-900 p-3.5 rounded-xl shadow-lg">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs font-black text-slate-400 uppercase tracking-wider">Conta Corrente</span>
            <i class="fa-solid fa-chevron-right text-xs text-slate-400"></i>
          </div>
          <span id="bankBalanceDisplay" class="text-2xl font-black tracking-tight text-slate-900 block">
            R$ 2.450,80
          </span>
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex gap-2">
            <button onclick="togglePixForm('send');" class="flex-1 py-2 px-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95">
              <i class="fa-solid fa-paper-plane text-xs"></i>
              <span>Enviar Pix</span>
            </button>
            <button onclick="togglePixForm('charge');" class="flex-1 py-2 px-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95">
              <i class="fa-solid fa-hand-holding-dollar text-xs"></i>
              <span>Cobrar Pix</span>
            </button>
          </div>

          <div id="pixInteractiveForm" class="hidden p-3 bg-black/40 rounded-xl border border-white/20 flex flex-col gap-2 transition-all">
            <span class="text-[10px] font-black uppercase text-purple-300">Enviar Pix</span>
            <input id="pixKeyInput" type="text" placeholder="Chave Pix (CPF, e-mail, tel)" class="w-full px-3 py-2 text-xs bg-white text-slate-900 rounded-lg font-semibold outline-none">
            <div class="flex gap-2">
              <input id="pixAmountInput" type="number" step="0.01" placeholder="Valor R$" class="w-1/2 px-3 py-2 text-xs bg-white text-slate-900 rounded-lg font-semibold outline-none">
              <button onclick="processPixSubmission();" class="w-1/2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-lg shadow-md transition-all active:scale-95 py-2">Confirmar</button>
            </div>
          </div>

          <div id="pixChargeForm" class="hidden p-3 bg-black/40 rounded-xl border border-white/20 flex flex-col gap-2 transition-all">
            <span class="text-[10px] font-black uppercase text-purple-300">Cobrar Pix por Notificação</span>
            <input id="pixChargePhoneInput" type="text" placeholder="Telefone da pessoa" class="w-full px-3 py-2 text-xs bg-white text-slate-900 rounded-lg font-semibold outline-none">
            <div class="flex gap-2">
              <input id="pixChargeAmountInput" type="number" step="0.01" placeholder="Valor R$" class="w-1/2 px-3 py-2 text-xs bg-white text-slate-900 rounded-lg font-semibold outline-none">
              <button onclick="requestPixCobrança();" class="w-1/2 bg-purple-500 hover:bg-purple-600 text-white text-xs font-black rounded-lg shadow-md transition-all active:scale-95 py-2">Enviar Notificação</button>
            </div>
          </div>
        </div>
      </div>
    ` : '';

    let aiSymbolsHTML = block.hasAiSymbols ? `
      <div class="ai-symbols-container w-full my-auto flex flex-col gap-2.5 p-3.5 bg-slate-900 rounded-xl border border-slate-700 shadow-xl" onclick="event.stopPropagation();">
        <div class="text-xs font-extrabold text-cyan-400 uppercase tracking-wider text-center mb-0.5">Plataformas Principais</div>
        <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-2 bg-[#10a37f]/10 border border-[#10a37f]/40 hover:border-[#10a37f] rounded-lg transition-all group">
          <div class="w-8 h-8 rounded-lg bg-[#10a37f] flex items-center justify-center p-1.5 shadow shrink-0">
            <svg class="w-full h-full fill-white" viewBox="0 0 24 24"><path d="M22.28 10.15a5.98 5.98 0 0 0-.52-4.81 6.05 6.05 0 0 0-6.54-2.83A6.02 6.02 0 0 0 10.8 1A6.05 6.05 0 0 0 5 4.88a6.02 6.02 0 0 0-4.1 3.1 6.05 6.05 0 0 0 .88 7.1 5.98 5.98 0 0 0 .52 4.81 6.05 6.05 0 0 0 6.54 2.83A6.02 6.02 0 0 0 13.2 23a6.05 6.05 0 0 0 5.8-3.88 6.02 6.02 0 0 0 4.1-3.1 6.05 6.05 0 0 0-.82-5.87zM13.2 21.5a4.49 4.49 0 0 1-2.83-1l.15-.08 4.7-2.71a.76.76 0 0 0 .38-.66v-6.6l1.98 1.15a.07.07 0 0 1 .04.05v5.38a4.52 4.52 0 0 1-4.42 4.47zM3.88 17.8a4.5 4.5 0 0 1-.54-2.98l.15.09 4.7 2.71a.76.76 0 0 0 .76 0l5.72-3.3v2.3a.08.08 0 0 1-.03.06l-4.66 2.69a4.52 4.52 0 0 1-6.1-1.57zm-1.38-9.4A4.5 4.5 0 0 1 4.8 6.1l-.01.17v5.42a.76.76 0 0 0 .38.66l5.72 3.3-1.98 1.15a.08.08 0 0 1-.07 0L4.18 14.1a4.52 4.52 0 0 1-1.68-5.7zm15.17-2.31 1.98 1.15a.08.08 0 0 1 .04.05v5.42a4.5 4.5 0 0 1-6.72 3.9l-.15-.09-4.7-2.71a.76.76 0 0 0-.76 0l-5.72 3.3V11.2a.08.08 0 0 1 .03-.06l4.66-2.69a4.5 4.5 0 0 1 6.2 1.45l5.22 3.01zM10.8 2.5a4.49 4.49 0 0 1 2.83 1l-.15.08-4.7 2.71a.76.76 0 0 0-.38.66v6.6l-1.98-1.15a.07.07 0 0 1-.04-.05V7.02a4.52 4.52 0 0 1 4.42-4.52zm8.13 4.88a4.5 4.5 0 0 1 .54 2.98l-.15-.09-4.7-2.71a.76.76 0 0 0-.76 0l-5.72 3.3v-2.3a.08.08 0 0 1 .03-.06l4.66-2.69a4.52 4.52 0 0 1 6.1 1.57z"/></svg>
          </div>
          <div class="flex flex-col">
            <span class="text-xs font-black text-white leading-none">ChatGPT</span>
            <span class="text-[9px] text-slate-400">OpenAI</span>
          </div>
        </a>
        <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-2 bg-blue-950/60 border border-blue-500/40 hover:border-blue-400 rounded-lg transition-all group">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center p-1.5 shadow shrink-0">
            <svg class="w-full h-full fill-white" viewBox="0 0 24 24"><path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z"/></svg>
          </div>
          <div class="flex flex-col">
            <span class="text-xs font-black text-white leading-none">Gemini</span>
            <span class="text-[9px] text-slate-400">Google</span>
          </div>
        </a>
        <a href="https://www.meta.ai" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-2 bg-sky-950/60 border border-sky-500/40 hover:border-sky-400 rounded-lg transition-all group">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center p-1.5 shadow shrink-0">
            <svg class="w-full h-full fill-white" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 16a6 6 0 1 1 6-6 6 6 0 0 1-6 6z"/></svg>
          </div>
          <div class="flex flex-col">
            <span class="text-xs font-black text-white leading-none">Meta AI</span>
            <span class="text-[9px] text-slate-400">Meta</span>
          </div>
        </a>
      </div>
    ` : '';

    let defaultVideoLinkHTML = !block.hasSmartphone ? `
      <a href="${block.youtubeUrl}" data-mini-video="1" data-video-title="${block.periodo}" onclick="event.preventDefault(); event.stopPropagation();" class="btn-video-link">
        <i class="fa-brands fa-youtube text-xl text-red-500"></i>
        <span>Assistir Vídeo</span>
      </a>
    ` : '';

    card.innerHTML = `
      <div class="card-inner-text text-center mb-1">
        <span class="text-xs font-black uppercase tracking-widest opacity-80 block">Época ${block.num}</span>
        <span class="text-sm font-bold opacity-90 block">${block.periodo}</span>
      </div>
      ${switchHTML}
      ${typewriterHTML}
      ${whatsAppHTML}
      ${googleSearchHTML}
      ${smartphoneHTML}
      ${onlineBankHTML}
      ${aiSymbolsHTML}
      ${defaultVideoLinkHTML}
    `;

    card.addEventListener('click', () => {
      if (currentIndex !== index) {
        currentIndex = index;
        updateCarousel();
      }
    });

    stage.appendChild(card);
  });

  updateCarousel();
}

function updateCarousel() {
  endPhoneCall();
  stopCameraStream();
  const cards = document.querySelectorAll('.carousel-card');

  if (blocksData[currentIndex]) {
    epochTitle.textContent = blocksData[currentIndex].title;
    if (blocksData[currentIndex].imagem) {
      bgTimeline.style.backgroundImage = `url('${blocksData[currentIndex].imagem}')`;
    }
    bgTimeline.style.backgroundPosition = blocksData[currentIndex].bgPosition || "center center";
  }

  if (isLightOnPermanently) {
    document.body.classList.add('lamp-on');
  }

  cards.forEach((card, i) => {
    card.classList.remove('hide-side-card');

    let offset = i - currentIndex;
    const isMobile = window.innerWidth < 640;
    
    const translateX = offset * (isMobile ? 200 : 315);
    const translateZ = -Math.abs(offset) * (isMobile ? 150 : 225);
    const rotateY = -offset * (isMobile ? 12 : 18);
    const opacity = Math.max(0.3, 1 - Math.abs(offset) * 0.25);
    const scale = 1 - Math.abs(offset) * 0.05;

    card.style.transform = `
      translateX(${translateX}px) 
      translateZ(${translateZ}px) 
      rotateY(${rotateY}deg) 
      scale(${scale})
    `;
    card.style.opacity = opacity;
    card.style.zIndex = 100 - Math.abs(offset) * 10;

    if (i === currentIndex) {
      card.classList.add('active-card');
    } else {
      card.classList.remove('active-card');
    }
  });

  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    cards.forEach((card, i) => {
      if (i !== currentIndex) {
        card.classList.add('hide-side-card');
      }
    });
  }, 500);
}

document.addEventListener('keydown', (e) => {
  if (document.activeElement && (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT')) return;

  if (e.key === 'ArrowRight') {
    currentIndex = (currentIndex < totalCards - 1) ? currentIndex + 1 : 0;
    updateCarousel();
  } else if (e.key === 'ArrowLeft') {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalCards - 1;
    updateCarousel();
  }
});

let startX = 0;
let isDragging = false;

stage.addEventListener('mousedown', (e) => { startX = e.clientX; isDragging = true; });
stage.addEventListener('mouseup', (e) => {
  if (!isDragging) return;
  if (Math.abs(startX - e.clientX) > 40) {
    currentIndex = (startX - e.clientX > 0) ? (currentIndex + 1) % totalCards : (currentIndex - 1 + totalCards) % totalCards;
    updateCarousel();
  }
  isDragging = false;
});

stage.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; isDragging = true; });
stage.addEventListener('touchend', (e) => {
  if (!isDragging) return;
  let touchX = e.changedTouches[0].clientX;
  if (Math.abs(startX - touchX) > 40) {
    currentIndex = (startX - touchX > 0) ? (currentIndex + 1) % totalCards : (currentIndex - 1 + totalCards) % totalCards;
    updateCarousel();
  }
  isDragging = false;
});

window.addEventListener('resize', updateCarousel);
window.onload = renderCards;

// Mini player interno: abre vídeos sem abandonar a linha do tempo.
(function setupTimelineMiniVideo() {
  function getYouTubeId(rawUrl) {
    try {
      const url = new URL(rawUrl, window.location.href);
      if (url.hostname.includes('youtu.be')) return url.pathname.split('/').filter(Boolean)[0] || '';
      if (url.searchParams.get('v')) return url.searchParams.get('v');
      const parts = url.pathname.split('/').filter(Boolean);
      const marker = parts.findIndex(part => ['embed', 'shorts', 'live', 'v'].includes(part));
      return marker >= 0 ? (parts[marker + 1] || '') : '';
    } catch (_) { return ''; }
  }

  function openTimelineMiniVideo(link) {
    const id = getYouTubeId(link.href);
    if (!id) { window.alert('Não foi possível identificar este vídeo do YouTube.'); return; }
    const overlay = document.getElementById('timelineMiniVideo');
    const frame = document.getElementById('timelineMiniVideoFrame');
    const title = document.getElementById('timelineMiniVideoTitle');
    if (!overlay || !frame || !title) return;
    title.textContent = link.dataset.videoTitle || 'Vídeo da linha do tempo';
    frame.src = 'https://www.youtube.com/embed/' + encodeURIComponent(id) + '?autoplay=1&playsinline=1&rel=0';
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
  }

  document.addEventListener('click', function(event) {
    const link = event.target.closest && event.target.closest('a[data-mini-video]');
    if (!link) return;
    event.preventDefault();
    event.stopPropagation();
    openTimelineMiniVideo(link);
  }, true);

  function closeTimelineMiniVideo() {
    const overlay = document.getElementById('timelineMiniVideo');
    const frame = document.getElementById('timelineMiniVideoFrame');
    if (frame) frame.src = 'about:blank';
    if (overlay) { overlay.hidden = true; overlay.setAttribute('aria-hidden', 'true'); }
  }
  document.addEventListener('click', function(event) {
    if (event.target.closest && event.target.closest('[data-close-mini-video]')) closeTimelineMiniVideo();
  });
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') closeTimelineMiniVideo();
  });

  // Permite mover a janela pela barra de título, inclusive com mouse.
  document.addEventListener('DOMContentLoaded', function() {
    const win = document.getElementById('timelineMiniVideoWindow');
    const bar = document.getElementById('timelineMiniVideoBar');
    if (!win || !bar) return;
    let dragging = false, startX = 0, startY = 0, left = 0, top = 0;
    bar.addEventListener('pointerdown', function(event) {
      if (event.target.closest('[data-close-mini-video]')) return;
      dragging = true;
      const rect = win.getBoundingClientRect();
      left = rect.left; top = rect.top; startX = event.clientX; startY = event.clientY;
      win.style.position = 'fixed'; win.style.left = left + 'px'; win.style.top = top + 'px';
      win.style.right = 'auto'; win.style.bottom = 'auto';
      bar.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    bar.addEventListener('pointermove', function(event) {
      if (!dragging) return;
      const maxLeft = Math.max(0, window.innerWidth - win.offsetWidth);
      const maxTop = Math.max(0, window.innerHeight - 90);
      win.style.left = Math.min(maxLeft, Math.max(0, left + event.clientX - startX)) + 'px';
      win.style.top = Math.min(maxTop, Math.max(0, top + event.clientY - startY)) + 'px';
    });
    const stop = () => { dragging = false; };
    bar.addEventListener('pointerup', stop); bar.addEventListener('pointercancel', stop);
  });
})();
