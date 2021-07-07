import { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useHistory } from "react-router-dom";
import Layout3 from "../layouts/Layout3";

import * as Cookies from "js-cookie";

function HelpStaff() {

    let history = useHistory();

    const [isCopied, setIsCopied] = useState(false);

    const onCopyText = () => {
        setIsCopied(true);
        setTimeout(() => {
        setIsCopied(false);
        }, 1000);
    };

    const Login = () => {
        history.push("/sign-in");
    };

    useEffect(() => {
        return function cleanup() {
            setIsCopied(false);
        }
    }, []);

    return (
        <Layout3 id={Cookies.get("id")} name={Cookies.get("name")} action="Viewing help">
            <div className="parent">
                <div className="welcome-page">
                    <div style={{overflowWrap: 'break-word', wordBreak: 'break-all'}}>
                        <h5>Refer to our user guide: </h5>
                        <h5>https://docs.google.com/document/d/1zvFvemhVmstVMCiOg0dLkmLf1wWBZFmuWxLuLHR_zJg/edit?usp=sharing</h5>
                        <span className="message">{ isCopied ? "Copied!" : ""}</span>
                    </div>
                    <div>
                        <CopyToClipboard text="https://docs.google.com/document/d/1zvFvemhVmstVMCiOg0dLkmLf1wWBZFmuWxLuLHR_zJg/edit?usp=sharing" onCopy={onCopyText}> 
                            <button style={{float: 'right'}} className="btn btn-primary btn-block">Copy URL</button>
                        </CopyToClipboard>
                        <button style={{float: 'left'}} type="submit" className="btn btn-primary btn-block" onClick={Login}>Login</button> 
                    </div>
                </div>
            </div>
        </Layout3>
    );
}

export default HelpStaff;