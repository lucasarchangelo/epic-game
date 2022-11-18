const web3 = require('web3');
const Game = artifacts.require("Game");
const Character = artifacts.require("Character");

let characterInstance;
let gameInstance;

contract("Game", (accounts) => {

    before("start", async () => {
        characterInstance = await Character.deployed();
        gameInstance = await Game.deployed();
        await characterInstance.safeMint(accounts[0]);
    });

    it("initialize", async () => {
        assert.ok(gameInstance.address != undefined);
    });

    it("check if address token is correct", async () => {
        const addressToken = await gameInstance.getAddressToken();
        assert.equal(addressToken, characterInstance.address);
    });

    it("attack the boss and check if player and boos healh went down", async () => {
        const beforeAttackPlayerAttributes = await characterInstance.getNFTAttributesByAddress(accounts[0]);
        await gameInstance.attackBoss();
        const bigBoss = await gameInstance.bigBoss.call();
        const afterAttackPlayerAttributes = await characterInstance.getNFTAttributesByAddress(accounts[0]);
        
        assert.ok(beforeAttackPlayerAttributes.hp < afterAttackPlayerAttributes);
        assert.ok(web3.utils.toNumber(bigBoss.hp) <  web3.utils.toNumber(bigBoss.maxHp));
    });
});
