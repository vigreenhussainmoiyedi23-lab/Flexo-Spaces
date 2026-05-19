import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
function LoginPage() {
  const navigate = useNavigate();
  const { GoogleLoginHandler } = useAuth();
  const handleSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse; // This is the ID token

    try {
      const data = await GoogleLoginHandler({ credential });
      navigate("/listings");
    } catch (err) {
      console.error("Login failed", err?.message);
    }
  };

  const handleError = () => {
    console.log("Google Login Failed");
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap={true} // Optional: enables One Tap
        theme="filled_white"
        size="large"
        text="continue_with"
      />
    </div>
  );
}

export default LoginPage;
