// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./extensions/BPContract.sol";

contract SCE is ERC20, AccessControl {
    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint public MAX_SUPPLY = 25_000_000_000 * (10 ** decimals());
    uint public DAILY_MINT = 12_500_000 * (10 ** decimals());
    address public CLAIM_POOL;

    bool public isInPreventBotMode;
    BPContract public BP;

    constructor() ERC20("Slime Royale Cupid Essence", "SCE") {

        _setRoleAdmin(MINTER_ROLE, OWNER_ROLE);
        _setRoleAdmin(OWNER_ROLE, OWNER_ROLE);
        _setupRole(OWNER_ROLE, msg.sender);

        //Pre-mint for LP & play-to-earn early rewards
        _mint(msg.sender, 100_000_000 * (10 ** decimals()));
    }

    function burn(uint amount) public {
        MAX_SUPPLY -= amount;
        _burn(msg.sender, amount);
    }

    function mint() external onlyRole(MINTER_ROLE) {
        require(CLAIM_POOL != address(0), "SCE:: must be config claim pool");
        uint supplyAfterMint = totalSupply() + DAILY_MINT;
        uint amount = supplyAfterMint > MAX_SUPPLY ? MAX_SUPPLY - totalSupply() : DAILY_MINT;
        require(amount > 0, "SCE:: max minted");
        _mint(CLAIM_POOL, amount);
    }

    function togglePreventBotMode() public onlyRole(OWNER_ROLE) {
        isInPreventBotMode = !isInPreventBotMode;
    }

    function setBPContract(address _bp) public onlyRole(OWNER_ROLE) {
        require(_bp != address(0), "invalid address");
        BP = BPContract(_bp);
    }

    function updateClaimPool(address pool) public onlyRole(OWNER_ROLE) {
        require(pool != address(0), "invalid address");
        CLAIM_POOL = pool;
    }

    function updateDailyMint(uint amount) public onlyRole(OWNER_ROLE) {
        require(amount > 0, "invalid amount");
        DAILY_MINT = amount;
    }

    function _beforeTokenTransfer(address from, address to, uint amount) internal override(ERC20) {
        if (isInPreventBotMode) {
            BP.protect(from, to, amount);
        }
        super._beforeTokenTransfer(from, to, amount);
    }
}
