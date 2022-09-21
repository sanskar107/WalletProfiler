import { FC} from "react";

interface TableProps {
  address: string;
  accountBalance: number;
  tokenBalance: number;
  totalTransactions: number;
  numberOfSwaps: number;
  totalAmountSwapped: number;
  numberOfStakes: number;
  totalAmountStaked: number;
  numberOfLPPositions: number;
  totalLPAmount: number;
  numberOfNFT: number;
  ERC721Tokens: Array<string>;
  ERC1155Tokens: Array<string>;
  labels: Array<string>;
}

const TableElement: FC<TableProps> = (props) => {
  return (
    <tr>
      <th scope="row">{props.address}</th>
      <td>{props.accountBalance}</td>
      <td>{props.tokenBalance}</td>
      <td>{props.totalTransactions}</td>
      <td>{props.numberOfSwaps}</td>
      <td>{props.totalAmountSwapped}</td>
      <td>{props.numberOfStakes}</td>
      <td>{props.totalAmountStaked}</td>
      <td>{props.numberOfLPPositions}</td>
      <td>{props.totalLPAmount}</td>
      <td>{props.numberOfNFT}</td>
      <td>{props.ERC721Tokens.join(',\n')}</td>
      <td>{props.ERC1155Tokens.join(',\n')}</td>
      <td>{props.labels.join(',\n')}</td>
    </tr>
  );
};

export default TableElement;
