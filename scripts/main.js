// User Management System
class UserManager {
  constructor() {
    this.currentPlayer = null;
    this.players = JSON.parse(localStorage.getItem("colorMemoryPlayers")) || {};
    this.init();
  }

  init() {
    this.loadSavedPlayers();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Enter key on name input
    const nameInput = document.getElementById("playerName");
    if (nameInput) {
      nameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          submitPlayerName();
        }
      });
    }
  }

  loadSavedPlayers() {
    const savedPlayersDiv = document.getElementById("savedPlayers");
    if (!savedPlayersDiv) return;

    const playerNames = Object.keys(this.players);

    if (playerNames.length === 0) {
      savedPlayersDiv.innerHTML =
        '<p style="opacity: 0.6; font-style: italic;">No saved players yet</p>';
      return;
    }

    savedPlayersDiv.innerHTML = "";
    playerNames.slice(0, 5).forEach((name) => {
      const button = document.createElement("button");
      button.className = "saved-player-btn";
      button.textContent = `${name} (Level ${this.players[name].bestLevel})`;
      button.onclick = () => this.selectPlayer(name);
      savedPlayersDiv.appendChild(button);
    });
  }

  createPlayer(name) {
    const player = {
      name: name,
      bestLevel: 0,
      highScore: 0,
      gamesPlayed: 0,
      achievements: [],
      totalPlayTime: 0,
      createdAt: Date.now(),
      lastPlayed: Date.now(),
    };

    this.players[name] = player;
    this.savePlayersData();
    return player;
  }

  selectPlayer(name) {
    if (!this.players[name]) {
      this.players[name] = this.createPlayer(name);
    }

    this.currentPlayer = this.players[name];
    this.currentPlayer.lastPlayed = Date.now();
    this.savePlayersData();
    this.showMainScreen();
  }

  updatePlayerStats(level, score) {
    if (!this.currentPlayer) return;

    this.currentPlayer.gamesPlayed++;
    if (level > this.currentPlayer.bestLevel) {
      this.currentPlayer.bestLevel = level;
    }
    if (score > this.currentPlayer.highScore) {
      this.currentPlayer.highScore = score;
    }
    this.currentPlayer.lastPlayed = Date.now();
    this.savePlayersData();
    this.updatePlayerDisplay();
  }

  savePlayersData() {
    localStorage.setItem("colorMemoryPlayers", JSON.stringify(this.players));
  }

  showMainScreen() {
    document.getElementById("welcomeScreen").style.display = "none";
    document.getElementById("mainScreen").style.display = "block";
    this.updatePlayerDisplay();
  }

  showWelcomeScreen() {
    document.getElementById("welcomeScreen").style.display = "block";
    document.getElementById("mainScreen").style.display = "none";
    this.loadSavedPlayers();
  }

  updatePlayerDisplay() {
    if (!this.currentPlayer) return;

    document.getElementById("currentPlayerName").textContent =
      this.currentPlayer.name;
    document.getElementById("playerBestLevel").textContent =
      this.currentPlayer.bestLevel;
    document.getElementById("playerHighScore").textContent =
      this.currentPlayer.highScore;
    document.getElementById("gamesPlayed").textContent =
      this.currentPlayer.gamesPlayed;
  }
}

// Global user manager instance
let userManager;

// Global functions for HTML onclick events
function submitPlayerName() {
  const nameInput = document.getElementById("playerName");
  const name = nameInput.value.trim();

  if (!name) {
    nameInput.style.borderColor = "#ff4757";
    nameInput.placeholder = "Please enter your name!";
    return;
  }

  if (name.length < 2) {
    nameInput.style.borderColor = "#ff4757";
    nameInput.placeholder = "Name must be at least 2 characters!";
    nameInput.value = "";
    return;
  }

  // Add click animation
  event.target.style.transform = "scale(0.95)";

  setTimeout(() => {
    userManager.selectPlayer(name);
  }, 150);
}

function changePlayer() {
  userManager.showWelcomeScreen();
}

