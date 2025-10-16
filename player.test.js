/**
 * @jest-environment jsdom
 */

// 1️⃣ Mock do localStorage com playerData já salvo
const fakePlayer = {
  name: "Hero",
  lvl: 1,
  exp: {
    expCurr: 0,
    expMax: 100,
    expCurrLvl: 0,
    expMaxLvl: 100,
    expPercent: 0,
    lvlGained: 0
  },
  bonusStats: {
    hp: 0, atk: 0, def: 0, atkSpd: 0, critRate: 0, critDmg: 0, vamp: 0
  },
  stats: {
    hp: 100, hpMax: 100, atk: 10, def: 5, atkSpd: 1, critRate: 5, critDmg: 50, vamp: 0
  },
  gold: 100,
  inCombat: false
};

global.localStorage = {
  store: {
    playerData: JSON.stringify(fakePlayer)
  },
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = value.toString();
  },
  clear() {
    this.store = {};
  }
};

// 2️⃣ Mock básico do DOM (precisa existir porque o script acessa elementos)
document.body.innerHTML = `
  <div id="lvlupSelect"></div>
  <div id="lvlupPanel"></div>
  <div id="player-name"></div>
  <div id="player-exp"></div>
  <div id="player-gold"></div>
  <div id="bonus-stats"></div>
`;

// 3️⃣ Mocks de funções globais e sons usados no script
global.sfxOpen = { play: jest.fn() };
global.sfxDecline = { play: jest.fn() };
global.sfxSell = { play: jest.fn() };
global.sfxItem = { play: jest.fn() };
global.sfxLvlUp = { play: jest.fn() };
global.sfxDeny = { play: jest.fn() };

global.dungeon = { status: { exploring: true, paused: false } };
global.enemy = { rewards: { exp: 50 } };
global.playerDead = false;
global.combatPanel = document.createElement('div');
global.nFormatter = (n) => n; // não formata, apenas retorna
global.addCombatLog = jest.fn();
global.saveData = jest.fn();
global.showEquipment = jest.fn();
global.showInventory = jest.fn();
global.applyEquipmentStats = jest.fn();
global.sellAll = jest.fn();
global.sellRarityElement = { value: "All", onclick: jest.fn(), onchange: jest.fn(), className: "" };
global.sellAllElement = { onclick: jest.fn() };
global.defaultModalElement = document.createElement('div');

// 4️⃣ Importa o player.js (agora ele vai encontrar o playerData corretamente)
require('./assets/js/player.js');

// 5️⃣ Acessa o player carregado pelo script
const player = JSON.parse(localStorage.getItem("playerData"));
beforeEach(() => {
  // Simula um jogador salvo no localStorage
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

  localStorage.setItem("playerData", JSON.stringify(fakePlayer));
  global.player = fakePlayer; // garante acesso global
});
// 6️⃣ Testes
test('playerLvlUp deve aumentar o nível e os atributos corretamente', () => {
  const prevLvl = player.lvl;
  const prevExpMax = player.exp.expMax;

  window.playerLvlUp();

  expect(player.lvl).toBe(prevLvl + 1);
  expect(player.exp.expMax).toBeGreaterThan(prevExpMax);
  expect(player.bonusStats.hp).toBeGreaterThan(0);
});

test('playerExpGain deve adicionar experiência e chamar playerLoadStats', () => {
  const spy = jest.spyOn(window, 'playerLoadStats');
  const expAntes = player.exp.expCurr;

  window.playerExpGain();

  expect(player.exp.expCurr).toBe(expAntes + global.enemy.rewards.exp);
  expect(spy).toHaveBeenCalled();
});
