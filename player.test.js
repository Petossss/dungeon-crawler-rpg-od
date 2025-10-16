/**
 * @jest-environment jsdom
 */

// Carrega o player.js para definir as funções globais
require('./assets/js/player.js');

// Cria mocks básicos para o ambiente de jogo
global.player = {
  lvl: 1,
  exp: { expCurr: 0, expMax: 100, expCurrLvl: 0, expMaxLvl: 100 },
  bonusStats: { hp: 0, atk: 0, def: 0 },
};
global.enemy = { rewards: { exp: 50 } };
global.playerLoadStats = jest.fn();

// Testa o level up
test('playerLvlUp deve aumentar o nível e os atributos corretamente', () => {
  const prevLvl = player.lvl;
  const prevExpMax = player.exp.expMax;

  // Chama função global definida no player.js
  global.playerLvlUp();

  expect(player.lvl).toBe(prevLvl + 1);
  expect(player.exp.expMax).toBeGreaterThan(prevExpMax);
});

// Testa ganho de experiência
test('playerExpGain deve adicionar experiência e chamar playerLoadStats', () => {
  const expAntes = player.exp.expCurr;

  global.playerExpGain();

  expect(player.exp.expCurr).toBe(expAntes + enemy.rewards.exp);
  expect(global.playerLoadStats).toHaveBeenCalled();
});
