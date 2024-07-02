// src/App.tsx
import React, { useEffect, useState } from "react";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import DeathCounter from "./DeathCounter";
import Login from "./Login";
import "./styles.css";

const App: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true); // State to track loading status

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false); // Set loading to false once we receive the auth status
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

    return (
        <div className="container">
            {user ? (
                <div>
                    <DeathCounter />
                    <button onClick={() => signOut(auth)}>Sign Out</button>
                </div>
            ) : (
                <Login />
            )}
        </div>
    );
};

export default App;
