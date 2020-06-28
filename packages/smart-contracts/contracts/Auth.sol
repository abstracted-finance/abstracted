// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

interface Authority {
    function canCall(
        address src,
        address t,
        bytes4 sig
    ) external view returns (bool);
}

contract Auth {
    address public authority;
    address public owner;

    event LogSetAuthority(address indexed authority);
    event LogSetOwner(address indexed owner);

    constructor() public {
        owner = msg.sender;
        emit LogSetOwner(msg.sender);
    }

    function setOwner(address owner_) public auth {
        owner = owner_;
        emit LogSetOwner(owner);
    }

    function setAuthority(address authority_) public auth {
        authority = authority_;
        emit LogSetAuthority(address(authority));
    }

    modifier auth {
        require(isAuthorized(msg.sender, msg.sig), "auth-unauthorized");
        _;
    }

    function isAuthorized(address src, bytes4 sig)
        internal
        view
        returns (bool)
    {
        if (src == address(this)) {
            return true;
        } else if (src == owner) {
            return true;
        } else if (authority == address(0)) {
            return false;
        } else {
            return Authority(authority).canCall(src, address(this), sig);
        }
    }
}
