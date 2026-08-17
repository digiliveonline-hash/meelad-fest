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

function CandidateRegistration() {
  // =========================
  // States
  // =========================

  const [candidateName, setCandidateName] = useState("");
  const [chestNo, setChestNo] = useState("");
  const [category, setCategory] = useState("SJ");
  const [programme, setProgramme] = useState("");
  const [programmeList, setProgrammeList] = useState<any[]>([]);
  const [teamList, setTeamList] = useState<any[]>([]);
   const [gender, setGender] = useState("");
  const [team, setTeam] = useState("");
  
  const [candidates, setCandidates] = useState<any[]>([]);
  const [editId, setEditId] = useState("");
  const [firstPoint, setFirstPoint] = useState(10);
  const [secondPoint, setSecondPoint] = useState(7);
  const [thirdPoint, setThirdPoint] = useState(5);
  const [participationPoint, setParticipationPoint] = useState(2);
  
  // =========================
  // Load Candidates
  // =========================
const loadProgrammes = async () => {
  const snapshot = await getDocs(collection(db, "schedule"));

  const data = snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));

  setProgrammeList(data);
};
  const loadCandidates = async () => {
    const snapshot = await getDocs(collection(db, "candidates"));

    const data = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    setCandidates(data);
  };
const loadTeams = async () => {
  const snapshot = await getDocs(collection(db, "teams"));

  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  setTeamList(data);
};

useEffect(() => {
  loadCandidates();
  loadProgrammes();
  loadTeams();
}, []);

    // =========================
  // Save Candidate
  // =========================

  const saveCandidate = async () => {
    if (editId === "") {
  await addDoc(collection(db, "candidates"), {
  candidateName,
  chestNo,
  category,
  programme,
  gender,
  team,
  createdAt: new Date(),
});

    } else {
   await updateDoc(doc(db, "candidates", editId), {
  candidateName,
  chestNo,
  category,
  programme,
  gender,
  team,
});

      setEditId("");
    }

    setCandidateName("");
    setChestNo("");
    setCategory("SJ");
    setProgramme("");
    setTeam("");

    loadCandidates();
  };

  // =========================
  // Edit Candidate
  // =========================

  const editCandidate = (item: any) => {
    setCandidateName(item.candidateName);
    setChestNo(item.chestNo);
    setCategory(item.category);
    setProgramme(item.programme);
    setGender(item.gender);
    setTeam(item.team);

    setEditId(item.id);
  };

  // =========================
  // Delete Candidate
  // =========================

  const deleteCandidate = async (id: string) => {
    if (!confirm("Delete this candidate?")) return;

    await deleteDoc(doc(db, "candidates", id));

    loadCandidates();
  };
    return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-lg shadow p-6">

          <h1 className="text-3xl font-bold text-green-700 mb-6">
            Candidate Registration
          </h1>

          <input
            type="text"
            placeholder="Candidate Name"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          />

          <input
            type="text"
            placeholder="Chest Number"
            value={chestNo}
            onChange={(e) => setChestNo(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          >
   <option value="SJ">Sub Junior</option>
<option value="J">Junior</option>
<option value="S">Senior</option>
<option value="SS">Super Senior</option>
          </select>

       <select
  value={programme}
  onChange={(e) => setProgramme(e.target.value)}
  className="w-full border p-2 rounded mb-3"
>
  <option value="">Select Programme</option>

  {programmeList.map((item: any) => (
    <option key={item.id} value={item.programmeName}>
      {item.programmeName}
    </option>
  ))}
</select>
<select
  value={gender}
  onChange={(e) => setGender(e.target.value)}
  className="w-full border p-2 rounded mb-3"
>
  <option value="">Select Gender</option>
  <option value="Boy">Boy</option>
  <option value="Girl">Girl</option>
</select>

<select
  value={team}
  onChange={(e) => setTeam(e.target.value)}
  className="w-full border p-2 rounded mb-5"
>
  <option value="">Select Team</option>

  {teamList.map((item: any) => (
    <option key={item.id} value={item.teamName}>
      {item.teamName}
    </option>
  ))}
</select>
          <button
            onClick={saveCandidate}
            className="bg-green-700 text-white px-6 py-2 rounded"
          >
            {editId ? "Update Candidate" : "Save Candidate"}
          </button>

        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-8">

          <h2 className="text-2xl font-bold mb-5">
            Registered Candidates
          </h2>

          {candidates.length === 0 ? (
            <p>No candidates found.</p>
          ) : (
            candidates.map((item: any) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 mb-4"
              >
                <h3 className="text-lg font-bold text-green-700">
                  {item.candidateName}
                </h3>

                <p><strong>Chest No:</strong> {item.chestNo}</p>
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>Programme:</strong> {item.programme}</p>
                <p><strong>Gender:</strong> {item.gender}</p>
                <p><strong>Team:</strong> {item.team}</p>

                <div className="mt-4">
                  <button
                    onClick={() => editCandidate(item)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteCandidate(item.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>

              </div>
            ))
          )}

        </div>
<hr className="my-8" />

<h2 className="text-2xl font-bold mb-4">
  🏆 Points Settings
</h2>

<div className="grid grid-cols-2 gap-4">

  <div>
    <label className="font-semibold">1st Prize</label>
    <input
      type="number"
      value={firstPoint}
      onChange={(e) => setFirstPoint(Number(e.target.value))}
      className="w-full border p-2 rounded"
    />
  </div>

  <div>
    <label className="font-semibold">2nd Prize</label>
    <input
      type="number"
      value={secondPoint}
      onChange={(e) => setSecondPoint(Number(e.target.value))}
      className="w-full border p-2 rounded"
    />
  </div>

  <div>
    <label className="font-semibold">3rd Prize</label>
    <input
      type="number"
      value={thirdPoint}
      onChange={(e) => setThirdPoint(Number(e.target.value))}
      className="w-full border p-2 rounded"
    />
  </div>

  <div>
    <label className="font-semibold">Participation</label>
    <input
      type="number"
      value={participationPoint}
      onChange={(e) => setParticipationPoint(Number(e.target.value))}
      className="w-full border p-2 rounded"
    />
  </div>

</div>
      </div>
    </div>
  );
}

export default CandidateRegistration;
