const Character = artifacts.require("Character");

module.exports = async function (deployer, _network, accounts) {
  await deployer.deploy(
    Character,
    ["Common CAT", "RARE CAT", "EPIC CAT 3"],
    [
      "https://i.imgur.com/wYTCtRu.jpeg",
      "https://i.imgur.com/EpHpQ1t.jpeg",
      "https://i.imgur.com/YP7oS9H.jpeg",
    ],
    [100, 200, 300],
    [25, 50, 100]
  );
};
