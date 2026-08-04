import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

function Leaderboard() {

  const [teams, setTeams] = useState<any[]>([]);
  const loadLeaderboard = async () => {

  const snap = await getDocs(collection(db, "teams"));

  const list = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  list.sort((a: any, b: any) => (b.score || 0) - (a.score || 0));

  setTeams(list);

};
useEffect(() => {

  loadLeaderboard();

}, []);

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto px-6 py-12">

        <h1 className="text-5xl font-bold text-center text-green-700 mb-10">
          🏆 Live Leaderboard
        </h1>

        {/* Top 3 */}

        <div className="grid md:grid-cols-3 gap-6 mb-12">

          {teams.slice(0, 3).map((team: any, index: number) => (

            <div
              key={team.id}
              className={`rounded-xl shadow-lg p-8 text-center
              ${
                index === 0
                  ? "bg-yellow-100"
                  : index === 1
                  ? "bg-gray-100"
                  : "bg-orange-100"
              }`}
            >

              <div className="text-6xl mb-4">
                {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
              </div>

              <h2 className="text-3xl font-bold text-green-700">
                {team.teamName}
              </h2>

              <p className="text-5xl font-bold mt-4 text-green-800">
                {team.score || 0}
              </p>

              <p className="text-gray-600">
                Points
              </p>

            </div>


          ))}

        </div>
        {/* Full Ranking */}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">

          <table className="w-full">

            <thead className="bg-green-700 text-white">

              <tr>

                <th className="py-4">Rank</th>

                <th>Team</th>

                <th>Points</th>

              </tr>

            </thead>

            <tbody>

              {teams.map((team: any, index: number) => (

                <tr
                  key={team.id}
                  className="text-center border-b hover:bg-green-50"
                >

                  <td className="py-4 font-bold">
                    #{index + 1}
                  </td>

                  <td className="font-semibold">
                    {team.teamName}
                  </td>

                  <td className="text-green-700 font-bold">
                    {team.score || 0}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Leaderboard;