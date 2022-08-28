import { FC, useState } from "react";

interface TableProps {
  key: number;
  addr: string;
  balance: number;
  defiScore: number;
  numberOfTrades: number;
  totalStakes: number;
  totalLp: number;
  numberOfNFTs: number;
  totalNFTValue: number;
  totalTransaction: number;
  labels: Array<string>;
}

const TableElement: FC<TableProps> = (props) => {
  return (
    <tr>
      <th scope="row">{props.addr}</th>
      <td>{props.balance}</td>
      <td>{props.defiScore}</td>
      <td>{props.numberOfTrades}</td>
      <td>{props.totalStakes}</td>
      <td>{props.totalLp}</td>
      <td>{props.numberOfNFTs}</td>
      <td>{props.totalNFTValue}</td>
      <td>{props.totalTransaction}</td>
      <td>{props.labels}</td>
    </tr>
  );
};

export default TableElement;
