const form = document.getElementById("arvore-form");
const arvoreList = document.getElementById("arvores-list");
const table_container = document.getElementById("table-container");
const loading_data = document.getElementById("loading-data")
let arvoreData = [];

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const novaArvore = {
    numero: parseInt(document.getElementById("numero").value, 10),
    vernaculo: document.getElementById("verna").value,
    cientify_name: document.getElementById("nome-cientifico").value,
    height: parseFloat(document.getElementById("altura").value),
    dap: parseFloat(document.getElementById("dap").value),
    phytosanitary_state: document.getElementById("estado-fitossanitario").value,
    structure_state: document.getElementById("condicao-estrutural").value,
    suggested_management: document.getElementById("manejo-sugerido").value,
    coords: { utm: document.getElementById("coordenadas-utm").value },
  };

  arvoreData.push(novaArvore);

  await fetch("https://sptrees.onrender.com/trees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(novaArvore),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Resposta do servidor:", data);
    })
    .catch((err) => {
      console.error("Erro:", err);
    });

  renderizarTabela();

  form.reset();
});

async function renderizarTabela() {
    let loading = true;

    setInterval(() => {
        if (loading) {
        table_container.style.display = "none";
        loading_data.style.display = "block";
        }
    }, 100);

  try {
    const response = await fetch("https://sptrees.onrender.com/trees", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    console.log("Resposta do servidor:", data);

    arvoreList.innerHTML = "";


    if (!data.trees || !Array.isArray(data.trees)) {
      console.error("Nenhuma árvore encontrada ou formato inesperado.");
      return;
    }

    data.trees.forEach((arvore) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${escapeHtml(arvore.numero)}</td>
                <td>${escapeHtml(arvore.vernaculo)}</td>
                <td>${escapeHtml(arvore.cientify_name)}</td>
                <td>${escapeHtml(arvore.height)}</td>
                <td>${escapeHtml(arvore.dap)}</td>
                <td>${escapeHtml(arvore.phytosanitary_state)}</td>
                <td>${escapeHtml(arvore.structure_state)}</td>
                <td>${escapeHtml(arvore.suggested_management ?? "")}</td>
                <td>${escapeHtml(arvore.coords?.utm ?? "")}</td>
            `;
      arvoreList.appendChild(row);
    });
  } catch (err) {
    console.error("Erro ao buscar árvores:", err);
  } finally {
    loading = false;
    clearInterval();
    setTimeout(() => {
      loading_data.style.display = "none";
      table_container.style.display = "block";
    }, 3000)
  }
}
function escapeHtml(text) {
  if (text === undefined || text === null) return "";
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
renderizarTabela();
