/**
 * @jest-environment jsdom
 */

beforeEach(() => {
  // Mock do localStorage
  const store = {};
  global.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => (store[key] = value.toString()),
    clear: () => Object.keys(store).forEach((k) => delete store[k]),
  };

  // Mock do player com valores iniciais válidos
  const fakePlayer = {
    name: "Herói",
    lvl: 1,
    exp: {
      expCurr: 0,
      expCurrLvl: 0,
      expMax: 100,
      expMaxLvl: 100,
      lvlGained: 0,
    },
    stats: {
      hp: 100,
      hpMax: 100,
      atk: 10,
      def: 5,
      atkSpd: 1,
      vamp: 0,
      critRate: 5,
      critDmg: 50,
      hpPercent: 100,
      expPercent: 0,
    },
    bonusStats: {
      hp: 0,
      atk: 0,
      def: 0,
      atkSpd: 0,
      vamp: 0,
      critRate: 0,
      critDmg: 0,
    },
    gold: 100,
    inCombat: false,
  };

  global.enemy = { rewards: { exp: 50 } };

  global.player = fakePlayer;
  window.player = global.player; // 🔥 Garante que player dentro do script seja o mesmo
  localStorage.setItem("playerData", JSON.stringify(fakePlayer));

  // Mock das funções DOM usadas no código
  document.body.innerHTML = `
    <div id="player-name"></div>
    <div id="player-exp"></div>
    <div id="player-gold"></div>
    <div id="bonus-stats"></div>
    <div id="lvlupSelect"></div>
    <div id="lvlupPanel"></div>
  `;

  window.showEquipment = jest.fn();
  window.showInventory = jest.fn();
  window.applyEquipmentStats = jest.fn();
  window.nFormatter = (n) => n;
  window.saveData = jest.fn();
  window.sfxOpen = { play: jest.fn() };
  window.sfxDecline = { play: jest.fn() };
  window.sfxLvlUp = { play: jest.fn() };
  window.sfxItem = { play: jest.fn() };
  window.sfxSell = { play: jest.fn() };
  window.sfxDeny = { play: jest.fn() };
  window.addCombatLog = jest.fn();
  window.combatPanel = document.createElement("div");
  window.combatPanel.id = "combat-panel";
});

// Importa o script após mocks
beforeAll(() => {
  require("../assets/js/player.js");
});

describe("Funções do Player", () => {
  test("playerLvlUp deve aumentar o nível e os atributos corretamente", () => {
    // Garante que o jogador possa subir de nível
    global.player.exp.expCurr = global.player.exp.expMax;
    window.player = global.player;

    const prevLvl = global.player.lvl;
    const prevExpMax = global.player.exp.expMax;

    window.playerLvlUp();

    expect(global.player.lvl).toBe(prevLvl + 1);
    expect(global.player.exp.expMax).toBeGreaterThan(prevExpMax);
    expect(global.player.bonusStats.hp).toBeGreaterThanOrEqual(4);
  });

  test("playerExpGain deve adicionar experiência e chamar playerLoadStats", () => {
    const spy = jest.spyOn(window, "playerLoadStats");
    const expAntes = global.player.exp.expCurr;

    window.playerExpGain();

    expect(global.player.exp.expCurr).toBe(expAntes + global.enemy.rewards.exp);
    expect(spy).toHaveBeenCalled();
  });
});
