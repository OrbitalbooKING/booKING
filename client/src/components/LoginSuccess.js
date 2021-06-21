// import history from "../history";

// const style = {
//     padding: 5
// };

// function LoginSuccess(props) {

//     const Logout = () => {
//         history.push("/sign-in");
//     };

//     const Login = () => {
//         history.push("/sign-in");
//     };

//     return (
//         <div className="welcome" style={style}>
//             {props.location.state !== undefined 
//                 ? <div>
//                     <h2>Welcome {props.location.state.id}!</h2>
//                     <button type="submit" className="btn btn-primary btn-block" onClick={Logout}>Logout</button> 
//                 </div> 
//                 : <div> 
//                     <h2>Invalid entry!</h2>
//                     <button type="submit" className="btn btn-primary btn-block" onClick={Login}>Login</button>
//                 </div>
//             }
//         </div>
//     );
// }

// export default LoginSuccess;

import history from "../history";
// import Layout1 from "../layouts/Layout1";
import Layout2 from "../layouts/Layout2";
import Unauthorised from "./Unauthorised";

const style = {
    padding: 5
};

function LoginSuccess(props) {

    const Home = () => {
        history.push({
            pathname: "/home",
            state: { id: props.location.state.id }
        });
    };

    // const Login = () => {
    //     history.push("/sign-in");
    // };

    return (
        <div className="auth-wrapper">
        <div className="auth-inner">
        <div className="welcome" style={style}>
            {props.location.state !== undefined 
                ? <Layout2 id={props.location.state.id} action="Logged in!">
                        <div>
                            <h2>Welcome {props.location.state.id}!</h2>
                            <button style={{float: 'left'}} type="submit" className="btn btn-primary btn-block" onClick={Home}>Home</button> 
                        </div>
                    </Layout2>
                // : <Layout1>
                //     <div> 
                //         <h2>Invalid entry!</h2>
                //         <button style={{float: 'left'}} type="submit" className="btn btn-primary btn-block" onClick={Login}>Login</button>
                //     </div>
                // </Layout1>
                : <Unauthorised />
            }
        </div></div></div>
    );
}

export default LoginSuccess;