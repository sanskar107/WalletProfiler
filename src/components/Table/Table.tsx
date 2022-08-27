import { FC, useState } from "react";
import Data from "../Data/Data";
import TableElement from "../TableElement/TableElement";

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
              Data.sort(function (a, b) {
                let keyA = a.totalBalance,
                  keyB = b.totalBalance;
                // Compare the 2 dates
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
              });
              setData(Data);
              setPrevState(!prevState);
              setNewState(!newState);
            }}
          >
            Total Balance
          </th>
          <th scope="col">Lifetime Value on your App</th>
          <th scope="col">Total Lifetime Value</th>
          <th scope="col">Risks</th>
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
                addr={ele.walletAddress}
                balance={ele.totalBalance}
                lifetimeValue={ele.lifeTimeValueApp}
                tlv={ele.tlv}
                risks={ele.risks}
                labels={ele.labels}
              />
            );
          })}
      </tbody>
    </table>
  );
};

export default Table;
