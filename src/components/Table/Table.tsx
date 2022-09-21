import { FC } from "react";
import TableElement from "../TableElement/TableElement";

interface TableProps { result: any; loaded: Boolean; }

const Table: FC<TableProps> = (props) => {
  let data = props.result;
  if (!props.loaded) {
    return (<div>
      <table className="table"></table> </div>);
  }
  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Wallet Address/Name</th>
            <th scope="col">Account Balance (USD)</th>
            <th scope="col">Token Balance (USD)</th>
            <th scope="col">Total Transactions</th>
            <th scope="col">Number Of Swaps</th>
            <th scope="col">Total Amount Swapped</th>
            <th scope="col">Number Of Stakes</th>
            <th scope="col">Total Amount Staked (USD)</th>
            <th scope="col">Number Of LP Positions</th>
            <th scope="col">Total LP Amount (USD)</th>
            <th scope="col">Number of NFTs</th>
            <th scope="col">ERC721 Tokens</th>
            <th scope="col">ER1155 Tokens</th>
            <th scope="col">Labels</th>
          </tr>
        </thead>
        <tbody>
          <TableElement
            address={data.address}
            accountBalance={data.accountBalance}
            tokenBalance={data.tokenBalance}
            totalTransactions={data.totalTransactions}
            numberOfSwaps={data.numberOfSwaps}
            totalAmountSwapped={data.totalAmountSwapped}
            numberOfStakes={data.numberOfStakes}
            totalAmountStaked={data.totalAmountStaked}
            numberOfLPPositions={data.numberOfLPPositions}
            totalLPAmount={data.totalLPAmount}
            numberOfNFT={data.numberOfNFT}
            ERC721Tokens={data.ERC721Tokens}
            ERC1155Tokens={data.ERC1155Tokens}
            labels={data.labels}
          />
        </tbody>
      </table>
    </div>
  );
};

export default Table;
