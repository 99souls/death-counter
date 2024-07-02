// src/DeathCounter.tsx
import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, doc, getDocs, addDoc, deleteDoc, setDoc } from "firebase/firestore";

interface Tracker {
    id: string;
    name: string;
    deaths: number;
}

const DeathCounter: React.FC = () => {
    const [trackers, setTrackers] = useState<Tracker[]>([]);
    const [newTrackerName, setNewTrackerName] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrackers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "trackers"));
                const trackersData: Tracker[] = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().name,
                    deaths: doc.data().deaths,
                }));
                setTrackers(trackersData);
            } catch (error: any) {
                setError("Error fetching trackers: " + error.message);
            }
        };

        fetchTrackers();
    }, []);

    const addTracker = async () => {
        if (newTrackerName.trim() === "") return;

        const newTracker = {
            name: newTrackerName,
            deaths: 0,
        };

        try {
            const docRef = await addDoc(collection(db, "trackers"), newTracker);
            setTrackers([...trackers, { ...newTracker, id: docRef.id }]);
            setNewTrackerName("");
        } catch (error: any) {
            setError("Error adding tracker: " + error.message);
        }
    };

    const deleteTracker = async (id: string) => {
        try {
            await deleteDoc(doc(db, "trackers", id));
            setTrackers(trackers.filter((tracker) => tracker.id !== id));
        } catch (error: any) {
            setError("Error deleting tracker: " + error.message);
        }
    };

    const incrementDeath = async (id: string) => {
        const tracker = trackers.find((t) => t.id === id);
        if (!tracker) return;

        const updatedDeaths = tracker.deaths + 1;
        try {
            await setDoc(doc(db, "trackers", id), { ...tracker, deaths: updatedDeaths });
            setTrackers(trackers.map((t) => (t.id === id ? { ...t, deaths: updatedDeaths } : t)));
        } catch (error: any) {
            setError("Error updating deaths: " + error.message);
        }
    };

    const decrementDeath = async (id: string) => {
        const tracker = trackers.find((t) => t.id === id);
        if (!tracker || tracker.deaths === 0) return;

        const updatedDeaths = tracker.deaths - 1;
        try {
            await setDoc(doc(db, "trackers", id), { ...tracker, deaths: updatedDeaths });
            setTrackers(trackers.map((t) => (t.id === id ? { ...t, deaths: updatedDeaths } : t)));
        } catch (error: any) {
            setError("Error updating deaths: " + error.message);
        }
    };

    return (
        <>
            <h1>Elden Ring Death Counter</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="new-tracker-container">
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
        </>
    );
};

export default DeathCounter;
