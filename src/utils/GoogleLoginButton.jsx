import { useEffect } from "react";

const GoogleLoginButton = ({ onLogin }) => {
  useEffect(() => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: onLogin,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large" }
      );
    }
  }, [onLogin]);

  return <div id="googleSignInDiv"></div>;
};

export default GoogleLoginButton;
