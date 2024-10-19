import { Central as Layout } from "@/layouts";
import "./NotFound.style.scss";

function NotFound() {
  return (
    <Layout title={"Page Not Found"}>
      <h1 id='title'>404</h1>
      <p id='text'>You've made it to the Chamber of Secrets! <br></br> In all seriousness though, that url doesn't exist.</p>
      <img id='chamber' src='/secret.png'></img>
    </Layout>
  );
}

export default NotFound;
