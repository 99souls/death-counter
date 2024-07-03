// src/Settings.tsx
import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";

interface Tracker {
    id: string;
    name: string;
    deaths: number;
    keybind: string;
}

interface SettingsProps {
    setSettingsOpen: (open: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ setSettingsOpen }) => {
    const [trackers, setTrackers] = useState<Tracker[]>([]);
    const [trackerName, setTrackerName] = useState<string>("");

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

    const addTracker = async () => {
        if (trackerName.trim() === "") return;
        await addDoc(collection(db, "trackers"), { name: trackerName, deaths: 0, keybind: "" });
        setTrackerName("");
    };

    const updateKeybind = async (id: string, keybind: string) => {
        const trackerRef = doc(db, "trackers", id);
        await updateDoc(trackerRef, { keybind });
    };

    const deleteTracker = async (id: string) => {
        await deleteDoc(doc(db, "trackers", id));
    };

    return (
        <div className="settings-container">
            <h2>Settings</h2>
            <input type="text" placeholder="New Tracker Name" value={trackerName} onChange={(e) => setTrackerName(e.target.value)} />
            <button onClick={addTracker}>Add Tracker</button>
            <div className="settings-list">
                {trackers.map((tracker) => (
                    <div className="settings-item">
                        <span>{tracker.name}:</span>
                        <input
                            type="text"
                            placeholder="Set Keybind"
                            value={tracker.keybind}
                            onChange={(e) => updateKeybind(tracker.id, e.target.value)}
                        />
                        <button onClick={() => deleteTracker(tracker.id)}>Delete</button>
                    </div>
                ))}
            </div>
            <button onClick={() => setSettingsOpen(false)} style={{ marginTop: "30px" }}>
                Close Settings
            </button>
        </div>
    );
};

export default Settings;
