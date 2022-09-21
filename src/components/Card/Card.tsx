import { FC, useState } from "react";
import getTransactionDataWrapper from "../CovalentAPI/CovalentAPIFunctions";

interface CardProps {setResult: any; chain: string; setLoaded: any;}

const Card: FC<CardProps> = (props) => {
  const [value, setValue] = useState("");
  return (
    <div
      className="card w-auto p-5 bg-primary bg-gradient"
      style={{ width: "18rem" }}
    >
      <div className="card-body">
        <h5 className="card-title">Enter Wallet Address</h5>
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
            onClick={async () => {
              props.setLoaded(false);
              const results = await getTransactionDataWrapper(value, props.chain);
              props.setResult(results);
              props.setLoaded(true);
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