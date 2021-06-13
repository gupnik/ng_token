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
    assert.equal(tokenName, "NG Token");
    assert.equal(tokenSymbol, "NGT");
  });

  it("sets the total supply upon deployment", async function () {
    tokenInstance = await NGToken.deployed();
    totalSupply = await tokenInstance.totalSupply();
    assert.equal(totalSupply.toNumber(), 1000000);
  });

  it("is owned entirely be creator upon deployment", async function() {
    tokenInstance = await NGToken.deployed();
    balance = await tokenInstance.balanceOf(accounts[0]);
    assert.equal(balance.toNumber(), 1000000);
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
    assert.equal(thrown, true);
    result = await tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] });
    assert.equal(result, true);
    receipt = await tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] });
    assert.equal(receipt.logs.length, 1);
    assert.equal(receipt.logs[0].event, "Transfer");
    assert.equal(receipt.logs[0].args._from, accounts[0]);
    assert.equal(receipt.logs[0].args._to, accounts[1]);
    assert.equal(receipt.logs[0].args._value, 250000);
    receiverBalance = await tokenInstance.balanceOf(accounts[1]);
    assert.equal(receiverBalance.toNumber(), 250000, 'adds the amount to receiver');
    senderBalance = await tokenInstance.balanceOf(accounts[0]);
    assert.equal(senderBalance.toNumber(), 750000, 'deducts the amount from sender');
  });

  it("approves tokens for delegated transfer", async function() {
    tokenInstance = await NGToken.deployed();
    result = await tokenInstance.approve.call(accounts[1], 100);
    assert.equal(result, true);
    receipt = await tokenInstance.approve(accounts[1], 100);
    assert.equal(receipt.logs.length, 1);
    assert.equal(receipt.logs[0].event, "Approval");
    assert.equal(receipt.logs[0].args._owner, accounts[0]);
    assert.equal(receipt.logs[0].args._spender, accounts[1]);
    assert.equal(receipt.logs[0].args._value, 100);
    allowance = await tokenInstance.allowance(accounts[0], accounts[1]);
    assert.equal(allowance.toNumber(), 100);
  });

  it("handles delegated token transfers", async function() {
    tokenInstance = await NGToken.deployed();
    fromAccount = accounts[2];
    toAccount = accounts[3];
    spendingAccount = accounts[4];

    //Setup
    await tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });

    receipt = await tokenInstance.approve(spendingAccount, 10, { from: fromAccount });
    let thrown  = false; 
    try {
      await tokenInstance.transferFrom(fromAccount, toAccount, 999999, { from: spendingAccount });
    } catch (error) {
      thrown = true;
      assert(error.message.indexOf("revert") >= 0, "cannot transfer value larger than balance amount");
    }
    assert.equal(thrown, true, "cannot transfer value larger than balance amount");

    thrown  = false; 
    try {
      await tokenInstance.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount });
    } catch (error) {
      thrown = true;
      assert(error.message.indexOf("revert") >= 0, "cannot transfer value larger than approved amount");
    }
    assert.equal(thrown, true, "cannot transfer value larger than approved amount");

    result = await tokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
    assert.equal(result, true);

    receipt = await tokenInstance.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount });
    assert.equal(receipt.logs.length, 1);
    assert.equal(receipt.logs[0].event, "Transfer");
    assert.equal(receipt.logs[0].args._from, fromAccount);
    assert.equal(receipt.logs[0].args._to, toAccount);
    assert.equal(receipt.logs[0].args._value, 10);

    receiverBalance = await tokenInstance.balanceOf(toAccount);
    assert.equal(receiverBalance.toNumber(), 10, 'adds the amount to receiver');
    senderBalance = await tokenInstance.balanceOf(fromAccount);
    assert.equal(senderBalance.toNumber(), 90, 'deducts the amount from sender');
    allowance = await tokenInstance.allowance(fromAccount, spendingAccount);
    assert.equal(allowance.toNumber(), 0, 'deducts the amount from the allowance');
  });
});
