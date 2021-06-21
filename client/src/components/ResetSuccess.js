// import history from "../history";

// const style = {
//     padding: 5
// };

// function ResetSuccess() {

//     const Login = () => {
//         history.push("/sign-in");
//     };

//     return (
//         <div className="welcome" style={style}>
//             <h2>You have successfully resetted your password!</h2>
//             <button type="submit" className="btn btn-primary btn-block" onClick={Login}>Login</button>
//         </div>
//     );
// }

// export default ResetSuccess;

import history from "../history";
import Layout1 from "../layouts/Layout1";

const style = {
    padding: 5
};

function ResetSuccess() {

    const Login = () => {
        history.push("/sign-in");
    };

    return (
        <div className="auth-wrapper">
        <div className="auth-inner">
        <Layout1>
        <div className="welcome" style={style}>
            <h2>You have successfully resetted your password!</h2>
            <button style={{float: 'left'}} type="submit" className="btn btn-primary btn-block" onClick={Login}>Login</button>
        </div>
        </Layout1>
        </div></div>
    );
}

export default ResetSuccess;