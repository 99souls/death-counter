// src/App.tsx
import React, { useEffect, useState } from "react";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import DeathCounter from "./DeathCounter";
import Login from "./Login";
import "./styles.css";

const App: React.FC = () => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

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
