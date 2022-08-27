/* Moralis init code */
const serverUrl = "https://n17q9godqxrc.usemoralis.com:2053/server";
const appId = "F7q2mwwSoR0A28k7VZRAouOOGuVe5bj1Fa3eVzjM";
const Moralis = window.Moralis;
Moralis.start({ serverUrl, appId });

/* Authentication code */
function getCurrentUser() {
  return Moralis.User.current();
}

async function login(callback) {
  let user = Moralis.User.current();
  if (!user) {
    try {
      user = await Moralis.authenticate({
        signingMessage: "Log in using Moralis",
      });
      await Moralis.enableWeb3();
      console.log("logged in user:", user);
      console.log(user.get("ethAddress"));
      callback(user.get("ethAddress"));
    } catch {
      console.log("Error");
    }
  }
}

async function logOut(callback) {
  await Moralis.User.logOut();
  console.log("logged out");
  callback();
  // document.querySelector("#btn-login").textContent = "Connect Wallet";
}

async function mintNFT(amountNFT, metadata) {
  let options = {
    contractAddress: "0xfb6f3E88541E88c34b45336A6703D378AcDC9d5b",
    functionName: "mint",
    abi: [
      {
        inputs: [
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "string", name: "_metadata", type: "string" },
        ],
        name: "mint",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    params: {
      amount: amountNFT,
      _metadata: metadata,
    },
    msgValue: 0,
  };
  await Moralis.executeFunction(options);
}

async function getURI(token_id) {
  let options = {
    contractAddress: "0xfb6f3E88541E88c34b45336A6703D378AcDC9d5b",
    functionName: "getURI",
    abi: [
      {
        inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
        name: "getURI",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    params: {
      tokenId: token_id,
    },
  };
  const metadataValue = await Moralis.executeFunction(options);
  return metadataValue;
}

async function confirm() {
  let options = {
    contractAddress: "0x4f890bA557CabB868dd1Cd6a77472B0915c5597C",
    functionName: "confirm_Delivery",
    abi: [
      {
        inputs: [],
        name: "confirm_Delivery",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
  };
  await Moralis.executeFunction(options);
}

export default login;
export { logOut, getCurrentUser };
