// import { useState } from "react";
// import { Link } from "react-router-dom";
// import history from "../history";
// import Axios from "axios";
// import configData from "../config.json";

// const style = {
//     padding: 5
// };

// function SignUpForm() {

//     const [details, setDetails] = useState({id: "", password: "", confirmPassword: ""});
//     const [error, setError] = useState("Create your account!");

//     const handleClick = e => {
//         e.preventDefault();

//         if (details.password !== details.confirmPassword) {
//             setError("Passwords do not match!");
//         } else if (details.id !== "" && details.password === "" && details.confirmPassword === "") {
//             setError("Please enter a password!");
//         } else if (details.password === details.confirmPassword && details.id !== "") {
//             Axios.post(configData.LOCAL_HOST + "/register", {
//                 NUSNET_ID: details.id,
//                 password: details.password,
//             }).then(response => {
//                 history.push("/sign-up-success");
//             }).catch((error) => {
//                 if (error.response.status === 400) {
//                     setError(error.response.data.message);
//                 } else {
//                     setError("Query failed!");
//                 }
//             });
//         } else if (details.id === "" && details.password !== "" && details.confirmPassword !== "") {
//             setError("Please enter your NUSNET ID!");
//         } else {
//             setError("Create your account!");
//         }
//     };

//     return (
//         <form>
//             <h3>Sign Up</h3>

//             <div className="error">
//                 <span className="message">{error}</span>
//             </div>

//             <div className="form-group" style={style}>
//                 <input type="text" className="form-control" placeholder="NUSNET ID"  onChange={e => setDetails({...details, id: e.target.value})} value={details.id} />
//             </div>

//             <div className="form-group" style={style}>
//                 <input type="password" className="form-control" placeholder="Password" onChange={e => setDetails({...details, password: e.target.value})} value={details.password} />
//             </div>

//             <div className="form-group" style={style}>
//                 <input type="password" className="form-control" placeholder="Re-enter password" onChange={e => setDetails({...details, confirmPassword: e.target.value})} value={details.confirmPassword} />
//             </div>

//             <div style={style}>
//                 <p className="forgot-password text-right">
//                     Already registered? <Link to="/sign-in">Sign in</Link>
//                 </p>
//                 <button type="submit" className="btn btn-primary btn-block" onClick={handleClick}>Sign Up</button>
//             </div>
//         </form>
//     );
// }

// export default SignUpForm;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import history from "../history";
import Axios from "axios";
import configData from "../config.json";
import Layout1 from "../layouts/Layout1";

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from "@material-ui/core/styles";

const style = {
    padding: 5
};

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 100
    },
    formControl2: {
        margin: theme.spacing(1),
        minWidth: 320
    },
    selectEmpty: {
        marginTop: theme.spacing(2)
    },
    menuPaper: {
        maxHeight: 200
    }  
}));

