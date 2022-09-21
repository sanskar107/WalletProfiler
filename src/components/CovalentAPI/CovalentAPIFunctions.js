
// Setup: npm install alchemy-sdk
import { Alchemy, Network } from "alchemy-sdk";

// Alchemy Data
//const alchemyAPI = '8UEf9m9JCbBGprR7fcph5g5tZqhNPQ2f';
//const alchemyBaseURL = `https://eth-mainnet.g.alchemy.com/v2/${alchemyAPI}`;
// let chainCurrencyTokenSymbol = 'ETH';
// let network = Network.ETH_MAINNET;
// let chainName = 'ethereum';

// let chainCurrencyTokenSymbol = 'MATIC';
// let network = Network.MATIC_MAINNET;
// let chainName = 'matic';
let chainCurrencyTokenSymbol;
let chain;
let alchemy;
const getTokenPrice = async (tokenSymbol) => {

  const tokenPriceUrl = `https://min-api.cryptocompare.com/data/price?fsym=${tokenSymbol}&tsyms=INR,USD,ETH`;
  const tokenPriceResponse = await fetch(tokenPriceUrl);
  const tokenPrices = await tokenPriceResponse.json();
  if (tokenPrices.Response == 'Error') {
    return { USD: '0', INR: '0', ETH: '0' };
  }
  return tokenPrices;
};

const getAccountBalance = async (address) => {
  const response = await alchemy.core.getBalance(address, "latest");
  const balanceInETH = parseInt(response._hex) / 10**18;
  const ETHPrice = await getTokenPrice(chainCurrencyTokenSymbol);
  const balance = { accountBalanceInETH: balanceInETH, accountBalanceInUSD: balanceInETH * ETHPrice.USD, accountBalanceInINR: balanceInETH * ETHPrice.INR  }
  return balance;
};

const getERC20TokenData = async (address) => {
  //const address = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"; // vitalik.eth
  const balances = await alchemy.core.getTokenBalances(address, 'erc20');
  const nonZeroBalances = balances.tokenBalances.filter((token) => {
    return token.tokenBalance !== '0x0000000000000000000000000000000000000000000000000000000000000000';
  });
  //console.log(`Token balances of ${address} \n`);
  let i = 0;
  let tokenData = [];
  let totalTokenBalanceInUSD = 0;
  let totalTokenBalanceInINR = 0;
  let totalTokenBalanceInETH = 0;
  for (let token of nonZeroBalances) {
    let balance = token.tokenBalance;
    const tokendata = await alchemy.core.getTokenMetadata(token.contractAddress);
    balance = balance / Math.pow(10, tokendata.decimals);
    balance = balance.toFixed(2);
    let tokenPrice = await getTokenPrice(tokendata.symbol);
    let tokenPriceInUSD = Number(tokenPrice.USD);
    let tokenPriceInINR = Number(tokenPrice.INR);
    let tokenPriceInETH = Number(tokenPrice.ETH);
    tokenData[i++] = {
      tokenName: tokendata.name,
      tokenBalance: balance,
      tokenSymbol: tokendata.symbol,
      tokenPriceInUSD: tokenPriceInUSD,
      tokenPriceInINR: tokenPriceInINR,
      tokenPriceInETH: tokenPriceInETH
    };

    totalTokenBalanceInUSD += (balance * tokenPriceInUSD);
    totalTokenBalanceInINR += (balance * tokenPriceInINR);
    totalTokenBalanceInETH += (balance * tokenPriceInETH);
    // console.log(`${i}. ${tokendata.name}: ${balance} ${tokendata.symbol} 
    // (${tokenPrice.INR} INR, ${tokenPrice.USD} USD, ${tokenPrice.ETH} ETH)`);
  }
  let totalTokenBalances = { totalBalanceUSD: totalTokenBalanceInUSD, totalBalanceINR: totalTokenBalanceInINR, totalBalanceETH: totalTokenBalanceInETH };
  return { tokenData, totalTokenBalances };
};

const getNFTContractFloorPrice = async (NFTContractAddress) => {
  // Print the NFT floor price for a contract
  const response = await alchemy.nft.getFloorPrice(NFTContractAddress);
  return response;
}

const getNFTData = async (address) => {
  const nfts = await alchemy.nft.getNftsForOwner(address);
  let ERC721Tokens = [];
  let ERC1155Tokens = [];
  let i=0, j=0;
  for (const nft of nfts.ownedNfts) {
    if (nft.tokenType == 'ERC721') {
      ERC721Tokens[i++] = nft
    } else {
      ERC1155Tokens[j++] = nft;
    }
  }
  return {ERC721Tokens: ERC721Tokens, ERC1155Tokens: ERC1155Tokens};

};

