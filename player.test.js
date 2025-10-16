/**
 * @jest-environment jsdom
 */

beforeAll(() => {
  // Importa o script original (isso cria o player global, mesmo que vazio)
  require("./assets/js/player.js");

  // Sobrescreve o player com um mock funcional
  global.player = {
    lvl: 1,
    exp: {
      expCurr: 0,
      expCurrLvl: 0,
      expMax: 100,
    },
    bonusStats: {
      hp: 10,
      atk: 5,
      def: 2,
      atkSpd: 1.2,
      vamp: 0.5,
      critRate: 0.3,
      critDmg: 1.5,
    },
  };

  // Mock de um inimigo básico
  global.enemy = {
    rewards: {
      exp: 50,
    },
  };

  // Mock de funções usadas dentro do player.js
  global.playerLoadStats = jest.fn();
  global.playerLvlUp = window.playerLvlUp;
  global.playerExpGain = window.playerExpGain;
});

describe("Funções do Player", () => {
  test("playerLvlUp deve aumentar o nível e os atributos corretamente", () => {
    const prevLvl = global.player.lvl;
    const prevExpMax = global.player.exp.expMax;

    window.playerLvlUp();

    expect(global.player.lvl).toBe(prevLvl + 1);
    expect(global.player.exp.expMax).toBeGreaterThan(prevExpMax);
    expect(global.player.bonusStats.hp).toBeGreaterThanOrEqual(10);
  });

  test("playerExpGain deve adicionar experiência e chamar playerLoadStats", () => {
    const expAntes = global.player.exp.expCurr;
    const spy = jest.spyOn(global, "playerLoadStats");

    window.playerExpGain();

    expect(global.player.exp.expCurr).toBe(
      expAntes + global.enemy.rewards.exp
    );
    expect(spy).toHaveBeenCalled();
  });
});
