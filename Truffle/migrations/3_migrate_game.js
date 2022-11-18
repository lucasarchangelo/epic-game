const Character = artifacts.require("Character");
const Game = artifacts.require("Game");

const GAME_ROLE = "0x6a64baf327d646d1bca72653e2a075d15fd6ac6d8cbd7f6ee03fc55875e0fa88";
const HEAL_PRICE = "10000000000000000";
const ATTACK_PRICE = "10000000000000000";
const MIN_DAMAGE = "25";

module.exports = async function (deployer, _network, accounts) {
    const _instanceNFT = await Character.deployed();

    await deployer.deploy(
        Game,
        _instanceNFT.address,
        HEAL_PRICE,
        ATTACK_PRICE,
        MIN_DAMAGE,
        "Angry Dog",
        "https://i.imgur.com/91cBbh9.jpeg",
        1000,
        50
    );

    const _gameInstance = await Game.deployed();
    await _instanceNFT.grantRole(GAME_ROLE, _gameInstance.address);
};