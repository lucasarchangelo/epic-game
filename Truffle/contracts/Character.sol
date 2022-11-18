// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract Character is ERC721, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant GAME_ROLE = keccak256("GAME_ROLE");
    Counters.Counter private _tokenIdCounter;

    struct CharacterAttributes {
        uint256 characterIndex;
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 attackDamage;
    }

    struct BigBoss {
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 attackDamage;
    }

    CharacterAttributes[] defaultCharacters;

    mapping(uint256 => CharacterAttributes) public nftHolderAttributes;
    mapping(address => uint256) public nftHolders;

    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint256[] memory characterHp,
        uint256[] memory characterAttackDmg
    ) ERC721("Character", "CHAR") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(GAME_ROLE, msg.sender);

        for (uint256 i = 0; i < characterNames.length; i += 1) {
            defaultCharacters.push(
                CharacterAttributes({
                    characterIndex: i,
                    name: characterNames[i],
                    imageURI: characterImageURIs[i],
                    hp: characterHp[i],
                    maxHp: characterHp[i],
                    attackDamage: characterAttackDmg[i]
                })
            );
        }

        // Increment counter to initialize with id 1
        _tokenIdCounter.increment();
    }

    function safeMint(address _to) public onlyRole(MINTER_ROLE) {
        require(balanceOf(_to) == 0, "You must have just one CHAR.");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(_to, tokenId);
        nftHolderAttributes[tokenId] = defaultCharacters[getRandomNFT()];
        nftHolderAttributes[tokenId].characterIndex = tokenId;
        nftHolders[_to] = tokenId;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        CharacterAttributes memory charAttributes = nftHolderAttributes[
            _tokenId
        ];

        string memory strHp = Strings.toString(charAttributes.hp);
        string memory strMaxHp = Strings.toString(charAttributes.maxHp);
        string memory strAttackDamage = Strings.toString(
            charAttributes.attackDamage
        );

        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                charAttributes.name,
                " -- NFT #: ",
                Strings.toString(_tokenId),
                '", "description": "Esta NFT da acesso ao meu jogo NFT!", "image": "',
                charAttributes.imageURI,
                '", "attributes": [ { "trait_type": "Health Points", "value": ',
                strHp,
                ', "max_value":',
                strMaxHp,
                '}, { "trait_type": "Attack Damage", "value": ',
                strAttackDamage,
                "} ]}"
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    function receiveDamage(address _from, uint256 damage)
        public
        onlyRole(GAME_ROLE)
    {
        CharacterAttributes storage attributes = nftHolderAttributes[
            nftHolders[_from]
        ];
        if (attributes.hp <= damage) {
            attributes.hp = 0;
        } else {
            attributes.hp -= damage;
        }
    }

    function healMyCat(address _from) public onlyRole(GAME_ROLE) {
        CharacterAttributes storage attributes = nftHolderAttributes[
            nftHolders[_from]
        ];
        attributes.hp = attributes.maxHp;
    }

    function getNFT(address _from)
        public
        view
        returns (CharacterAttributes memory char)
    {
        return nftHolderAttributes[nftHolders[_from]];
    }

    function getNFTAttributesByAddress(address _from)
        public
        view
        returns (uint256 hp, uint256 attackDamage)
    {
        return (
            nftHolderAttributes[nftHolders[_from]].hp,
            nftHolderAttributes[nftHolders[_from]].attackDamage
        );
    }

    function getRandomNFT() private view returns (uint256 nftRandom) {
        return random() % defaultCharacters.length;
    }

    function random() private view returns (uint256 randomNumber) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.difficulty,
                        block.timestamp,
                        defaultCharacters.length
                    )
                )
            );
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
