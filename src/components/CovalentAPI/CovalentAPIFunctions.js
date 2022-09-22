
// Setup: npm install alchemy-sdk
import { Alchemy, Network } from "alchemy-sdk";

// Alchemy Data
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