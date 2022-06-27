// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "./extensions/BPContract.sol";

contract SRG is AccessControl, ERC20, ERC20Snapshot {
    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");

    bool public isInPreventBotMode;
    BPContract public BP;

    constructor() ERC20("Slime Royale Gold", "SRG") {

        _setRoleAdmin(OWNER_ROLE, OWNER_ROLE);
        _setupRole(OWNER_ROLE, msg.sender);

        //Community Growth Incentives
        _mint(0xd8Eab13D0e30269ff54a0FC37B36fD261892AB0e, 120000000 * (10 ** decimals()));
        //Play to earn
        _mint(0x8F153dF5765cFdD28403258f9F0Db3f0Fbe38f44, 120000000 * (10 ** decimals()));
        //Ecosystem Fund
        _mint(0xCCa18C0309FCD69547980f4377dc4A9C5fe6A4c0, 100000000 * (10 ** decimals()));
        //Team
        _mint(0xdFa5304a68b4829120382628607Cc4cE655E5Bc7, 200000000 * (10 ** decimals()));
        //Advisor
        _mint(0x08d3239bCCf759214aB40667F297D5F523B74836, 40000000 * (10 ** decimals()));
        //Liquidity & Staking Rewards
        _mint(0xE0e422EC9Bd295BA93d955739dD5e198267Ff529, 300000000 * (10 ** decimals()));
        //Public Sale
        _mint(0x0dC32b68917785dd71163BEA8479A7dCF0CDBDf3, 10000000 * (10 ** decimals()));
        //Private Sale
        _mint(0x4342396043D0991A733F253eD77b0f909DFE1e9c, 80000000 * (10 ** decimals()));
        //Seed Round
        _mint(0x76b7343Ee1C928CCbc35204ae9dD21dd5CB1CaCe, 30000000 * (10 ** decimals()));
    }

    /**
     * Utilities functions
     */
    function snapshot() public onlyRole(OWNER_ROLE) returns (uint) {
        return _snapshot();
    }

    function togglePreventBotMode() public onlyRole(OWNER_ROLE) {
        isInPreventBotMode = !isInPreventBotMode;
    }

    function setBPContract(address _bp) public onlyRole(OWNER_ROLE) {
        require(address(_bp) == address(0), "SRG:: invalid address");
        BP = BPContract(_bp);
    }

    function _beforeTokenTransfer(address from, address to, uint amount) internal override(ERC20, ERC20Snapshot) {
        if (isInPreventBotMode) {
            BP.protect(from, to, amount);
        }
        super._beforeTokenTransfer(from, to, amount);
    }
}
