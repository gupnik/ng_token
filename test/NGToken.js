const NGToken = artifacts.require("NGToken");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("NGToken", function (/* accounts */) {
  it("should assert true", async function () {
    await NGToken.deployed();
    return assert.isTrue(true);
  });

  it("sets the total supply upon deployment", async function () {
    tokenInstance = await NGToken.deployed();
    totalSupply = await tokenInstance.totalSupply();
    assert(totalSupply.toNumber(), 100000);
  });
});
