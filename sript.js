const params = new URLSearchParams(window.location.search);

const overlay = document.getElementById("overlay");
const panel = document.getElementById("panel");
const header = document.getElementById("header");
const titleEl = document.getElementById("title");
const kickerEl = document.getElementById("kicker");

const single = document.getElementById("single");
const badge = document.getElementById("badge");
const textEl = document.getElementById("text");

// Config
const dock = (params.get("dock") || "tr").toLowerCase(); // tr|tl|br|bl
const speed = Math.max(0.4, Math.min(2.0, parseFloat(params.get("speed") || "1")));
const accentHex = (params.get("accent") || "").trim().replace("#", "");
const icon = (params.get("icon") ?? "1").toString().trim(); // "1" or "0"
const n = Math.max(1, parseInt(params.get("n") || "1", 10));

const title = (params.get("title") || "").trim();
const kicker = (params.get("kicker") || "").trim();
const text = (params.get("text") || "").trim();

// Aplicar dock
overlay.classList.remove("tl","tr","bl","br");
overlay.classList.add(dock);

// Tempos
panel.style.setProperty("--t", `${Math.round(900 / speed)}ms`);

// Cor
if (/^[0-9a-fA-F]{6}$/.test(accentHex)) {
  panel.style.setProperty("--accent", `#${accentHex}`);
}

// Header opcional
titleEl.textContent = title ? decodeURIComponent(title) : "";
kickerEl.textContent = kicker ? decodeURIComponent(kicker) : "";
if (!title && !kicker) header.classList.add("hide");

// Texto
textEl.textContent = text ? decodeURIComponent(text) : "Ponto em destaque";

// Badge (opcional)
badge.textContent = String(n);
if (icon === "0") single.classList.add("noicon");

// Entrada
requestAnimationFrame(() => panel.classList.add("ready"));
