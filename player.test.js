/**
 * @jest-environment jsdom
 */

require('./assets/js/player.js');

// Mocks básicos de DOM e funções que o player.js usa
beforeAll(() => {
  document.body.innerHTML = `
    <div id="player-name"></div>
    <div id="player-exp"></div>
    <div id="player-gold"></div>
    <div id="bonus-stats"></div>
    <div id="player-hp-battle"></div>
    <div id="player-hp-dmg"></div>
    <div id="player-exp-bar"></div>
    <div id="player-combat-info"></div>
  `;

  global.nFormatter = (val) => val; // mock simples
  global.showEquipment = jest.fn();
  global.showInventory = jest.fn();
  global.applyEquipmentStats = jest.fn();
  global.playerHpElement = document.createElement('div');
  global.playerAtkElement = document.createElement('div');
  global.playerDefElement = document.createElement('div');
  global.playerAtkSpdElement = document.createElement('div');
  global.playerVampElement = document.createElement('div');
  global.playerCrateElement = document.createElement('div');
  global.playerCdmgElement = document.createElement('div');
  global.playerDead = false;
});

beforeEach(() => {
  // Mocka o player e o inimigo
  global.player = {
    name: 'Hero',
    lvl: 1,
    exp: {
      expCurr: 0,
      expMax: 100,
      expCurrLvl: 0,
      expMaxLvl: 100,
      lvlGained: 0
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
    stats: {
      hp: 100,
      hpMax: 100,
      atk: 10,
      def: 5,
      atkSpd: 1.0,
      vamp: 0,
      critRate: 0,
      critDmg: 0
    },
    gold: 100,
    inCombat: false
  };

  global.enemy = {
    rewards: {
      exp: 150 // força o level up
    }
  };
});

describe('Funções do Player', () => {
  test('playerLvlUp deve aumentar o nível e os atributos corretamente', () => {
    const prevLvl = global.player.lvl;
    const prevExpMax = global.player.exp.expMax;

    window.playerLvlUp();

    expect(global.player.lvl).toBe(prevLvl + 1);
    expect(global.player.exp.expMax).toBeGreaterThan(prevExpMax);
    expect(global.player.bonusStats.hp).toBeGreaterThan(0);
    expect(global.player.bonusStats.atk).toBeGreaterThan(0);
    expect(global.player.bonusStats.def).toBeGreaterThan(0);
  });

  test('playerExpGain deve adicionar experiência e chamar playerLoadStats', () => {
    const spy = jest.spyOn(window, 'playerLoadStats');

    const expAntes = global.player.exp.expCurr;
    window.playerExpGain();
    const expDepois = global.player.exp.expCurr;

    expect(expDepois).toBeGreaterThan(expAntes);
    expect(global.player.lvl).toBe(2); // deve subir de nível
    expect(spy).toHaveBeenCalled();
  });
});
