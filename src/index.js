import ReactDOM from "react-dom";
import { Router } from 'react-router';
import history from "./history";
import "./App.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
    <Router history={history}>
        <App />
    </Router>,
    document.getElementById("root")
);

serviceWorker.unregister();
