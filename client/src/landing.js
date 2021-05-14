import { Card, Button } from "react-bootstrap";
import "./landing.css";
import logo from "./Logo.png";

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=a3296c7d32264744a2a198e3ef62a255&response_type=code&redirect_uri=https://playlist-analyst.herokuapp.com&scope=user-top-read%20playlist-read-private%20user-read-private%20user-library-read%20playlist-read-collaborative";

function Login() {
  return (
    <div className="loginParent">
      <Card className="loginCard">
        <div className="loginCarddiv">
          <div className="cardContent">
            <img src={logo} style={{ height: "80px" }} />
            <div className="loginPageText">
              Welcome to the Playlist Analyst <br /> Log in with Spotify to
              analyze any of your playlists, and get breakdowns of the artists,
              genres, moods and many more. This thing is in CLOSED ALPHA BRO!!!
              Meaning it's ver unfinished. If you even know about the existence
              of this it's cus you're a very special person. Su out.
            </div>
            <a href={AUTH_URL}>
              <Button className="btn-login">Login with Spotify</Button>
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Login;
