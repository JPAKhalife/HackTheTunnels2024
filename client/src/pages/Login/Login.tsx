import { useState } from "react";
import { useAccountContext } from "../../context";
import { Base as Layout } from "@/layouts";
import "./Login.style.scss";

function Login() {
  const [message, setMessage] = useState(null);
  const { login } = useAccountContext();

  const attemptLogin = async () => {
    try {
      const message = await login("admin@email.com", "password");
      setMessage(message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="Login"></div>
      <div className="Login__panel">
        <div className="Login__panel__content">
          <img src="/hogwartslogo.png"></img>
          <div className="Login__panel__content__message">
            <div id="description">Welcome to the Hogwarts SSO Federated Portal.</div> 
            <br></br>
            <div id="description">That's right, we use technology too!</div>
            <div id="description">
              Enter your{" "}
              <a href="https://www.hogwartsishere.com/courses/by-level/" target="blank">
                Hogwarts
              </a>{" "}
              username and password.
            </div>
          </div>
          {message && <p id="error">{message}</p>}
          <div className="Login__panel__content__input">
            <input type="text" placeholder="Hogwarts username"></input>
            <input type="password" placeholder="Password"></input>
          </div>
          <div className="Login__panel__content__checkbox">
            <input type="checkbox"></input>
            <label>Keep me signed in</label>
          </div>
          <div className="buttons">
          <button className="blob-btn" onClick={() => attemptLogin()}>
            Sign In
            <span className="blob-btn__inner">
              <span className="blob-btn__blobs">
                <span className="blob-btn__blob"></span>
                <span className="blob-btn__blob"></span>
                <span className="blob-btn__blob"></span>
                <span className="blob-btn__blob"></span>
              </span>
            </span>
          </button>
          </div>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7" result="goo"></feColorMatrix>
              <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
            </filter>
          </defs>
        </svg>
          <button
            
          >
            Sign In
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default Login;
