const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hint = document.getElementById("hint");

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function moveNoButton() {
  const container = document.getElementById("card");
  const padding = 12;

  // Make positioning relative to the card
  container.style.position = "relative";
  noBtn.style.position = "absolute";

  const cRect = container.getBoundingClientRect();
  const bRect = noBtn.getBoundingClientRect();

  // --- Movement zone (smaller than the card) ---
  // Adjust these to taste:
  const zoneWidthRatio = 0.60;  // 60% of card width
  const zoneHeightRatio = 0.35; // 35% of card height

  const zoneW = cRect.width * zoneWidthRatio;
  const zoneH = cRect.height * zoneHeightRatio;

  // Place the zone roughly around where the buttons are (centered)
  const zoneLeft = (cRect.width - zoneW) / 2;
  const zoneTop  = (cRect.height * 0.45); // move zone down/up (0.35-0.55 works well)

  // Clamp zone so it stays inside the card
  const safeZoneLeft = Math.max(padding, Math.min(zoneLeft, cRect.width - zoneW - padding));
  const safeZoneTop  = Math.max(padding, Math.min(zoneTop,  cRect.height - zoneH - padding));

  // Compute max positions inside the zone
  const maxX = safeZoneLeft + zoneW - bRect.width - padding;
  const maxY = safeZoneTop  + zoneH - bRect.height - padding;

  const x = rand(safeZoneLeft + padding, Math.max(safeZoneLeft + padding, maxX));
  const y = rand(safeZoneTop + padding,  Math.max(safeZoneTop + padding,  maxY));

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;

  hint.textContent = "😛💩🤡";
}


///   hint.textContent = "😛💩🤡";

function confettiBurst(count = 120) {
  for (let i = 0; i < count; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = `${rand(0, 100)}vw`;
    c.style.animationDelay = `${rand(0, 300)}ms`;
    c.style.background = `hsl(${Math.floor(rand(0, 360))} 90% 60%)`;
    c.style.transform = `rotate(${rand(0, 360)}deg)`;
    c.style.width = `${rand(6, 12)}px`;
    c.style.height = `${rand(8, 16)}px`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 1600);
  }
}

yesBtn.addEventListener("click", () => {
  confettiBurst();
  document.getElementById("card").innerHTML = `
    <div class="emoji" aria-hidden="true">🥰</div>
    <h1>YAYYYYY!!!</h1>
    <p class="sub">See you on Valentine’s 💖</p>
    <p style="opacity:.85;margin-top:16px;">(Screenshot this and send it to me 😌)</p>
  `;
});

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("click", moveNoButton); // mobile fallback

