const NGToken = artifacts.require("NGToken");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("NGToken", function (accounts) {
  it("should assert true", async function () {
    await NGToken.deployed();
    return assert.isTrue(true);
  });

  it("has correct name and symbol", async function() {
    tokenInstance = await NGToken.deployed();
    tokenName = await tokenInstance.name();
    tokenSymbol = await tokenInstance.symbol();
    assert(tokenName, "NG Token");
    assert(tokenSymbol, "NGT");
  });

  it("sets the total supply upon deployment", async function () {
    tokenInstance = await NGToken.deployed();
    totalSupply = await tokenInstance.totalSupply();
    assert(totalSupply.toNumber(), 100000);
  });

  it("is owned entirely be creator upon deployment", async function() {
    tokenInstance = await NGToken.deployed();
    balance = await tokenInstance.balanceOf(accounts[0]);
    assert(balance.toNumber(), 100000);
  });

  it("transfers token ownership", async function() {
    tokenInstance = await NGToken.deployed();
    let thrown  = false;
    try {
      await tokenInstance.transfer.call(accounts[1], 99999999999);
    } catch (error) {
      thrown = true;
      assert(error.message.indexOf("revert") >= 0);
    } 
    assert(thrown, true);
    result = await tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] });
    assert(result, true);
    receipt = await tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] });
    assert(receipt.logs.length, 1);
    assert(receipt.logs[0].event, "Transfer");
    assert(receipt.logs[0].args._from, accounts[0]);
    assert(receipt.logs[0].args._to, accounts[1]);
    assert(receipt.logs[0].args._value, 250000);
    receiverBalance = await tokenInstance.balanceOf(accounts[1]);
    assert(receiverBalance.toNumber(), 250000, 'adds the amount to receiver');
    senderBalance = await tokenInstance.balanceOf(accounts[0]);
    assert(senderBalance.toNumber(), 750000, 'deducts the amount from sender');
  });
});
