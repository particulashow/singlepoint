const params = new URLSearchParams(window.location.search);

const overlay = document.getElementById("overlay");
const panel = document.getElementById("panel");
const header = document.getElementById("header");
const titleEl = document.getElementById("title");
const kickerEl = document.getElementById("kicker");

const single = document.getElementById("single");
const badge = document.getElementById("badge");
const textEl = document.getElementById("text");

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

// Config
const dock = (params.get("dock") || "tr").toLowerCase(); // tr|tl|br|bl
const speed = Math.max(0.4, Math.min(2.0, parseFloat(params.get("speed") || "1")));
const icon = (params.get("icon") ?? "1").toString().trim();
const n = Math.max(1, parseInt(params.get("n") || "1", 10));

const title = (params.get("title") || "").trim();
const kicker = (params.get("kicker") || "").trim();
const text = (params.get("text") || "").trim();

overlay.classList.remove("tl","tr","bl","br");
overlay.classList.add(dock);

document.documentElement.style.setProperty("--t", `${Math.round(900 / speed)}ms`);

setAccentFromHex(params.get("accent") || "");

// Header opcional
titleEl.textContent = title ? safeDecode(title) : "";
kickerEl.textContent = kicker ? safeDecode(kicker) : "";
if (!title && !kicker) header.classList.add("hide");

// Conteúdo
textEl.textContent = text ? safeDecode(text) : "Ponto em destaque";
badge.textContent = String(n);

if (icon === "0") single.classList.add("noicon");

// Entrada
requestAnimationFrame(() => panel.classList.add("ready"));
