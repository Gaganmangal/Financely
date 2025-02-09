import React, { useEffect } from "react";
import "./styles.css";
import { useAuthState, useIdToken } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { getAuth, signOut } from "firebase/auth";
import userSvg from "../../assets/user.svg";

function Header() {
  const [user, loading, error] = useIdToken(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);

  function logoutfnc() {
    try {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          toast.success("Logout Successflly!");
          navigate("/");
        })
        .catch((error) => {
          // An error happened.
          toast.error(error.message);
        });
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="navbar">
      <p className="logo">Financly.</p>
      {user && (
        <div style={{ display: "flex", alignContent: "center", gap: "0.5rem" }}>
          <img
            src={user.photoURL ? user.photoURL : userSvg}
            style={{ borderRadius: "50%", height: "1.5rem", width: "1.5rem" }}
          />
          <p className="logo link" onClick={logoutfnc}>
            Logout
          </p>{" "}
        </div>
      )}
    </div>
  );
}

export default Header;
