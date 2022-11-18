// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface ICharacterNFT is IERC721 {
    function safeMint(address to) external;
}

contract CharacterSale is Ownable {

    ICharacterNFT private charToken;

    uint256 public price;

    constructor(address _nftChar, uint256 _price) {
        charToken = ICharacterNFT(_nftChar);
        price = _price;
    }

    function setPrice(uint256 _price) public onlyOwner {
        price = _price;
    }

    function getPrice() public view returns (uint256 _price) {
        return price;
    }

    function buyCharacter() public payable { 
        require(msg.value == price);
        payable(owner()).transfer(msg.value);
        charToken.safeMint(msg.sender);
    }
}