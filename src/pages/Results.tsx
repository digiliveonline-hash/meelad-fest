import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

type DataItem = Record<string, any>;

function Results() {
  const [results, setResults] = useState<DataItem[]>([]);
  const [programmes, setProgrammes] = useState<DataItem[]>([]);
  const [candidates, setCandidates] = useState<DataItem[]>([]);
  const [teams, setTeams] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // CATEGORY NAME
  // =====================================================

  const getCategoryName = (category: any) => {
    const value = String(category || "").trim().toUpperCase();

    switch (value) {
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

  // =====================================================
  // PROGRAMME TYPE
  // =====================================================

  const getProgrammeType = (
    programme: DataItem | undefined,
    result: DataItem
  ) => {
    const type =
      programme?.programmeType ||
      result?.programmeType ||
      "Individual";

    const normalized = String(type)
      .trim()
      .toLowerCase();

    if (normalized === "group") {
      return "Group";
    }

    return "Individual";
  };

  // =====================================================
  // POINT SYSTEM
  //
  // INDIVIDUAL
  // 1st = 5
  // 2nd = 3
  // 3rd = 1
  //
  // GROUP
  // 1st = 10
  // 2nd = 5
  // 3rd = 3
  // =====================================================

  const getPoints = (
    programmeType: string,
    position: number
  ) => {
    if (programmeType === "Group") {
      if (position === 1) return 10;
      if (position === 2) return 5;
      if (position === 3) return 3;
    }

    if (position === 1) return 5;
    if (position === 2) return 3;
    if (position === 3) return 1;

    return 0;
  };

  // =====================================================
  // LOAD ALL DATA
  // =====================================================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      // =================================================
      // RESULTS
      // =================================================

      const resultsSnapshot = await getDocs(
        collection(db, "results")
      );

      const resultData: DataItem[] =
        resultsSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

      // =================================================
      // SCHEDULE / PROGRAMMES
      // =================================================

      const scheduleSnapshot = await getDocs(
        collection(db, "schedule")
      );

      const programmeData: DataItem[] =
        scheduleSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

      // =================================================
      // CANDIDATES
      // =================================================

      const candidatesSnapshot = await getDocs(
        collection(db, "candidates")
      );

      const candidateData: DataItem[] =
        candidatesSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

      // =================================================
      // TEAMS
      // =================================================

      const teamsSnapshot = await getDocs(
        collection(db, "teams")
      );

      const teamData: DataItem[] =
        teamsSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

      // =================================================
      // SORT RESULTS
      // =================================================

      resultData.sort((a, b) => {
        const aSeconds =
          a?.createdAt?.seconds || 0;

        const bSeconds =
          b?.createdAt?.seconds || 0;

        return bSeconds - aSeconds;
      });

      // =================================================
      // TEAM SCORE CALCULATION
      // =================================================

      const scores: Record<string, number> = {};

      resultData.forEach((result) => {
        // -------------------------------------------------
        // FIND PROGRAMME
        // -------------------------------------------------

        const programme = programmeData.find(
          (item) =>
            String(item.id) ===
            String(result?.programmeId)
        );

        // -------------------------------------------------
        // PROGRAMME TYPE
        // -------------------------------------------------

        const programmeType =
          getProgrammeType(
            programme,
            result
          );

        // =================================================
        // FIRST PLACE
        // =================================================

        const firstCandidate =
          candidateData.find(
            (candidate) =>
              String(candidate?.chestNo) ===
              String(result?.firstChest)
          );

        const firstTeam = String(
          result?.firstTeam ||
            firstCandidate?.team ||
            ""
        ).trim();

        if (
          firstTeam &&
          firstTeam !== "-"
        ) {
          const points = getPoints(
            programmeType,
            1
          );

          scores[firstTeam] =
            (scores[firstTeam] || 0) +
            points;
        }

        // =================================================
        // SECOND PLACE
        // =================================================

        const secondCandidate =
          candidateData.find(
            (candidate) =>
              String(candidate?.chestNo) ===
              String(result?.secondChest)
          );

        const secondTeam = String(
          result?.secondTeam ||
            secondCandidate?.team ||
            ""
        ).trim();

        if (
          secondTeam &&
          secondTeam !== "-"
        ) {
          const points = getPoints(
            programmeType,
            2
          );

          scores[secondTeam] =
            (scores[secondTeam] || 0) +
            points;
        }

        // =================================================
        // THIRD PLACE
        // =================================================

        const thirdCandidate =
          candidateData.find(
            (candidate) =>
              String(candidate?.chestNo) ===
              String(result?.thirdChest)
          );

        const thirdTeam = String(
          result?.thirdTeam ||
            thirdCandidate?.team ||
            ""
        ).trim();

        if (
          thirdTeam &&
          thirdTeam !== "-"
        ) {
          const points = getPoints(
            programmeType,
            3
          );

          scores[thirdTeam] =
            (scores[thirdTeam] || 0) +
            points;
        }
      });

      // =================================================
      // ADD SCORE TO TEAMS
      // =================================================

      const updatedTeams: DataItem[] =
        teamData.map((team) => {
          const teamName = String(
            team?.teamName || ""
          ).trim();

          return {
            ...team,
            score:
              scores[teamName] || 0,
          };
        });

      // =================================================
      // SORT TEAMS
      // =================================================

      updatedTeams.sort(
        (a, b) =>
          Number(b?.score || 0) -
          Number(a?.score || 0)
      );

      // =================================================
      // SAVE TO STATE
      // =================================================

      setResults(resultData);
      setProgrammes(programmeData);
      setCandidates(candidateData);
      setTeams(updatedTeams);

    } catch (err) {
      console.error(
        "Results loading error:",
        err
      );

      setError(
        "Results load ചെയ്യാൻ കഴിഞ്ഞില്ല."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FIND CANDIDATE
  // =====================================================

  const findCandidate = (
    chestNo: any
  ) => {
    if (
      chestNo === undefined ||
      chestNo === null ||
      chestNo === ""
    ) {
      return undefined;
    }

    return candidates.find(
      (candidate) =>
        String(candidate?.chestNo) ===
        String(chestNo)
    );
  };

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
          <div className="text-6xl mb-4">
            🏆
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            Loading Results...
          </h2>

          <p className="text-gray-500 mt-2">
            Please wait
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR SCREEN
  // =====================================================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md w-full">
          <div className="text-5xl mb-4">
            ⚠️
          </div>

          <h2 className="text-2xl font-bold text-red-600">
            Error
          </h2>

          <p className="text-gray-600 mt-3">
            {error}
          </p>

          <button
            onClick={loadData}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 md:px-8 md:py-10">

      <div className="max-w-7xl mx-auto">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="text-center mb-10">

          <div className="text-6xl mb-3">
            🏆
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-green-700">
            Grand Results
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Meelad Fest Results
          </p>

        </div>

        {/* =================================================
            NO RESULTS
        ================================================= */}

        {results.length === 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-10 text-center">

            <div className="text-6xl mb-5">
              🏆
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Results Not Published Yet
            </h2>

            <p className="text-gray-500 mt-3">
              Please check again later.
            </p>

          </div>
        )}

        {/* =================================================
            RESULTS
        ================================================= */}

        <div className="space-y-8">

          {results.map((result) => {

            // =============================================
            // PROGRAMME
            // =============================================

            const programme =
              programmes.find(
                (item) =>
                  String(item.id) ===
                  String(result?.programmeId)
              );

            // =============================================
            // PROGRAMME TYPE
            // =============================================

            const programmeType =
              getProgrammeType(
                programme,
                result
              );

            // =============================================
            // CATEGORY
            // =============================================

            const category =
              programme?.category ||
              result?.category ||
              "-";

            // =============================================
            // POINTS
            // =============================================

            const firstPoints =
              getPoints(
                programmeType,
                1
              );

            const secondPoints =
              getPoints(
                programmeType,
                2
              );

            const thirdPoints =
              getPoints(
                programmeType,
                3
              );

            // =============================================
            // CANDIDATES
            // =============================================

            const firstCandidate =
              findCandidate(
                result?.firstChest
              );

            const secondCandidate =
              findCandidate(
                result?.secondChest
              );

            const thirdCandidate =
              findCandidate(
                result?.thirdChest
              );

            // =============================================
            // FIRST
            // =============================================

            const firstName =
              result?.firstName ||
              firstCandidate?.candidateName ||
              "-";

            const firstChest =
              result?.firstChest ||
              firstCandidate?.chestNo ||
              "-";

            const firstTeam =
              result?.firstTeam ||
              firstCandidate?.team ||
              "-";

            // =============================================
            // SECOND
            // =============================================

            const secondName =
              result?.secondName ||
              secondCandidate?.candidateName ||
              "-";

            const secondChest =
              result?.secondChest ||
              secondCandidate?.chestNo ||
              "-";

            const secondTeam =
              result?.secondTeam ||
              secondCandidate?.team ||
              "-";

            // =============================================
            // THIRD
            // =============================================

            const thirdName =
              result?.thirdName ||
              thirdCandidate?.candidateName ||
              "-";

            const thirdChest =
              result?.thirdChest ||
              thirdCandidate?.chestNo ||
              "-";

            const thirdTeam =
              result?.thirdTeam ||
              thirdCandidate?.team ||
              "-";

            return (
              <div
                key={String(result.id)}
                className="bg-white rounded-3xl shadow-lg overflow-hidden"
              >

                {/* =======================================
                    PROGRAMME HEADER
                ======================================= */}

                <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-5 md:p-7">

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    <div>

                      <h2 className="text-2xl md:text-3xl font-bold">
                        {programme?.programmeName ||
                          result?.programmeName ||
                          "Programme"}
                      </h2>

                      <div className="flex flex-wrap gap-2 mt-4">

                        <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-semibold">
                          {getCategoryName(
                            category
                          )}
                        </span>

                        <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-semibold">
                          {programmeType}
                        </span>

                      </div>

                    </div>

                    <div className="text-sm md:text-base">

                      {programme?.date && (
                        <p>
                          📅 {programme.date}
                        </p>
                      )}

                      {programme?.time && (
                        <p className="mt-1">
                          ⏰ {programme.time}
                        </p>
                      )}

                      {programme?.venue && (
                        <p className="mt-1">
                          📍 {programme.venue}
                        </p>
                      )}

                    </div>

                  </div>

                </div>

                {/* =======================================
                    WINNERS
                ======================================= */}

                <div className="p-5 md:p-7">

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    {/* =================================
                        FIRST
                    ================================= */}

                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6 text-center">

                      <div className="text-6xl mb-3">
                        🥇
                      </div>

                      <p className="text-sm font-bold text-yellow-700 uppercase tracking-wide">
                        First Prize
                      </p>

                      <h3 className="text-2xl font-bold text-gray-800 mt-3">
                        {firstName}
                      </h3>

                      <div className="mt-5 space-y-2 text-gray-600">

                        <p>
                          <span className="font-semibold">
                            Chest:
                          </span>{" "}
                          {firstChest}
                        </p>

                        <p>
                          <span className="font-semibold">
                            Team:
                          </span>{" "}
                          {firstTeam}
                        </p>

                      </div>

                      <div className="mt-5 inline-block bg-yellow-200 text-yellow-800 px-5 py-2 rounded-full font-bold">
                        +{firstPoints} Points
                      </div>

                    </div>

                    {/* =================================
                        SECOND
                    ================================= */}

                    <div className="bg-gray-50 border-2 border-gray-300 rounded-2xl p-6 text-center">

                      <div className="text-6xl mb-3">
                        🥈
                      </div>

                      <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                        Second Prize
                      </p>

                      <h3 className="text-2xl font-bold text-gray-800 mt-3">
                        {secondName}
                      </h3>

                      <div className="mt-5 space-y-2 text-gray-600">

                        <p>
                          <span className="font-semibold">
                            Chest:
                          </span>{" "}
                          {secondChest}
                        </p>

                        <p>
                          <span className="font-semibold">
                            Team:
                          </span>{" "}
                          {secondTeam}
                        </p>

                      </div>

                      <div className="mt-5 inline-block bg-gray-200 text-gray-700 px-5 py-2 rounded-full font-bold">
                        +{secondPoints} Points
                      </div>

                    </div>

                    {/* =================================
                        THIRD
                    ================================= */}

                    <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-6 text-center">

                      <div className="text-6xl mb-3">
                        🥉
                      </div>

                      <p className="text-sm font-bold text-orange-700 uppercase tracking-wide">
                        Third Prize
                      </p>

                      <h3 className="text-2xl font-bold text-gray-800 mt-3">
                        {thirdName}
                      </h3>

                      <div className="mt-5 space-y-2 text-gray-600">

                        <p>
                          <span className="font-semibold">
                            Chest:
                          </span>{" "}
                          {thirdChest}
                        </p>

                        <p>
                          <span className="font-semibold">
                            Team:
                          </span>{" "}
                          {thirdTeam}
                        </p>

                      </div>

                      <div className="mt-5 inline-block bg-orange-200 text-orange-800 px-5 py-2 rounded-full font-bold">
                        +{thirdPoints} Points
                      </div>

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

        {/* =================================================
            OVERALL CHAMPION
        ================================================= */}

        {teams.length > 0 && (

          <section className="mt-14">

            <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 rounded-3xl shadow-xl p-6 md:p-10">

              <div className="text-center text-white mb-8">

                <div className="text-6xl mb-3">
                  👑
                </div>

                <h2 className="text-3xl md:text-4xl font-extrabold">
                  Overall Champion
                </h2>

                <p className="mt-2">
                  Meelad Fest Team Championship
                </p>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* CHAMPION */}

                <div className="bg-white rounded-2xl shadow-lg p-7 text-center">

                  <div className="text-6xl">
                    🥇
                  </div>

                  <p className="text-sm font-bold text-gray-500 mt-3">
                    CHAMPION
                  </p>

                  <h3 className="text-2xl font-extrabold text-yellow-600 mt-2">
                    {teams[0]?.teamName || "-"}
                  </h3>

                  <p className="text-lg font-bold text-gray-600 mt-2">
                    {teams[0]?.score || 0} Points
                  </p>

                </div>

                {/* RUNNER UP */}

                <div className="bg-white rounded-2xl shadow-lg p-7 text-center">

                  <div className="text-6xl">
                    🥈
                  </div>

                  <p className="text-sm font-bold text-gray-500 mt-3">
                    RUNNER UP
                  </p>

                  <h3 className="text-2xl font-extrabold text-gray-600 mt-2">
                    {teams[1]?.teamName || "-"}
                  </h3>

                  <p className="text-lg font-bold text-gray-600 mt-2">
                    {teams[1]?.score || 0} Points
                  </p>

                </div>

                {/* THIRD */}

                <div className="bg-white rounded-2xl shadow-lg p-7 text-center">

                  <div className="text-6xl">
                    🥉
                  </div>

                  <p className="text-sm font-bold text-gray-500 mt-3">
                    THIRD PLACE
                  </p>

                  <h3 className="text-2xl font-extrabold text-orange-600 mt-2">
                    {teams[2]?.teamName || "-"}
                  </h3>

                  <p className="text-lg font-bold text-gray-600 mt-2">
                    {teams[2]?.score || 0} Points
                  </p>

                </div>

              </div>

            </div>

          </section>

        )}

        {/* =================================================
            TEAM LEADERBOARD
        ================================================= */}

        {teams.length > 0 && (

          <section className="mt-14 pb-12">

            <div className="text-center mb-7">

              <div className="text-5xl mb-2">
                🏆
              </div>

              <h2 className="text-3xl font-extrabold text-green-700">
                Team Leaderboard
              </h2>

              <p className="text-gray-500 mt-2">
                Overall Team Points
              </p>

            </div>

            <div className="space-y-3">

              {teams.map(
                (team, index) => {

                  const rankIcon =
                    index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : String(index + 1);

                  const borderClass =
                    index === 0
                      ? "border-yellow-400"
                      : index === 1
                      ? "border-gray-300"
                      : index === 2
                      ? "border-orange-300"
                      : "border-transparent";

                  return (
                    <div
                      key={String(team?.id)}
                      className={`bg-white border-2 ${borderClass} rounded-2xl shadow-sm p-4 md:p-5 flex items-center justify-between`}
                    >

                      <div className="flex items-center gap-4">

                        <div className="w-12 text-center text-3xl font-bold">
                          {rankIcon}
                        </div>

                        <div>

                          <h3 className="text-lg md:text-xl font-bold text-gray-800">
                            {team?.teamName || "-"}
                          </h3>

                          {team?.teamCode && (
                            <p className="text-sm text-gray-500 mt-1">
                              Team Code:{" "}
                              {team.teamCode}
                            </p>
                          )}

                        </div>

                      </div>

                      <div className="text-right">

                        <p className="text-2xl font-extrabold text-green-700">
                          {team?.score || 0}
                        </p>

                        <p className="text-sm text-gray-500">
                          Points
                        </p>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </section>

        )}

      </div>
    </div>
  );
}

export default Results;