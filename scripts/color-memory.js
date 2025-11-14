// Color Memory Chain Game Logic
class ColorMemoryGame {
  constructor() {
    this.sequence = [];
    this.playerSequence = [];
    this.level = 1;
    this.score = 0;
    this.isPlaying = false;
    this.isPlayerTurn = false;
    this.currentStep = 0;
    this.gameSpeed = 1000; // milliseconds between flashes
    this.colorMeanings = {}; // For color meaning twists
    this.twistLevel = 5; // Level at which color meanings start changing
    this.maxLevel = 50; // Extended game with 50 levels
    this.specialEvents = {}; // For special level events
    this.speedBoostMode = false; // Ultra-fast mode at higher levels
    this.colorBlindMode = false; // Colors become similar at extreme levels
    this.gameStartTime = 0; // Track game duration

    this.colors = ["red", "blue", "green", "yellow", "purple", "orange"];

    // Load current player data
    this.currentPlayer =
      JSON.parse(sessionStorage.getItem("currentPlayer")) || null;
    this.achievements = this.currentPlayer
      ? this.currentPlayer.achievements
      : [];
    this.highScore = this.currentPlayer ? this.currentPlayer.highScore : 0;

    this.setupGame();
  }

  checkAchievements() {
    const newAchievements = [];

    const achievementList = [
      {
        id: "first_twist",
        level: 5,
        name: "Mind Bender",
        desc: "Survive your first color twist",
      },
      {
        id: "level_10",
        level: 10,
        name: "Rising Star",
        desc: "Reach level 10",
      },
      {
        id: "level_15",
        level: 15,
        name: "Memory Master",
        desc: "Reach level 15",
      },
      { id: "level_20", level: 20, name: "Legendary", desc: "Reach level 20" },
      {
        id: "level_25",
        level: 25,
        name: "Unstoppable",
        desc: "Reach level 25",
      },
      {
        id: "level_30",
        level: 30,
        name: "Elite Player",
        desc: "Reach level 30",
      },
      {
        id: "level_35",
        level: 35,
        name: "Hyperspeed Hero",
        desc: "Survive hyperspeed mode",
      },
      {
        id: "level_40",
        level: 40,
        name: "Vision Master",
        desc: "Conquer color blind mode",
      },
      {
        id: "level_45",
        level: 45,
        name: "Almost Impossible",
        desc: "Reach level 45",
      },
      {
        id: "level_50",
        level: 50,
        name: "COLOR MEMORY CHAMPION",
        desc: "Complete all 50 levels!",
      },
      {
        id: "score_1000",
        score: 1000,
        name: "Point Collector",
        desc: "Score 1000+ points",
      },
      {
        id: "score_5000",
        score: 5000,
        name: "High Scorer",
        desc: "Score 5000+ points",
      },
      {
        id: "score_10000",
        score: 10000,
        name: "Score Legend",
        desc: "Score 10000+ points",
      },
    ];

    achievementList.forEach((achievement) => {
      if (!this.achievements.includes(achievement.id)) {
        let earned = false;

        if (achievement.level && this.level >= achievement.level) {
          earned = true;
        } else if (achievement.score && this.score >= achievement.score) {
          earned = true;
        }

        if (earned) {
          this.achievements.push(achievement.id);
          newAchievements.push(achievement);
        }
      }
    });

    if (newAchievements.length > 0) {
      localStorage.setItem(
        "colorMemoryAchievements",
        JSON.stringify(this.achievements)
      );
      this.showAchievements(newAchievements);
    }
  }

  showAchievements(achievements) {
    achievements.forEach((achievement, index) => {
      setTimeout(() => {
        const achievementDiv = document.createElement("div");
        achievementDiv.className = "achievement-popup";

        const contentDiv = document.createElement("div");
        contentDiv.className = "achievement-content";

        const iconDiv = document.createElement("div");
        iconDiv.className = "achievement-icon";
        iconDiv.textContent = "🏆";

        const textDiv = document.createElement("div");
        textDiv.className = "achievement-text";

        const nameDiv = document.createElement("div");
        nameDiv.className = "achievement-name";
        nameDiv.textContent = achievement.name;

        const descDiv = document.createElement("div");
        descDiv.className = "achievement-desc";
        descDiv.textContent = achievement.desc;

        textDiv.appendChild(nameDiv);
        textDiv.appendChild(descDiv);
        contentDiv.appendChild(iconDiv);
        contentDiv.appendChild(textDiv);
        achievementDiv.appendChild(contentDiv);

        document.body.appendChild(achievementDiv);

        setTimeout(() => {
          achievementDiv.remove();
        }, 4000);
      }, index * 1000);
    });
  }