function startColorGame() {
  if (!userManager.currentPlayer) {
    alert("Please select a player first!");
    return;
  }

  // Add click animation
  event.target.style.transform = "scale(0.95)";

  // Store current player in session for the game
  sessionStorage.setItem(
    "currentPlayer",
    JSON.stringify(userManager.currentPlayer)
  );

  setTimeout(() => {
    window.location.href = "games/color-memory.html";
  }, 150);
}

// Enhanced interactive effects
document.addEventListener("DOMContentLoaded", function () {
  userManager = new UserManager();

  // Check if there's only one player and auto-select them
  const playerNames = Object.keys(userManager.players);
  if (playerNames.length === 1) {
    const recentPlayer = playerNames[0];
    const timeSinceLastPlay =
      Date.now() - userManager.players[recentPlayer].lastPlayed;

    // Auto-select if played within last 24 hours
    if (timeSinceLastPlay < 24 * 60 * 60 * 1000) {
      userManager.selectPlayer(recentPlayer);
    }
  }

  // Add enhanced particle effects
  createEnhancedParticles();

  // Add keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Enter" &&
      document.getElementById("welcomeScreen").style.display !== "none"
    ) {
      submitPlayerName();
    }
  });
});

// Enhanced particle system
function createEnhancedParticles() {
  setInterval(() => {
    createFloatingParticle();
  }, 3000);

  // Create burst effect on user interactions
  document.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      createParticleBurst(e.clientX, e.clientY);
    }
  });
}

function createFloatingParticle() {
  const particle = document.createElement("div");
  const colors = ["#667eea", "#764ba2", "#2ed573", "#ffa502", "#ff4757"];
  const color = colors[Math.floor(Math.random() * colors.length)];

  particle.style.cssText = `
        position: fixed;
        width: ${Math.random() * 6 + 3}px;
        height: ${Math.random() * 6 + 3}px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        animation: floatUp ${Math.random() * 3 + 4}s linear forwards;
        left: ${Math.random() * window.innerWidth}px;
        top: ${window.innerHeight}px;
        z-index: -1;
        opacity: ${Math.random() * 0.5 + 0.3};
    `;

  document.body.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 7000);
}

function createParticleBurst(x, y) {
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement("div");
    const angle = (i / 8) * Math.PI * 2;
    const velocity = Math.random() * 100 + 50;

    particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: #ffa502;
            border-radius: 50%;
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
            z-index: 1000;
            animation: particleBurst 0.6s ease-out forwards;
            --dx: ${Math.cos(angle) * velocity}px;
            --dy: ${Math.sin(angle) * velocity}px;
        `;

    document.body.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 600);
  }

  // Add screen shake effect for major actions
  document.body.style.animation = "screenShake 0.3s ease-out";
  setTimeout(() => {
    document.body.style.animation = "";
  }, 300);
}

// Add haptic feedback for mobile devices
function addHapticFeedback() {
  if ("vibrate" in navigator) {
    navigator.vibrate(50);
  }
}

// Enhanced button interactions
function addButtonInteractions() {
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("mousedown", function () {
      this.style.transform = "scale(0.95)";
    });

    button.addEventListener("mouseup", function () {
      this.style.transform = "";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "";
    });

    // Add click sound placeholder
    button.addEventListener("click", function () {
      addHapticFeedback();
      // playClickSound(); // Could add actual sound here
    });
  });
}

// Add CSS animations for particles and effects
const style = document.createElement("style");
style.textContent = `
    @keyframes floatUp {
        to {
            transform: translateY(-${
              window.innerHeight + 100
            }px) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes particleBurst {
        to {
            transform: translate(var(--dx), var(--dy));
            opacity: 0;
        }
    }
    
    @keyframes screenShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-2px); }
        75% { transform: translateX(2px); }
    }
    
    @keyframes buttonPulse {
        0% { box-shadow: 0 0 0 0 rgba(255, 165, 2, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(255, 165, 2, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255, 165, 2, 0); }
    }
    
    .play-btn:hover {
        animation: buttonPulse 1.5s infinite;
    }
`;
document.head.appendChild(style);

// Initialize enhanced interactions
document.addEventListener("DOMContentLoaded", function () {
  addButtonInteractions();
});
