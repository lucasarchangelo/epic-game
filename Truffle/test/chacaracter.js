const nodeBase64 = require("nodejs-base64-converter");
const Character = artifacts.require("Character");

let characterInstance;

contract("Character", (accounts) => {
  before("start", async () => {
    characterInstance = await Character.deployed();
    await characterInstance.safeMint(accounts[0]);
  });

  it("initialize", async () => {
    assert.ok(characterInstance.address != undefined);
  });

  it("check balance of a minted wallet", async () => {
    const balance = await characterInstance.balanceOf(accounts[0]);
    assert.ok(balance > 0);
  });

  it("Throw error when mint with another account", async () => {
    try {
      await characterInstance.safeMint(accounts[1], {from: accounts[1]});
    } catch (err) {
      return assert.ok(true);
    }
    assert.ok(false);
  });

  it("Check if TokenURI is correct", async () => {
    const tokenURI = await characterInstance.tokenURI(0);
    const response = nodeBase64.decode(tokenURI.split(",")[1]);
    assert.equal(
      JSON.parse(response).description,
      "Esta NFT da acesso ao meu jogo NFT!"
    );
  });
});
