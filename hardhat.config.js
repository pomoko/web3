require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("solidity-coverage")
require("hardhat-gas-reporter")

/** @type import('hardhat/config').HardhatUserConfig */

const ALCHEMY_ETHEREUM_RINKEBY_RPC_URL =
    process.env.ALCHEMY_ETHEREUM_RINKEBY_RPC_URL || "https://eth-rinkeby"
const ALCHEMY_ETHEREUM_GOERLI_RPC_URL =
    process.env.ALCHEMY_ETHEREUM_GOERLI_RPC_URL || "https://eth-rinkeby"
const ALCHEMY_POLYGON_MUMBAI_RPC_URL =
    process.env.ALCHEMY_POLYGON_MUMBAI_RPC_URL || "https://pol-mumbai"
const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY || "0xkey"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key"
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "key"

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "key"

// task("accounts", "Prints the list of all accounts", async (taskArgs, hre) => {
//     const accounts = await hre.ethers.getSigners()

//     for (const account of accounts) {
//         console.log(account.address)
//     }
// })

// task("block-number", "Prints the current block number").setAction(
//     //hre is HardhatRuntimeEnvironment which is the same as require("hardhat")
//     async (taskArgs, hre) => {
//         const blockNumber = await hre.ethers.provider.getBlockNumber()
//         console.log(`Block Number is: ${blockNumber}`)
//     }
// )

module.exports = {
    defaultNetwork: "hardhat", //this is the network that hardhat defaults to without having the be explicitly added
    // other networks can be added
    networks: {
        eth_rinkeby: {
            url: ALCHEMY_ETHEREUM_RINKEBY_RPC_URL,
            //accounts lists the private keys
            accounts: [METAMASK_PRIVATE_KEY],
            chainId: 4, //EVM chain ID for rinkeby. Check chainlist.org for a list of chain IDs
            blockConfirmations: 6, //number of block confirmations to wait
        },
        eth_goerli: {
            url: ALCHEMY_ETHEREUM_GOERLI_RPC_URL,
            //accounts lists the private keys
            accounts: [METAMASK_PRIVATE_KEY],
            chainId: 5, //EVM chain ID for rinkeby. Check chainlist.org for a list of chain IDs
            blockConfirmations: 6, //number of block confirmations to wait
        },
        poly_mumbai: {
            url: ALCHEMY_POLYGON_MUMBAI_RPC_URL,
            accounts: [METAMASK_PRIVATE_KEY],
            chainId: 80001,
            blockConfirmations: 3,
        },
        localhost: {
            //after running hardhat node
            url: "http://127.0.0.1:8545/",
            chainId: 31337, //same as hardhat
        },
    },
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
    },
    etherscan: {
        apiKey: POLYGONSCAN_API_KEY,
    },
    // polygonscan: {
    //     apiKey: POLYGONSCAN_API_KEY,
    // },
    gasReporter: {
        enabled: true, //true would generate report, false would not
        outputFile: "gas-report.txt", //txt file to output to
        noColors: true,
        currency: "USD", //output currency
        // coinmarketcap: COINMARKETCAP_API_KEY,
        // token: "ETHER", //native token of the network to use
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
    },
}
