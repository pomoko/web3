// const { deployments, ethers, network, getNamedAccounts } = require("hardhat")
// const { expect, assert } = require("chai")
// const { developmentChains } = require("../../helper-hardhat-config")

// developmentChains.includes(network.name)
//     ? describe.skip
//     : describe("FundMe", async function () {

//         let fundMe, deployer
//         const sendValue = ethers.utils.parseEther("1")

//         beforeEach(async function(){
//             deployer = (await getNamedAccounts()).deployer
//             fundMe = await ethers.getContract("FundMe", deployer)
//         })

//         it("allows practice to fund and withdraw", async function(){
//             await fundMe.fund({value:sendValue})
//             await fundMe.withdraw()
//         })
//     })