  setupGame() {
    this.updateDisplay();
    document.getElementById("highScore").textContent = this.highScore;
    this.resetColorMeanings();

    // Display current player info
    const playerNameElement = document.getElementById("gamePlayerName");
    if (playerNameElement && this.currentPlayer) {
      playerNameElement.textContent = this.currentPlayer.name;
    }
  }

  resetColorMeanings() {
    // Initialize color meanings (each color maps to itself initially)
    this.colors.forEach((color) => {
      this.colorMeanings[color] = color;
    });
    this.displayColorMeanings();
  }

  displayColorMeanings() {
    const display = document.getElementById("colorMeaningDisplay");
    if (this.level >= this.twistLevel) {
      const meanings = Object.entries(this.colorMeanings)
        .map(([visual, actual]) =>
          visual !== actual
            ? `${visual.toUpperCase()} → ${actual.toUpperCase()}`
            : null
        )
        .filter(Boolean);

      if (meanings.length > 0) {
        display.innerHTML = `<strong>Color Meanings:</strong> ${meanings.join(
          ", "
        )}`;
      } else {
        display.innerHTML = "No color twists active";
      }
    } else {
      display.innerHTML = `Color twists unlock at level ${this.twistLevel}!`;
    }
  }

  startGame() {
    this.sequence = [];
    this.level = 1;
    this.score = 0;
    this.isPlaying = true;
    this.gameSpeed = 1000;
    this.gameStartTime = Date.now();
    this.resetColorMeanings();

    document.getElementById("startBtn").style.display = "none";
    document.getElementById("gameStatus").textContent = "Level 1";
    document.getElementById("instructionDisplay").textContent =
      "Watch the sequence!";

    // Update player games played count
    if (this.currentPlayer) {
      this.updatePlayerProgress();
    }

    this.nextLevel();
  }

  updatePlayerProgress() {
    if (!this.currentPlayer) return;

    // Update current player data
    const players =
      JSON.parse(localStorage.getItem("colorMemoryPlayers")) || {};
    if (players[this.currentPlayer.name]) {
      players[this.currentPlayer.name].gamesPlayed++;
      if (this.level > players[this.currentPlayer.name].bestLevel) {
        players[this.currentPlayer.name].bestLevel = this.level;
      }
      if (this.score > players[this.currentPlayer.name].highScore) {
        players[this.currentPlayer.name].highScore = this.score;
      }
      players[this.currentPlayer.name].achievements = this.achievements;
      players[this.currentPlayer.name].lastPlayed = Date.now();

      // Calculate play time
      const gameTime = Date.now() - this.gameStartTime;
      players[this.currentPlayer.name].totalPlayTime += gameTime;

      localStorage.setItem("colorMemoryPlayers", JSON.stringify(players));

      // Update session storage
      this.currentPlayer = players[this.currentPlayer.name];
      sessionStorage.setItem(
        "currentPlayer",
        JSON.stringify(this.currentPlayer)
      );
    }
  }

  nextLevel() {
    this.playerSequence = [];
    this.currentStep = 0;
    this.isPlayerTurn = false;

    // Add new color to sequence
    const randomColor =
      this.colors[Math.floor(Math.random() * this.colors.length)];
    this.sequence.push(randomColor);

    // Progressive difficulty scaling
    this.applyLevelDifficulty();

    // Add color meaning twists at higher levels
    if (this.level >= this.twistLevel && this.level % 2 === 0) {
      this.addColorTwist();
    }

    // Special level events
    this.checkSpecialEvents();

    this.updateDisplay();
    this.displayColorMeanings();

    document.getElementById("nextLevelBtn").style.display = "none";
    document.getElementById("replayBtn").style.display = "none";

    setTimeout(() => {
      this.playSequence();
    }, 1000);
  }

