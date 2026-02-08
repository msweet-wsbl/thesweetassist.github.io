const $ = (sel) => document.querySelector(sel);

const servicesGrid = $("#servicesGrid");
const hoverBubble = $("#hoverBubble");
const bubbleTitle = $("#bubbleTitle");
const bubblePoints = $("#bubblePoints");
const bubbleBook = $("#bubbleBook");

const workList = $("#workList");
const yearEl = $("#year");

const modal = $("#modal");
const modalClose = $("#modalClose");
const modalText = $("#modalText");
const modalMailto = $("#modalMailto");
const copyTemplateBtn = $("#copyTemplate");
const templateEl = $("#template");

let currentService = null;

yearEl.textContent = new Date().getFullYear();

// ---- Helpers ----
function parseCSV(text) {
  // Simple CSV parser (handles commas; supports quoted fields)
  const lines = text.trim().split(/\r?\n/);
  const headers = splitCSVLine(lines[0]).map(h => h.trim());
  return lines.slice(1).map(line => {
    const cols = splitCSVLine(line);
    const obj = {};
    headers.forEach((h, i) => (obj[h] = (cols[i] ?? "").trim()));
    return obj;
  });
}

function splitCSVLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    const next = line[i + 1];

    if (ch === '"' && inQuotes && next === '"') {
      cur += '"';
      i++;
      continue;
    }
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function bulletsFromString(str) {
  // Accept "a | b | c" or "a; b; c"
  const raw = str.includes("|") ? str.split("|") : str.split(";");
  return raw.map(s => s.trim()).filter(Boolean);
}

function setBubble(service) {
  if (!service) return;
  bubbleTitle.textContent = service.title || "Service";
  bubblePoints.innerHTML = "";

  const items = bulletsFromString(service.bullets || "");
  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = "Details available on request.";
    bubblePoints.appendChild(li);
  } else {
    items.slice(0, 6).forEach(t => {
      const li = document.createElement("li");
      li.textContent = t;
      bubblePoints.appendChild(li);
    });
  }

  bubbleBook.href = "#contact";
}

function openModal(service) {
  currentService = service;

  const title = service?.title ? `Service: ${service.title}` : "Service inquiry";
  $("#modalTitle").textContent = "Book a Sweet Assist";
  modalText.textContent = `You selected: ${service?.title || "a service"} — click Email to book, or copy the template.`;

  const email = ($("#emailLink").getAttribute("href") || "mailto:hello@yourdomain.com").replace("mailto:", "");
  const subject = encodeURIComponent(`Sweet Assist Inquiry — ${title}`);
  const body = encodeURIComponent(
`Hi Sweet,

I’d like help with: ${service?.title || "[service]"}
Goal/outcome: [what success looks like]
Hours needed: [weekly or one-time]
Timezone + best times: [your availability]
Tools you use: [Gmail/Google Calendar/Notion/Sheets/etc.]

Thanks!`
  );

  modalMailto.href = `mailto:${email}?subject=${subject}&body=${body}`;

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

// ---- Navigation buttons (no long scroll; just jump) ----
document.querySelectorAll("[data-jump]").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-jump");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ---- Modal events ----
modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target?.dataset?.close === "true") closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

copyTemplateBtn.addEventListener("click", async () => {
  templateEl.select();
  templateEl.setSelectionRange(0, templateEl.value.length);
  try {
    await navigator.clipboard.writeText(templateEl.value);
    copyTemplateBtn.textContent = "Copied!";
    setTimeout(() => (copyTemplateBtn.textContent = "Copy Message Template"), 1200);
  } catch {
    // fallback
    document.execCommand("copy");
  }
});

// ---- Load CSV data ----
async function loadServices() {
  const res = await fetch("services.csv");
  const text = await res.text();
  const services = parseCSV(text);

  servicesGrid.innerHTML = "";

  services.forEach((svc) => {
    const card = document.createElement("div");
    card.className = "card";
    card.tabIndex = 0;

    const titleRow = document.createElement("div");
    titleRow.className = "card-title";

    const title = document.createElement("span");
    title.textContent = svc.title || "Service";

    const pill = document.createElement("span");
    pill.className = "pill";
    pill.textContent = svc.tag || "Support";

    titleRow.appendChild(title);
    titleRow.appendChild(pill);

    const meta = document.createElement("div");
    meta.className = "card-meta";
    meta.textContent = svc.short || "Hover for details";

    card.appendChild(titleRow);
    card.appendChild(meta);

    // Hover bubble behavior
    card.addEventListener("mouseenter", () => setBubble(svc));
    card.addEventListener("focus", () => setBubble(svc));

    // Click to book
    card.addEventListener("click", () => openModal(svc));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openModal(svc);
    });

    servicesGrid.appendChild(card);
  });

  // Default bubble
  setBubble(services[0] || null);
}

async function loadWork() {
  const res = await fetch("work.csv");
  const text = await res.text();
  const items = parseCSV(text);

  workList.innerHTML = "";
  items.slice(0, 6).forEach((it) => {
    const li = document.createElement("li");
    li.textContent = `${it.highlight || "Highlight"}${it.note ? " — " + it.note : ""}`;
    workList.appendChild(li);
  });
}

loadServices().catch(() => {
  servicesGrid.innerHTML = `<div class="card"><div class="card-title"><span>Couldn’t load services.csv</span></div><div class="card-meta">Make sure the file is in the same folder as index.html.</div></div>`;
});

loadWork().catch(() => {
  workList.innerHTML = `<li>Couldn’t load work.csv — add it in the same folder.</li>`;
});
