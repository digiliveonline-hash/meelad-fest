import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

interface Team {
  id: string;
  teamName?: string;
  score?: number;
}

function Leaderboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  // ==========================
  // Load Leaderboard
  // ==========================
  const loadLeaderboard = async () => {
    try {
      setLoading(true);

      const snap = await getDocs(collection(db, "teams"));

      const list: Team[] = snap.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          teamName: data.teamName || "Unknown Team",
          score: Number(data.score) || 0,
        };
      });

      // ==========================
      // Sort Highest Score First
      // ==========================
      list.sort((a, b) => {
        return (b.score || 0) - (a.score || 0);
      });

      setTeams(list);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Load when page opens
  // ==========================
  useEffect(() => {
    loadLeaderboard();
  }, []);

  // ==========================
  // Loading
  // ==========================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🏆</div>
          <p className="text-xl font-semibold text-green-700">
            Loading Leaderboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* ==========================
            TITLE
        ========================== */}

        <h1 className="text-4xl sm:text-5xl font-bold text-center text-green-700 mb-10">
          🏆 Live Leaderboard
        </h1>

        {/* ==========================
            NO TEAMS
        ========================== */}

        {teams.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-10 text-center">
            <p className="text-xl text-gray-500">
              No teams found.
            </p>
          </div>
        ) : (
          <>
            {/* ==========================
                TOP 3
            ========================== */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

              {teams.slice(0, 3).map((team, index) => (

                <div
                  key={team.id}
                  className={`
                    rounded-2xl
                    shadow-xl
                    p-8
                    text-center
                    transform
                    transition
                    hover:scale-105
                    ${
                      index === 0
                        ? "bg-yellow-100 border-4 border-yellow-400"
                        : index === 1
                        ? "bg-gray-100 border-4 border-gray-300"
                        : "bg-orange-100 border-4 border-orange-400"
                    }
                  `}
                >

                  {/* Medal */}

                  <div className="text-6xl mb-4">
                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : "🥉"}
                  </div>

                  {/* Rank */}

                  <p className="text-lg font-semibold text-gray-500 mb-2">
                    Rank #{index + 1}
                  </p>

                  {/* Team Name */}

                  <h2 className="text-2xl sm:text-3xl font-bold text-green-700 break-words">
                    {team.teamName}
                  </h2>

                  {/* Score */}

                  <p className="text-5xl font-bold mt-5 text-green-800">
                    {team.score || 0}
                  </p>

                  <p className="text-gray-600 font-medium">
                    Points
                  </p>

                </div>

              ))}

            </div>

            {/* ==========================
                FULL RANKING
            ========================== */}

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

              <div className="bg-green-700 px-6 py-5">
                <h2 className="text-2xl font-bold text-white">
                  📊 Complete Ranking
                </h2>
              </div>

              <div className="overflow-x-auto">

                <table className="w-full">

                  {/* Table Header */}

                  <thead className="bg-green-600 text-white">

                    <tr>

                      <th className="py-4 px-4 text-center">
                        Rank
                      </th>

                      <th className="py-4 px-4 text-left">
                        Team
                      </th>

                      <th className="py-4 px-4 text-center">
                        Points
                      </th>

                    </tr>

                  </thead>

                  {/* Table Body */}

                  <tbody>

                    {teams.map((team, index) => (

                      <tr
                        key={team.id}
                        className={`
                          text-center
                          border-b
                          transition
                          hover:bg-green-50
                          ${
                            index < 3
                              ? "bg-green-50"
                              : "bg-white"
                          }
                        `}
                      >

                        {/* Rank */}

                        <td className="py-5 px-4">

                          {index === 0 ? (
                            <span className="text-2xl">
                              🥇
                            </span>
                          ) : index === 1 ? (
                            <span className="text-2xl">
                              🥈
                            </span>
                          ) : index === 2 ? (
                            <span className="text-2xl">
                              🥉
                            </span>
                          ) : (
                            <span className="font-bold text-gray-600">
                              #{index + 1}
                            </span>
                          )}

                        </td>

                        {/* Team Name */}

                        <td className="py-5 px-4 text-left">

                          <span className="font-semibold text-gray-800">
                            {team.teamName}
                          </span>

                        </td>

                        {/* Points */}

                        <td className="py-5 px-4">

                          <span className="text-xl font-bold text-green-700">
                            {team.score || 0}
                          </span>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>
          </>
        )}

      </div>

    </div>
  );
}

export default Leaderboard;