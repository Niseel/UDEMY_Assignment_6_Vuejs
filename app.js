function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const app = Vue.createApp({
  data() {
    return {
      maximunMonsterHP: 100,
      maximunplayerHP: 100,
      monsterHP: 100,
      playerHP: 100,
      round: 0,
      winner: null,
      logMessages: [],
    };
  },
  watch: {
    monsterHP(value) {
      if (value <= 0 && this.playerHP <= 0) {
        // A draw
        this.winner = "draw";
      } else if (value <= 0) {
        // Monster lose
        this.winner = "player";
      }
      return value;
    },
    playerHP(value) {
      if (value <= 0 && this.monsterHP <= 0) {
        // A draw
        this.winner = "draw";
      } else if (value <= 0) {
        // Player lose
        this.winner = "monster";
      }
      return value;
    },
  },
  computed: {
    renderMonsterHP() {
      const nextHealValue = this.monsterHP >= 0 ? this.monsterHP : 0;
      return { width: nextHealValue + "%" };
    },
    renderPlayerHP() {
      const nextHealValue = this.playerHP >= 0 ? this.playerHP : 0;
      return { width: nextHealValue + "%" };
    },
    unlockSpecialAttack() {
      return this.round && this.round % 3 === 0 ? false : true;
    },
  },
  methods: {
    playerAttack() {
      this.round++;
      const attackValue = getRandomNumberBetween(2, 10);
      this.monsterHP = this.monsterHP - attackValue;
      this.addLogData("Player", "Attack", attackValue);
      this.monsterAttack();
    },
    playerSpecialAttack() {
      this.round++;
      const attackValue = getRandomNumberBetween(20, 50);
      this.monsterHP = this.monsterHP - attackValue;
      this.addLogData("Player", "Special Attack", attackValue);
    },
    playerHeal() {
      this.round++;
      const healValue = getRandomNumberBetween(10, 15);
      this.playerHP =
        this.playerHP + healValue >= this.smaximunPlayerHP
          ? this.smaximunPlayerHP
          : this.playerHP + healValue;
      this.addLogData("Player", "heal", healValue);
      this.monsterAttack();
    },
    playerSurrender() {
      this.playerHP = 0;
      this.addLogData("Player", "Surrender", 0);
    },
    monsterAttack() {
      const attackValue = getRandomNumberBetween(5, 10);
      this.playerHP = this.playerHP - attackValue;
      this.addLogData("Monster", "Attack", attackValue);
    },

    resetData() {
      this.monsterHP = 100;
      this.playerHP = 100;
      this.round = 0;
      this.winner = null;
      this.addLogData("Game", "Reset", 0);
      this.addLogData("--------", "----------", "------");
    },

    addLogData(who, action, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: action,
        actionValue: value,
      });
    },
  },
});

app.mount("#game");
