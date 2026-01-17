const params = new URLSearchParams(window.location.search);

const overlay = document.getElementById("overlay");
const panel   = document.getElementById("panel");
const header  = document.getElementById("header");
const titleEl = document.getElementById("title");
const kickerEl= document.getElementById("kicker");

const single  = document.getElementById("single");
const badgeEl = document.getElementById("badge");
const textEl  = document.getElementById("text");
const microEl = document.getElementById("micro");

function safeDecode(v){
  try { return decodeURIComponent(v); } catch { return v; }
}

function setAccentFromHex(hex){
  const h = (hex || "").trim().replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return false;

  const r = parseInt(h.slice(0,2), 16);
  const g = parseInt(h.slice(2,4), 16);
  const b = parseInt(h.slice(4,6), 16);

  document.documentElement.style.setProperty("--accent-r", String(r));
  document.documentElement.style.setProperty("--accent-g", String(g));
  document.documentElement.style.setProperty("--accent-b", String(b));
  return true;
}

function getItems(){
  const items = [];
  for (let i = 1; i <= 10; i++){
    const raw = params.get(`item${i}`);
    const txt = raw ? safeDecode(raw).trim() : "";
    items.push(txt); // pode ser vazio
  }
  return items;
}

function findNearestFilled(items, startIndex1Based){
  // startIndex1Based: 1..10
  let idx = Math.min(10, Math.max(1, startIndex1Based)) - 1;

  if (items[idx]) return idx;

  // procura para a frente
  for (let i = idx + 1; i < items.length; i++){
    if (items[i]) return i;
  }
  // depois para trás
  for (let i = idx - 1; i >= 0; i--){
    if (items[i]) return i;
  }
  return -1;
}

function applyDock(){
  const dock = (params.get("dock") || "tr").toLowerCase(); // tr|tl|br|bl
  overlay.classList.remove("tl","tr","bl","br");
  overlay.classList.add(dock);
}

function applyTiming(){
  const speed = Math.max(0.4, Math.min(2.0, parseFloat(params.get("speed") || "1")));
  document.documentElement.style.setProperty("--t", `${Math.round(900 / speed)}ms`);
}

function applyHeader(){
  const title  = (params.get("title")  || "").trim();
  const kicker = (params.get("kicker") || "").trim();

  titleEl.textContent  = title  ? safeDecode(title)  : "";
  kickerEl.textContent = kicker ? safeDecode(kicker) : "";

  if (!title && !kicker) header.classList.add("hide");
  else header.classList.remove("hide");
}

let lastShownIndex = null;

function showActive(items){
  let active = parseInt(params.get("active") || "1", 10);
  if (!Number.isFinite(active)) active = 1;

  const idx = findNearestFilled(items, active);

  // se não houver nada preenchido, fallback elegante
  if (idx === -1){
    badgeEl.textContent = "•";
    textEl.textContent = "Sem pontos definidos no URL";
    return;
  }

  // animação de troca (se muda)
  if (lastShownIndex !== null && idx !== lastShownIndex){
    single.classList.add("swap");
    setTimeout(() => {
      badgeEl.textContent = String(idx + 1);
      textEl.textContent  = items[idx];
      single.classList.remove("swap");
    }, 240);
  } else {
    badgeEl.textContent = String(idx + 1);
    textEl.textContent  = items[idx];
  }

  lastShownIndex = idx;

  // micro debug opcional (liga com debug=1)
  const debug = (params.get("debug") || "0").trim() === "1";
  if (debug){
    microEl.style.display = "block";
    microEl.textContent = `active=${active} → a mostrar item${idx+1}`;
  } else {
    microEl.style.display = "none";
  }
}

// Init
applyDock();
applyTiming();
applyHeader();
setAccentFromHex(params.get("accent") || "");

// Render
const items = getItems();

// se não vier nada, mete um fallback para não “ficar vazio”
const hasAny = items.some(Boolean);
if (!hasAny){
  items[0] = "Introdução";
  items[1] = "Manifesto";
  items[2] = "Os Líderes";
  items[3] = "Matrioska";
  items[4] = "O caminho";
}

showActive(items);

// Entrada
requestAnimationFrame(() => panel.classList.add("ready"));
