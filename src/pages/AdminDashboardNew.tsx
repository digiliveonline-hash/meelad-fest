import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

function AdminDashboardNew() {
    const getCategoryName = (category: string) => {
    switch (category) {
      case "K":
        return "Kids";

      case "SJ":
        return "Sub Junior";

      case "J":
        return "Junior";

      case "S":
        return "Senior";

      case "SS":
        return "Super Senior";

      default:
        return category || "-";
    }
  };

  // ==========================
  // Announcement States
  // ==========================

  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);

  const [announcementTitle, setAnnouncementTitle] = useState("");

  const [announcementMessage, setAnnouncementMessage] = useState("");

  const [announcements, setAnnouncements] = useState<any[]>([]);

  const [announcementEditId, setAnnouncementEditId] = useState("");

  // ==========================
  // Programme States
  // ==========================

  const [showProgrammeForm, setShowProgrammeForm] = useState(false);

  const [programmeName, setProgrammeName] = useState("");

  const [programmeType, setProgrammeType] = useState("Individual");

  const [programmeCategory, setProgrammeCategory] = useState("SJ");

  const [programmeStage, setProgrammeStage] = useState("On Stage");

  const [programmeVenue, setProgrammeVenue] = useState("");

  const [programmeDate, setProgrammeDate] = useState("");

  const [programmeTime, setProgrammeTime] = useState("");

  const [programmeDuration, setProgrammeDuration] = useState("");

  const [programmes, setProgrammes] = useState<any[]>([]);

  const [programmeEditId, setProgrammeEditId] = useState("");

  // ==========================
  // Team States
  // ==========================

  const [showTeamForm, setShowTeamForm] = useState(false);

  const [teamName, setTeamName] = useState("");

  const [teamCode, setTeamCode] = useState("");

  const [teams, setTeams] = useState<any[]>([]);

  const [teamEditId, setTeamEditId] = useState("");

  // ==========================
  // Candidate States
  // ==========================

  const [showCandidateForm, setShowCandidateForm] = useState(false);

  const [candidateName, setCandidateName] = useState("");

  const [chestNo, setChestNo] = useState("");

  const [gender, setGender] = useState("Boy");

  const [candidateCategory, setCandidateCategory] = useState("SJ");

  const [selectedTeam, setSelectedTeam] = useState("");

  const [selectedProgramme, setSelectedProgramme] = useState("");

  const [candidates, setCandidates] = useState<any[]>([]);

  const [candidateEditId, setCandidateEditId] = useState("");

    // ==========================
  // Result States
  // ==========================