  applyLevelDifficulty() {
    // Speed increases
    if (this.level <= 10) {
      this.gameSpeed = Math.max(600, 1000 - this.level * 40);
    } else if (this.level <= 20) {
      this.gameSpeed = Math.max(300, 600 - (this.level - 10) * 30);
    } else if (this.level <= 35) {
      this.gameSpeed = Math.max(150, 300 - (this.level - 20) * 10);
    } else {
      // Ultra-fast mode for levels 35+
      this.gameSpeed = 150;
      this.speedBoostMode = true;
    }

    // Color blind mode for extreme levels (40+)
    if (this.level >= 40) {
      this.colorBlindMode = true;
      this.applySimilarColors();
    }
  }

  checkSpecialEvents() {
    const milestones = {
      5: "🌀 Color Twists Begin!",
      10: "⚡ Speed Boost Activated!",
      15: "🎯 Precision Mode!",
      20: "🔥 You're on Fire!",
      25: "🧠 Mind-Bending Level!",
      30: "⭐ Legendary Status!",
      35: "🚀 Hyperspeed Mode!",
      40: "👁️ Color Vision Test!",
      45: "🏆 Almost Impossible!",
      50: "🎉 COLOR MEMORY MASTER!",
    };

    if (milestones[this.level]) {
      this.showSpecialEvent(milestones[this.level]);
    }
  }

  showSpecialEvent(message) {
    const status = document.getElementById("gameStatus");
    const originalText = status.textContent;
    status.textContent = message;
    status.style.color = "#ffa502";
    status.style.fontSize = "2.5rem";

    setTimeout(() => {
      status.textContent = originalText;
      status.style.color = "white";
      status.style.fontSize = "2rem";
    }, 3000);
  }

  applySimilarColors() {
    // Make colors more similar at extreme levels
    const similarColorSets = [
      { red: "#ff4757", orange: "#ff6348" }, // Similar reds
      { blue: "#3742fa", purple: "#a55eea" }, // Similar blues
      { green: "#2ed573", yellow: "#ffa502" }, // Green-yellow mix
    ];

    // Apply similar color scheme
    const buttons = document.querySelectorAll(".color-button");
    buttons.forEach((button) => {
      const color = button.dataset.color;
      if (color === "red") button.style.background = "#ff5757";
      if (color === "orange") button.style.background = "#ff5348";
      if (color === "blue") button.style.background = "#4752fa";
      if (color === "purple") button.style.background = "#9555ea";
    });
  }

  addColorTwist() {
    // More complex twists based on level
    if (this.level < 15) {
      // Simple swaps
      this.simpleColorSwap();
    } else if (this.level < 25) {
      // Chain swaps (A→B, B→C, C→A)
      this.chainColorSwap();
    } else if (this.level < 35) {
      // Random shuffle
      this.shuffleAllColors();
    } else {
      // Extreme twists - reverse mappings
      this.reverseColorMappings();
    }
  }

  simpleColorSwap() {
    const availableColors = [...this.colors];
    const color1 =
      availableColors[Math.floor(Math.random() * availableColors.length)];
    availableColors.splice(availableColors.indexOf(color1), 1);
    const color2 =
      availableColors[Math.floor(Math.random() * availableColors.length)];

    // Swap their meanings
    const temp = this.colorMeanings[color1];
    this.colorMeanings[color1] = this.colorMeanings[color2];
    this.colorMeanings[color2] = temp;

    this.showTwistNotification(
      `🌀 Color Twist! ${color1.toUpperCase()} ↔ ${color2.toUpperCase()}`
    );
  }

