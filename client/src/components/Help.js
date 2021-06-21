import { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import history from "../history";
import Layout1 from "../layouts/Layout1";

const style = {
    padding: 5,
    // whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word'
};

function Help() {

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
        <div className="auth-wrapper">
        <div className="display">
        <Layout1>
        <div className="" style={style}>
            <div>
                <h5>Refer to our user guide: </h5>
                <h5>https://docs.google.com/document/d/1zvFvemhVmstVMCiOg0dLkmLf1wWBZFmuWxLuLHR_zJg/edit?usp=sharing</h5>
                <span className="message">{ isCopied ? "Copied!" : ""}</span>
            </div>
                <CopyToClipboard text="https://docs.google.com/document/d/1zvFvemhVmstVMCiOg0dLkmLf1wWBZFmuWxLuLHR_zJg/edit?usp=sharing" onCopy={onCopyText}> 
                    <button style={{float: 'right'}} className="btn btn-primary btn-block">Copy URL</button>
                </CopyToClipboard>
            <button style={{float: 'left'}} type="submit" className="btn btn-primary btn-block" onClick={Login}>Login</button>
        </div>
        </Layout1></div></div>
    );
}

export default Help;