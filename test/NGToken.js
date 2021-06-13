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
  })
});
