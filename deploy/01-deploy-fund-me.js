const { network } = require("hardhat")
const {
    networkConfig,
    developmentChains,
    etherChainIds,
    polygonChainIds,
} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config()
// //above notation is the same as the following:
// const helperConfig = require("../helper-hardhat-config")
// const networkConfig = helperConfig.networkConfig

// async function deployFunc(hre){
//     hre.getNamedAccounts()
//     hre.deployments()
// }
// module.exports.default = deployFunc
////----------------------------------------------//
// //above can be simplified to:
// module.exports = async (hre) => {
//     const { geNamedAccounts, deployments } = hre
// }
//above can be simplified to:
//refer to below link for docs
//https://github.com/wighawag/hardhat-deploy
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts() //this extracts the accounts under "namedAccounts" in config file
    const chainId = network.config.chainId

    log(`Contract deploying to the network: ${network.name}`)
    log(`Deployer is: ${deployer}`)

    //get the Aggregator address dynamically using the chainId
    //to do that, create a file in the root (helper-hardhat-config.js)
    //when going for localhost or hardhat network we want to use a "mock"
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
        log(`yes it is coming here indeed with: ${ethUsdPriceFeedAddress}`)
    } else {
        ethUsdPriceFeedAddress =
            networkConfig[chainId]["ethUsdPriceFeedAddress"]
    }
    //if the contract doesn't exist, we deploy a minimal version for local testing
    //create another file in the deploy folder (00-deploy-mocks.js). Give the file a name that would precede the main deploy file
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe" /*name of file*/, {
        from: deployer,
        args: args, //put price feed address here
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    //contract verification
    if (!developmentChains.includes(network.name)) {
        log("came right here")
        if (etherChainIds.includes(chainId) && process.env.ETHERSCAN_API_KEY) {
            //await verify(fundMe.address, args)
        } else if (
            polygonChainIds.includes(chainId) &&
            process.env.POLYGONSCAN_API_KEY
        ) {
            //await verify(fundMe.address, args)
        }
    }
    log("------------------------------------------")
}

module.exports.tags = ["all", "fundme"]
