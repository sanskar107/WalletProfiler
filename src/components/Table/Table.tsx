import { FC, useState } from "react";
import Data from "../Data/Data";
import TableElement from "../TableElement/TableElement";
import { fetchedData } from "../Card/Card";

interface TableProps {}

const Table: FC<TableProps> = (props) => {
  const [newState, setNewState] = useState(true);
  const [prevState, setPrevState] = useState(false);
  const [data, setData] = useState(Data);
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
                let keyA = a.totalBalance,
                  keyB = b.totalBalance;
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
                    let temp = Data.filter((ele) => {
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
                    let temp = Data.filter((ele) => {
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
                    let temp = Data.filter((ele) => {
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
                    setData(Data);
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
        {prevState != newState &&
          data.map((ele) => {
            return (
              <TableElement
                key={ele.id}
                addr={ele.address}
                balance={ele.totalAmountInUSD}
                defiScore={ele.defiScore}
                numberOfTrades={ele.numberOfTrades}
                totalStakes={ele.numberOfStakes}
                totalLp={ele.totalLp}
                numberOfNFTs={ele.numberOfNFTs}
                totalNFTUSD={ele.totalNFTUSD}
                labels={ele.labels}
              />
            );
          })}
      </tbody>
    </table>
  );
};

export default Table;
