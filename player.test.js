/**
 * Testes para player.js
 * Simula comportamento básico de level up e ganho de experiência.
 */

beforeEach(() => {
  // Mock básico do objeto global player
  global.player = {
    lvl: 1,
    exp: { expCurr: 0, expCurrLvl: 0, expMax: 100 },
    atk: 10,
    def: 5,
    vit: 10,
    hp: { curr: 10, max: 10 },
    mp: { curr: 5, max: 5 }
  };

  // Mock de inimigo
  global.enemy = {
    rewards: { exp: 50 }
  };

  // Mock da função playerLoadStats, chamada por playerExpGain
  global.playerLoadStats = jest.fn();
});

// Importa o código a ser testado (ajuste o caminho conforme a estrutura real)
const { playerLvlUp, playerExpGain } = require('./assets/js/player.js');

test('playerLvlUp deve aumentar o nível e os atributos corretamente', () => {
  const prevLvl = player.lvl;
  const prevExpMax = player.exp.expMax;
  const prevAtk = player.atk;
  const prevDef = player.def;

  player.exp.expCurr = 120; // Simula XP suficiente para upar
  playerLvlUp();

  expect(player.lvl).toBe(prevLvl + 1);
  expect(player.exp.expMax).toBeGreaterThan(prevExpMax);
  expect(player.atk).toBeGreaterThan(prevAtk);
  expect(player.def).toBeGreaterThan(prevDef);
});

test('playerExpGain deve adicionar experiência e chamar playerLoadStats', () => {
  const expAntes = player.exp.expCurr;

  playerExpGain();

  expect(player.exp.expCurr).toBe(expAntes + enemy.rewards.exp);
  expect(global.playerLoadStats).toHaveBeenCalled();
});