const [resultCategory, setResultCategory] = useState("");  

  const [resultProgramme, setResultProgramme] = useState("");

  const [firstChest, setFirstChest] = useState("");

  const [secondChest, setSecondChest] = useState("");

  const [thirdChest, setThirdChest] = useState("");

  const [publishedResults, setPublishedResults] = useState<any[]>([]);

  const [editResultId, setEditResultId] = useState("");

  const [editFirstChest, setEditFirstChest] = useState("");

  const [editSecondChest, setEditSecondChest] = useState("");

  const [editThirdChest, setEditThirdChest] = useState("");

  

  // ==========================
  // Load Functions
  // ==========================

  const loadAnnouncements = async () => {
    const snapshot = await getDocs(collection(db, "announcements"));

    setAnnouncements(
      snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }))
    );
  };

  const loadProgrammes = async () => {
    const snapshot = await getDocs(collection(db, "schedule"));

    setProgrammes(
      snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }))
    );
  };

  const loadTeams = async () => {
    const snapshot = await getDocs(collection(db, "teams"));

    setTeams(
      snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }))
    );
  };

  const loadCandidates = async () => {
    const snapshot = await getDocs(collection(db, "candidates"));

    setCandidates(
      snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }))
    );
  };

  const loadResults = async () => {
    const snapshot = await getDocs(collection(db, "results"));

    setPublishedResults(
      snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }))
    );
  };

  useEffect(() => {
    loadAnnouncements();
    loadProgrammes();
    loadTeams();
    loadCandidates();
    loadResults();
  }, []);
    // ==========================
  // Announcement CRUD
  // ==========================

  const saveAnnouncement = async () => {
    if (
      announcementTitle.trim() === "" ||
      announcementMessage.trim() === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    if (announcementEditId === "") {
      await addDoc(collection(db, "announcements"), {
        title: announcementTitle,
        message: announcementMessage,
        createdAt: new Date(),
      });
    } else {
      await updateDoc(
        doc(db, "announcements", announcementEditId),
        {
          title: announcementTitle,
          message: announcementMessage,
        }
      );

      setAnnouncementEditId("");
    }

    setAnnouncementTitle("");
    setAnnouncementMessage("");
    setShowAnnouncementForm(false);

    loadAnnouncements();
  };

  const editAnnouncement = (item: any) => {
    setAnnouncementTitle(item.title);
    setAnnouncementMessage(item.message);

    setAnnouncementEditId(item.id);

    setShowAnnouncementForm(true);
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;

    await deleteDoc(doc(db, "announcements", id));

    loadAnnouncements();
  };
    // ==========================
  // Programme CRUD
  // ==========================
const saveProgramme = async () => {
  if (programmeName.trim() === "") {
    alert("Please enter programme name");
    return;
  }

  try {
    if (programmeEditId === "") {
      // =========================
      // ADD NEW PROGRAMME
      // =========================
      await addDoc(collection(db, "schedule"), {
        programmeName: programmeName.trim(),

        // Individual / Group
        programmeType,

        // Kids / SJ / J / S / SS
        category: programmeCategory,

        stage: programmeStage,
        venue: programmeVenue,
        date: programmeDate,
        time: programmeTime,
        duration: programmeDuration,

        createdAt: new Date(),
      });
    } else {
      // =========================
      // UPDATE PROGRAMME
      // =========================
      await updateDoc(
        doc(db, "schedule", programmeEditId),
        {
          programmeName: programmeName.trim(),

          // Individual / Group
          programmeType,

          // Kids / SJ / J / S / SS
          category: programmeCategory,

          stage: programmeStage,
          venue: programmeVenue,
          date: programmeDate,
          time: programmeTime,
          duration: programmeDuration,
        }
      );

      setProgrammeEditId("");
    }

    // =========================
    // CLEAR FORM
    // =========================

    setProgrammeName("");
    setProgrammeType("Individual");
    setProgrammeCategory("SJ");
    setProgrammeStage("On Stage");
    setProgrammeVenue("");
    setProgrammeDate("");
    setProgrammeTime("");
    setProgrammeDuration("");

    setShowProgrammeForm(false);

    await loadProgrammes();

    alert("Programme saved successfully!");
  } catch (error) {
    console.error("Error saving programme:", error);

    alert("Something went wrong while saving programme.");
  }
};

    // ==========================
  // Team CRUD
  // ==========================

  const saveTeam = async () => {
    if (teamName.trim() === "") {
      alert("Please enter team name");
      return;
    }

    if (teamEditId === "") {
      await addDoc(collection(db, "teams"), {
        teamName,
        teamCode,
        score: 0,
        createdAt: new Date(),
      });
    } else {
      await updateDoc(doc(db, "teams", teamEditId), {
        teamName,
        teamCode,
      });

      setTeamEditId("");
    }

    setTeamName("");
    setTeamCode("");

    setShowTeamForm(false);

    loadTeams();
  };

  const editTeam = (item: any) => {
    setTeamName(item.teamName);
    setTeamCode(item.teamCode || "");

    setTeamEditId(item.id);

    setShowTeamForm(true);
  };

  const deleteTeam = async (id: string) => {
    if (!confirm("Delete this team?")) return;

    await deleteDoc(doc(db, "teams", id));

    loadTeams();
  };
    // ==========================
  // Candidate CRUD
  // ==========================

  const saveCandidate = async () => {
    if (
      candidateName.trim() === "" ||
      chestNo.trim() === "" ||
      selectedTeam === "" ||
      selectedProgramme === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    if (candidateEditId === "") {
      await addDoc(collection(db, "candidates"), {
        candidateName,
        chestNo,
        gender,
        category: candidateCategory,
        team: selectedTeam,
        programme: selectedProgramme,
        createdAt: new Date(),
      });
    } else {
      await updateDoc(doc(db, "candidates", candidateEditId), {
        candidateName,
        chestNo,
        gender,
        category: candidateCategory,
        team: selectedTeam,
        programme: selectedProgramme,
      });

      setCandidateEditId("");
    }

    setCandidateName("");
    setChestNo("");
    setGender("Boy");
    setCandidateCategory("SJ");
    setSelectedTeam("");
    setSelectedProgramme("");

    setShowCandidateForm(false);

    loadCandidates();
  };

  const editCandidate = (item: any) => {
    setCandidateName(item.candidateName);
    setChestNo(item.chestNo);
    setGender(item.gender || "Boy");
    setCandidateCategory(item.category || "SJ");
    setSelectedTeam(item.team);
    setSelectedProgramme(item.programme);

    setCandidateEditId(item.id);

    setShowCandidateForm(true);
  };

  const deleteCandidate = async (id: string) => {
    if (!confirm("Delete this candidate?")) return;

    await deleteDoc(doc(db, "candidates", id));

    loadCandidates();
  };

  // ==========================
// Edit Programme
// ==========================

const editProgramme = (item: any) => {
  setProgrammeName(item.programmeName || "");

  setProgrammeType(
    item.programmeType || "Individual"
  );

  setProgrammeCategory(
    item.category || "SJ"
  );

  setProgrammeStage(
    item.stage || "On Stage"
  );

  setProgrammeVenue(
    item.venue || ""
  );

  setProgrammeDate(
    item.date || ""
  );

  setProgrammeTime(
    item.time || ""
  );

  setProgrammeDuration(
    item.duration || ""
  );

  setProgrammeEditId(item.id);

  setShowProgrammeForm(true);
};


// ==========================
// Delete Programme
// ==========================

const deleteProgramme = async (id: string) => {
  if (!confirm("Delete this programme?")) return;

  try {
    await deleteDoc(
      doc(db, "schedule", id)
    );

    await loadProgrammes();

    alert("Programme deleted successfully!");
  } catch (error) {
    console.error(
      "Error deleting programme:",
      error
    );

    alert(
      "Something went wrong while deleting programme."
    );
  }
};


    // ==========================
  // Publish Result
  // ==========================
// ==========================
// Recalculate Team Scores
// ==========================
const recalculateTeamScores = async () => {
  try {
    // Get all teams
    const teamSnap = await getDocs(
      collection(db, "teams")
    );

    const teamData = teamSnap.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    // Get all published results
    const resultSnap = await getDocs(
      collection(db, "results")
    );

    const resultData = resultSnap.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    // ==========================
    // Calculate scores
    // ==========================

    const teamScores: {
      [key: string]: number;
    } = {};

    resultData.forEach((result: any) => {
      const firstTeam =
        String(result.firstTeam || "").trim();

      const secondTeam =
        String(result.secondTeam || "").trim();

      const thirdTeam =
        String(result.thirdTeam || "").trim();

      const firstPoint =
        Number(result.firstPoint) || 0;

      const secondPoint =
        Number(result.secondPoint) || 0;

      const thirdPoint =
        Number(result.thirdPoint) || 0;

      // 1st
      if (firstTeam) {
        teamScores[firstTeam] =
          (teamScores[firstTeam] || 0) +
          firstPoint;
      }

      // 2nd
      if (secondTeam) {
        teamScores[secondTeam] =
          (teamScores[secondTeam] || 0) +
          secondPoint;
      }

      // 3rd
      if (thirdTeam) {
        teamScores[thirdTeam] =
          (teamScores[thirdTeam] || 0) +
          thirdPoint;
      }
    });

    // ==========================
    // Update teams
    // ==========================
for (const team of teamData as any[]) {
  const teamName =
    String(team.teamName || "").trim();

  const totalScore =
    teamScores[teamName] || 0;

  await updateDoc(
    doc(db, "teams", team.id),
    {
      score: totalScore,
    }
  );
}
    console.log(
      "Team scores recalculated successfully"
    );

  } catch (error) {
    console.error(
      "Error recalculating team scores:",
      error
    );
  }
};

const publishResult = async () => {
  if (
    !resultProgramme ||
    !firstChest ||
    !secondChest ||
    !thirdChest
  ) {
    alert("Please fill all fields");
    return;
  }

  try {
    // ==========================
    // Find selected programme
    // ==========================

    const programme = programmes.find(
      (item: any) => item.id === resultProgramme
    );

    if (!programme) {
      alert("Programme not found");
      return;
    }

    // ==========================
    // Find candidates by Chest No
    // ==========================

    const first = candidates.find(
      (c: any) =>
        String(c.chestNo) === String(firstChest)
    );

    const second = candidates.find(
      (c: any) =>
        String(c.chestNo) === String(secondChest)
    );

    const third = candidates.find(
      (c: any) =>
        String(c.chestNo) === String(thirdChest)
    );

    // ==========================
    // Check candidates exist
    // ==========================

    if (!first || !second || !third) {
      alert(
        "One or more chest numbers are not found."
      );
      return;
    }

    // ==========================
    // Check category
    // ==========================

    if (
      first.category !== programme.category ||
      second.category !== programme.category ||
      third.category !== programme.category
    ) {
      alert(
        "One or more chest numbers do not belong to the selected category."
      );
      return;
    }

    // ==========================
    // Check duplicate result
    // ==========================

    const alreadyPublished = publishedResults.find(
      (item: any) =>
        item.programmeId === resultProgramme
    );

    if (alreadyPublished) {
      alert("Result already published!");
      return;
    }

    // ==========================
    // Points
    // ==========================

    let firstPoint = 5;
    let secondPoint = 3;
    let thirdPoint = 1;

    if (programme.programmeType === "Group") {
      firstPoint = 10;
      secondPoint = 5;
      thirdPoint = 3;
    }

  

    // ==========================
    // Save Result
    // ==========================

    await addDoc(
      collection(db, "results"),
      {
        programmeId: resultProgramme,

        category: programme.category,

        firstChest,
        secondChest,
        thirdChest,

        firstName: first.candidateName,
        secondName: second.candidateName,
        thirdName: third.candidateName,

        firstTeam: first.team,
        secondTeam: second.team,
        thirdTeam: third.team,

        programmeType:
          programme.programmeType ||
          "Individual",

        firstPoint,
        secondPoint,
        thirdPoint,

        createdAt: new Date(),
      }
    );

    await recalculateTeamScores();

    // ==========================
    // Clear form
    // ==========================

    setResultProgramme("");
    setFirstChest("");
    setSecondChest("");
    setThirdChest("");

    // ==========================
    // Reload data
    // ==========================

    await loadResults();
    await loadTeams();

    alert(
      "Result Published Successfully!"
    );

  } catch (error) {
    console.error(
      "Error publishing result:",
      error
    );

    alert(
      "Something went wrong while publishing result."
    );
  }
};



   // ==========================
// Result Edit / Delete
// ==========================

const editResult = (item: any) => {
  setEditResultId(item.id);

  setResultProgramme(item.programmeId || "");

  setEditFirstChest(item.firstChest || "");
  setEditSecondChest(item.secondChest || "");
  setEditThirdChest(item.thirdChest || "");
};

const updateResult = async () => {
  if (!editResultId) {
    alert("Please select a result");
    return;
  }

  if (
    !editFirstChest ||
    !editSecondChest ||
    !editThirdChest
  ) {
    alert("Please fill all fields");
    return;
  }

  try {
    await updateDoc(
      doc(db, "results", editResultId),
      {
        firstChest: editFirstChest,
        secondChest: editSecondChest,
        thirdChest: editThirdChest,
      }
    );

    setEditResultId("");
    setEditFirstChest("");
    setEditSecondChest("");
    setEditThirdChest("");
    setResultProgramme("");

    await loadResults();

    alert("Result Updated Successfully!");
  } catch (error) {
    console.error("Error updating result:", error);
    alert("Something went wrong while updating result.");
  }
};

const deleteResult = async (id: string) => {
  if (!confirm("Delete this result?")) return;

  try {
    await deleteDoc(
      doc(db, "results", id)
    );

    await loadResults();

    alert("Result Deleted Successfully!");
  } catch (error) {
    console.error("Error deleting result:", error);
    alert("Something went wrong while deleting result.");
  }
};

  // ==========================
  // Start JSX
  // ==========================

  return (
    
        <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold text-center text-green-700 mb-8">
          🕌 Meelad Fest Admin Dashboard
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6">

          {/* ==========================
              Announcement Section
          ========================== */}
<div className="flex justify-between items-center mb-6">

  <h2 className="text-2xl font-bold">
    📢 Announcements
  </h2>

  <div className="flex gap-3">

    <Link
      to="/admin-settings"
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      ⚙ Settings
    </Link>

    <button
      onClick={() => {
        setShowAnnouncementForm(true);
        setAnnouncementEditId("");
        setAnnouncementTitle("");
        setAnnouncementMessage("");
      }}
      className="bg-green-700 text-white px-4 py-2 rounded"
    >
      Add Notice
    </button>

  </div>

</div>

          {showAnnouncementForm && (

            <div className="mb-6">

              <input
                type="text"
                placeholder="Notice Title"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                className="w-full border p-2 rounded mb-3"
              />

              <textarea
                placeholder="Notice Message"
                value={announcementMessage}
                onChange={(e) =>
                  setAnnouncementMessage(e.target.value)
                }
                rows={4}
                className="w-full border p-2 rounded mb-3"
              />

              <button
                onClick={saveAnnouncement}
                className="bg-blue-600 text-white px-5 py-2 rounded"
              >
                {announcementEditId
                  ? "Update Notice"
                  : "Save Notice"}
              </button>

            </div>

          )}

          {announcements.map((item: any) => (

            <div
              key={item.id}
              className="border rounded-lg p-4 mb-4"
            >

              <h3 className="text-lg font-bold text-green-700">
                {item.title}
              </h3>

              <p className="my-3">
                {item.message}
              </p>

              <button
                onClick={() => editAnnouncement(item)}
                className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
              >
                Edit
              </button>

              <button
                onClick={() => deleteAnnouncement(item.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>

            </div>

          ))}

          <hr className="my-8" />

      {/* ==========================
              Programme Management
          ========================== */}

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl font-bold">
              📅 Programme Management
            </h2>

            <button
              onClick={() => {
                setShowProgrammeForm(true);

                setProgrammeEditId("");

                setProgrammeName("");

                setProgrammeCategory("SJ");

                setProgrammeStage("On Stage");

                setProgrammeVenue("");

                setProgrammeDate("");

                setProgrammeTime("");

                setProgrammeDuration("");
              }}
              className="bg-green-700 text-white px-4 py-2 rounded"
            >
              Add Programme
            </button>

          </div>

          {showProgrammeForm && (

            <div className="mb-6 space-y-3">

              <input
                type="text"
                placeholder="Programme Name"
                value={programmeName}
                onChange={(e) =>
                  setProgrammeName(e.target.value)
                }
                className="w-full border p-2 rounded"
              />
              <select
  value={programmeType}
  onChange={(e) => setProgrammeType(e.target.value)}
  className="w-full border p-2 rounded mb-3"
>
  <option value="Individual">Individual</option>
  <option value="Group">Group</option>
</select>

   <select
  value={programmeCategory}
  onChange={(e) => setProgrammeCategory(e.target.value)}
  className="w-full border p-2 rounded"
>
  <option value="K">Kids</option>
  <option value="SJ">Sub Junior</option>
  <option value="J">Junior</option>
  <option value="S">Senior</option>
  <option value="SS">Super Senior</option>
</select>

              <input
                type="text"
                placeholder="Stage"
                value={programmeStage}
                onChange={(e) =>
                  setProgrammeStage(e.target.value)
                }
                className="w-full border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Venue"
                value={programmeVenue}
                onChange={(e) =>
                  setProgrammeVenue(e.target.value)
                }
                className="w-full border p-2 rounded"
              />

              <input
                type="date"
                value={programmeDate}
                onChange={(e) =>
                  setProgrammeDate(e.target.value)
                }
                className="w-full border p-2 rounded"
              />

              <input
                type="time"
                value={programmeTime}
                onChange={(e) =>
                  setProgrammeTime(e.target.value)
                }
                className="w-full border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Duration"
                value={programmeDuration}
                onChange={(e) =>
                  setProgrammeDuration(e.target.value)
                }
                className="w-full border p-2 rounded"
              />

              <button
                onClick={saveProgramme}
                className="bg-blue-600 text-white px-5 py-2 rounded"
              >
                {programmeEditId
                  ? "Update Programme"
                  : "Save Programme"}
              </button>

            </div>

          )}

          {programmes.map((item: any) => (

            <div
              key={item.id}
              className="border rounded-lg p-4 mb-4"
            >

              <h3 className="text-lg font-bold text-green-700">
                {item.programmeName}
              </h3>

              <p>Category : {item.category}</p>
              <p>Stage : {item.stage}</p>
              <p>Venue : {item.venue}</p>
              <p>Date : {item.date}</p>
              <p>Time : {item.time}</p>
              <p>Duration : {item.duration}</p>

              <div className="mt-3">

                <button
                  onClick={() => editProgramme(item)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteProgramme(item.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

          <hr className="my-8" />
                    {/* ==========================
              Team Management
          ========================== */}

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl font-bold">
              🏆 Team Management
            </h2>

            <button
              onClick={() => {
                setShowTeamForm(true);
                setTeamEditId("");
                setTeamName("");
                setTeamCode("");
              }}
              className="bg-green-700 text-white px-4 py-2 rounded"
            >
              Add Team
            </button>

          </div>

          {showTeamForm && (

            <div className="mb-6 space-y-3">

              <input
                type="text"
                placeholder="Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Team Code"
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value)}
                className="w-full border p-2 rounded"
              />

              <button
                onClick={saveTeam}
                className="bg-blue-600 text-white px-5 py-2 rounded"
              >
                {teamEditId
                  ? "Update Team"
                  : "Save Team"}
              </button>

            </div>

          )}

          {teams.map((team: any) => (

            <div
              key={team.id}
              className="border rounded-lg p-4 mb-4 flex justify-between items-center"
            >

              <div>

                <h3 className="text-lg font-bold text-green-700">
                  {team.teamName}
                </h3>

                <p>Code : {team.teamCode}</p>

                <p>
                  Score : <strong>{team.score || 0}</strong>
                </p>

              </div>

              <div>

                <button
                  onClick={() => editTeam(team)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTeam(team.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

          <hr className="my-8" />
                    {/* ==========================
              Candidate Registration
          ========================== */}

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl font-bold">
              👤 Candidate Registration
            </h2>

            <button
              onClick={() => {
                setShowCandidateForm(true);

                setCandidateEditId("");

                setCandidateName("");

                setChestNo("");

                setGender("Boy");

                setCandidateCategory("SJ");

                setSelectedTeam("");

                setSelectedProgramme("");
              }}
              className="bg-green-700 text-white px-4 py-2 rounded"
            >
              Add Candidate
            </button>

          </div>

          {showCandidateForm && (

            <div className="space-y-3 mb-6">

              <input
                type="text"
                placeholder="Candidate Name"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Chest Number"
                value={chestNo}
                onChange={(e) => setChestNo(e.target.value)}
                className="w-full border p-2 rounded"
              />

              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="Boy">Boy</option>
                <option value="Girl">Girl</option>
              </select>

    <select
  value={programmeCategory}
  onChange={(e) => setProgrammeCategory(e.target.value)}
  className="w-full border p-2 rounded"
>
  <option value="K">Kids</option>
  <option value="SJ">Sub Junior</option>
  <option value="J">Junior</option>
  <option value="S">Senior</option>
  <option value="SS">Super Senior</option>
</select>

              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Team</option>

                {teams.map((team: any) => (
                  <option
                    key={team.id}
                    value={team.teamName}
                  >
                    {team.teamName}
                  </option>
                ))}
              </select>

              <select
                value={selectedProgramme}
                onChange={(e) => setSelectedProgramme(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Programme</option>

                {programmes
                  .filter(
                    (p: any) =>
                      p.category === candidateCategory
                  )
                  .map((programme: any) => (
                    <option
                      key={programme.id}
                      value={programme.programmeName}
                    >
                      {programme.programmeName}
                    </option>
                  ))}
              </select>

              <button
                onClick={saveCandidate}
                className="bg-blue-600 text-white px-5 py-2 rounded"
              >
                {candidateEditId
                  ? "Update Candidate"
                  : "Save Candidate"}
              </button>

            </div>

          )}

          <hr className="my-8" />

                    {/* ==========================
              Candidate List
          ========================== */}

          <h2 className="text-2xl font-bold mb-5">
            📋 Candidate List
          </h2>

          {candidates.length === 0 ? (

            <p>No candidates found.</p>

          ) : (

            candidates.map((candidate: any) => (

              <div
                key={candidate.id}
                className="border rounded-lg p-4 mb-4"
              >

                <h3 className="text-lg font-bold text-green-700">
                  {candidate.candidateName}
                </h3>

                <p>
                  <strong>Chest No :</strong> {candidate.chestNo}
                </p>

                <p>
                  <strong>Gender :</strong> {candidate.gender}
                </p>

                <p>
                  <strong>Category :</strong> {candidate.category}
                </p>

                <p>
                  <strong>Team :</strong> {candidate.team}
                </p>

                <p>
                  <strong>Programme :</strong> {candidate.programme}
                </p>

                <div className="mt-3">

                  <button
                    onClick={() => editCandidate(candidate)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteCandidate(candidate.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))

          )}

          <hr className="my-8" />
                   {/* ==========================
    Result Management
========================== */}

<h2 className="text-2xl font-bold mb-5">
  🏆 Result Management
</h2>

<div className="border rounded-lg p-4 mb-8">

  <select
    value={resultProgramme}
    onChange={(e) => setResultProgramme(e.target.value)}
    className="w-full border p-2 rounded mb-3"
  >
    <option value="">Select Programme</option>
{programmes.map((programme: any) => (
  <option
    key={programme.id}
    value={programme.id}
  >
    {programme.programmeName} — {
      programme.category === "K"
        ? "Kids"
        : programme.category === "SJ"
        ? "Sub Junior"
        : programme.category === "J"
        ? "Junior"
        : programme.category === "S"
        ? "Senior"
        : programme.category === "SS"
        ? "Super Senior"
        : "Category Not Set"
    }
  </option>
))}

  </select>

  <input
    type="text"
    placeholder="🥇 First Prize Chest No"
    value={firstChest}
    onChange={(e) => setFirstChest(e.target.value)}
    className="w-full border p-2 rounded mb-3"
  />

  <input
    type="text"
    placeholder="🥈 Second Prize Chest No"
    value={secondChest}
    onChange={(e) => setSecondChest(e.target.value)}
    className="w-full border p-2 rounded mb-3"
  />

  <input
    type="text"
    placeholder="🥉 Third Prize Chest No"
    value={thirdChest}
    onChange={(e) => setThirdChest(e.target.value)}
    className="w-full border p-2 rounded mb-4"
  />

  <button
    onClick={publishResult}
    className="bg-green-700 text-white px-6 py-2 rounded"
  >
    Publish Result
  </button>

</div>

<h2 className="text-xl font-bold mb-4">
  Published Results
</h2>

{publishedResults.map((item: any) => {

  const programme = programmes.find(
    (p: any) => p.id === item.programmeId
  );

  return (
    <div
      key={item.id}
      className="border rounded-lg p-4 mb-4"
    >

      <p>
        <strong>Programme :</strong>{" "}
        {programme?.programmeName || "Programme"}
      </p>

      <p>
        <strong>Category :</strong>{" "}
        {getCategoryName(programme?.category)}
      </p>

      {editResultId === item.id ? (

        <>

          <input
            value={editFirstChest}
            onChange={(e) =>
              setEditFirstChest(e.target.value)
            }
            className="w-full border p-2 rounded mb-2"
            placeholder="First Prize Chest No"
          />

          <input
            value={editSecondChest}
            onChange={(e) =>
              setEditSecondChest(e.target.value)
            }
            className="w-full border p-2 rounded mb-2"
            placeholder="Second Prize Chest No"
          />

          <input
            value={editThirdChest}
            onChange={(e) =>
              setEditThirdChest(e.target.value)
            }
            className="w-full border p-2 rounded mb-3"
            placeholder="Third Prize Chest No"
          />

          <button
            onClick={updateResult}
            className="bg-blue-600 text-white px-3 py-1 rounded mr-2"
          >
            Update
          </button>

        </>

      ) : (

        <>

          <p>🥇 {item.firstChest}</p>
          <p>🥈 {item.secondChest}</p>
          <p>🥉 {item.thirdChest}</p>

          <button
            onClick={() => editResult(item)}
            className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
          >
            Edit
          </button>

        </>

      )}

      <button
        onClick={() => deleteResult(item.id)}
        className="bg-red-600 text-white px-3 py-1 rounded"
      >
        Delete
      </button>

    </div>
  );
})}

        </div>

      </div>

    </div>
  );
}

export default AdminDashboardNew;