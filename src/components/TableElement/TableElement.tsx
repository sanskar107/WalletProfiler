import { FC, useState } from "react";

interface TableProps {
  key: number;
  addr: string;
  balance: number;
  lifetimeValue: number;
  tlv: number;
  risks: string;
  labels: Array<string>;
}

const TableElement: FC<TableProps> = (props) => {
  return (
    <tr>
      <th scope="row">{props.addr}</th>
      <td>{props.balance}</td>
      <td>{props.lifetimeValue}</td>
      <td>{props.tlv}</td>
      <td>{props.risks}</td>
      <td>{props.labels}</td>
    </tr>
  );
};

export default TableElement;
