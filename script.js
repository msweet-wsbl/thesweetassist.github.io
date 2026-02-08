let currentService = "";

function showBubble(title, items) {
  currentService = title;

  document.getElementById("bubbleTitle").innerText = title;

  const list = document.getElementById("bubbleList");
  list.innerHTML = "";
  items.forEach(i => {
    const li = document.createElement("li");
    li.innerText = i;
    list.appendChild(li);
  });
}

function openModal() {
  document.getElementById("modal").style.display = "flex";
}
function closeModal() {
  document.getElementById("modal").style.display = "none";
}
