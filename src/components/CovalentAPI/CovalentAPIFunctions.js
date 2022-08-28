let TableData = [];

const getTransactionData = async (address, chain, chainId) => {
  const query = new URLSearchParams({
    page: "1",
    pageSize: "50",
    contract: "string",
    fromBlock: "",
    toBlock: "",
    chainId: "false",
    auth_key: "4lCUepYmqhannplibgDy81oV2DjNaUuSaUmITEQK",
  }).toString();

  // const chain = "ethereum";
  // const address = '0x345d8e3a1f62ee6b1d483890976fd66168e390f2';
  const resp = await fetch(
    `https://api.unmarshal.com/v1/${chain}/address/${address}/transactions?${query}`,
    { method: "GET" }
  );

  if (!resp) return null;

  const data = await resp.json();
  // console.log(data);
  let result = [
    {
      address: address,
      balance: 0,
      defiScore: 0,
      totalTrades: 0, // Change at the end
      totalStakes: 0, // Change at the end
      totalLP: 0,
      numberOfNFT: 0,
      totalNFTValue: 0,
      labels: [""],
      totalTransaction: 0,
    },
  ];
  let totalAmountStaked = 0;
  let totalAmountTraded = 0;
  let isTrader = false;
  let isStaker = false;
  let labels = [];
  let tradingPlatforms = ["uniswap_v2"];
  let numberOfTrades = 0;
  let numberOfStakes = 0;
  let numberOfLPPositions = 0;
  let stakingPlatforms = ["Aave"];
  let isLPProvider = false;
  let numberOfTransactions =
    typeof data.total_txns === "undefined" ? 0 : Number(data.total_txns);

  if (!data) return result[0];

  for (let i = 0, j = 0; i < data.total_txs; i++) {
    const transactionData = data.transactions[i];
    if (!transactionData) {
      continue;
    }
    if ((transactionData.type = "stake")) {
      isStaker = true;
      numberOfStakes = numberOfStakes + 1;
      totalAmountStaked =
        totalAmountStaked + (Number(transactionData.value) / 10 ** 18) * 1500;
      if (labels.indexOf("Staker") === -1) {
        labels.push("Staker");
      }
    } else if (transactionData.type == "swap") {
      totalAmountTraded =
        totalAmountTraded + (Number(transactionData.value) / 10 ** 18) * 1500;
      numberOfTrades = numberOfTrades + 1;
      isTrader = true;
      if (labels.indexOf("Trader") === -1) {
        labels.push("Trader");
      }
    }
  }
  // Search for LP
  const lpQuery = new URLSearchParams({
    auth_key: "4lCUepYmqhannplibgDy81oV2DjNaUuSaUmITEQK",
  }).toString();
  const protocols = "uniswap_v2";
  const response = await fetch(
    `https://api.unmarshal.com/v2/protocols/${protocols}/address/${address}/positions?${lpQuery}`,
    { method: "GET" }
  );

  if (!response) return null;

  const lpData = await response.json();
  // console.log(lpData);
  let LPPools = [];
  let totalLPAmountProvided = 0;
  if (!lpData) {
    isLPProvider = true;
    numberOfLPPositions = lpData.positions.length;
    for (let i = 0; i < lpData.positions.length; i++) {
      let position = lpData.positions[i];
      totalLPAmountProvided = totalLPAmountProvided + position.pool_token.quote;
      if (LPPools.indexOf(position.pool_token.contract_name) === -1) {
        LPPools.push(position.pool_token.contract_name);
      }
    }
  }

  let totalNFTUSD = 0;
  let covalentUrl = `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=false&key=ckey_bcac8aebbd3646009645c9209ce`;
  const covalentResponse = await fetch(covalentUrl);

  if (!covalentResponse) return null;
  const covalentData = await covalentResponse.json();
  let myItems = covalentData.data.items;
  let allAccountBalanceInUSD = 0;
  let numberOfNFTHoldings = 0;
  let NFTs = [];
  for (let i = 0; i < myItems.length; i++) {
    let item = myItems[i];
    if (item.type == "nft") {
      NFTs.push(item.contract_ticker_symbol);
      numberOfNFTHoldings = numberOfNFTHoldings + parseFloat(item.balance);
      const options = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-API-Key":
            "0cj1gQWGR9CZTT5MpnvGoMzrWbqTxFTnLmQN99YVgpFyie8iMCnglq1EXKRUjap4",
        },
      };
      const nftPriceResponse = await fetch(
        "https://deep-index.moralis.io/api/v2/nft/" +
          item.contract_address +
          "/lowestprice?chain=eth&marketplace=opensea",
        options
      );

      if (!nftPriceResponse) return null;
      const nftPriceData = await nftPriceResponse.json();
      if (!nftPriceData) {
        continue;
      }
      totalNFTUSD =
        totalNFTUSD +
        (Number(nftPriceData.price) / 10 ** 18) *
          1500 *
          parseFloat(item.balance);
    } else if (item.quote_rate > 0.0001) {
      allAccountBalanceInUSD = allAccountBalanceInUSD + item.quote;
    }
  }
  const defiScore =
    0.2 * (Number(isTrader) * totalAmountTraded * numberOfTrades) +
    0.4 * (Number(isStaker) * totalAmountStaked * numberOfStakes) +
    0.4 * (Number(isLPProvider) * totalLPAmountProvided * numberOfLPPositions);
  // Return result
  result[0] = {
    address: address,
    balance: allAccountBalanceInUSD,
    defiScore: defiScore,
    totalTrades: numberOfTrades, // Change at the end
    totalStakes: numberOfStakes, // Change at the end
    totalLP: numberOfLPPositions,
    numberOfNFT: numberOfNFTHoldings,
    totalNFTValue: totalNFTUSD,
    labels: labels,
    totalTransaction: numberOfTransactions,
  };

  console.log(result[0]);
  return result[0];
  // console.log("Result: ", result);
};

const getTransactionDataWrapper = async (addressArray, chain, chainId) => {
  for (let i = 0; i < 10; i++) {
    let result = await getTransactionData(addressArray[i], chain, chainId);
    if (!result) continue;
    result.id = i;
    TableData.push(result);
  }

  return TableData;
};

export default getTransactionDataWrapper;
export { TableData };
