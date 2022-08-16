const { assert, expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let deployer
          let mockV3Aggregator
          const sendValue = ethers.utils.parseEther("1") //adds 18 zeros to the parameter
          //deploy FundMe
          beforeEach(async function () {
              //deploy FundMe using hardhat deploy

              //the following gets the signing address from config[networks][networkName][accounts]
              // const accounts = await ethers.getSigners()//just for info

              //get the deployer
              deployer = (await getNamedAccounts()).deployer //alternate syntax: { deployer } = await getNamedAccounts()
              //deployments.fixture allows us to use "tags"
              await deployments.fixture(["all"])
              fundMe = await ethers.getContract("FundMe", deployer) //the function gets the most recently deployed contract passed as parameter
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })

          describe("constructor", async function () {
              it("sets the aggregator addresses correctly", async function () {
                  let response = await fundMe.getAggregatorPriceFeedAddress()
                  assert.equal(response, mockV3Aggregator.address)
                  response = await fundMe.getOwner()
                  assert.equal(response, deployer)
              })
          })

          describe("fund", async function () {
              it("fails if insuficient eth sent", async function () {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH!"
                  )
              })

              it("updates the addressToAmountFunded data structure", async function () {
                  await fundMe.fund({ value: sendValue })
                  const amountSent = await fundMe.getAddressToAmountFunded(
                      deployer
                  )
                  assert.equal(amountSent.toString(), sendValue.toString())
              })
              it("adds funder to array of funders", async function () {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.getFunder(0)
                  assert.equal(deployer, funder)
              })
          })

          describe("withdraw", async function () {
              //you need to fund the contract before withdrawal,
              //so start with beforeEach
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })

              it("withdraw ETH from a single funder", async function () {
                  //arrange

                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address) //same as using ethers.provider.getBalance()
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  //act
                  const txResponse = await fundMe.withdraw()
                  const txReceipt = await txResponse.wait(1)

                  const { gasUsed, effectiveGasPrice } = txReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice) //.mul() because big numbers

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString() /**use .add() instead of + because we are getting "big numbers" from blockchain */,
                      endingDeployerBalance.add(gasCost).toString()
                  )
                  //assert
              })

              it("allows us to withdraw with multiple funders", async function () {
                  //Arrange
                  const accounts = await ethers.getSigners()
                  let fundMeConnectedContract
                  //indez zero will be deployer so we will start from index 1
                  for (let i = 1; i < 6; i++) {
                      //we are starting with index 1 because 0 will be the deployer
                      fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  //Act
                  const txResponse = await fundMe.withdraw()
                  const txReceipt = await txResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = txReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )

                  //make sure tha funders are reset properly
                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })

              it("Only allows the owner to withdraw", async function () {
                  const accounts = await ethers.getSigners()
                  const attackerAccount = accounts[1]
                  const connectedAccount = await fundMe.connect(attackerAccount)
                  // await connectedAccount.withdraw()
                  await expect(connectedAccount.withdraw()).to.be.reverted
              })
          })
      })
