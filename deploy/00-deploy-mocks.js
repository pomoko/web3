const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    log(`Mocks deploying to the network: ${network.name}`)

    //if the chain id includes one of the dev chains, deploy mocks
    if (developmentChains.includes(network.name)) {
        log("Local network detected. Deploying mocks...")
        const mock = await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator", //redundant but explicit
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER], //these are the values of the constructor for MockVsAggregator.sol
        })
        log("Mocks deployed!")
        log("-------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
