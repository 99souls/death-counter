// src/App.tsx
import React, { useEffect, useState } from "react";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import DeathCounter from "./DeathCounter";
import Login from "./Login";
import "./styles.css";
import Settings from "./Settings";

const App: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true); // State to track loading status
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

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
                settingsOpen ? (
                    <Settings setSettingsOpen={setSettingsOpen} />
                ) : (
                    <>
                        <DeathCounter />
                        <button onClick={() => setSettingsOpen(true)} style={{ marginRight: "5px" }}>
                            Open Settings
                        </button>
                        <button onClick={() => signOut(auth)}>Sign out</button>
                    </>
                )
            ) : (
                <Login />
            )}
        </div>
    );
};

export default App;
