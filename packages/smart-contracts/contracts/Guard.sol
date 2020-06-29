// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.7.0;

import "./Auth.sol";

contract Guard is Auth, Authority {
    event LogPermit(
        bytes32 indexed src,
        bytes32 indexed t,
        bytes32 indexed sig
    );

    event LogForbid(
        bytes32 indexed src,
        bytes32 indexed t,
        bytes32 indexed sig
    );

    bytes32 public constant ANY = bytes32(uint256(-1));

    mapping(bytes32 => mapping(bytes32 => mapping(bytes32 => bool))) acl;

    function canCall(
        address src_,
        address t_,
        bytes4 sig
    ) public override view returns (bool) {
        bytes32 src = bytes32(bytes20(src_));
        bytes32 t = bytes32(bytes20(t_));

        return
            acl[src][t][sig] ||
            acl[src][t][ANY] ||
            acl[src][ANY][sig] ||
            acl[src][ANY][ANY] ||
            acl[ANY][t][sig] ||
            acl[ANY][t][ANY] ||
            acl[ANY][ANY][sig] ||
            acl[ANY][ANY][ANY];
    }

    function permit(
        bytes32 src,
        bytes32 t,
        bytes32 sig
    ) public auth {
        acl[src][t][sig] = true;
        emit LogPermit(src, t, sig);
    }

    function forbid(
        bytes32 src,
        bytes32 t,
        bytes32 sig
    ) public auth {
        acl[src][t][sig] = false;
        emit LogForbid(src, t, sig);
    }

    function permit(
        address src,
        address t,
        bytes32 sig
    ) public {
        permit(bytes32(bytes20(src)), bytes32(bytes20(t)), sig);
    }

    function forbid(
        address src,
        address t,
        bytes32 sig
    ) public {
        forbid(bytes32(bytes20(src)), bytes32(bytes20(t)), sig);
    }
}

contract GuardFactory {
    mapping(address => address) public guards;

    function newGuard() public returns (address guard) {
        guard = newGuard(msg.sender);
    }

    function newGuard(address owner) public returns (address guard) {
        guard = address(new Guard());
        Guard(guard).setOwner(owner);
        guards[owner] = guard;
    }
}
