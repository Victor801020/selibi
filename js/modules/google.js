export function executeMiniSearch() {
  const input = document.getElementById('googleSearchInput');
  const results = document.getElementById('googleSearchResults');
  if (!input || !results) return;
  const query = input.value.trim();
  if (!query) return;

  const encodedQuery = encodeURIComponent(query);
  const googleUrl = `https://www.google.com/search?q=${encodedQuery}`;

  results.innerHTML = `
    <div class="flex flex-col gap-1.5 p-1">
      <div class="text-xs font-extrabold text-blue-600 hover:underline cursor-pointer truncate" onclick="window.open('${googleUrl}', '_blank')">
        ${query} - Pesquisa Google
      </div>
      <div class="text-[10px] text-emerald-700 font-semibold truncate">
        https://www.google.com/search?q=${encodedQuery}
      </div>
      <div class="text-[10px] text-slate-700 leading-snug">
        Mostrando resultados atualizados sobre "<strong>${query}</strong>". Clique abaixo para abrir diretamente na busca oficial do Google.
      </div>
      <a href="${googleUrl}" target="_blank" rel="noopener noreferrer" class="mt-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] rounded text-center shadow transition-all flex items-center justify-center gap-1">
        <i class="fa-solid fa-arrow-up-right-from-square"></i>
        <span>Abrir "${query}" no Google</span>
      </a>
    </div>
  `;
}