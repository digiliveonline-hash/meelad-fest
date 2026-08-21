import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

function Results() {
  const [results, setResults] = useState<any[]>([]);
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ==========================
  // Category Name
  // ==========================

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
  // Load All Data
  // ==========================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // ==========================
      // Results
      // ==========================

      const resultSnap = await getDocs(
        collection(db, "results")
      );

      const resultData = resultSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ==========================
      // Programmes
      // ==========================

      const programmeSnap = await getDocs(
        collection(db, "schedule")
      );

      const programmeData = programmeSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ==========================
      // Candidates
      // ==========================

      const candidateSnap = await getDocs(
        collection(db, "candidates")
      );

      const candidateData = candidateSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ==========================
      // Teams
      // ==========================

      const teamSnap = await getDocs(
        collection(db, "teams")
      );

      const teamData = teamSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ==========================
      // Sort Results
      // ==========================

      resultData.sort((a: any, b: any) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;

        return bTime - aTime;
      });

      // ==========================
      // Sort Teams
      // ==========================

      teamData.sort(
        (a: any, b: any) =>
          (b.score || 0) - (a.score || 0)
      );

      setResults(resultData);
      setProgrammes(programmeData);
      setCandidates(candidateData);
      setTeams(teamData);

    } catch (error) {
      console.error(
        "Error loading results:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Find Candidate
  // ==========================

  const findCandidate = (
    chestNo: string
  ) => {
    return candidates.find(
      (candidate: any) =>
        String(candidate.chestNo) ===
        String(chestNo)
    );
  };

  // ==========================
  // Loading
  // ==========================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">
            🏆
          </div>

          <p className="text-xl font-semibold text-gray-600">
            Loading Results...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">

      {/* ==========================
          PAGE HEADER
      ========================== */}

      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-10">

          <div className="text-5xl mb-3">
            🏆
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-green-700">
            Grand Results
          </h1>

          <p className="text-gray-500 mt-2">
            Meelad Fest Results
          </p>

        </div>

        {/* ==========================
            NO RESULTS
        ========================== */}

        {results.length === 0 ? (

          <div className="bg-white rounded-2xl shadow p-10 text-center">

            <div className="text-5xl mb-4">
              🏆
            </div>

            <h2 className="text-2xl font-bold text-gray-700">
              Results Not Published Yet
            </h2>

            <p className="text-gray-500 mt-2">
              Please check again later.
            </p>

          </div>

        ) : (

          /* ==========================
             RESULT LIST
          ========================== */

          <div className="space-y-8">

            {results.map((result: any) => {

              // ==========================
              // Find Programme
              // ==========================

              const programme =
                programmes.find(
                  (p: any) =>
                    p.id === result.programmeId
                );

              // ==========================
              // OLD RESULT SUPPORT
              // ==========================

              const firstCandidate =
                findCandidate(
                  result.firstChest
                );

              const secondCandidate =
                findCandidate(
                  result.secondChest
                );

              const thirdCandidate =
                findCandidate(
                  result.thirdChest
                );

              // ==========================
              // New Result Data
              // ==========================

              const firstName =
                result.firstName ||
                firstCandidate?.candidateName ||
                "-";

              const firstTeam =
                result.firstTeam ||
                firstCandidate?.team ||
                "-";

              const firstChest =
                result.firstChest ||
                firstCandidate?.chestNo ||
                "-";

              const secondName =
                result.secondName ||
                secondCandidate?.candidateName ||
                "-";

              const secondTeam =
                result.secondTeam ||
                secondCandidate?.team ||
                "-";

              const secondChest =
                result.secondChest ||
                secondCandidate?.chestNo ||
                "-";

              const thirdName =
                result.thirdName ||
                thirdCandidate?.candidateName ||
                "-";

              const thirdTeam =
                result.thirdTeam ||
                thirdCandidate?.team ||
                "-";

              const thirdChest =
                result.thirdChest ||
                thirdCandidate?.chestNo ||
                "-";

              return (

                <div
                  key={result.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >

                  {/* ==========================
                      PROGRAMME HEADER
                  ========================== */}

                  <div className="p-5 md:p-6 border-b">

                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">

                      <div>

                        <h2 className="text-2xl md:text-3xl font-bold text-green-700">
                          {programme?.programmeName ||
                            "Programme"}
                        </h2>

                        <div className="flex flex-wrap gap-2 mt-3">

                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {getCategoryName(
                              programme?.category ||
                              result.category
                            )}
                          </span>

                          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {programme?.programmeType ||
                              result.programmeType ||
                              "Individual"}
                          </span>

                        </div>

                      </div>

                      <div className="text-sm text-gray-500">

                        {programme?.date && (
                          <p>
                            📅 {programme.date}
                          </p>
                        )}

                        {programme?.venue && (
                          <p>
                            📍 {programme.venue}
                          </p>
                        )}

                      </div>

                    </div>

                  </div>


                  {/* ==========================
                      WINNERS
                  ========================== */}

                  <div className="p-5 md:p-6">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                      {/* ==========================
                          FIRST
                      ========================== */}

                      <div className="relative bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-5 text-center">

                        <div className="text-5xl mb-3">
                          🥇
                        </div>

                        <h3 className="text-xl font-bold text-yellow-700 mb-4">
                          First Prize
                        </h3>

                        <p className="text-2xl font-bold text-gray-800">
                          {firstName}
                        </p>

                        <div className="mt-4 space-y-2 text-gray-600">

                          <p>
                            <strong>
                              Chest No:
                            </strong>{" "}
                            {firstChest}
                          </p>

                          <p>
                            <strong>
                              Team:
                            </strong>{" "}
                            {firstTeam}
                          </p>

                        </div>

                        {result.firstPoint && (
                          <div className="mt-4 inline-block bg-yellow-200 text-yellow-800 px-4 py-1 rounded-full font-bold">
                            +{result.firstPoint} Points
                          </div>
                        )}

                      </div>


                      {/* ==========================
                          SECOND
                      ========================== */}

                      <div className="relative bg-gray-50 border-2 border-gray-300 rounded-2xl p-5 text-center">

                        <div className="text-5xl mb-3">
                          🥈
                        </div>

                        <h3 className="text-xl font-bold text-gray-700 mb-4">
                          Second Prize
                        </h3>

                        <p className="text-2xl font-bold text-gray-800">
                          {secondName}
                        </p>

                        <div className="mt-4 space-y-2 text-gray-600">

                          <p>
                            <strong>
                              Chest No:
                            </strong>{" "}
                            {secondChest}
                          </p>

                          <p>
                            <strong>
                              Team:
                            </strong>{" "}
                            {secondTeam}
                          </p>

                        </div>

                        {result.secondPoint && (
                          <div className="mt-4 inline-block bg-gray-200 text-gray-700 px-4 py-1 rounded-full font-bold">
                            +{result.secondPoint} Points
                          </div>
                        )}

                      </div>


                      {/* ==========================
                          THIRD
                      ========================== */}

                      <div className="relative bg-orange-50 border-2 border-orange-300 rounded-2xl p-5 text-center">

                        <div className="text-5xl mb-3">
                          🥉
                        </div>

                        <h3 className="text-xl font-bold text-orange-700 mb-4">
                          Third Prize
                        </h3>

                        <p className="text-2xl font-bold text-gray-800">
                          {thirdName}
                        </p>

                        <div className="mt-4 space-y-2 text-gray-600">

                          <p>
                            <strong>
                              Chest No:
                            </strong>{" "}
                            {thirdChest}
                          </p>

                          <p>
                            <strong>
                              Team:
                            </strong>{" "}
                            {thirdTeam}
                          </p>

                        </div>

                        {result.thirdPoint && (
                          <div className="mt-4 inline-block bg-orange-200 text-orange-800 px-4 py-1 rounded-full font-bold">
                            +{result.thirdPoint} Points
                          </div>
                        )}

                      </div>

                    </div>

                  </div>

                </div>

              );
            })}

          </div>

        )}


        {/* ==================================================
            OVERALL CHAMPION
        ================================================== */}

        {teams.length > 0 && (

          <div className="mt-14">

            <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 rounded-3xl shadow-xl p-6 md:p-10">

              <div className="text-center text-white mb-8">

                <div className="text-5xl mb-3">
                  👑
                </div>

                <h2 className="text-3xl md:text-4xl font-bold">
                  Overall Champion
                </h2>

                <p className="mt-2 opacity-90">
                  Meelad Fest Team Championship
                </p>

              </div>


              {/* ==========================
                  TOP 3
              ========================== */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* Champion */}

                <div className="bg-white rounded-2xl p-6 text-center shadow-lg">

                  <div className="text-5xl mb-3">
                    🥇
                  </div>

                  <p className="text-sm text-gray-500 font-semibold">
                    CHAMPION
                  </p>

                  <h3 className="text-2xl font-bold text-yellow-600 mt-2">
                    {teams[0]?.teamName || "-"}
                  </h3>

                  <p className="text-lg font-semibold text-gray-600 mt-2">
                    {teams[0]?.score || 0} Points
                  </p>

                </div>


                {/* Runner Up */}

                <div className="bg-white rounded-2xl p-6 text-center shadow-lg">

                  <div className="text-5xl mb-3">
                    🥈
                  </div>

                  <p className="text-sm text-gray-500 font-semibold">
                    RUNNER UP
                  </p>

                  <h3 className="text-2xl font-bold text-gray-600 mt-2">
                    {teams[1]?.teamName || "-"}
                  </h3>

                  <p className="text-lg font-semibold text-gray-600 mt-2">
                    {teams[1]?.score || 0} Points
                  </p>

                </div>


                {/* Third */}

                <div className="bg-white rounded-2xl p-6 text-center shadow-lg">

                  <div className="text-5xl mb-3">
                    🥉
                  </div>

                  <p className="text-sm text-gray-500 font-semibold">
                    THIRD PLACE
                  </p>

                  <h3 className="text-2xl font-bold text-orange-600 mt-2">
                    {teams[2]?.teamName || "-"}
                  </h3>

                  <p className="text-lg font-semibold text-gray-600 mt-2">
                    {teams[2]?.score || 0} Points
                  </p>

                </div>

              </div>

            </div>

          </div>

        )}


        {/* ==================================================
            FULL TEAM LEADERBOARD
        ================================================== */}

        {teams.length > 0 && (

          <div className="mt-14 mb-10">

            <div className="text-center mb-7">

              <div className="text-4xl mb-2">
                🏆
              </div>

              <h2 className="text-3xl font-bold text-green-700">
                Team Leaderboard
              </h2>

              <p className="text-gray-500 mt-2">
                Overall Team Points
              </p>

            </div>


            <div className="space-y-3">

              {teams.map(
                (team: any, index: number) => (

                  <div
                    key={team.id}
                    className={`bg-white rounded-xl shadow p-4 md:p-5 flex items-center justify-between ${
                      index === 0
                        ? "border-2 border-yellow-400"
                        : index === 1
                        ? "border-2 border-gray-300"
                        : index === 2
                        ? "border-2 border-orange-300"
                        : ""
                    }`}
                  >

                    <div className="flex items-center gap-4">

                      <div className="text-3xl w-10 text-center">

                        {index === 0
                          ? "🥇"
                          : index === 1
                          ? "🥈"
                          : index === 2
                          ? "🥉"
                          : `${index + 1}`}

                      </div>

                      <div>

                        <h3 className="text-lg md:text-xl font-bold text-gray-800">
                          {team.teamName}
                        </h3>

                        {team.teamCode && (
                          <p className="text-sm text-gray-500">
                            Team Code:{" "}
                            {team.teamCode}
                          </p>
                        )}

                      </div>

                    </div>

                    <div className="text-right">

                      <p className="text-2xl font-bold text-green-700">
                        {team.score || 0}
                      </p>

                      <p className="text-sm text-gray-500">
                        Points
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default Results;