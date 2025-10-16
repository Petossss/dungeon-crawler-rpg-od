/**
 * @jest-environment jsdom
 */

describe("Funções do Player", () => {

  // 1️⃣ Mocka o localStorage ANTES de importar player.js
  const fakePlayerData = JSON.stringify({
    name: "Hero",
    lvl: 1,
    exp: {
      expCurr: 0,
      expMax: 100,
      expCurrLvl: 0,
      expMaxLvl: 100,
      lvlGained: 0
    },
    stats: {
      hp: 100,
      hpMax: 100,
      atk: 10,
      def: 5,
      atkSpd: 1,
      vamp: 0,
      critRate: 5,
      critDmg: 50
    },
    bonusStats: {
      hp: 0,
      atk: 0,
      def: 0,
      atkSpd: 0,
      vamp: 0,
      critRate: 0,
      critDmg: 0
    },
    gold: 100,
    inCombat: false
  });

  beforeAll(() => {
    // Mock de localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => fakePlayerData),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });

    // Mock básico do DOM (evita erros de querySelector)
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

    // Mocka elementos de stats
    global.playerHpElement = document.createElement("div");
    global.playerAtkElement = document.createElement("div");
    global.playerDefElement = document.createElement("div");
    global.playerAtkSpdElement = document.createElement("div");
    global.playerVampElement = document.createElement("div");
    global.playerCrateElement = document.createElement("div");
    global.playerCdmgElement = document.createElement("div");

    // Mock de funções globais e sons
    global.sfxOpen = { play: jest.fn() };
    global.sfxDecline = { play: jest.fn() };
    global.sfxSell = { play: jest.fn() };
    global.sfxItem = { play: jest.fn() };
    global.sfxLvlUp = { play: jest.fn() };
    global.sfxDeny = { play: jest.fn() };
    global.dungeon = { status: { exploring: true, paused: false } };
    global.enemy = { rewards: { exp: 50 } };
    global.playerDead = false;
    global.combatPanel = document.createElement("div");
    global.sellAllElement = document.createElement("button");
    global.sellRarityElement = { value: "All" };
    global.defaultModalElement = document.createElement("div");
    global.addCombatLog = jest.fn();
    global.saveData = jest.fn();
    global.showEquipment = jest.fn();
    global.showInventory = jest.fn();
    global.applyEquipmentStats = jest.fn();
    global.sellAll = jest.fn();
    global.nFormatter = (n) => n; // não formata, só retorna o número
  });

  // Importa o player.js só DEPOIS do mock estar pronto
  beforeAll(() => {
    require("./assets/js/player.js");
  });

  beforeEach(() => {
    // Reinicializa o jogador antes de cada teste
    global.player = JSON.parse(fakePlayerData);
  });

  // 2️⃣ Testes
  test("playerLvlUp deve aumentar o nível e os atributos corretamente", () => {
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

