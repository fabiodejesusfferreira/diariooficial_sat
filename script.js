let todosOsDiarios = [];

document.addEventListener("DOMContentLoaded", () => {
  inicializar();
  const form = document.getElementById("search-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    aplicarFiltros();
  });
  const resetButton = document.getElementById("btn-reset");
  resetButton.addEventListener("click", () => {
    form.reset();
    renderizarListaDiarios(todosOsDiarios);
  });
});

async function inicializar() {
  // ... (código de busca de dados permanece o mesmo) ...
  const listaContainer = document.getElementById("listaDosDiarios");
  listaContainer.innerHTML = "<p>Carregando diários...</p>";
  const GITHUB_API_URL =
    "https://api.github.com/repos/fabiodejesusfferreira/diariooficial_sat/contents/src/api/src/database/diarioDatabase.ts";
  try {
    const response = await fetch(GITHUB_API_URL);
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados: ${response.statusText}`);
    }
    const fileData = await response.json();
    const conteudoDecodificado = atob(fileData.content);
    const stringJson = conteudoDecodificado
      .replace("export const database =", "")
      .replace(/;$/, "")
      .trim();
    todosOsDiarios = JSON.parse(stringJson);
    renderizarListaDiarios(todosOsDiarios);
  } catch (error) {
    listaContainer.innerHTML =
      '<p style="color: red;">Falha ao carregar os diários do GitHub.</p>';
    console.error("Erro ao inicializar:", error);
  }
}

function aplicarFiltros() {
  // ... (código da função de filtro permanece o mesmo) ...
  const palavraChave = document.getElementById("keyword").value.toLowerCase();
  const dataInicio = document.getElementById("start-date").value;
  const dataFim = document.getElementById("end-date").value;
  const numeroDiario = document.getElementById("diary-number").value;
  const diariosFiltrados = todosOsDiarios.filter((diario) => {
    if (numeroDiario && diario.id.toString() !== numeroDiario) {
      return false;
    }
    if (palavraChave) {
      const tagEncontrada = diario.tags.some((tag) =>
        tag.toLowerCase().includes(palavraChave)
      );
      if (!tagEncontrada) {
        return false;
      }
    }
    const dataDiario = new Date(diario.date);
    dataDiario.setHours(0, 0, 0, 0);
    if (dataInicio) {
      const inicio = new Date(dataInicio);
      if (dataDiario < inicio) {
        return false;
      }
    }
    if (dataFim) {
      const fim = new Date(dataFim);
      if (dataDiario > fim) {
        return false;
      }
    }
    return true;
  });
  renderizarListaDiarios(diariosFiltrados);
}

/**
 * Renderiza (desenha) a lista de diários na página.
 * @param {Array} diarios - A lista de diários a ser exibida.
 */
function renderizarListaDiarios(diarios) {
  const listaContainer = document.getElementById("listaDosDiarios");
  listaContainer.innerHTML = "";

  if (diarios.length === 0) {
    listaContainer.innerHTML = `<div id="noResultContainer">
        <img width="100" src="assets/sem-conteudo.png" alt="sem conteudo">
        <p id="noResultText">Nenhum resultado</p>
      </div>`;
    return;
  }

  diarios.forEach((diario) => {
    const itemLi = document.createElement("li");
    itemLi.className = "itemDiario";

    const dataPublicacao = new Date(diario.date).toLocaleDateString("pt-BR");
    const titulo = `Diário Nº ${diario.id}, ${new Date(
      diario.date
    ).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })}`;

    // --- INÍCIO DA MUDANÇA ---
    // 1. Cria o HTML para as tags
    // Usamos .map() para transformar cada string de tag em um <span> estilizado
    // e .join('') para juntar tudo em uma única string de HTML.
    const tagsHtml = diario.tags
      .map((tag) => `<span class="tag-box">${tag}</span>`)
      .join(" ");
    // --- FIM DA MUDANÇA ---

    itemLi.innerHTML = `
            <h2>
                ${titulo}
                ${tagsHtml}
            </h2>
            <p class="itemData">Data de publicação: ${dataPublicacao}</p>
            <div class="downloadContainer">
                <div>
                    <a href="${diario.pdf || "#"}" target="_blank">
                        <img style="width: 18px; padding: 0px;" src="assets/pdfIcon.png" alt="ícone do PDF"> Baixar arquivo
                    </a>
                    <a target="_blank" href="${diario.pdf || "#"}">
                        <img style="width: 14px; padding: 0px;" src="assets/link.png" alt="link">
                    </a>
                </div>
                <p class="itemTamanho">${diario.size || "N/A"}</p>
            </div>
        `;
    listaContainer.appendChild(itemLi);
  });
}
