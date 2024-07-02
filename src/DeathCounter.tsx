// src/DeathCounter.tsx
import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { collection, doc, onSnapshot, addDoc, deleteDoc, updateDoc, increment } from "firebase/firestore";

interface Tracker {
    id: string;
    name: string;
    deaths: number;
}

const DeathCounter: React.FC = () => {
    const [trackers, setTrackers] = useState<Tracker[]>([]);
    const [newTrackerName, setNewTrackerName] = useState<string>("");

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "trackers"), (snapshot) => {
            const trackersData: Tracker[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name || "",
                deaths: doc.data().deaths || 0,
            }));
            setTrackers(trackersData);
        });

        return () => unsubscribe();
    }, []);

    const addTracker = async () => {
        if (newTrackerName.trim() === "") return;
        await addDoc(collection(db, "trackers"), { name: newTrackerName, deaths: 0 });
        setNewTrackerName("");
    };

    const incrementDeath = async (id: string) => {
        const trackerRef = doc(db, "trackers", id);
        await updateDoc(trackerRef, { deaths: increment(1) });
    };

    const decrementDeath = async (id: string) => {
        const trackerRef = doc(db, "trackers", id);
        await updateDoc(trackerRef, { deaths: increment(-1) });
    };

    const deleteTracker = async (id: string) => {
        const trackerRef = doc(db, "trackers", id);
        await deleteDoc(trackerRef);
    };

    return (
        <div>
            <h1>Elden Ring Death Counter</h1>
            <div>
                <input type="text" placeholder="New Tracker Name" value={newTrackerName} onChange={(e) => setNewTrackerName(e.target.value)} />
                <button onClick={addTracker}>Add Tracker</button>
            </div>
            <div className="player-container">
                {trackers.map((tracker) => (
                    <div key={tracker.id} className="player">
                        <h2>{tracker.name}</h2>
                        <p>Deaths: {tracker.deaths}</p>
                        <button onClick={() => incrementDeath(tracker.id)}>Add Death</button>
                        <button onClick={() => decrementDeath(tracker.id)}>Decrement Death</button>
                        <button onClick={() => deleteTracker(tracker.id)}>Delete Tracker</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeathCounter;
