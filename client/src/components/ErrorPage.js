import { useHistory } from "react-router-dom";

function ErrorPage() {
  let history = useHistory();

  const goHome = () => {
    // redirects user back to home
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
            onClick={goHome}
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
