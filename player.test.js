/**
 * @jest-environment jsdom
 */

// Cria mocks antes de importar player.js
beforeAll(() => {
  global.player = {
    lvl: 1,
    exp: { expCurr: 0, expCurrLvl: 0, expMax: 100 },
    bonusStats: { hp: 10, atk: 5, def: 3 },
  };

  global.enemy = {
    rewards: { exp: 50 },
  };

  global.playerLoadStats = jest.fn();

  // Agora importamos o player.js, que depende dessas variáveis
  require("./assets/js/player.js");
});

describe("Funções do Player", () => {
  test("playerLvlUp deve aumentar o nível e os atributos corretamente", () => {
    const prevLvl = global.player.lvl;
    const prevExpMax = global.player.exp.expMax;

    // Garante que player não está null
    expect(global.player).not.toBeNull();

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
