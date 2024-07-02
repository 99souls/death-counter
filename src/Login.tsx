// src/Login.tsx
import React, { useState } from "react";
import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    const handleSignUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Error signing up:", error);
        }
    };

    return (
        <div>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /> <br></br>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /> <br></br>
            <button onClick={handleLogin}>Login</button> <br></br>
            <button onClick={handleSignUp}>Sign Up</button> <br></br>
        </div>
    );
};

export default Login;