  chainColorSwap() {
    const availableColors = [...this.colors];
    const color1 =
      availableColors[Math.floor(Math.random() * availableColors.length)];
    availableColors.splice(availableColors.indexOf(color1), 1);
    const color2 =
      availableColors[Math.floor(Math.random() * availableColors.length)];
    availableColors.splice(availableColors.indexOf(color2), 1);
    const color3 =
      availableColors[Math.floor(Math.random() * availableColors.length)];

    // Chain swap: A→B, B→C, C→A
    const temp = this.colorMeanings[color1];
    this.colorMeanings[color1] = this.colorMeanings[color2];
    this.colorMeanings[color2] = this.colorMeanings[color3];
    this.colorMeanings[color3] = temp;

    this.showTwistNotification(
      `🔄 Chain Twist! ${color1.toUpperCase()}→${color2.toUpperCase()}→${color3.toUpperCase()}`
    );
  }

  shuffleAllColors() {
    const shuffledColors = [...this.colors].sort(() => Math.random() - 0.5);
    this.colors.forEach((color, index) => {
      this.colorMeanings[color] = shuffledColors[index];
    });

    this.showTwistNotification(`🎲 MEGA SHUFFLE! All colors randomized!`);
  }

  reverseColorMappings() {
    // Create complete reverse mapping
    const reverseMap = {};
    Object.entries(this.colorMeanings).forEach(([visual, actual]) => {
      reverseMap[visual] = actual;
    });

    // Apply reverse
    Object.keys(this.colorMeanings).forEach((color) => {
      this.colorMeanings[color] = reverseMap[reverseMap[color]] || color;
    });

    this.showTwistNotification(`↩️ REVERSE REALITY! Everything backwards!`);
  }

  showTwistNotification(message) {
    const status = document.getElementById("gameStatus");
    const originalText = status.textContent;
    status.textContent = message;
    status.style.color = "#ffa502";

    setTimeout(() => {
      status.textContent = originalText;
      status.style.color = "white";
    }, 3000);
  }

  async playSequence() {
    document.getElementById("gameStatus").textContent = "Watch carefully!";
    document.getElementById(
      "instructionDisplay"
    ).textContent = `Level ${this.level} - Sequence length: ${this.sequence.length}`;

    for (let i = 0; i < this.sequence.length; i++) {
      await this.flashColor(this.sequence[i]);
      if (i < this.sequence.length - 1) {
        await this.delay(200); // Short pause between flashes
      }
    }

    this.startPlayerTurn();
  }

  flashColor(color) {
    return new Promise((resolve) => {
      const button = document.querySelector(`.color-button.${color}`);
      button.classList.add("flash");

      // Play sound effect (if you want to add audio)
      // this.playSound(color);

      setTimeout(() => {
        button.classList.remove("flash");
        resolve();
      }, this.gameSpeed / 2);
    });
  }

  startPlayerTurn() {
    this.isPlayerTurn = true;
    document.getElementById("gameStatus").textContent = "Your turn!";
    document.getElementById("instructionDisplay").textContent =
      "Click the colors in the correct sequence";
    document.getElementById("replayBtn").style.display = "inline-block";
    this.updateProgress();
  }

  playerClick(color) {
    if (!this.isPlayerTurn || !this.isPlaying) return;

    // Get the actual color this button represents (considering twists)
    const actualColor = this.colorMeanings[color];
    this.playerSequence.push(actualColor);
    this.currentStep++;

    // Visual feedback
    const button = document.querySelector(`.color-button.${color}`);
    button.classList.add("active");
    setTimeout(() => button.classList.remove("active"), 200);

    // Check if the click is correct
    const expectedColor = this.sequence[this.currentStep - 1];
    if (actualColor !== expectedColor) {
      this.gameOver();
      return;
    }

    this.updateProgress();

    // Check if sequence is complete
    if (this.playerSequence.length === this.sequence.length) {
      this.levelComplete();
    }
  }

