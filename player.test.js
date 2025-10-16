/**
 * @jest-environment jsdom
 */

// ✅ Recarrega o módulo do player depois de configurar o ambiente
beforeEach(() => {
  // Limpa o cache dos módulos (para forçar reload do player.js)
  jest.resetModules();

  // Simula dados de jogador no localStorage
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

  // ✅ Mock de localStorage
  global.localStorage = {
    store: {},
    getItem(key) { return this.store[key] || null; },
    setItem(key, value) { this.store[key] = value.toString(); },
    clear() { this.store = {}; }
  };

  localStorage.setItem("playerData", JSON.stringify(fakePlayer));

  // ✅ Mocks de dependências do jogo
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
  `;

  // ✅ Importa o player.js só depois de configurar o ambiente
  require('./assets/js/player.js');
});

// 🔹 Testes
test('playerLvlUp deve aumentar o nível e os atributos corretamente', () => {
  const player = JSON.parse(localStorage.getItem("playerData"));
  const prevLvl = player.lvl;
  const prevExpMax = player.exp.expMax;

  window.playerLvlUp();

  expect(player.lvl).toBe(prevLvl + 1);
  expect(player.exp.expMax).toBeGreaterThan(prevExpMax);
  expect(player.bonusStats.hp).toBeGreaterThan(0);
});

test('playerExpGain deve adicionar experiência e chamar playerLoadStats', () => {
  const player = JSON.parse(localStorage.getItem("playerData"));
  const spy = jest.spyOn(window, 'playerLoadStats');
  const expAntes = player.exp.expCurr;

  window.playerExpGain();

  expect(player.exp.expCurr).toBe(expAntes + global.enemy.rewards.exp);
  expect(spy).toHaveBeenCalled();
});

