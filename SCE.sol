// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "./extensions/BPContract.sol";

contract SCE is AccessControl, ERC20Burnable {
    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");
    bytes32 public constant SIGNER_ROLE = keccak256("SIGNER_ROLE");

    using ECDSA for bytes32;
    mapping(string => uint) public claimed;

    bool public isInPreventBotMode;
    BPContract public BP;

    event BurnForReason(uint amount, string reason);
    event Claim(address indexed user, string itx, uint amount);

    constructor() ERC20("Slime Royale Cupid Essence", "SCE") {

        _setRoleAdmin(SIGNER_ROLE, OWNER_ROLE);
        _setRoleAdmin(OWNER_ROLE, OWNER_ROLE);
        _setupRole(OWNER_ROLE, msg.sender);
    }

    function burnFor(uint amount, string calldata reason) public {
        _burn(msg.sender, amount);
        emit BurnForReason(amount, reason);
    }

    function claim(address user, string calldata itx, uint amount, uint expire, bytes memory signature) public {
        require(amount > 0, "invalid amount");
        require(claimed[itx] == 0, "itx was claimed");
        require(verifySignature(user, itx, amount, expire, signature), "wrong signature");
        claimed[itx] = amount;

        _mint(user, amount);

        emit Claim(user, itx, amount);
    }

    function verifySignature(address user, string calldata itx, uint amount, uint expire, bytes memory signature)
    internal view returns (bool) {
        require(block.timestamp < expire, "signature expire");
        bytes32 hash = keccak256(abi.encodePacked(user, itx, amount, expire, address(this)));
        bytes32 messageHash = hash.toEthSignedMessageHash();
        address signatory = messageHash.recover(signature);
        return hasRole(SIGNER_ROLE, signatory);
    }

    function togglePreventBotMode() public onlyRole(OWNER_ROLE) {
        isInPreventBotMode = !isInPreventBotMode;
    }

    function setBPContract(address _bp) public onlyRole(OWNER_ROLE) {
        require(_bp == address(0), "invalid address");
        BP = BPContract(_bp);
    }

    function _beforeTokenTransfer(address from, address to, uint amount) internal override(ERC20) {
        if (isInPreventBotMode) {
            BP.protect(from, to, amount);
        }
        super._beforeTokenTransfer(from, to, amount);
    }
}
