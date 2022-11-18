const Character = artifacts.require("Character");
const CharacterSale = artifacts.require("CharacterSale");

const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
const MINT_PRICE = "30000000000000000";

module.exports = async function (deployer, _network, accounts) {
    const _instanceNFT = await Character.deployed();

    await deployer.deploy(
        CharacterSale,
        _instanceNFT.address,
        MINT_PRICE
    );

    const _saleInstance = await CharacterSale.deployed();
    await _instanceNFT.grantRole(MINTER_ROLE, _saleInstance.address);
};