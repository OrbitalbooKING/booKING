// import { useState } from "react";
// import { Link, useHistory } from "react-router-dom";
// import Axios from "axios";
// import configData from "../config.json";
// import Layout1 from "../layouts/Layout1";
// import Home from "./Home";

// import * as Cookies from "js-cookie";

// const style = {
//   padding: 5,
// };

// function ResetForm() {
//   let history = useHistory();

//   const [details, setDetails] = useState({
//     id: "",
//     password: "",
//     newPassword: "",
//   });
//   const [error, setError] = useState("Reset your password!");

//   const resetPassword = (e) => {
//     e.preventDefault();

//     if (details.password !== details.newPassword) {
//       setError("Passwords do not match!");
//     } else if (
//       details.id !== "" &&
//       details.password === "" &&
//       details.newPassword === ""
//     ) {
//       setError("Please enter your new password!");
//     } else if (details.password === details.newPassword && details.id !== "") {
//       Axios.patch(configData.LOCAL_HOST + "/reset", {
//         NUSNET_ID: details.id,
//         password: details.password,
//       })
//         .then((response) => {
//           history.push({
//             pathname: "/reset-password-success",
//             state: { message: response.data.message },
//           });
//         })
//         .catch((error) => {
//           if (error.response) {
//             console.log("response");
//             // The request was made and the server responded with a status code
//             // that falls out of the range of 2xx
//             if (error.response.status === 400) {
//               setError(error.response.data.message);
//             }
//           } else if (error.request) {
//             console.log("request");
//             // The request was made but no response was received
//             // `error.request` is an instance of XMLHttpRequest in the
//             // browser and an instance of
//             // http.ClientRequest in node.js
//             console.log(error.request);
//           } else {
//             // Something happened in setting up the request that triggered an Error
//             setError("Query failed!");
//           }
//         });
//     } else if (
//       details.id === "" &&
//       details.password !== "" &&
//       details.newPassword !== ""
//     ) {
//       setError("Please enter your NUSNET ID!");
//     } else {
//       setError("Reset your password!");
//     }
//   };

//   return (
//     <>
//       {Cookies.get("name") === undefined &&
//       Cookies.get("name") === undefined ? (
//         <Layout1>
//           <div className="parent">
//             <div className="content">
//               <form>
//                 <h3>Reset password</h3>

//                 <div className="error">
//                   <span className="message">{error}</span>
//                 </div>

//                 <div className="form-group" style={style}>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="NUSNET ID"
//                     onChange={(e) =>
//                       setDetails({ ...details, id: e.target.value })
//                     }
//                     value={details.id}
//                   />
//                 </div>

//                 <div className="form-group" style={style}>
//                   <input
//                     type="password"
//                     className="form-control"
//                     placeholder="Password"
//                     onChange={(e) =>
//                       setDetails({ ...details, password: e.target.value })
//                     }
//                     value={details.password}
//                   />
//                 </div>

//                 <div className="form-group" style={style}>
//                   <input
//                     type="password"
//                     className="form-control"
//                     placeholder="Re-enter password"
//                     onChange={(e) =>
//                       setDetails({ ...details, newPassword: e.target.value })
//                     }
//                     value={details.newPassword}
//                   />
//                 </div>

//                 <div style={style}>
//                   <p className="forgot-password text-right">
//                     <Link to="/sign-in">Sign in</Link>
//                   </p>
//                   <button
//                     style={{ float: "left" }}
//                     type="submit"
//                     className="btn btn-primary btn-block"
//                     onClick={resetPassword}
//                   >
//                     Reset
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </Layout1>
//       ) : (
//         <Home />
//       )}
//     </>
//   );
// }

// export default ResetForm;

import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Axios from "axios";
import configData from "../config.json";
import Layout1 from "../layouts/Layout1";
import Home from "./Home";

import * as Cookies from "js-cookie";

const style = {
  padding: 5,
};

function ResetForm() {
  let history = useHistory();

  const [id, setId] = useState();
  const [error, setError] = useState(
    "Enter your NUSNET ID to reset your password!"
  );

  const resetPassword = (e) => {
    e.preventDefault();

    // if (details.password !== details.newPassword) {
    //   setError("Passwords do not match!");
    // } else if (
    //   details.id !== "" &&
    //   details.password === "" &&
    //   details.newPassword === ""
    // ) {
    //   setError("Please enter your new password!");
    // } else if (details.password === details.newPassword && details.id !== "") {
    Axios.post(configData.LOCAL_HOST + "/trigger_password_reset", {
      NUSNET_ID: id,
    })
      .then((response) => {
        history.push({
          pathname: "/reset-password-success",
          state: { message: response.data.message },
        });
      })
      .catch((error) => {
        if (error.response) {
          console.log("response");
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.status === 400) {
            setError(error.response.data.message);
          }
        } else if (error.request) {
          console.log("request");
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the
          // browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          setError("Query failed!");
        }
      });
    // } else if (
    //   details.id === "" &&
    //   details.password !== "" &&
    //   details.newPassword !== ""
    // ) {
    //   setError("Please enter your NUSNET ID!");
    // } else {
    //   setError("Reset your password!");
    // }
  };

  return (
    <>
      {Cookies.get("name") === undefined && Cookies.get("id") === undefined ? (
        <Layout1>
          <div className="parent">
            <div className="content">
              <form>
                <h3>Reset Password</h3>

                <div className="error">
                  <span className="message">{error}</span>
                </div>

                <div className="form-group" style={style}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="NUSNET ID"
                    onChange={(e) => setId(e.target.value)}
                    value={id}
                  />
                </div>

                {/* <div className="form-group" style={style}>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    onChange={(e) =>
                      setDetails({ ...details, password: e.target.value })
                    }
                    value={details.password}
                  />
                </div>

                <div className="form-group" style={style}>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Re-enter password"
                    onChange={(e) =>
                      setDetails({ ...details, newPassword: e.target.value })
                    }
                    value={details.newPassword}
                  />
                </div> */}

                <div style={style}>
                  <p className="forgot-password text-right">
                    <Link to="/sign-in">Sign in</Link>
                  </p>
                  <button
                    style={{ float: "left" }}
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={resetPassword}
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Layout1>
      ) : (
        <Home />
      )}
    </>
  );
}

export default ResetForm;
