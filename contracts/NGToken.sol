// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract NGToken {
  string public name = "NG Token";
  string public symbol = "NGT";
  uint256 public totalSupply;

  event Transfer(
    address indexed _from,
    address indexed _to, 
    uint256 _value
  );

  mapping(address => uint256) public balanceOf;

  constructor() public {
    totalSupply = 1000000;
    balanceOf[msg.sender] = 1000000;
  }

  function transfer(address _to, uint256 _value) public returns (bool success) {
    require(balanceOf[msg.sender] >= _value);

    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;

    emit Transfer(msg.sender, _to, _value);

    return true;
  }
}
