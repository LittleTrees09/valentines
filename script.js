const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hint = document.getElementById("hint");

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

// ---------------- NO button logic (main page only) ----------------
let noMoveCount = 0;
const NO_MOVE_LIMIT = 2;

// Small, controlled nudge
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function nudgeNoButton(dx) {
  const padding = 16;

  const rect = noBtn.getBoundingClientRect();
  const bw = rect.width;
  const bh = rect.height;

  // If left/top haven't been set yet, start from current rendered position
  const currentLeft = Number.parseFloat(noBtn.style.left);
  const currentTop = Number.parseFloat(noBtn.style.top);
  const x0 = Number.isFinite(currentLeft) ? currentLeft : rect.left;
  const y0 = Number.isFinite(currentTop) ? currentTop : rect.top;

  const minX = padding;
  const maxX = window.innerWidth - bw - padding;
  const minY = padding;
  const maxY = window.innerHeight - bh - padding;

  const x1 = clamp(x0 + dx, minX, maxX);
  const y1 = clamp(y0, minY, maxY);

  noBtn.style.position = "fixed";
  noBtn.style.left = `${x1}px`;
  noBtn.style.top = `${y1}px`;
}

function lockNoButton() {
  noBtn.removeEventListener("mouseenter", onNoHover);
  if (hint) hint.textContent = "Sige, pwede mo na pindutin 😈";
}

function onNoHover() {
  const step = 40; // adjust to taste (20–80)

  // 1st contact: nudge left
  if (noMoveCount === 0) {
    noMoveCount++;
    nudgeNoButton(-step);
    if (hint) hint.textContent = `Anong kala mo ha 😜 (${noMoveCount}/${NO_MOVE_LIMIT})`;
    return;
  }

  // 2nd contact: nudge right, then stop moving forever
  if (noMoveCount === 1) {
    noMoveCount++;
    nudgeNoButton(+step);
    if (hint) hint.textContent = `Anong kala mo ha 😜 (${noMoveCount}/${NO_MOVE_LIMIT})`;
    lockNoButton();
    return;
  }
}

function onNoClick(e) {
  // Before limit: click acts as a "mobile fallback" (counts as a contact)
  if (noMoveCount < NO_MOVE_LIMIT) {
    e.preventDefault();
    onNoHover();
    return;
  }

  // After limit: clicking NO redirects to gorilla page
  window.location.href = "gorilla.html";
}

// ---------------- YES flow (shared) ----------------
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

// Global YES flow so gorilla.html can reuse it
window.runYesFlow = function runYesFlow() {
  confettiBurst();

  const successMarkup = `
    <div class="emoji" aria-hidden="true">🥰</div>
    <h1>YAYYYYY~~</h1>
    <p class="sub">See you on Valentine’s 💖</p>
    <p style="opacity:.85;margin-top:16px;">Below ay mga fave pics ko every year natin and I hope dadami pa pictures natin below~</p>

    <div class="mini-actions">
      <a class="photo-thumb" href="kiss.html" aria-label="Open kiss photo">
        <img src="kiss.jpeg" alt="Kiss photo thumbnail" />
      </a>
      <p class="thumb-note">Click the photo 😉</p>
    </div>
  `;

  const card = document.getElementById("card");

  // index.html: update existing card
  if (card) {
    card.innerHTML = successMarkup;
    return;
  }

  // gorilla.html: hide gorilla image + show overlay (don’t wipe body or confetti dies)
  const gorillaWrap = document.querySelector(".gorilla-wrap");
  if (gorillaWrap) gorillaWrap.style.display = "none";

  let overlay = document.getElementById("successOverlay");
  if (!overlay) {
    overlay = document.createElement("main");
    overlay.id = "successOverlay";
    overlay.className = "card";
    overlay.style.position = "fixed";
    overlay.style.left = "50%";
    overlay.style.top = "45%";
    overlay.style.transform = "translate(-50%, -50%)";
    overlay.style.zIndex = "9000";
    overlay.style.width = "min(520px, 92vw)";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = successMarkup;
};



// ---------------- One-press YES (pointerdown) ----------------
function hookYesButtonOnce(btn) {
  if (!btn) return;

  const fireOnce = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (btn.dataset.clicked === "1") return;
    btn.dataset.clicked = "1";

    btn.style.pointerEvents = "none";
    btn.blur?.();

    window.runYesFlow();
  };

  // pointerdown fixes "needs multiple clicks" on some devices
  btn.addEventListener("pointerdown", fireOnce, { once: true });
  btn.addEventListener("click", fireOnce, { once: true });
}

// Hook YES buttons if present
hookYesButtonOnce(yesBtn);
hookYesButtonOnce(document.getElementById("gorillaYes"));

// Hook NO only on main page
if (noBtn) {
  noBtn.addEventListener("mouseenter", onNoHover);
  noBtn.addEventListener("click", onNoClick);
}

