import * as dotenv from "dotenv";

import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-solhint";
import "@nomiclabs/hardhat-waffle";
import "@openzeppelin/hardhat-upgrades";
import "@primitivefi/hardhat-dodoc";
import "@typechain/hardhat";
import "hardhat-abi-exporter";
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import { HardhatUserConfig, task } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";
import "solidity-coverage";

dotenv.config();

const chainIds = {
  // local
  localhost: 31337,
  // testnet
  goerli: 5,
  "fantom-testnet": 4002,
  "pgn-sepolia": 58008,
  "arbitrum-goerli": 421613,

  // mainnet
  mainnet: 1,
  "optimism-mainnet": 10,
  "pgn-mainnet": 424,
  "fantom-mainnet": 250,
  "arbitrumOne-mainnet": 42161,
};

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

let deployPrivateKey = process.env.DEPLOYER_PRIVATE_KEY as string;
if (!deployPrivateKey) {
  // default first account deterministically created by local nodes like `npx hardhat node` or `anvil`
  deployPrivateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
}

const infuraIdKey = process.env.INFURA_ID as string;

/**
 * Generates hardhat network configuration the test networks.
 * @param network
 * @param url (optional)
 * @returns {NetworkUserConfig}
 */
function createTestnetConfig(
  network: keyof typeof chainIds,
  url?: string
): NetworkUserConfig {
  if (!url) {
    url = `https://${network}.infura.io/v3/${infuraIdKey}`;
  }
  return {
    accounts: [deployPrivateKey],
    chainId: chainIds[network],
    allowUnlimitedContractSize: true,
    url,
  };
}

/**
 * Generates hardhat network configuration the mainnet networks.
 * @param network
 * @param url (optional)
 * @returns {NetworkUserConfig}
 */
function createMainnetConfig(
  network: keyof typeof chainIds,
  url?: string
): NetworkUserConfig {
  if (!url) {
    url = `https://${network}.infura.io/v3/${infuraIdKey}`;
  }
  return {
    accounts: [deployPrivateKey],
    chainId: chainIds[network],
    url,
  };
}

const abiExporter = [
  {
    path: "./abis/pretty",
    flat: true,
    clear: true,
    format: "fullName",
  },
  {
    path: "./abis/ugly",
    flat: true,
    clear: true,
  },
];

const dodoc = {
  outputDir: "./docs/contracts",
  exclude: ["contracts/dummy", "contracts/mocks"],
};

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 400,
      },
    },
    // @ts-ignore
  },
  networks: {
    // Main Networks
    mainnet: createMainnetConfig("mainnet"),
    "optimism-mainnet": createMainnetConfig("optimism-mainnet"),
    "pgn-mainnet": {
      accounts: [deployPrivateKey],
      chainId: chainIds["pgn-mainnet"],
      url: "https://rpc.publicgoods.network",
      gasPrice: 20000000000,
    },
    "fantom-mainnet": createMainnetConfig(
      "fantom-mainnet",
      "https://rpc.ftm.tools"
    ),
    "arbitrumOne": {
      accounts: [deployPrivateKey],
      url: 'https://arb1.arbitrum.io/rpc',
      chainId: chainIds["arbitrumOne-mainnet"],
    },

    // Test Networks
    goerli: createTestnetConfig("goerli"),
    "fantom-testnet": createTestnetConfig(
      "fantom-testnet",
      "https://rpc.testnet.fantom.network/"
    ),
    "pgn-sepolia": {
      accounts: [deployPrivateKey],
      chainId: chainIds["pgn-sepolia"],
      url: "https://sepolia.publicgoods.network",
    },
    arbitrumGoerli: {
      accounts: [deployPrivateKey],
      url: 'https://goerli-rollup.arbitrum.io/rpc',
      chainId: chainIds["arbitrum-goerli"],
    },
    localhost: createTestnetConfig("localhost", "http://localhost:8545"),
    hardhat: {
      forking: {
        url: process.env.FORK_RPC_URL || "",
        blockNumber: 9188740 // A recent block where both AllowanceModule an Safe factory exist
      }
    }
  },
  gasReporter: {
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    excludeContracts: ["contracts/mocks", "contracts/dummy"],
  },
  etherscan: {
    apiKey: {
      // @ts-ignore
      mainnet: process.env.ETHERSCAN_API_KEY,
      // @ts-ignore
      goerli: process.env.ETHERSCAN_API_KEY,
      // @ts-ignore
      optimisticEthereum: process.env.OPTIMISTIC_ETHERSCAN_API_KEY,
      // @ts-ignore
      ftmTestnet: process.env.FTMSCAN_API_KEY,
      // @ts-ignore
      opera: process.env.FTMSCAN_API_KEY,
      // @ts-ignore
      "pgn-mainnet": process.env.PGNSCAN_API_KEY,
    },
    customChains: [
      {
        network: "pgn-mainnet",
        chainId: chainIds["pgn-mainnet"],
        urls: {
          apiURL: "https://explorer.publicgoods.network/api",
          browserURL: "https://explorer.publicgoods.network",
        },
      },
    ],
  },
  abiExporter: abiExporter,
  dodoc: dodoc,
};

export default config;
