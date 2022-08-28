import { FC, useState } from "react";
import "./NavBar.css";
import NavSearch from "./NavSearch/NavSearch";
import * as Func from "../FunctionCalls/FunctionCall";
import sendNotification from "../Comm/Comm";

interface NavbarProps {}

const NavBar: FC<NavbarProps> = (props) => {
  const [ethAddr, setEthAddr] = useState("Login");

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Wallet Profiler
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a
                className="nav-link active"
                aria-current="page"
                href="#"
                onClick={async () => {
                  console.log("Await NExt");
                  await sendNotification(
                    [
                      "0x26e28866a88b41b44ee08b3bafdd3a147191f4b1",
                      "0x81dc6992b3170817f2a67d96d302f911bdb2cc33",
                      "0x1162a83a65f4b4f58698245236fddaf55479cf61",
                      "0xb600fd470d7422231a2308f6807e1e467c4145e4",
                      "0x9277ba9fc17E8eA062b3Da52497f52e98792f3c6",
                    ],
                    "TITLE: You are Lucky Winner",
                    "MESSAGE: You have been chosen by us for your first 100 transactions"
                  );
                  console.log("After AWAIT");
                }}
              >
                Notify
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Link
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Dropdown
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </li>
              </ul>
            </li>
          </ul>
          <div className="">
            <button
              className="btn btn-outline-success me-3"
              onClick={() => {
                Func.default((ethAddr: any) => {
                  setEthAddr(ethAddr);
                });
              }}
            >
              {ethAddr}
            </button>
            <button
              className="btn btn-outline-success"
              onClick={() => {
                Func.logOut(() => {
                  setEthAddr("Login");
                });
              }}
            >
              LogOut
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