// 
const getDeFiData = async (address) => {
  let result = {};
  let query = new URLSearchParams({
    page: "1",
    pageSize: "100",
    contract: "string",
    fromBlock: "",
    toBlock: "",
    auth_key: "4lCUepYmqhannplibgDy81oV2DjNaUuSaUmITEQK",
  }).toString();

  let response = await fetch(
    `https://api.unmarshal.com/v2/${chain}/address/${address}/transactions?${query}`,
    { method: "GET" }
  );

  const data = await response.json();
  let numberOfTransactions = 0;
  if (data.transactions.length == 0) {
    return result;
  }
  numberOfTransactions = data.total_txs;
  let numberOfStakes = 0;
  let totalAmountStaked = 0;
  let numberOfSwaps = 0;
  let totalAmountSwapped = 0;
  let numberOfLPPositions = 0;
  let totalLPAmountProvided = 0;
  let labels = [];
  for (let i = 0; i < data.transactions.length; i++) {
    const transactionData = data.transactions[i];
    if (!transactionData) {
      continue;
    }
    //console.log(transactionData.type);
    //console.log(transactionData.description);
    // contract_execution, approve, Mint, send, receive
    if (transactionData.type == "stake" || transactionData.type == "unstake") {
      numberOfStakes++;
      totalAmountStaked =
        totalAmountStaked + (Number(transactionData.value) / 10 ** 18) * 1500;
      if (labels.indexOf("Staker") === -1) {
        labels.push("Staker");
      }
    } else if (transactionData.type == "swap") {
      totalAmountSwapped =
        totalAmountSwapped + (Number(transactionData.sent[0].value) / 10 ** transactionData.sent[0].decimals) * transactionData.sent[0].quoteRate;
      numberOfSwaps++;
      if (labels.indexOf("Swapper") === -1) {
        labels.push("Swapper");
      }
    }
  }

  // Search for LP
  query = new URLSearchParams({
    auth_key: "4lCUepYmqhannplibgDy81oV2DjNaUuSaUmITEQK",
  }).toString();

  const protocols = "uniswap_v2";
  response = await fetch(
    `https://api.unmarshal.com/v2/protocols/${protocols}/address/${address}/lp_transactions?${query}`,
    { method: "GET" }
  );
  const lpData = await response.json();
  let LPPoolTokens = [];
  if (lpData != null) {
    numberOfLPPositions = lpData.transactions.length;
    if (numberOfLPPositions != 0) {
      labels.push("LP Provider");
    }
    for (let i = 0; i < numberOfLPPositions; i++) {
      let transaction = lpData.transactions[i];
      totalLPAmountProvided = totalLPAmountProvided + transaction.pool_token.quote_rate * Number(transaction.liquidity);
      if (transaction.pool_token.contract_ticker_symbol !== '' && LPPoolTokens.indexOf(transaction.pool_token.contract_ticker_symbol) === -1) {
        LPPoolTokens.push(transaction.pool_token.contract_ticker_symbol);
      }
    }
  }
  result.numberOfTransactions = numberOfTransactions;
  result.totalAmountStaked = totalAmountStaked;
  result.totalAmountSwapped = totalAmountSwapped;
  result.totalLPAmountProvided = totalLPAmountProvided;
  result.numberOfStakes = numberOfStakes;
  result.numberOfSwaps = numberOfSwaps;
  result.numberOfLPPositions = numberOfLPPositions;
  result.labels = labels;
  result.LPPoolTokens = LPPoolTokens;
  return result;
};

const getTransactionData = async (address) => {

  const accountBalance = await getAccountBalance(address);
  console.log("\nAccount Balance:\n");
  console.log(accountBalance);

  const { tokenData, totalTokenBalances } = await getERC20TokenData(address);
  console.log("\nToken Balance:\n");
  console.log(totalTokenBalances);

  const { ERC721Tokens, ERC1155Tokens } = await getNFTData(address);
  console.log("\nERC721 Tokens:\n");
  console.log(ERC721Tokens);
  console.log("\nERC1155 Tokens:\n");
  console.log(ERC1155Tokens);

  const deFiData = await getDeFiData(address);
  console.log("\nDefi Data:\n");
  console.log(deFiData);

  if (ERC721Tokens.length > 0 || ERC1155Tokens.length > 0) {
    deFiData.labels.push('NFT Hodler');
  }

  // const chain = "ethereum";
  // const address = '0x345d8e3a1f62ee6b1d483890976fd66168e390f2';
  /* 0xc1e42f862d202b4a0ed552c1145735ee088f6ccf has $93,949 in uniswap LP

0x471c6a1f283d2b52ff332b9706ffa6ca4f261479 has $116,589,004 in uniswap LP

0x1b04d574d4a3d57fb724848937a926aa21c59271 has $13,742,147 in uniswap L
*/
console.log("\nFinal Result:\n");
  let result = {
    address: address,
    accountBalance: accountBalance.accountBalanceInUSD,
    tokenBalance: totalTokenBalances.totalBalanceUSD,
    totalTransactions: deFiData.numberOfTransactions, 
    numberOfSwaps: deFiData.numberOfSwaps,
    totalAmountSwapped: deFiData.totalAmountSwapped,
    numberOfStakes: deFiData.numberOfStakes,
    totalAmountStaked: deFiData.totalAmountStaked,
    numberOfLPPositions: deFiData.numberOfLPPositions,
    totalLPAmount: deFiData.totalLPAmountProvided,
    numberOfNFT: ERC721Tokens.length + ERC1155Tokens.length,
    ERC721Tokens: ERC721Tokens.map(obj => obj.title),
    ERC1155Tokens: ERC1155Tokens.map(obj => obj.title),
    labels: deFiData.labels
  };
  return result;
};

