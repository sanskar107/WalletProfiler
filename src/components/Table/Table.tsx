import { FC, useState } from "react";
import Data from "../Data/Data";
import TableElement from "../TableElement/TableElement";
import { fetchedData } from "../Card/Card";

interface TableProps {}

const Table: FC<TableProps> = (props) => {
  const [data, setData] = useState([
    {
      id: 0,
      address: "0x9999999999",
      balance: 0,
      defiScore: 0,
      totalTrades: 0,
      totalStakes: 0,
      totalLP: 0,
      numberOfNFT: 0,
      totalNFTValue: 0,
      totalTranscation: 0,
      labels: ["NFT", "Staker"],
    },
  ]);
  const [newState, setNewState] = useState(true);
  const [prevState, setPrevState] = useState(false);
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Wallet Address/Name</th>
          <th
            role="button"
            scope="col"
            onClick={() => {
              data.sort(function (a, b) {
                let keyA = a.balance,
                  keyB = b.balance;
                // Compare the 2 dates
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
              });
              console.log(fetchedData);
              setData(data);
              setPrevState(!prevState);
              setNewState(!newState);
            }}
          >
            Total Balance
          </th>
          <th scope="col">Defi Score</th>
          <th scope="col">Total trades</th>
          <th scope="col">Total Stakes</th>
          <th scope="col">Total LP</th>
          <th scope="col">Number of NFTs</th>
          <th scope="col">Total NFT Value</th>
          <th scope="col">Total Transactions</th>
          <th scope="col" className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Labels
            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={() => {
                    let temp = data.filter((ele) => {
                      return ele.labels.includes("NFT");
                    });
                    setData(temp);
                    setPrevState(!prevState);
                    setNewState(!newState);
                  }}
                >
                  NFT
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={() => {
                    let temp = data.filter((ele) => {
                      return ele.labels.includes("Stake Hodler");
                    });
                    setData(temp);
                    setPrevState(!prevState);
                    setNewState(!newState);
                  }}
                >
                  Stake Hodler
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={() => {
                    let temp = data.filter((ele) => {
                      return ele.labels.includes("Defi");
                    });
                    setData(temp);
                    setPrevState(!prevState);
                    setNewState(!newState);
                  }}
                >
                  Defi
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={() => {
                    console.log("All Dropdown Data", Data);
                    setData(Data);
                    console.log("All Dropdown Data", Data);
                    console.log("All Dropdown stateData", data);
                    setPrevState(!prevState);
                    setNewState(!newState);
                  }}
                >
                  All
                </a>
              </li>
            </ul>
          </th>
        </tr>
      </thead>
      <tbody>
        {prevState !== newState &&
          data.map((ele) => {
            return (
              <TableElement
                key={ele.id}
                addr={ele.address}
                balance={ele.balance}
                defiScore={ele.defiScore}
                numberOfTrades={ele.totalTrades}
                totalStakes={ele.totalStakes}
                totalLp={ele.totalLP}
                numberOfNFTs={ele.numberOfNFT}
                totalNFTValue={ele.totalNFTValue}
                totalTransaction={ele.totalTranscation}
                labels={ele.labels}
              />
            );
          })}
      </tbody>
    </table>
  );
};

export default Table;
