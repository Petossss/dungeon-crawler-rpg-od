/**
 * @jest-environment jsdom
 */
global.player = JSON.parse(localStorage.getItem("playerData"));
window.player = global.player; // 🔥 garante que o script enxergue o mesmo objeto
beforeEach(() => {
  jest.resetModules();

  const fakePlayer = {
    name: "Hero",
    lvl: 1,
    exp: {
      expCurr: 0,
      expCurrLvl: 0,
      expMax: 100,
      expMaxLvl: 100,
      lvlGained: 0
    },
    stats: {
      hp: 100,
      hpMax: 100,
      atk: 10,
      def: 5,
      atkSpd: 1.0,
      vamp: 0,
      critRate: 5,
      critDmg: 50
    },
    bonusStats: {
      hp: 0,
      atk: 0,
      def: 0,
      atkSpd: 0,
      critRate: 0,
      critDmg: 0
    },
    gold: 0,
    inCombat: false
  };

  global.localStorage = {
    store: {},
    getItem(key) { return this.store[key] || null; },
    setItem(key, value) { this.store[key] = value.toString(); },
    clear() { this.store = {}; }
  };
  localStorage.setItem("playerData", JSON.stringify(fakePlayer));

  // 🧩 Define o player global ANTES de importar o script
  global.player = JSON.parse(localStorage.getItem("playerData"));
  window.player = global.player;

  // Mocks necessários para player.js
  global.enemy = { rewards: { exp: 50 } };
  global.playerLoadStats = jest.fn();
  global.lvlupPopup = jest.fn();
  global.showEquipment = jest.fn();
  global.showInventory = jest.fn();
  global.applyEquipmentStats = jest.fn();
  global.addCombatLog = jest.fn();
  global.saveData = jest.fn();
  global.nFormatter = (n) => n;
  global.playerDead = false;
  global.combatPanel = document.createElement('div');

  document.body.innerHTML = `
    <div id="lvlupSelect"></div>
    <div id="lvlupPanel"></div>
    <div id="player-name"></div>
    <div id="player-exp"></div>
    <div id="player-gold"></div>
    <div id="bonus-stats"></div>
    <div id="player-hp-battle"></div>
    <div id="player-hp-dmg"></div>
    <div id="player-exp-bar"></div>
    <div id="player-combat-info"></div>
  `;

  global.playerHpElement = document.createElement('div');
  global.playerAtkElement = document.createElement('div');
  global.playerDefElement = document.createElement('div');
  global.playerAtkSpdElement = document.createElement('div');
  global.playerVampElement = document.createElement('div');
  global.playerCrateElement = document.createElement('div');
  global.playerCdmgElement = document.createElement('div');

  require('./assets/js/player.js');
});

test('playerLvlUp deve aumentar o nível e os atributos corretamente', () => {
  const prevLvl = global.player.lvl;
  const prevExpMax = global.player.exp.expMax;

  window.playerLvlUp();

  expect(global.player.lvl).toBe(prevLvl + 1);
  expect(global.player.exp.expMax).toBeGreaterThan(prevExpMax);
  expect(global.player.bonusStats.hp).toBeGreaterThan(0);
});

test('playerExpGain deve adicionar experiência e chamar playerLoadStats', () => {
  const spy = jest.spyOn(window, 'playerLoadStats');
  const expAntes = global.player.exp.expCurr;

  window.playerExpGain();

  expect(global.player.exp.expCurr).toBe(expAntes + global.enemy.rewards.exp);
  expect(spy).toHaveBeenCalled();
});