const getTransactionDataWrapper = async (address, chainName) => {
  let network;
  if (chainName == 'matic') {
    chainCurrencyTokenSymbol = 'MATIC';
    network = Network.MATIC_MAINNET;
    chain = 'matic';
  } else {
    chainCurrencyTokenSymbol = 'ETH';
    network = Network.ETH_MAINNET;
    chain = 'ethereum';
  }
const config = {
  apiKey: "8UEf9m9JCbBGprR7fcph5g5tZqhNPQ2f",
  network: network,
};
alchemy = new Alchemy(config);
  let result = await getTransactionData(address);
  if (!result) {
    console.log("Data not fetched", result);
    return;
  }
  return result;
};

export default getTransactionDataWrapper;

// const getNFTTokenData = async (address) => {
  //   // Get number of NFT minted to a address from alchemy 0xE0Def774872ED742e03cEB51759AB9a5a9a9A496
  //   const res = await alchemy.core.getAssetTransfers({
  //     fromBlock: "0x0",
  //     fromAddress: address,
  //     excludeZeroValue: true,
  //     category: ["erc721", "erc1155"],
  //   });
  
  //   // Print contract address and tokenId for each NFT (ERC721 or ERC1155):
  //   let ERC721Tokens = [];
  //   let ERC1155Tokens = [];
  //   let ERC721ContractAddressesToTokenCount = new Map();
  //   let ERC1155ContractAddressesToTokenCount = new Map();
  //   let i = 0;
  //   let j = 0;
  //   for (const events of res.transfers) {
  //     if (events.asset !== null) {
  //       let NFTContractAddress = events.rawContract.address;
  //       if (events.erc1155Metadata == null) {
  //         if (!ERC721ContractAddressesToTokenCount.has(NFTContractAddress)) {
  //           const nftFloorPriceData = await getNFTContractFloorPrice(NFTContractAddress);
  //           ERC721ContractAddressesToTokenCount.set(NFTContractAddress, 1);
  //           ERC721Tokens[i++] = { NFTContractAddress: NFTContractAddress, NFTCollectionName: events.asset, NFTFloorPriceData: nftFloorPriceData };
  //         } else {
  //           ERC721ContractAddressesToTokenCount.set(NFTContractAddress, ERC721ContractAddressesToTokenCount.get(NFTContractAddress) + 1);
  //         }
  //       } else {
  //         for (const erc1155 of events.erc1155Metadata) {
  //           if (!ERC1155ContractAddressesToTokenCount.has(NFTContractAddress)) {
  //             const nftFloorPriceData = await getNFTContractFloorPrice(NFTContractAddress);
  //             ERC1155ContractAddressesToTokenCount.set(NFTContractAddress, 1);
  //             ERC1155Tokens[j++] = { NFTContractAddress: NFTContractAddress, NFTCollectionName: events.asset, NFTFloorPriceData: nftFloorPriceData };
  //           } else {
  //             ERC1155ContractAddressesToTokenCount.set(NFTContractAddress, ERC1155ContractAddressesToTokenCount.get(NFTContractAddress) + 1);
  //           }
  //         }
  //       }
  //     }
  //   }
  
  //   for (let token of ERC721Tokens) {
  //     token.totalNFTTokens = ERC721ContractAddressesToTokenCount.get(token.NFTContractAddress);
  //     token.approxTotalNFTHoldingValueOpenSeaInETH = token.totalNFTTokens * token.NFTFloorPriceData.openSea.floorPrice;
  //     token.approxTotalNFTHoldingValuelooksRareInETH = token.totalNFTTokens * token.NFTFloorPriceData.looksRare.floorPrice;
  //   }
  //   for (let token of ERC1155Tokens) {
  //     token.totalNFTTokens = ERC1155ContractAddressesToTokenCount.get(token.NFTContractAddress);
  //     token.approxTotalNFTHoldingValueOpenSeaInETH = token.totalNFTTokens * token.NFTFloorPriceData.openSea.floorPrice;
  //     token.approxTotalNFTHoldingValuelooksRareInETH = token.totalNFTTokens * token.NFTFloorPriceData.looksRare.floorPrice;
  //   }
  
  //   return { ERC721Tokens, ERC1155Tokens };
  // };
  