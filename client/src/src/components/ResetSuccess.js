import { useHistory } from "react-router-dom";
import Layout1 from "../layouts/Layout1";
import LoginForm from "./Login";

function ResetSuccess(props) {
  let history = useHistory();

  const Login = () => {
    history.push("/sign-in");
  };

  return (
    <>
      {props.location.state !== undefined ? (
        <Layout1>
          <div className="parent">
            <div className="welcome-page">
              <h2>{props.location.state.message}</h2>
              <div>
                <button
                  style={{ float: "left" }}
                  type="submit"
                  className="btn btn-primary btn-block"
                  onClick={Login}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </Layout1>
      ) : (
        <LoginForm />
      )}
    </>
  );
}

export default ResetSuccess;
