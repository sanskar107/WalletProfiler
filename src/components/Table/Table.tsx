import { FC, useState } from "react";
import Data from "../Data/Data";
import TableElement from "../TableElement/TableElement";

interface TableProps {}

const Table: FC<TableProps> = (props) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Wallet Address/Name</th>
          <th scope="col">Total Balance</th>
          <th scope="col">Lifetime Value on your App</th>
          <th scope="col">Total Lifetime Value</th>
          <th scope="col">Risks</th>
          <th scope="col">Labels</th>
        </tr>
      </thead>
      <tbody>
        {Data.map((ele) => (
          <TableElement
            key={ele.id}
            addr={ele.walletAddress}
            balance={ele.totalBalance}
            lifetimeValue={ele.lifeTimeValueApp}
            tlv={ele.tlv}
            risks={ele.risks}
            labels={ele.labels}
          />
        ))}
      </tbody>
    </table>
  );
};

export default Table;
