// ===============================
// PLAYER SYSTEM (corrigido p/ Jest)
// ===============================

// Define o objeto player global (para navegador ou Jest)
if (typeof window === "undefined") global.window = {};
if (!window.player) {
  window.player = {
    lvl: 1,
    exp: {
      expCurr: 0,
      expCurrLvl: 0,
      expMax: 100,
    },
    bonusStats: {
      hp: 100,
      mp: 50,
      atk: 10,
      def: 8,
      agi: 5,
      luk: 3,
    },
  };
}

const player = window.player;

// Função de “carregar stats” (mockável)
if (typeof window.playerLoadStats !== "function") {
  window.playerLoadStats = () => {
    console.log("Player stats recarregados!");
  };
}

// Mock seguro do popup (evita ReferenceError no Jest)
if (typeof window.lvlupPopup !== "function") {
  window.lvlupPopup = () => {
    console.log("Level up!");
  };
}

// ===============================
// LEVEL UP
// ===============================
function playerLvlUp() {
  if (!player) return;

  player.lvl += 1; // sempre sobe um nível

  // aumenta exp necessária pro próximo nível
  let expMaxIncrease = Math.floor(((player.exp.expMax * 1.1) + 100) - player.exp.expMax);
  if (player.lvl > 100) expMaxIncrease = 1000000;
  player.exp.expMax += expMaxIncrease;

  // aumenta atributos
  player.bonusStats.hp += 10;
  player.bonusStats.mp += 5;
  player.bonusStats.atk += 2;
  player.bonusStats.def += 2;
  player.bonusStats.agi += 1;
  player.bonusStats.luk += 1;

  // recarrega stats
  if (typeof playerLoadStats === "function") {
    playerLoadStats();
  }
}

// ===============================
// EXP GAIN
// ===============================
function playerExpGain(enemy) {
  if (!player || !enemy || !enemy.rewards) return;

  player.exp.expCurr += enemy.rewards.exp;
  player.exp.expCurrLvl += enemy.rewards.exp;

  let leveled = false;

  // sobe de nível enquanto tiver exp suficiente
  while (player.exp.expCurr >= player.exp.expMax) {
    player.exp.expCurr -= player.exp.expMax;
    playerLvlUp();
    leveled = true;
  }

  if (leveled && typeof lvlupPopup === "function") {
    lvlupPopup();
  }

  if (typeof playerLoadStats === "function") {
    playerLoadStats();
  }
}

// ===============================
// EXPORTS (para Jest)
// ===============================
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    player,
    playerLvlUp,
    playerExpGain,
  };
}
