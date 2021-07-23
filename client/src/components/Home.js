import StudentHome from "./StudentHome";
import StaffHome from "./StaffHome";
import AdminHome from "./AdminHome";
import Unauthorised from "./Unauthorised";

import * as Cookies from "js-cookie";

function Home() {
  return (
    <>
      {Cookies.get("name") !== undefined &&
      Cookies.get("id") !== undefined &&
      Cookies.get("account") === "Student" ? (
        <StudentHome />
      ) : Cookies.get("name") !== undefined &&
        Cookies.get("id") !== undefined &&
        Cookies.get("account") === "Staff" ? (
        <StaffHome />
      ) : Cookies.get("name") !== undefined &&
        Cookies.get("id") !== undefined &&
        Cookies.get("account") === "Admin" ? (
        <AdminHome />
      ) : (
        <Unauthorised />
      )}
    </>
  );
}

export default Home;
