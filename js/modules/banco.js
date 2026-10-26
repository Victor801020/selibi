let bankBalance = 2450.80;
let isBalanceVisible = true;

export function toggleBalanceVisibility() {
  isBalanceVisible = !isBalanceVisible;
  const display = document.getElementById('bankBalanceDisplay');
  const eyeIcon = document.getElementById('bankEyeIcon');

  if (display && eyeIcon) {
    if (isBalanceVisible) {
      display.textContent = `R$ ${bankBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
      eyeIcon.className = 'fa-solid fa-eye text-white text-sm';
    } else {
      display.textContent = 'R$ ••••••';
      eyeIcon.className = 'fa-solid fa-eye-slash text-white text-sm';
    }
  }
}

export function togglePixForm(mode) {
  const sendForm = document.getElementById('pixInteractiveForm');
  const chargeForm = document.getElementById('pixChargeForm');

  if (mode === 'send') {
    if (chargeForm) chargeForm.classList.add('hidden');
    if (sendForm) sendForm.classList.toggle('hidden');
  } else if (mode === 'charge') {
    if (sendForm) sendForm.classList.add('hidden');
    if (chargeForm) chargeForm.classList.toggle('hidden');
  }
}

export function processPixSubmission() {
  const keyInput = document.getElementById('pixKeyInput');
  const amountInput = document.getElementById('pixAmountInput');
  
  if (!keyInput || !amountInput) return;

  const key = keyInput.value.trim();
  const val = parseFloat(amountInput.value);

  if (!key) {
    alert("Por favor, informe a chave Pix (CPF, celular, e-mail ou aleatória)!");
    return;
  }

  if (isNaN(val) || val <= 0) {
    alert("Por favor, digite um valor válido!");
    return;
  }

  if (val > bankBalance) {
    alert("Saldo insuficiente na conta!");
    return;
  }

  bankBalance -= val;
  isBalanceVisible = false;
  toggleBalanceVisibility();
  
  keyInput.value = '';
  amountInput.value = '';
  togglePixForm('send');

  alert(`Pix de R$ ${val.toFixed(2)} enviado com sucesso para "${key}"!`);
}

export function requestPixCobrança() {
  const phoneInput = document.getElementById('pixChargePhoneInput');
  const amountInput = document.getElementById('pixChargeAmountInput');

  if (!phoneInput || !amountInput) return;

  const phone = phoneInput.value.trim();
  const val = parseFloat(amountInput.value);

  if (!phone) {
    alert("Digite o número de telefone da pessoa para quem deseja enviar a cobrança!");
    return;
  }

  if (isNaN(val) || val <= 0) {
    alert("Informe um valor válido para a cobrança!");
    return;
  }

  phoneInput.value = '';
  amountInput.value = '';
  togglePixForm('charge');

  const notif = document.getElementById('webPixNotification');
  const textElem = document.getElementById('webPixNotifText');
  const subElem = document.getElementById('webPixNotifSub');

  if (notif && textElem && subElem) {
    textElem.textContent = `Cobrança Pix enviada para (${phone})`;
    subElem.textContent = `Notificação enviada! Valor: R$ ${val.toFixed(2).replace('.', ',')}`;

    notif.classList.remove('translate-x-full', 'opacity-0');
    notif.classList.add('translate-x-0', 'opacity-100');

    setTimeout(() => { closeWebPixNotif(); }, 6000);
  }
}

export function closeWebPixNotif() {
  const notif = document.getElementById('webPixNotification');
  if (notif) {
    notif.classList.remove('translate-x-0', 'opacity-100');
    notif.classList.add('translate-x-full', 'opacity-0');
  }
}