import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

function AnnouncementSection() {
  const [notice, setNotice] = useState("");
  const [notices, setNotices] = useState<any[]>([]);
  const [editId, setEditId] = useState("");

  const loadNotices = async () => {
    const snapshot = await getDocs(collection(db, "announcements"));

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setNotices(data);
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const saveNotice = async () => {
    if (notice.trim() === "") {
      alert("Please enter an announcement.");
      return;
    }

    if (editId === "") {
      await addDoc(collection(db, "announcements"), {
        notice,
        createdAt: new Date(),
      });
    } else {
      await updateDoc(doc(db, "announcements", editId), {
        notice,
      });

      setEditId("");
    }

    setNotice("");
    loadNotices();
  };

  const editNotice = (item: any) => {
    setNotice(item.notice);
    setEditId(item.id);
  };

  const deleteNotice = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;

    await deleteDoc(doc(db, "announcements", id));
    loadNotices();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-2xl font-bold text-green-700 mb-5">
        📢 Announcement Management
      </h2>

      <textarea
        value={notice}
        onChange={(e) => setNotice(e.target.value)}
        className="w-full border rounded p-3"
        rows={3}
        placeholder="Enter Announcement..."
      />

      <button
        onClick={saveNotice}
        className="mt-4 bg-green-700 text-white px-6 py-2 rounded"
      >
        {editId ? "Update Announcement" : "Save Announcement"}
      </button>

      <div className="mt-8 space-y-3">
        {notices.map((item: any) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <p>{item.notice}</p>

            <div className="space-x-2">
              <button
                onClick={() => editNotice(item)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteNotice(item.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnnouncementSection;