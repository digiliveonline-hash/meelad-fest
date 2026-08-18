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
  // Candidate States
  // =========================

  const [candidateName, setCandidateName] = useState("");
  const [chestNo, setChestNo] = useState("");
  const [category, setCategory] = useState("SJ");
  const [gender, setGender] = useState("");
  const [team, setTeam] = useState("");

  // Multiple programmes
  const [programmes, setProgrammes] = useState<string[]>([]);

  // =========================
  // Data States
  // =========================

  const [programmeList, setProgrammeList] = useState<any[]>([]);
  const [teamList, setTeamList] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);

  // =========================
  // Edit
  // =========================

  const [editId, setEditId] = useState("");

  // =========================
  // Points Settings
  // =========================

  const [firstPoint, setFirstPoint] = useState(10);
  const [secondPoint, setSecondPoint] = useState(7);
  const [thirdPoint, setThirdPoint] = useState(5);
  const [participationPoint, setParticipationPoint] = useState(2);

  // =========================
  // Load Programmes
  // =========================

  const loadProgrammes = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "schedule")
      );

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setProgrammeList(data);
    } catch (error) {
      console.error("Error loading programmes:", error);
    }
  };

  // =========================
  // Load Candidates
  // =========================

  const loadCandidates = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "candidates")
      );

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setCandidates(data);
    } catch (error) {
      console.error("Error loading candidates:", error);
    }
  };

  // =========================
  // Load Teams
  // =========================

  const loadTeams = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "teams")
      );

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setTeamList(data);
    } catch (error) {
      console.error("Error loading teams:", error);
    }
  };

  // =========================
  // Load All Data
  // =========================

  useEffect(() => {
    loadCandidates();
    loadProgrammes();
    loadTeams();
  }, []);

  // =========================
  // Programme Selection
  // =========================

  const toggleProgramme = (programmeName: string) => {
    setProgrammes((previous) => {
      if (previous.includes(programmeName)) {
        return previous.filter(
          (programme) => programme !== programmeName
        );
      }

      return [...previous, programmeName];
    });
  };
  

  // =========================
  // Save / Update Candidate
  // =========================

  const saveCandidate = async () => {
    // Validation
    if (
      candidateName.trim() === "" ||
      chestNo.trim() === "" ||
      gender === "" ||
      team === "" ||
      programmes.length === 0
    ) {
      alert(
        "Please fill all fields and select at least one programme."
      );
      return;
    }

    try {
      if (editId === "") {
        // =========================
        // ADD NEW CANDIDATE
        // =========================

        await addDoc(collection(db, "candidates"), {
          candidateName: candidateName.trim(),
          chestNo: chestNo.trim(),
          category,
          gender,
          team,

          // Multiple programmes
          programmes,

          createdAt: new Date(),
        });

        alert("Candidate added successfully!");
      } else {
        // =========================
        // UPDATE CANDIDATE
        // =========================

        await updateDoc(
          doc(db, "candidates", editId),
          {
            candidateName: candidateName.trim(),
            chestNo: chestNo.trim(),
            category,
            gender,
            team,

            // Multiple programmes
            programmes,
          }
        );

        alert("Candidate updated successfully!");

        setEditId("");
      }

      // Clear form
      clearForm();

      // Reload candidates
      await loadCandidates();
    } catch (error) {
      console.error("Error saving candidate:", error);

      alert(
        "Something went wrong while saving candidate."
      );
    }
  };

  // =========================
  // Clear Form
  // =========================

  const clearForm = () => {
    setCandidateName("");
    setChestNo("");
    setCategory("SJ");
    setGender("");
    setTeam("");
    setProgrammes([]);
    setEditId("");
  };

  // =========================
  // Edit Candidate
  // =========================

  const editCandidate = (item: any) => {
    setCandidateName(item.candidateName || "");
    setChestNo(item.chestNo || "");
    setCategory(item.category || "SJ");
    setGender(item.gender || "");
    setTeam(item.team || "");

    // =========================
    // Support OLD + NEW data
    // =========================

    if (Array.isArray(item.programmes)) {
      // New format
      setProgrammes(item.programmes);
    } else if (item.programme) {
      // Old format
      setProgrammes([item.programme]);
    } else {
      setProgrammes([]);
    }

    setEditId(item.id);

    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // Delete Candidate
  // =========================

  const deleteCandidate = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this candidate?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(
        doc(db, "candidates", id)
      );

      await loadCandidates();

      alert("Candidate deleted successfully!");
    } catch (error) {
      console.error("Error deleting candidate:", error);

      alert(
        "Something went wrong while deleting candidate."
      );
    }
  };

  // =========================
  // Display Programmes
  // =========================

  const getCandidateProgrammes = (item: any) => {
    // New data
    if (Array.isArray(item.programmes)) {
      return item.programmes;
    }

    // Old data
    if (item.programme) {
      return [item.programme];
    }

    return [];
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">

        {/* =========================
            Candidate Form
        ========================= */}

        <div className="bg-white rounded-lg shadow p-6">

          <h1 className="text-3xl font-bold text-green-700 mb-6">
            Candidate Registration
          </h1>

          {/* Candidate Name */}

          <input
            type="text"
            placeholder="Candidate Name"
            value={candidateName}
            onChange={(e) =>
              setCandidateName(e.target.value)
            }
            className="w-full border p-3 rounded mb-3"
          />

          {/* Chest Number */}

          <input
            type="text"
            placeholder="Chest Number"
            value={chestNo}
            onChange={(e) =>
              setChestNo(e.target.value)
            }
            className="w-full border p-3 rounded mb-3"
          />

          {/* Category */}
<select
  value={category}
  onChange={(e) => {
    setCategory(e.target.value);
    setProgrammes([]);
  }}
  className="w-full border p-3 rounded mb-3"
>
  <option value="K">
    Kids
  </option>

  <option value="SJ">
    Sub Junior
  </option>

  <option value="J">
    Junior
  </option>

  <option value="S">
    Senior
  </option>

  <option value="SS">
    Super Senior
  </option>
</select>

          {/* =========================
              Multiple Programmes
          ========================= */}
<div className="border rounded-lg p-4 mb-4">

  <h2 className="text-lg font-bold mb-3">
    Select Programmes
  </h2>

  {programmeList.length === 0 ? (
    <p className="text-gray-500">
      No programmes found.
    </p>
  ) : (
    <div className="grid md:grid-cols-2 gap-3">

      {programmeList
        .filter(
          (item: any) =>
            item.category === category
        )
        .map(
          (item: any) => (
            <label
              key={item.id}
              className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer transition ${
                programmes.includes(
                  item.programmeName
                )
                  ? "bg-green-100 border-green-600"
                  : "bg-white"
              }`}
            >

              <input
                type="checkbox"
                checked={programmes.includes(
                  item.programmeName
                )}
                onChange={() =>
                  toggleProgramme(
                    item.programmeName
                  )
                }
                className="w-5 h-5"
              />

              <span className="font-medium">
                {item.programmeName}
              </span>

            </label>
          )
        )}

    </div>
  )}

</div>

            {/* Selected Programme Count */}

            <div className="mt-4">

              <p className="font-semibold text-green-700">
                Selected Programmes:{" "}
                {programmes.length}
              </p>

              {programmes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">

                  {programmes.map(
                    (programmeName) => (
                      <span
                        key={programmeName}
                        className="bg-green-700 text-white px-3 py-1 rounded-full text-sm"
                      >
                        {programmeName}
                      </span>
                    )
                  )}

                </div>
              )}

            </div>

          {/* Gender */}

          <select
            value={gender}
            onChange={(e) =>
              setGender(e.target.value)
            }
            className="w-full border p-3 rounded mb-3"
          >
            <option value="">
              Select Gender
            </option>

            <option value="Boy">
              Boy
            </option>

            <option value="Girl">
              Girl
            </option>
          </select>

          {/* Team */}

          <select
            value={team}
            onChange={(e) =>
              setTeam(e.target.value)
            }
            className="w-full border p-3 rounded mb-5"
          >
            <option value="">
              Select Team
            </option>

            {teamList.map(
              (item: any) => (
                <option
                  key={item.id}
                  value={item.teamName}
                >
                  {item.teamName}
                </option>
              )
            )}
          </select>

          {/* Buttons */}

          <div className="flex gap-3">

            <button
              onClick={saveCandidate}
              className="bg-green-700 text-white px-6 py-3 rounded font-semibold"
            >
              {editId
                ? "Update Candidate"
                : "Save Candidate"}
            </button>

            {editId && (
              <button
                onClick={clearForm}
                className="bg-gray-500 text-white px-6 py-3 rounded font-semibold"
              >
                Cancel Edit
              </button>
            )}

          </div>

        </div>

        {/* =========================
            Registered Candidates
        ========================= */}

        <div className="bg-white rounded-lg shadow p-6 mt-8">

          <h2 className="text-2xl font-bold mb-5">
            Registered Candidates
          </h2>

          {candidates.length === 0 ? (
            <p>
              No candidates found.
            </p>
          ) : (
            candidates.map(
              (item: any) => {

                const candidateProgrammes =
                  getCandidateProgrammes(item);

                return (
                  <div
                    key={item.id}
                    className="border rounded-lg p-5 mb-4"
                  >

                    {/* Name */}

                    <h3 className="text-xl font-bold text-green-700">
                      {item.candidateName}
                    </h3>

                    <div className="mt-2 space-y-1">

                      <p>
                        <strong>
                          Chest No:
                        </strong>{" "}
                        {item.chestNo}
                      </p>

                      <p>
                        <strong>
                          Category:
                        </strong>{" "}
                        {item.category}
                      </p>

                      {/* Programmes */}

                      <div>
                        <strong>
                          Programmes:
                        </strong>

                        {candidateProgrammes.length ===
                        0 ? (
                          <span className="text-gray-500 ml-2">
                            No programme
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-2 mt-2">

                            {candidateProgrammes.map(
                              (
                                programmeName: string
                              ) => (
                                <span
                                  key={programmeName}
                                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                                >
                                  {programmeName}
                                </span>
                              )
                            )}

                          </div>
                        )}
                      </div>

                      <p>
                        <strong>
                          Gender:
                        </strong>{" "}
                        {item.gender}
                      </p>

                      <p>
                        <strong>
                          Team:
                        </strong>{" "}
                        {item.team}
                      </p>

                    </div>

                    {/* Buttons */}

                    <div className="mt-4">

                      <button
                        onClick={() =>
                          editCandidate(item)
                        }
                        className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteCandidate(item.id)
                        }
                        className="bg-red-600 text-white px-4 py-2 rounded"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                );
              }
            )
          )}

        </div>

        {/* =========================
            Points Settings
        ========================= */}

        <div className="bg-white rounded-lg shadow p-6 mt-8">

          <h2 className="text-2xl font-bold mb-4">
            🏆 Points Settings
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <label className="font-semibold">
                1st Prize
              </label>

              <input
                type="number"
                value={firstPoint}
                onChange={(e) =>
                  setFirstPoint(
                    Number(e.target.value)
                  )
                }
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="font-semibold">
                2nd Prize
              </label>

              <input
                type="number"
                value={secondPoint}
                onChange={(e) =>
                  setSecondPoint(
                    Number(e.target.value)
                  )
                }
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="font-semibold">
                3rd Prize
              </label>

              <input
                type="number"
                value={thirdPoint}
                onChange={(e) =>
                  setThirdPoint(
                    Number(e.target.value)
                  )
                }
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="font-semibold">
                Participation
              </label>

              <input
                type="number"
                value={participationPoint}
                onChange={(e) =>
                  setParticipationPoint(
                    Number(e.target.value)
                  )
                }
                className="w-full border p-2 rounded"
              />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default CandidateRegistration;