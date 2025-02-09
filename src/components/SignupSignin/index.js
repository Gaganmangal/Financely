import React, { useState } from "react";
import "./styles.css";
import Input from "../Input";
import Button from "../Button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db, provider } from "../../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";

function SignupSigninComponents() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const navigate = useNavigate();

  function signupWithEmail() {
    setLoading(true);
    console.log("name: ", name);
    console.log("email: ", email);
    console.log("password: ", password);
    console.log("confirmpassword: ", confirmpassword);

    if (name != "" && email != "" && password != "" && confirmpassword != "") {
      if (password == confirmpassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log("User: ", user.uid);
            toast.success("User Created");
            setConfirmPassword("");
            setEmail("");
            setPassword("");
            setName("");
            setLoading(false);
            createDoc(user);
            navigate("/dashboard");
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);

            // ..
          });
      } else {
        toast.error("Password don't match!");
        setLoading(false);
      }
    } else {
      toast.error("All fields is mandatory!");
      setLoading(false);
    }
  }

  function loginUsingEmail() {
    setLoading(true);
    console.log("email: ", email);
    console.log("password: ", password);

    if (email != "" && password != "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
          toast.success("User Logged in!");
          navigate("/dashboard");
          setLoading(false);
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);
        });
    } else {
      toast.error("All fields is mandatory!");
      setLoading(false);
    }
  }

  async function createDoc(user) {
    setLoading(true);
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = new Date();

      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt,
        });
        toast.success("Account created!");
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    } else {
      setLoading(false);
      toast.error("Account Already Exists!");
    }
  }

  function googleAuth() {
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          setLoading(false);
          const user = result.user;
          createDoc(user);
          navigate("/dashboard");
          toast.success("Account created!");
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          setLoading(false);
          toast.error(errorMessage);
        });
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  }

  return (
    <>
      {loginForm ? (
        <div className="Signup-wrapper">
          <h2 className="title">
            Login on <span style={{ color: "var(--theme)" }}>Financely.</span>
          </h2>
          <form>
            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"mangalgagan8@gmail.com"}
            />
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Example@123"}
            />
            <Button
              disabled={loading}
              text={loading ? "Loading....." : "Login Using Email and Password"}
              onClick={loginUsingEmail}
            />
            <p className="p-login">or</p>
            <Button
              text={loading ? "Loading....." : "Login Using Google"}
              blue={true}
              onClick={googleAuth}
            />
            <Button
              text={loading ? "Loading....." : "Login Using Google"}
              blue={true}
              onClick={googleAuth}
            />
            <p className="p-login" onClick={() => setLoginForm(!loginForm)}>
              Or Don't Have An Account? Click Here.
            </p>
          </form>
        </div>
      ) : (
        <div className="Signup-wrapper">
          <h2 className="title">
            Sign UP on <span style={{ color: "var(--theme)" }}>Financely.</span>
          </h2>
          <form>
            <Input
              type="text"
              label={"Full Name"}
              state={name}
              setState={setName}
              placeholder={"Gagan Mangal"}
            />
            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"mangalgagan8@gmail.com"}
            />
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Example@123"}
            />
            <Input
              type="password"
              label={"Confirm Password"}
              state={confirmpassword}
              setState={setConfirmPassword}
              placeholder={"Example@123"}
            />
            <Button
              disabled={loading}
              text={
                loading ? "Loading....." : "Signup Using Email and Password"
              }
              onClick={signupWithEmail}
            />
            <p className="p-login">or</p>
            <Button
              text={loading ? "Loading....." : "Signup Using Google"}
              onClick={googleAuth}
              blue={true}
            />
            <p className="p-login" onClick={() => setLoginForm(!loginForm)}>
              Or Have An Account Already? Click Here
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export default SignupSigninComponents;
