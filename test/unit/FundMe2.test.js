// const { assert, expect } = require("chai")
// const { deployments, ethers, getNamedAccounts, log } = require("hardhat")

// describe("FundMe", async function () {
//     let deployer, fundMe, mockV3Aggregator
//     const fundAmount = ethers.utils.parseEther("1") //also look at ethers.parseUnits()

//     beforeEach(async function () {
//         deployer = (await getNamedAccounts()).deployer
//         await deployments.fixture(["all"])
//         fundMe = await ethers.getContract("FundMe", deployer)
//         mockV3Aggregator = await ethers.getContract(
//             "MockV3Aggregator",
//             deployer
//         )
//     })

//     describe("constructor", async function () {
//         it("runs the constructor", async function () {
//             const response = await fundMe.aggregatorPriceFeedAddress()
//             assert.equal(response, mockV3Aggregator.address)
//         })
//     })

//     describe("fund", async function () {
//         it("fails if insufficient eth sent", async function () {
//             await expect(fundMe.fund()).to.be.revertedWith(
//                 "You need to spend more ETH!"
//             )
//         })
//         it("updates the addressToAmountFunded data structure", async function () {
//             const amountReceived = await fundMe.addressToAmountFunded(deployer)
//             assert.equal(amountReceived.toString(), fundAmount)
//         })
//         it("adds funder to array of funders", async function () {
//             await fundMe.fund({ value: fundAmount })
//             const funder = await fundMe.funders(0)
//             assert.equal(deployer, funder)
//         })
//     })

//     describe("withdraw", async function () {
//         //need to fund contract before withdrawal
//         beforeEach(async function () {
//             await fundMe.fund({ value: fundAmount })
//         })

//         it("withdraw ETH from a single funder", async function () {
//             const startingFundMeBalance = await fundMe.provider.getBalance(
//                 fundMe.address
//             )
//             const startingDeployerBalance = await fundMe.provider.getBalance(
//                 deployer
//             )
//         })
//     })
// })
