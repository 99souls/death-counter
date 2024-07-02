// src/DeathCounter.tsx
import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import "./styles.css";

const DeathCounter: React.FC = () => {
    const [player1Deaths, setPlayer1Deaths] = useState<number>(0);
    const [player2Deaths, setPlayer2Deaths] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            const player1Doc = await getDoc(doc(collection(db, "deaths"), "player1"));
            const player2Doc = await getDoc(doc(collection(db, "deaths"), "player2"));

            if (player1Doc.exists()) {
                setPlayer1Deaths(player1Doc.data().count);
            }
            if (player2Doc.exists()) {
                setPlayer2Deaths(player2Doc.data().count);
            }
        };

        fetchData();
    }, []);

    const incrementDeath = async (player: string) => {
        if (player === "player1") {
            const newCount = player1Deaths + 1;
            setPlayer1Deaths(newCount);
            await setDoc(doc(collection(db, "deaths"), "player1"), { count: newCount });
        } else if (player === "player2") {
            const newCount = player2Deaths + 1;
            setPlayer2Deaths(newCount);
            await setDoc(doc(collection(db, "deaths"), "player2"), { count: newCount });
        }
    };

    const decrementDeath = async (player: string) => {
        if (player === "player1") {
            if (player1Deaths != 0) {
                const newCount = player1Deaths - 1;
                setPlayer1Deaths(newCount);
                await setDoc(doc(collection(db, "deaths"), "player1"), { count: newCount });
            }
        } else if (player === "player2") {
            if (player2Deaths != 0) {
                const newCount = player2Deaths - 1;
                setPlayer2Deaths(newCount);
                await setDoc(doc(collection(db, "deaths"), "player2"), { count: newCount });
            }
        }
    };

    return (
        <div>
            <h1>Elden Ring Death Counter</h1>
            <div className="player-container">
                <div className="player">
                    <h2>Steff</h2>
                    <p>Deaths: {player1Deaths}</p>
                    <button onClick={() => incrementDeath("player1")}>Add Death</button> <br></br>
                    <button onClick={() => decrementDeath("player1")}>Remove Death</button>
                </div>
                <div className="player">
                    <h2>Dan</h2>
                    <p>Deaths: {player2Deaths}</p>
                    <button onClick={() => incrementDeath("player2")}>Add Death</button> <br></br>
                    <button onClick={() => decrementDeath("player2")}>Remove Death</button>
                </div>
            </div>
        </div>
    );
};

export default DeathCounter;
