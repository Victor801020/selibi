let cameraStream = null;
let selectedSenaiSize = 'M';

export function switchSmartphoneApp(appName) {
  const youtubeApp = document.getElementById('appYoutube');
  const cameraApp = document.getElementById('appCamera');
  const mlApp = document.getElementById('appMercadoLivre');
  const mapsApp = document.getElementById('appMaps');

  if (youtubeApp) youtubeApp.classList.add('hidden');
  if (cameraApp) cameraApp.classList.add('hidden');
  if (mlApp) mlApp.classList.add('hidden');
  if (mapsApp) mapsApp.classList.add('hidden');

  stopCameraStream();

  if (appName === 'youtube' && youtubeApp) youtubeApp.classList.remove('hidden');
  if (appName === 'camera' && cameraApp) {
    cameraApp.classList.remove('hidden');
    confirmAndStartCamera();
  }
  if (appName === 'ml' && mlApp) mlApp.classList.remove('hidden');
  if (appName === 'maps' && mapsApp) mapsApp.classList.remove('hidden');
}

export function selectSenaiSize(btn, size) {
  selectedSenaiSize = size;
  const buttons = document.querySelectorAll('.btn-senai-size');
  buttons.forEach(b => {
    b.classList.remove('bg-slate-900', 'text-white');
    b.classList.add('bg-white', 'text-slate-800');
  });
  btn.classList.remove('bg-white', 'text-slate-800');
  btn.classList.add('bg-slate-900', 'text-white');
}

export function buySenaiUniform() {
  const qtyInput = document.getElementById('senaiQtyInput');
  const qty = qtyInput ? qtyInput.value : 1;
  const total = (89.90 * qty).toFixed(2).replace('.', ',');
  alert(`Compra do Uniforme SENAI (Tamanho ${selectedSenaiSize}, Qtd: ${qty}) confirmada!\nValor total: R$ ${total}`);
}

export function searchAndOpenGoogleMaps() {
  const input = document.getElementById('mapsStreetSearchInput');
  if (!input) return;
  const query = input.value.trim();
  if (!query) {
    alert("Digite o nome da rua ou local para procurar!");
    return;
  }

  const encoded = encodeURIComponent(query);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
  
  if (confirm(`Abrir o Google Maps diretamente para "${query}"?`)) {
    window.open(mapsUrl, '_blank');
  }
}

export function confirmAndStartCamera() {
  if (confirm("Deseja ativar a câmera do dispositivo?")) {
    const video = document.getElementById('smartphoneCameraFeed');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          cameraStream = stream;
          if (video) { video.srcObject = stream; video.play(); }
        })
        .catch(() => { alert("Não foi possível acessar a câmera."); });
    } else {
      alert("Navegador sem suporte para câmera.");
    }
  }
}

export function stopCameraStream() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }
}