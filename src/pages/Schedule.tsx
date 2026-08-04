import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

function Schedule() {
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // ===========================
  // Load Programmes
  // ===========================

  const loadProgrammes = async () => {
    const snapshot = await getDocs(collection(db, "schedule"));

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort by Date then Time

    data.sort((a: any, b: any) => {
      const [d1, m1, y1] = (a.date || "01-01-2000").split("-");
      const [d2, m2, y2] = (b.date || "01-01-2000").split("-");

      const date1 = new Date(`${y1}-${m1}-${d1} ${a.time || "00:00"}`);
      const date2 = new Date(`${y2}-${m2}-${d2} ${b.time || "00:00"}`);

      return date1.getTime() - date2.getTime();
    });

    setProgrammes(data);
    const resultSnapshot = await getDocs(collection(db, "results"));

const resultData = resultSnapshot.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
}));

setResults(resultData);
  };

  useEffect(() => {
    loadProgrammes();
  }, []);

  // ===========================
  // Search + Category Filter
  // ===========================

  const filteredProgrammes = programmes.filter((item: any) => {
    const matchesSearch = item.programmeName
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" ||
      item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // ===========================
  // Group By Date
  // ===========================

  const groupedProgrammes = filteredProgrammes.reduce(
    (groups: any, item: any) => {
      const date = item.date || "No Date";

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(item);

      return groups;
    },
    {}
  );
    return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-green-700">
            📅 Programme Schedule
          </h1>

          <p className="text-gray-600 mt-2">
            Meelad Fest 2026
          </p>
        </div>

        {/* Search */}

        <input
          type="text"
          placeholder="🔍 Search Programme..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg p-3 mb-5"
        />

        {/* Category Filter */}

        <div className="flex flex-wrap gap-3 mb-8">
          {["All", "SJ", "J", "S"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-5 py-2 rounded-full font-semibold transition ${
                categoryFilter === cat
                  ? "bg-green-700 text-white"
                  : "bg-white border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Date Wise Programmes */}

        {Object.keys(groupedProgrammes).length === 0 ? (

          <div className="bg-white rounded-lg shadow p-8 text-center">
            No Programmes Found
          </div>

        ) : (

          Object.keys(groupedProgrammes).map((date) => (

            <div key={date} className="mb-10">

              {/* Date Heading */}

              <div className="bg-green-700 text-white px-5 py-3 rounded-lg mb-5">
                <h2 className="text-2xl font-bold">
                  📅 {date}
                </h2>
              </div>

              {/* Cards */}

              <div className="grid md:grid-cols-2 gap-6">

                {groupedProgrammes[date].map((item: any) => (

                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-lg border-l-4 border-green-600 p-6 hover:shadow-xl transition"
                  >

                    <h3 className="text-2xl font-bold text-green-700 mb-4">
                      {item.programmeName}
                    </h3>

{results.some(
  (result: any) => result.programmeId === item.id
) && (
  <div className="mb-4">
    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
      🏆 Result Published
    </span>
  </div>
)}

                    <div className="space-y-2 text-gray-700">

                      <p>
                        📂 <strong>Category :</strong> {item.category}
                      </p>

                      <p>
                        👤 <strong>Gender :</strong> {item.gender || "-"}
                      </p>

                      <p>
                        🎭 <strong>Stage :</strong> {item.stage}
                      </p>

                      {item.venue && (
                        <p>
                          📍 <strong>Venue :</strong> {item.venue}
                        </p>
                      )}

                      <p>
                        🕘 <strong>Time :</strong> {item.time}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          ))

        )}

      </div>
    </div>
  );
}

export default Schedule;
