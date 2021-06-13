// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract NGToken {
  string public name = "NG Token";
  string public symbol = "NGT";
  uint256 public totalSupply;

  mapping(address => uint256) public balanceOf;

  constructor() public {
    totalSupply = 1000000;
    balanceOf[msg.sender] = 1000000;
  }
}
