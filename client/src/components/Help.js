import { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useHistory } from "react-router-dom";
import Layout1 from "../layouts/Layout1";
import Layout2 from "../layouts/Layout2";
import Layout3 from "../layouts/Layout3";

import * as Cookies from "js-cookie";

function Help() {
  let history = useHistory();

  const [isCopied, setIsCopied] = useState(false);

  const onCopyText = () => {
    // sets the copied message to disappear after a second
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const goLogin = () => {
    // redirects user back to login page
    history.push("/sign-in");
  };

  const goHome = () => {
    // redirects user back to home
    history.push("/home");
  };

  useEffect(() => {
    return function cleanup() {
      setIsCopied(false);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {Cookies.get("name") === undefined &&
      Cookies.get("id") === undefined &&
      Cookies.get("account") === undefined ? (
        <Layout1>
          <div className="parent">
            <div className="help-page">
              <div>
                <h5>Refer to our user guide: </h5>
              </div>
              <div
                style={{ overflowWrap: "break-word", wordBreak: "break-all" }}
              >
                <h5>
                  https://docs.google.com/document/d/1zvFvemhVmstVMCiOg0dLkmLf1wWBZFmuWxLuLHR_zJg/edit?usp=sharing
                </h5>
                <span className="message">{isCopied ? "Copied!" : ""}</span>
              </div>
              <div>
                <CopyToClipboard
                  text="https://docs.google.com/document/d/1zvFvemhVmstVMCiOg0dLkmLf1wWBZFmuWxLuLHR_zJg/edit?usp=sharing"
                  onCopy={onCopyText}
                >
                  <button
                    style={{ float: "right" }}
                    className="btn btn-primary btn-block"
                  >
                    Copy URL
                  </button>
                </CopyToClipboard>
                <button
                  style={{ float: "left" }}
                  type="submit"
                  className="btn btn-primary btn-block"
                  onClick={goLogin}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </Layout1>
      ) : Cookies.get("name") !== undefined &&
        Cookies.get("id") !== undefined &&
        Cookies.get("account") === "Student" ? (
        <Layout2
          id={Cookies.get("id")}
          name={Cookies.get("name")}
          action="Viewing help"
        >
          <div className="parent">
            <div className="help-page">
              <div>
                <h5>Refer to our user guide: </h5>
              </div>
              <div
                style={{ overflowWrap: "break-word", wordBreak: "break-all" }}
              >
                <h5>
                  https://docs.google.com/document/d/1zvFvemhVmstVMCiOg0dLkmLf1wWBZFmuWxLuLHR_zJg/edit?usp=sharing
                </h5>
                <span className="message">{isCopied ? "Copied!" : ""}</span>
              </div>
              <div>
                <CopyToClipboard
                  text="https://docs.google.com/document/d/1zvFvemhVmstVMCiOg0dLkmLf1wWBZFmuWxLuLHR_zJg/edit?usp=sharing"
                  onCopy={onCopyText}
                >
                  <button
                    style={{ float: "right" }}
                    className="btn btn-primary btn-block"
                  >
                    Copy URL
                  </button>
                </CopyToClipboard>
                <button
                  style={{ float: "left" }}
                  type="submit"
                  className="btn btn-primary btn-block"
                  onClick={goHome}
                >
                  Home
                </button>
              </div>
            </div>
          </div>
        </Layout2>
      ) : (
        <Layout3
          id={Cookies.get("id")}
          name={Cookies.get("name")}
          action="Viewing help"
        >
          <div className="parent">
            <div className="help-page">
              <div>
                <h5>Refer to our user guide: </h5>
              </div>
              <div
                style={{ overflowWrap: "break-word", wordBreak: "break-all" }}
              >
                <h5>
                  https://docs.google.com/document/d/1zvFvemhVmstVMCiOg0dLkmLf1wWBZFmuWxLuLHR_zJg/edit?usp=sharing
                </h5>
                <span className="message">{isCopied ? "Copied!" : ""}</span>
              </div>
              <div>
                <CopyToClipboard
                  text="https://docs.google.com/document/d/1zvFvemhVmstVMCiOg0dLkmLf1wWBZFmuWxLuLHR_zJg/edit?usp=sharing"
                  onCopy={onCopyText}
                >
                  <button
                    style={{ float: "right" }}
                    className="btn btn-primary btn-block"
                  >
                    Copy URL
                  </button>
                </CopyToClipboard>
                <button
                  style={{ float: "left" }}
                  type="submit"
                  className="btn btn-primary btn-block"
                  onClick={goHome}
                >
                  Home
                </button>
              </div>
            </div>
          </div>
        </Layout3>
      )}
    </>
  );
}

export default Help;