  levelComplete() {
    this.isPlayerTurn = false;

    // Enhanced scoring system
    let levelBonus = this.level * 10;
    let sequenceBonus = this.sequence.length * 5;
    let speedBonus = this.speedBoostMode ? this.level * 5 : 0;
    let difficultyBonus = this.level > 20 ? (this.level - 20) * 10 : 0;
    let perfectBonus = this.level >= 10 ? 50 : 0;

    let totalPoints =
      levelBonus + sequenceBonus + speedBonus + difficultyBonus + perfectBonus;
    this.score += totalPoints;
    this.level++;

    // Check if game is complete
    if (this.level > this.maxLevel) {
      this.gameComplete();
      return;
    }

    // Dynamic success messages
    const successMessages = [
      "🎉 Perfect!",
      "⚡ Amazing!",
      "🔥 On Fire!",
      "🌟 Incredible!",
      "🚀 Unstoppable!",
      "🏆 Legendary!",
      "💎 Flawless!",
      "⭐ Superb!",
      "🎯 Bullseye!",
      "👑 Masterful!",
    ];

    const message =
      successMessages[Math.floor(Math.random() * successMessages.length)];
    document.getElementById("gameStatus").textContent = message;

    let bonusText = `+${totalPoints} points!`;
    if (speedBonus > 0) bonusText += ` (Speed Bonus: +${speedBonus})`;
    if (difficultyBonus > 0) bonusText += ` (Difficulty: +${difficultyBonus})`;
    if (perfectBonus > 0) bonusText += ` (Perfect: +${perfectBonus})`;

    document.getElementById("instructionDisplay").textContent = bonusText;
    document.getElementById("nextLevelBtn").style.display = "inline-block";
    document.getElementById("replayBtn").style.display = "none";

    this.updateDisplay();

    // Check for achievements
    this.checkAchievements();

    // Check for high score
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("colorMemoryHighScore", this.highScore);
      document.getElementById("highScore").textContent = this.highScore;
    }
  }

  gameComplete() {
    this.isPlaying = false;
    this.isPlayerTurn = false;

    document.getElementById("gameStatus").textContent = "🏆 GAME MASTER!";
    document.getElementById(
      "instructionDisplay"
    ).textContent = `You conquered all ${this.maxLevel} levels! You are a Color Memory Legend!`;

    // Show completion modal
    document.getElementById("finalLevel").textContent = this.maxLevel;
    document.getElementById("finalScore").textContent = this.score;
    document.getElementById("newHighScore").style.display = "block";
    document.getElementById("newHighScore").textContent =
      "🎉 COLOR MEMORY CHAMPION!";

    setTimeout(() => {
      document.getElementById("gameOverModal").style.display = "flex";
    }, 2000);
  }

  gameOver() {
    this.isPlaying = false;
    this.isPlayerTurn = false;

    // Update player progress before showing game over
    this.updatePlayerProgress();

    document.getElementById("gameStatus").textContent = "💥 Game Over!";
    document.getElementById("instructionDisplay").textContent =
      "Better luck next time!";

    // Show game over modal
    document.getElementById("finalLevel").textContent = this.level;
    document.getElementById("finalScore").textContent = this.score;

    // Show player-specific messaging
    let newRecord = false;
    if (this.currentPlayer) {
      if (
        this.score > this.currentPlayer.highScore ||
        this.level > this.currentPlayer.bestLevel
      ) {
        newRecord = true;
        document.getElementById("newHighScore").style.display = "block";
        document.getElementById("newHighScore").textContent =
          "🎉 New Personal Best!";
      }
    } else if (this.score > this.highScore) {
      newRecord = true;
      document.getElementById("newHighScore").style.display = "block";
      document.getElementById("newHighScore").textContent =
        "🎉 New High Score!";
    }

    if (!newRecord) {
      document.getElementById("newHighScore").style.display = "none";
    }

    // Show achievements earned this game
    this.displayGameAchievements();

    setTimeout(() => {
      document.getElementById("gameOverModal").style.display = "flex";
    }, 1500);
  }

  displayGameAchievements() {
    const achievementsList = document.getElementById("achievementsList");
    if (!achievementsList) return;

    // This would show achievements earned in this session
    const recentAchievements = this.achievements.slice(-3); // Show last 3 achievements

    if (recentAchievements.length > 0) {
      achievementsList.innerHTML = "<h4>Recent Achievements:</h4>";
      recentAchievements.forEach((achievementId) => {
        const achievement = this.getAchievementData(achievementId);
        if (achievement) {
          const achievementDiv = document.createElement("div");
          achievementDiv.className = "achievement-badge";
          achievementDiv.textContent = `🏆 ${achievement.name}`;
          achievementsList.appendChild(achievementDiv);
        }
      });
    } else {
      achievementsList.innerHTML = "";
    }
  }

  getAchievementData(id) {
    const achievementList = [
      {
        id: "first_twist",
        level: 5,
        name: "Mind Bender",
        desc: "Survive your first color twist",
      },
      {
        id: "level_10",
        level: 10,
        name: "Rising Star",
        desc: "Reach level 10",
      },
      {
        id: "level_15",
        level: 15,
        name: "Memory Master",
        desc: "Reach level 15",
      },
      { id: "level_20", level: 20, name: "Legendary", desc: "Reach level 20" },
      {
        id: "level_25",
        level: 25,
        name: "Unstoppable",
        desc: "Reach level 25",
      },
      {
        id: "level_30",
        level: 30,
        name: "Elite Player",
        desc: "Reach level 30",
      },
      {
        id: "level_35",
        level: 35,
        name: "Hyperspeed Hero",
        desc: "Survive hyperspeed mode",
      },
      {
        id: "level_40",
        level: 40,
        name: "Vision Master",
        desc: "Conquer color blind mode",
      },
      {
        id: "level_45",
        level: 45,
        name: "Almost Impossible",
        desc: "Reach level 45",
      },
      {
        id: "level_50",
        level: 50,
        name: "COLOR MEMORY CHAMPION",
        desc: "Complete all 50 levels!",
      },
      {
        id: "score_1000",
        score: 1000,
        name: "Point Collector",
        desc: "Score 1000+ points",
      },
      {
        id: "score_5000",
        score: 5000,
        name: "High Scorer",
        desc: "Score 5000+ points",
      },
      {
        id: "score_10000",
        score: 10000,
        name: "Score Legend",
        desc: "Score 10000+ points",
      },
    ];

    return achievementList.find((achievement) => achievement.id === id);
  }

  replaySequence() {
    if (!this.isPlaying) return;
    this.isPlayerTurn = false;
    this.playSequence();
  }

  updateDisplay() {
    document.getElementById("level").textContent = this.level;
    document.getElementById("score").textContent = this.score;
    document.getElementById("currentStep").textContent = this.currentStep;
    document.getElementById("totalSteps").textContent = this.sequence.length;
  }

  updateProgress() {
    const progress = (this.currentStep / this.sequence.length) * 100;
    document.getElementById("progressFill").style.width = `${progress}%`;
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Global game instance
let game;

// Initialize game when page loads
document.addEventListener("DOMContentLoaded", function () {
  game = new ColorMemoryGame();
});

// Global functions for HTML onclick events
function startGame() {
  game.startGame();
}

function nextLevel() {
  game.nextLevel();
}

function replaySequence() {
  game.replaySequence();
}

function playerClick(color) {
  game.playerClick(color);
}

function restartGame() {
  document.getElementById("gameOverModal").style.display = "none";
  document.getElementById("startBtn").style.display = "inline-block";
  document.getElementById("nextLevelBtn").style.display = "none";
  document.getElementById("replayBtn").style.display = "none";

  game = new ColorMemoryGame();
}

function goHome() {
  window.location.href = "../index.html";
}

// Keyboard controls
document.addEventListener("keydown", function (e) {
  if (!game.isPlayerTurn) return;

  const keyMap = {
    1: "red",
    2: "blue",
    3: "green",
    4: "yellow",
    5: "purple",
    6: "orange",
  };

  if (keyMap[e.key]) {
    playerClick(keyMap[e.key]);
  }

  if (e.key === "r" || e.key === "R") {
    replaySequence();
  }
});

// Add visual indicator for keyboard controls
document.addEventListener("DOMContentLoaded", function () {
  const colors = ["red", "blue", "green", "yellow", "purple", "orange"];
  colors.forEach((color, index) => {
    const button = document.querySelector(`.color-button.${color}`);
    const keyNumber = document.createElement("div");
    keyNumber.textContent = index + 1;
    keyNumber.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: rgba(0,0,0,0.6);
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
        `;
    button.appendChild(keyNumber);
  });
});
