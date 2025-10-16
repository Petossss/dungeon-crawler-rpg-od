/**
 * @jest-environment jsdom
 */

// Mock do localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    clear: () => { store = {}; }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock básico do DOM
document.body.innerHTML = `
  <div id="lvlupSelect"></div>
  <div id="lvlupPanel"></div>
  <div id="player-name"></div>
  <div id="player-exp"></div>
  <div id="player-gold"></div>
  <div id="bonus-stats"></div>
`;

// Mock de funções e variáveis globais
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
global.nFormatter = (n) => n; // função fake que só retorna o número
global.addCombatLog = jest.fn();
global.saveData = jest.fn();
global.showEquipment = jest.fn();
global.showInventory = jest.fn();
global.applyEquipmentStats = jest.fn();
global.sellAll = jest.fn();
global.sellRarityElement = { value: "All", onclick: jest.fn(), onchange: jest.fn(), className: "" };
global.sellAllElement = { onclick: jest.fn() };
global.defaultModalElement = document.createElement('div');

// Mock do player inicial
global.player = {
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

// Importa o arquivo player.js após mocks
import './player.js';

// Agora podemos acessar funções globais criadas pelo player.js
test('playerLvlUp deve aumentar o nível e os atributos corretamente', () => {
  const prevLvl = player.lvl;
  const prevExpMax = player.exp.expMax;

  player.exp.expCurr = 120; // simula que ele atingiu XP suficiente
  playerLvlUp();

  expect(player.lvl).toBe(prevLvl + 1);
  expect(player.exp.expMax).toBeGreaterThan(prevExpMax);
  expect(player.bonusStats.hp).toBeGreaterThan(0);
});

test('playerExpGain deve adicionar experiência e chamar playerLoadStats', () => {
  const spy = jest.spyOn(global, 'playerLoadStats');
  player.exp.expCurr = 0;
  player.exp.expMax = 100;

  playerExpGain();

  expect(player.exp.expCurr).toBeGreaterThan(0);
  expect(spy).toHaveBeenCalled();
});
