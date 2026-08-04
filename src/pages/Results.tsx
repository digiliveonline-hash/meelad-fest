import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

function Results() {
  const [results, setResults] = useState<any[]>([]);
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const resultSnap = await getDocs(collection(db, "results"));
    const resultData = resultSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const programmeSnap = await getDocs(collection(db, "schedule"));
    const programmeData = programmeSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const candidateSnap = await getDocs(collection(db, "candidates"));
    const candidateData = candidateSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const teamSnap = await getDocs(collection(db, "teams"));
    const teamData = teamSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    teamData.sort(
      (a: any, b: any) => (b.score || 0) - (a.score || 0)
    );

    setResults(resultData);
    setProgrammes(programmeData);
    setCandidates(candidateData);
    setTeams(teamData);

   console.log(candidateData[0]);
    console.log("Results:", resultData);
  };


  return (
        <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-8">
🏆 Grand Results
      </h1>

      {results.map((result: any) => {
        const programme = programmes.find(
          (p: any) => p.id === result.programmeId
        );

        const first = candidates.find(
          (c: any) => String(c.chestNo) === String(result.firstChest)
        );

        const second = candidates.find(
          (c: any) => String(c.chestNo) === String(result.secondChest)
        );

        const third = candidates.find(
          (c: any) => String(c.chestNo) === String(result.thirdChest)
        );

        return (
          <div
            key={result.id}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-blue-700">
              {programme?.programmeName}
            </h2>

            <p className="text-gray-500 mb-5">
              Category: {programme?.category}
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-yellow-100 rounded-lg p-4">
                <h3 className="text-xl font-bold text-yellow-700">
                  🥇 First Prize
                </h3>

                <p><strong>Name:</strong> {first?.candidateName}</p>
                <p><strong>Chest No:</strong> {first?.chestNo}</p>
                <p><strong>Team:</strong> {first?.team}</p>
              </div>

              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="text-xl font-bold">
                  🥈 Second Prize
                </h3>

                <p><strong>Name:</strong> {second?.candidateName}</p>
                <p><strong>Chest No:</strong> {second?.chestNo}</p>
                <p><strong>Team:</strong> {second?.team}</p>
              </div>

              <div className="bg-orange-100 rounded-lg p-4">
                <h3 className="text-xl font-bold text-orange-700">
                  🥉 Third Prize
                </h3>

                <p><strong>Name:</strong> {third?.candidateName}</p>
                <p><strong>Chest No:</strong> {third?.chestNo}</p>
                <p><strong>Team:</strong> {third?.team}</p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Team Leaderboard - ONE TIME ONLY */}

      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl shadow-lg p-6 mb-10 text-center">

  <h2 className="text-3xl font-bold mb-6">
    🏆 OVERALL CHAMPION
  </h2>

  <div className="grid md:grid-cols-3 gap-4">

    <div className="bg-white text-black rounded-lg p-4">
      <h3 className="text-xl font-bold text-yellow-600">
        🥇 Champion
      </h3>

      <p className="text-2xl font-bold">
        {teams[0]?.teamName || "-"}
      </p>

      <p>
        {teams[0]?.score || 0} Points
      </p>
    </div>

    <div className="bg-white text-black rounded-lg p-4">
      <h3 className="text-xl font-bold text-gray-600">
        🥈 Runner Up
      </h3>

      <p className="text-2xl font-bold">
        {teams[1]?.teamName || "-"}
      </p>

      <p>
        {teams[1]?.score || 0} Points
      </p>
    </div>

    <div className="bg-white text-black rounded-lg p-4">
      <h3 className="text-xl font-bold text-orange-600">
        🥉 Third Place
      </h3>

      <p className="text-2xl font-bold">
        {teams[2]?.teamName || "-"}
      </p>

      <p>
        {teams[2]?.score || 0} Points
      </p>
    </div>

  </div>
</div>

      <div className="mt-12">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          🏆 Team Leaderboard
        </h2>

        <div className="space-y-3">
          {teams.map((team: any, index) => (
            <div
              key={team.id}
              className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">
                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : `${index + 1}.`}
                </span>

                <div>
                  <h3 className="text-xl font-bold">
                    {team.teamName}
                  </h3>

                  <p className="text-gray-500">
                    Total Score
                  </p>
                </div>
              </div>

              <div className="text-2xl font-bold text-green-700">
                {team.score || 0} pts
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Results;
