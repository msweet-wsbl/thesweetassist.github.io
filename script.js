// Change this to your real email
const OWNER_EMAIL = "hello@thesweetassist.com";

let currentService = "General Inquiry";

/* ========== HOVER BUBBLE ========== */
function showBubble(title, items) {
  currentService = title || "General Inquiry";

  const bubbleTitle = document.getElementById("bubbleTitle");
  const bubbleList = document.getElementById("bubbleList");

  if (bubbleTitle) {
    bubbleTitle.innerText = currentService;
  }

  if (bubbleList) {
    bubbleList.innerHTML = "";
    items.forEach(i => {
      const li = document.createElement("li");
      li.innerText = i;
      bubbleList.appendChild(li);
    });
  }
}

/* ========== MODAL ========== */
function openModal(service) {
  currentService = service || currentService || "General Inquiry";

  const modal = document.getElementById("modal");
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");

  // Pre-select dropdown
  const select = document.getElementById("serviceSelect");
  if (select) {
    select.value = currentService;
  }

  // Focus name input
  const nameInput = document.getElementById("nameInput");
  if (nameInput) {
    setTimeout(() => nameInput.focus(), 50);
  }
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
}

/* Close modal when clicking outside */
document.addEventListener("click", function(e) {
  const modal = document.getElementById("modal");
  if (e.target === modal) {
    closeModal();
  }
});

/* Close modal with ESC */
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    closeModal();
  }
});

/* ========== EMAIL FUNCTION ========== */
function sendBookingEmail(event) {
  event.preventDefault();

  const service = document.getElementById("serviceSelect").value.trim();
  const name = document.getElementById("nameInput").value.trim();
  const email = document.getElementById("emailInput").value.trim();
  const message = document.getElementById("messageInput").value.trim();

  if (!service) {
    alert("Please select a service.");
    return;
  }

  const subject = `${service} Inquiry`;

  const body =
`Hi Sweet,

I'm reaching out about: ${service}

Name: ${name}
Email: ${email}

Message:
${message}

Thanks!`;

  const mailto = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = mailto;
}
