/* =========================================================
   TrendGear Dashboard — script.js
   Fase III: Fetch a Firebase Realtime Database + renderizado
   dinámico en el DOM mediante template literals.
   ========================================================= */

// 1) URL de tu Firebase Realtime Database.
//    Reemplazá esto por la URL real de tu proyecto, con el
//    sufijo ".json" (formato REST que expone Firebase).
//    Ejemplo real: "https://trendgear-xxxxx-default-rtdb.firebaseio.com/clientes.json"
const FIREBASE_URL = "https://stock-flow-b661f-default-rtdb.firebaseio.com/clientes.json";

// Fallback local para poder probar el dashboard sin depender
// todavía de un proyecto de Firebase ya configurado.
const LOCAL_FALLBACK_URL = "data_firebase_seed.json";

let allClients = [];

const tableBody = document.getElementById("clientsTableBody");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");

/* ---------- 1. Fetch de datos ---------- */

async function fetchClients() {
  try {
    const response = await fetch(FIREBASE_URL);
    if (!response.ok) throw new Error(`Firebase respondió ${response.status}`);
    const data = await response.json();
    if (!data) throw new Error("Firebase devolvió datos vacíos");
    return normalizeData(data);
  } catch (firebaseError) {
    console.warn("No se pudo leer Firebase, usando datos locales de respaldo:", firebaseError);
    try {
      const localResponse = await fetch(LOCAL_FALLBACK_URL);
      const localData = await localResponse.json();
      return normalizeData(localData);
    } catch (localError) {
      console.error("Tampoco se pudo cargar el respaldo local:", localError);
      tableBody.innerHTML = `
        <tr class="tg-table__loading-row">
          <td colspan="10">No se pudieron cargar los datos. Revisá la consola y la URL de Firebase.</td>
        </tr>`;
      return [];
    }
  }
}

// Firebase Realtime Database devuelve un objeto { "1001": {...}, "1002": {...} }
// en lugar de un array. Lo convertimos a array para poder usar forEach/filter/map.
function normalizeData(data) {
  return Object.values(data);
}

/* ---------- 2. Lógica de renderizado (forEach + template literals) ---------- */

function renderTable(clients) {
  if (clients.length === 0) {
    tableBody.innerHTML = "";
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  let rowsHtml = "";
  clients.forEach((client) => {
    rowsHtml += buildRowTemplate(client);
  });

  tableBody.innerHTML = rowsHtml;
}

function buildRowTemplate(client) {
  const badgeClass = membershipBadgeClass(client.membership_status);
  const amountFormatted = formatCurrency(client.amount_spent);

  return `
    <tr>
      <td>${client.customer_id}</td>
      <td>${client.name}</td>
      <td>${client.product_purchased}</td>
      <td>${client.purchase_date}</td>
      <td class="tg-amount">${amountFormatted}</td>
      <td>${client.age}</td>
      <td>${client.city}</td>
      <td>${client.payment_method}</td>
      <td>${client.last_login_date}</td>
      <td><span class="tg-badge ${badgeClass}">${client.membership_status}</span></td>
    </tr>
  `;
}

function membershipBadgeClass(status) {
  const normalized = (status || "").toLowerCase();
  if (normalized === "gold") return "tg-badge--gold";
  if (normalized === "silver") return "tg-badge--silver";
  return "tg-badge--bronze";
}

function formatCurrency(amount) {
  const value = Number(amount);
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

/* ---------- 3. KPIs ---------- */

function renderKPIs(clients) {
  const count = clients.length;
  const total = clients.reduce((sum, c) => sum + Number(c.amount_spent), 0);
  const avg = count ? total / count : 0;
  const avgAge = count ? clients.reduce((sum, c) => sum + Number(c.age), 0) / count : 0;

  document.getElementById("kpiCount").textContent = count;
  document.getElementById("kpiTotal").textContent = formatCurrency(total);
  document.getElementById("kpiAvg").textContent = formatCurrency(avg);
  document.getElementById("kpiAge").textContent = avgAge.toFixed(1);
  document.getElementById("footerCount").textContent = count;
}

/* ---------- 4. Búsqueda (nombre o ciudad) ---------- */

searchInput.addEventListener("input", (event) => {
  const term = event.target.value.trim().toLowerCase();
  const filtered = allClients.filter((client) =>
    client.name.toLowerCase().includes(term) ||
    client.city.toLowerCase().includes(term)
  );
  renderTable(filtered);
});

/* ---------- 5. Menú hamburguesa ---------- */

const burgerBtn = document.getElementById("burgerBtn");
const nav = document.getElementById("tgNav");

burgerBtn.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  burgerBtn.classList.toggle("is-open", isOpen);
  burgerBtn.setAttribute("aria-expanded", String(isOpen));
});

// Cierra el menú al elegir una opción (útil en móvil)
document.querySelectorAll(".tg-nav__link").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    burgerBtn.classList.remove("is-open");
    burgerBtn.setAttribute("aria-expanded", "false");
  });
});

/* ---------- 6. Botón "Actualizar datos" ---------- */

document.getElementById("refreshLink").addEventListener("click", async (event) => {
  event.preventDefault();
  tableBody.innerHTML = `<tr class="tg-table__loading-row"><td colspan="10">Actualizando…</td></tr>`;
  await init();
});

/* ---------- 7. Inicialización ---------- */

async function init() {
  allClients = await fetchClients();
  renderKPIs(allClients);
  renderTable(allClients);
}

init();