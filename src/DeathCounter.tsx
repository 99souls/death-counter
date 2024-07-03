// src/DeathCounter.tsx
import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { collection, doc, onSnapshot, updateDoc, increment } from "firebase/firestore";

interface Tracker {
    id: string;
    name: string;
    deaths: number;
    keybind: string;
}

const DeathCounter: React.FC = () => {
    const [trackers, setTrackers] = useState<Tracker[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "trackers"), (snapshot) => {
            const trackersData: Tracker[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name || "",
                deaths: doc.data().deaths || 0,
                keybind: doc.data().keybind || "",
            }));
            setTrackers(trackersData);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            trackers.forEach((tracker) => {
                if (event.key === tracker.keybind) {
                    incrementDeath(tracker.id);
                }
            });
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [trackers]);

    const incrementDeath = async (id: string) => {
        const trackerRef = doc(db, "trackers", id);
        await updateDoc(trackerRef, { deaths: increment(1) });
    };

    const decrementDeath = async (id: string) => {
        const trackerRef = doc(db, "trackers", id);
        await updateDoc(trackerRef, { deaths: increment(-1) });
    };

    return (
        <div>
            <h1>Elden Ring Death Counter</h1>

            <div className="player-container">
                {trackers.map((tracker) => (
                    <div key={tracker.id} className="player">
                        <h2>{tracker.name}</h2>
                        <p>Deaths: {tracker.deaths}</p>
                        <button onClick={() => incrementDeath(tracker.id)}>Add Death</button>
                        <button onClick={() => decrementDeath(tracker.id)}>Decrement Death</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeathCounter;