function SignUpForm() {

    const classes = useStyles();

    const currentYear = new Date().getFullYear();

    const [details, setDetails] = useState({id: "", username: "", password: "", confirmPassword: ""});
    const [gradYear, setGradYear] = useState();
    const [faculty, setFaculty] = useState();
    const [error, setError] = useState("Create your account!");

    const handleGradYearChange = (event) => {
        setGradYear(event.target.value);
    };

    const handleFacultyChange = (event) => {
        setFaculty(event.target.value);
    };

    // const facultyList = [
    //     "College of Humanities and Sciences (CHS)",
    //     "Business & Accountancy",
    //     "Computing",
    //     "Dentistry",
    //     "Design & Environment",
    //     "Engineering",
    //     "Law",
    //     "Medicine",
    //     "Nursing",
    //     "Pharmacy",
    //     "Music",
    //     "Special Programmes",
    //     "Concurrent Degree Programmes",
    //     "Minor Programmes",
    //     "Joint Degree Programmes",
    //     "Double Major Programmes",
    //     "Double Degree Programmes",
    //     "Part-Time Programmes"
    // ];

    const [facultyList, setFacultyList] = useState();

    const submitForm = e => {
        e.preventDefault();

        if (details.password !== details.confirmPassword) {
            setError("Passwords do not match!");
        } else if (details.id !== "" && details.password === "" && details.confirmPassword === "") {
            setError("Please enter a password!");
        } else if (details.password === details.confirmPassword && details.id !== "") {
            let facultyId = "";
            for (let i = 0; i < facultyList.length; i++) {
                if (faculty === facultyList[i].Facultydescription) {
                    facultyId = facultyList[i].ID;
                    continue;
                }
            }
            Axios.post(configData.LOCAL_HOST + "/register", {
                name: details.username,
                NUSNET_ID: details.id,
                faculty: facultyId,
                gradYear: gradYear,
                password: details.password
            }).then(response => {
                history.push("/sign-up-success");
            }).catch((error) => {
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
        } else if (details.id === "" && details.password !== "" && details.confirmPassword !== "") {
            setError("Please enter your NUSNET ID!");
        } else {
            setError("Create your account!");
        }
        console.log(details.username);
        console.log(details.id);
        console.log(gradYear);
        console.log(faculty);
        console.log(details.password);
        console.log(details.confirmPassword);
    };

    const getFacultyList = e => {
        Axios.get(configData.LOCAL_HOST + "/get_faculty").then(response => {
            setFacultyList(response.data.data);
        }).catch((error) => {
            if (error.response) {
                console.log("response");
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                if (error.response.status === 400) {
                    console.log(error.response.data.message);
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
                console.log("Query failed!");
            }
        });
    };

    useEffect(() => {
        getFacultyList();
    }, []);

    return (
        <div className="auth-wrapper">
        <div className="auth-inner">
        <Layout1>
        <form>
            <h3>Sign Up</h3>

            <div className="error">
                <span className="message">{error}</span>
            </div>

            <div className="form-group" style={style}>
                <input type="text" className="form-control" placeholder="Username"  onChange={e => setDetails({...details, username: e.target.value})} value={details.username} />
            </div> 
            
            <div className="form-group" style={style}>
                <input style={{width: 210, float: 'left'}}type="text" className="form-control" placeholder="NUSNET ID"  onChange={e => setDetails({...details, id: e.target.value})} value={details.id} />
                <div style={{float: 'left'}}><FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">Grad. year</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={gradYear === undefined ? "" : gradYear}
                    onChange={handleGradYearChange}
                    input={<Input />}
                    MenuProps={{ classes: { paper: classes.menuPaper } }}
                    >
                    {Array.from({ length: (10) / 1}, (_, i) => currentYear + (i * 1)).map((val, key) => {
                        if (val === undefined) {
                            return <MenuItem value={val} key={key}>Blank</MenuItem>;
                        } else {
                            return <MenuItem value={val} key={key}>{val}</MenuItem>;
                        }
                    })}
                    </Select>
                </FormControl></div>
            </div>

            
            <FormControl className={classes.formControl2}>
                <InputLabel id="demo-simple-select-label">Faculty</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={faculty === undefined ? "" : faculty}
                onChange={handleFacultyChange}
                input={<Input />}
                MenuProps={{ classes: { paper: classes.menuPaper } }}
                >                 
                {facultyList === undefined ? "" : Object.entries(facultyList).sort().map((val, key) => {
                    // console.log(val[1].Facultydescription)
                    if (val === undefined) {
                        return <MenuItem value={val[1].Facultydescription} key={key}>Blank</MenuItem>;
                    } else {
                        return <MenuItem value={val[1].Facultydescription} key={key}>{val[1].Facultydescription}</MenuItem>;
                    }
                })}
                </Select>
            </FormControl>

            <div className="form-group" style={style}>
                <input type="password" className="form-control" placeholder="Password" onChange={e => setDetails({...details, password: e.target.value})} value={details.password} />
            </div>

            <div className="form-group" style={style}>
                <input type="password" className="form-control" placeholder="Re-enter password" onChange={e => setDetails({...details, confirmPassword: e.target.value})} value={details.confirmPassword} />
            </div>

            <div style={style}>
                <p className="forgot-password text-right">
                    Already registered? <Link to="/sign-in">Sign in</Link>
                </p>
                <button style={{float: 'left'}} type="submit" className="btn btn-primary btn-block" onClick={submitForm}>Sign Up</button>
            </div>
        </form>
        </Layout1>
        </div></div>
    );
}

export default SignUpForm;