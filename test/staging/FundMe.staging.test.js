const { ethers, deployments, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")

//alternate if/else notation:
//if (x){ action } else { otherAction}
//x ? action : otherAction
//let var = x ? action : otherAction
developmentChains.includes(network.name)
    ? describe.skip //the question mark is another if statement, basically saying if the previous condition is true, continue to next
    : describe("FundMe", async function () {
          let fundMe, deployer, txResponse, txReceipt
          const sendValue = ethers.utils.parseEther("1")

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })

          it("allows people to fund and withdraw", async function () {
              await (await fundMe.fund({ value: sendValue })).wait(1)
              await (await fundMe.withdraw()).wait(1)
              const endingBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )
              assert.equal(endingBalance.toString(), "0")
          })
      })
