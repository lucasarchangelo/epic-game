// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IERC727Game is IERC721 {
    function receiveDamage(address _from, uint256 damage) external;

    function healMyCat(address _from) external;

    function getNFTAttributesByAddress(address _from)
        external
        returns (uint256, uint256);
}

contract Game is Ownable {
    struct Boss {
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 attackDamage;
    }

    struct DamageOwner {
        address owner;
        uint256 damageIndex;
    }

    // Current Initialized Boss
    Boss public bigBoss;

    // NFT address
    IERC727Game private charToken;

    // Config variables
    uint256 healPrice;
    uint256 attackPrice;
    uint256 minDamage;
    address winner;

    mapping(address => DamageOwner) damageIndex;
    DamageOwner[] damageDealt;
    address[] tickets;

    constructor(
        address _nftChar,
        uint256 _healPrice,
        uint256 _attackPrice,
        uint256 _minDamage,
        string memory bossName,
        string memory bossImageURI,
        uint256 bossHp,
        uint256 bossAttackDamage
    ) {
        charToken = IERC727Game(_nftChar);
        healPrice = _healPrice;
        attackPrice = _attackPrice;
        minDamage = _minDamage;
        bigBoss = Boss({
            name: bossName,
            imageURI: bossImageURI,
            hp: bossHp,
            maxHp: bossHp,
            attackDamage: bossAttackDamage
        });
    }

    function attackBoss() public payable {
        uint256 hp;
        uint256 attackDamage;
        require(
            msg.value == attackPrice,
            "You send the incorrect amount to attack."
        );
        require(charToken.balanceOf(msg.sender) > 0, "You dont have any CHAR.");
        require(bigBoss.hp > 0, "Error: Boss`s HP is zero.");

        (hp, attackDamage) = charToken.getNFTAttributesByAddress(msg.sender);

        require(hp > 0, "Error: Players HP is zero.");

        charToken.receiveDamage(msg.sender, bigBoss.attackDamage);

        (hp, attackDamage) = charToken.getNFTAttributesByAddress(msg.sender);

        if (hp > 0) {
            if (bigBoss.hp <= attackDamage) {
                //If boss hp is smaller than attack, change attack power to bigboss hp.
                attackDamage = bigBoss.hp;
                bigBoss.hp = 0;
                getRandomTicket();
            } else {
                bigBoss.hp = bigBoss.hp - attackDamage;
            }

            uint256 _index = damageIndex[msg.sender].damageIndex;
            address _damageOwner = damageIndex[msg.sender].owner;

            // If this sender alread dealt some damage, add more damage
            if (
                _damageOwner == msg.sender &&
                damageDealt.length > _index &&
                damageDealt[_index].owner == msg.sender
            ) {
                damageDealt[damageIndex[msg.sender].damageIndex]
                    .damageIndex += attackDamage;
                // If its the first time, create a new index for this player
            } else {
                damageIndex[msg.sender].owner = msg.sender;
                damageIndex[msg.sender].damageIndex = damageDealt.length;
                damageDealt.push(DamageOwner(msg.sender, attackDamage));
            }

            // Add tickets count for each minDamage that player dealt
            for (uint256 i = 0; i < attackDamage / minDamage; i++) {
                tickets.push(msg.sender);
            }
        }
    }

    function healMyCat() public payable {
        require(
            msg.value == healPrice,
            "You send the incorrect amount to heal"
        );
        payable(owner()).transfer(msg.value);
        charToken.healMyCat(msg.sender);
    }

    function createNewBoss(
        string memory bossName,
        string memory bossImageURI,
        uint256 bossHp,
        uint256 bossAttackDamage
    ) public onlyOwner {
        require(bigBoss.hp == 0, "Boss didnt die yet!");
        winner = address(0);
        bigBoss.name = bossName;
        bigBoss.imageURI = bossImageURI;
        bigBoss.maxHp = bossHp;
        bigBoss.hp = bossHp;
        bigBoss.attackDamage = bossAttackDamage;

        // Resets config variables
        delete tickets;
        delete damageDealt;
    }

    function claimPrize() public {
        require(msg.sender == winner, "You're not the winner");
        delete winner;
        payable(msg.sender).transfer(address(this).balance);
    }

    function getRandomTicket() private {
        uint256 _index = random() % tickets.length;
        winner = tickets[_index];
    }

    function setAddressToken(address token) public onlyOwner {
        charToken = IERC727Game(token);
    }

    function getAddressToken() public view onlyOwner returns (address ad) {
        return address(charToken);
    }

    function getBossStatus() public view returns (Boss memory _boss) {
        return bigBoss;
    }

    function getHealPrice() public view returns (uint256 _healPrice) {
        return healPrice;
    }

    function getAttackPrice() public view returns (uint256 _attackPrice) {
        return attackPrice;
    }

    function getRanking() public view returns (DamageOwner[] memory _ranking) {
        return damageDealt;
    }

    function getMinDamage() public view returns (uint256 _minDamage) {
        return minDamage;
    }

    function getWinner() public view returns (address _winner) {
        return winner;
    }

    function getTickets() public view returns (address[] memory _tickets) {
        return tickets;
    }

    function random() private view returns (uint256 randomNumber) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.difficulty,
                        block.timestamp,
                        tickets.length
                    )
                )
            );
    }
}
