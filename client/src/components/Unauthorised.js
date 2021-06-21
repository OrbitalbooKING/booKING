import history from "../history";
import Layout1 from "../layouts/Layout1";

// const style = {
//     padding: 5
// };

function Unauthorised() {

    const Login = () => {
        history.push("/sign-in");
    };

    return (
        <Layout1>
            <div> 
                <h2>Please login!</h2>
                <button style={{float: 'left'}} type="submit" className="btn btn-primary btn-block" onClick={Login}>Login</button>
            </div>
        </Layout1>
    );
}

export default Unauthorised;