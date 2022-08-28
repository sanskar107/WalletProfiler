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
      totalTransaction: 0,
      labels: ["NFT", "Staker"],
    },
  ]);
  const [newState, setNewState] = useState(true);
  const [prevState, setPrevState] = useState(false);
  return (
    <div>
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Wallet Address/Name</th>
          <th
            role="button"
            scope="col"
            onClick={() => {
              setData(
                data.sort(function (a, b) {
                  let keyA = a.balance,
                    keyB = b.balance;
                  // Compare the 2 dates
                  if (keyA < keyB) return -1;
                  if (keyA > keyB) return 1;
                  return 0;
                })
              );
              console.log(fetchedData);
              // setData(data);
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
                      return ele.labels.includes("NFT Hodler");
                    });
                    setData(temp);
                    setPrevState(!prevState);
                    setNewState(!newState);
                  }}
                >
                  NFT Hodler
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={() => {
                    let temp = data.filter((ele) => {
                      return ele.labels.includes("Staker");
                    });
                    setData(temp);
                    setPrevState(!prevState);
                    setNewState(!newState);
                  }}
                >
                  Staker
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={() => {
                    let temp = data.filter((ele) => {
                      return ele.labels.includes("Trader");
                    });
                    setData(temp);
                    setPrevState(!prevState);
                    setNewState(!newState);
                  }}
                >
                  Trader
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={() => {
                    let temp = data.filter((ele) => {
                      return ele.labels.includes("LP Provider");
                    });
                    setData(temp);
                    setPrevState(!prevState);
                    setNewState(!newState);
                  }}
                >
                  LP
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
                totalTransaction={ele.totalTransaction}
                labels={ele.labels}
              />
            );
          })}
      </tbody>
    </table>
    <button type="button" className="btn btn-lg btn-danger"
      onClick={() => {
        var avg_bal = 0.0;
        var defi_score = 0.0;
        var total_trades = 0.0;
        var total_stakes = 0.0;
        var total_lp = 0.0;
        var num_nft = 0.0;
        var nft_val = 0.0;
        var tot_trans = 0.0;
        let avg_factor = 1.0 / data.length;
        for(let i = 0; i < data.length; i++) {
          avg_bal += data[i].balance * avg_factor;
          defi_score += data[i].defiScore * avg_factor;
          total_trades += data[i].totalTrades * avg_factor;
          total_stakes += data[i].totalStakes * avg_factor;
          total_lp += data[i].totalLP * avg_factor;
          num_nft += data[i].numberOfNFT * avg_factor;
          nft_val += data[i].totalNFTValue * avg_factor;
          tot_trans += data[i].totalTranscation * avg_factor;
        }

        console.log("Average Balance : ", avg_bal);
        console.log("Average defi score : ", defi_score);
        console.log("Total Trades : ", total_trades);
        console.log("Total Stakes : ", total_stakes);
        console.log("Total LP : ", total_lp);
        console.log("Number of NFTs : ", num_nft);
        console.log("Total NFT Value : ", nft_val);
        console.log("Total Transactions", tot_trans);
      }
      }
      >
      Get Insights</button>

    </div>
  );
};

export default Table;
