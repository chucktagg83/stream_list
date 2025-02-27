import { auth, githubProvider, googleProvider, signInWithPopup } from "./firebase";

const Login = ({ setUser }) => {
  const handleLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user); // Save user data
    } catch (error) {
      console.error("Sign-In Error:", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={() => handleLogin(githubProvider)}>Sign in with GitHub</button>
      <button onClick={() => handleLogin(googleProvider)}>Sign in with Google</button>
    </div>
  );
};

export default Login;


