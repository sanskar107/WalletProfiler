import { FC, useState } from "react";
import getTransactionDataWrapper from "../CovalentAPI/CovalentAPIFunctions";
import fetchData from "../FetchData/FetchData";

interface CardProps {}

let fetchedData: any;
let chain: string = "ethereum";
let chainId: number = 1;

const updateChain = (_chain: string, _chainId: number) => {
  chain = _chain;
  chainId = _chainId;
};

const Card: FC<CardProps> = (props) => {
  const [value, setValue] = useState("");
  return (
    <div
      className="card w-auto p-5 bg-primary bg-gradient"
      style={{ width: "18rem" }}
    >
      <div className="card-body">
        <h5 className="card-title">Input IPFS Data URL</h5>
        <form className="d-flex">
          <input
            className="form-control me-2"
            type="search"
            value={value}
            placeholder="Search"
            aria-label="Search"
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          <button
            type="button"
            className="btn bg-secondary bg-gradient"
            onClick={() => {
              // fetchData(value, async (response: any) => {
              //   console.log(chain, chainId);
              //   const results = await getTransactionDataWrapper(
              //     response,
              //     chain,
              //     chainId
              //   );
              //   console.log(results);
              // });
              const results = getTransactionDataWrapper(value, chain, chainId);
              console.log(results);
            }}
          >
            Load
          </button>
        </form>
      </div>
    </div>
  );
};

export default Card;
export { fetchedData, updateChain };
