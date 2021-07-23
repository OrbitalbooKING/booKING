import { useHistory } from "react-router-dom";

function ErrorPage() {
  let history = useHistory();

  const Home = () => {
    history.push("/home");
  };

  return (
    <div>
      <div className="welcome-page">
        <h1>Error 404</h1>
        <p>The page you are looking for doesn't exist!</p>
        <div>
          <button
            style={{ float: "left" }}
            type="submit"
            className="btn btn-primary btn-block"
            onClick={Home}
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
