import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

function AdminSettings() {
    const [festivalName, setFestivalName] = useState("");
const [festivalDate, setFestivalDate] = useState("");
const [festivalVenue, setFestivalVenue] = useState("");
const [festivalLogo, setFestivalLogo] = useState("");
const [festivalBanner, setFestivalBanner] = useState("");

const saveSettings = async () => {
  try {
    await setDoc(doc(db, "settings", "festival"), {
      festivalName,
      festivalDate,
      festivalVenue,
      festivalLogo,
    });

    alert("✅ Settings Saved Successfully");
  } catch (error) {
    console.error(error);
    alert("❌ Failed to Save Settings");
  }
};
return (
  <div className="min-h-screen bg-gray-100 p-8">

    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

      <h1 className="text-4xl font-bold text-green-700 mb-8">
        ⚙ Festival Settings
      </h1>

      <div className="space-y-5">

        <input
          type="text"
          placeholder="Festival Name"
          value={festivalName}
          onChange={(e) => setFestivalName(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        <input
          type="date"
          value={festivalDate}
          onChange={(e) => setFestivalDate(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        <input
          type="text"
          placeholder="Festival Venue"
          value={festivalVenue}
          onChange={(e) => setFestivalVenue(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        <input
          type="text"
          placeholder="Logo URL"
          value={festivalLogo}
          onChange={(e) => setFestivalLogo(e.target.value)}
          className="w-full border rounded-lg p-3"
        />
<input
  type="text"
  placeholder="Festival Banner Image URL"
  value={festivalBanner}
  onChange={(e) => setFestivalBanner(e.target.value)}
  className="w-full border rounded-lg p-3"
/>
{festivalBanner && (
  <img
    src={festivalBanner}
    alt="Festival Banner"
    className="w-full h-56 object-cover rounded-lg border mt-3"
  />
)}

        <button
          onClick={saveSettings}
          className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800"
        >
          💾 Save Settings
        </button>

      </div>

    </div>

  </div>
);
}

export default AdminSettings;