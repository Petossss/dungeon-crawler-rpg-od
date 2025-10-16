// Garante que o player sempre exista, mesmo se o localStorage estiver vazio
let player = JSON.parse(localStorage.getItem("playerData")) || {
  lvl: 1,
  exp: { expCurr: 0, expCurrLvl: 0, expMax: 100, lvlGained: 0 },
  bonusStats: {
    hp: 10,
    atk: 5,
    def: 2,
    atkSpd: 1.2,
    vamp: 0.5,
    critRate: 0.3,
    critDmg: 1.5,
  },
  stats: { hp: 100, hpMax: 100, atk: 10, def: 5, atkSpd: 1.2, vamp: 0.5, critRate: 0.3, critDmg: 1.5 },
  gold: 0,
  name: "Hero",
  inCombat: false,
};

let inventoryOpen = false;
let leveled = false;
const lvlupSelect = document.querySelector("#lvlupSelect");
const lvlupPanel = document.querySelector("#lvlupPanel");

const playerExpGain = () => {
  player.exp.expCurr += enemy.rewards.exp;
  player.exp.expCurrLvl += enemy.rewards.exp;

  while (player.exp.expCurr >= player.exp.expMax) {
    playerLvlUp();
  }

  if (leveled) {
    lvlupPopup();
  }

  playerLoadStats();
};

// Levels up the player
const playerLvlUp = () => {
  leveled = true;

  // Calculates the excess exp and the new exp required to level up
  let expMaxIncrease = Math.floor(((player.exp.expMax * 1.1) + 100) - player.exp.expMax);
  if (player.lvl > 100) {
    expMaxIncrease = 1000000;
  }

  let excessExp = player.exp.expCurr - player.exp.expMax;
  player.exp.expCurrLvl = excessExp;
  player.exp.expMaxLvl = expMaxIncrease;

  // Increase player level and maximum exp
  player.lvl++;
  player.exp.lvlGained++;
  player.exp.expMax += expMaxIncrease;

  // Increase player bonus stats per level
  player.bonusStats.hp += 4;
  player.bonusStats.atk += 2;
  player.bonusStats.def += 2;
  player.bonusStats.atkSpd += 0.15;
  player.bonusStats.critRate += 0.1;
  player.bonusStats.critDmg += 0.25;
};

// Refresh the player stats
const playerLoadStats = () => {
  showEquipment();
  showInventory();
  applyEquipmentStats();

  let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  if (player.stats.hp > player.stats.hpMax) {
    player.stats.hp = player.stats.hpMax;
  }
  player.stats.hpPercent = Number((player.stats.hp / player.stats.hpMax) * 100)
    .toFixed(2)
    .replace(rx, "$1");
  player.exp.expPercent = Number((player.exp.expCurrLvl / player.exp.expMaxLvl) * 100)
    .toFixed(2)
    .replace(rx, "$1");

  if (player.inCombat || playerDead) {
    const playerCombatHpElement = document.querySelector("#player-hp-battle");
    const playerHpDamageElement = document.querySelector("#player-hp-dmg");
    const playerExpElement = document.querySelector("#player-exp-bar");
    const playerInfoElement = document.querySelector("#player-combat-info");
    playerCombatHpElement.innerHTML = `&nbsp${nFormatter(player.stats.hp)}/${nFormatter(player.stats.hpMax)}(${player.stats.hpPercent}%)`;
    playerCombatHpElement.style.width = `${player.stats.hpPercent}%`;
    playerHpDamageElement.style.width = `${player.stats.hpPercent}%`;
    playerExpElement.style.width = `${player.exp.expPercent}%`;
    playerInfoElement.innerHTML = `${player.name} Lv.${player.lvl} (${player.exp.expPercent}%)`;
  }

  // Header
  document.querySelector("#player-name").innerHTML = `<i class="fas fa-user"></i>${player.name} Lv.${player.lvl}`;
  document.querySelector("#player-exp").innerHTML = `<p>Exp</p> ${nFormatter(player.exp.expCurr)}/${nFormatter(player.exp.expMax)} (${player.exp.expPercent}%)`;
  document.querySelector("#player-gold").innerHTML = `<i class="fas fa-coins" style="color: #FFD700;"></i>${nFormatter(player.gold)}`;

  // Player Stats
  playerHpElement.innerHTML = `${nFormatter(player.stats.hp)}/${nFormatter(player.stats.hpMax)} (${player.stats.hpPercent}%)`;
  playerAtkElement.innerHTML = nFormatter(player.stats.atk);
  playerDefElement.innerHTML = nFormatter(player.stats.def);
  playerAtkSpdElement.innerHTML = player.stats.atkSpd.toFixed(2).replace(rx, "$1");
  playerVampElement.innerHTML = player.stats.vamp.toFixed(2).replace(rx, "$1") + "%";
  playerCrateElement.innerHTML = player.stats.critRate.toFixed(2).replace(rx, "$1") + "%";
  playerCdmgElement.innerHTML = player.stats.critDmg.toFixed(2).replace(rx, "$1") + "%";

  document.querySelector("#bonus-stats").innerHTML = `
    <h4>Bonus Stats</h4>
    <p><i class="fas fa-heart"></i>HP+${player.bonusStats.hp.toFixed(2).replace(rx, "$1")}%</p>
    <p><i class="ra ra-sword"></i>ATK+${player.bonusStats.atk.toFixed(2).replace(rx, "$1")}%</p>
    <p><i class="ra ra-round-shield"></i>DEF+${player.bonusStats.def.toFixed(2).replace(rx, "$1")}%</p>
    <p><i class="ra ra-plain-dagger"></i>ATK.SPD+${player.bonusStats.atkSpd.toFixed(2).replace(rx, "$1")}%</p>
    <p><i class="ra ra-dripping-blade"></i>VAMP+${player.bonusStats.vamp.toFixed(2).replace(rx, "$1")}%</p>
    <p><i class="ra ra-lightning-bolt"></i>C.RATE+${player.bonusStats.critRate.toFixed(2).replace(rx, "$1")}%</p>
    <p><i class="ra ra-focused-lightning"></i>C.DMG+${player.bonusStats.critDmg.toFixed(2).replace(rx, "$1")}%</p>`;
};

if (typeof window !== "undefined") {
  window.playerExpGain = playerExpGain;
  window.playerLvlUp = playerLvlUp;
  window.playerLoadStats = playerLoadStats;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    player,
    playerLvlUp,
    playerExpGain,
    playerLoadStats,
  };
}
