import { FC, useState } from "react";
import getTransactionDataWrapper from "../CovalentAPI/CovalentAPIFunctions";
import fetchData from "../FetchData/FetchData";

interface CardProps {}

let fetchedData: any;

const Card: FC<CardProps> = (props) => {
  const [value, setValue] = useState("");
  return (
    <div className="card w-auto p-5" style={{ width: "18rem" }}>
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
            className="btn btn-outline-success"
            onClick={() => {
              fetchData(value, async (response: any) => {
                const results = await getTransactionDataWrapper(
                  response,
                  "matic",
                  137
                );
                console.log(results);
              });
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
export { fetchedData };
