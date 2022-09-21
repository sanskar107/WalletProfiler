import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import Card from "./components/Card/Card";
import Table from "./components/Table/Table";
import { useState } from "react";
import Loader from './components/Loader/Loader';

function App() {  
  const [chain, setChain] = useState("");
  const [result, setResult] = useState(
    {
      address: "0x000000",
      accountBalance:0,
      tokenBalance: 0,
      totalTransactions: 0, 
      numberOfSwaps: 0,
      totalAmountSwapped: 0,
      numberOfStakes: 0,
      totalAmountStaked: 0,
      numberOfLPPositions: 0,
      totalLPAmount: 0,
      numberOfNFT: 0,
      ERC721Tokens: [""],
      ERC1155Tokens: [""],
      labels: [""]
    }
  );
  const [loaded, setLoaded] = useState(true);
  return (
    <div className="">
      <NavBar setChain={setChain}/>
      <Card setResult={setResult} chain={chain} setLoaded={setLoaded}/>
      <Loader loaded={loaded}/>
      <Table result={result} loaded={loaded}/>
    </div>
  );
}

export default App;
