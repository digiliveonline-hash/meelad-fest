import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

function Schedule() {
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // ===========================
  // Category List
  // ===========================

  const categories = [
    { value: "All", label: "All" },
    { value: "SJ", label: "Sub Junior" },
    { value: "J", label: "Junior" },
    { value: "S", label: "Senior" },
    { value: "SS", label: "Super Senior" },
  ];

  // ===========================
  // Category Name
  // ===========================

  const getCategoryName = (category: string) => {
    switch (category) {
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

  // ===========================
  // Load Programmes + Results
  // ===========================

  const loadData = async () => {
    try {
      setLoading(true);

      // Load Schedule
      const scheduleSnapshot = await getDocs(
        collection(db, "schedule")
      );

      const programmeData = scheduleSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by Date + Time
      programmeData.sort((a: any, b: any) => {
        const [d1, m1, y1] = (a.date || "01-01-2000").split("-");
        const [d2, m2, y2] = (b.date || "01-01-2000").split("-");

        const date1 = new Date(
          `${y1}-${m1}-${d1} ${a.time || "00:00"}`
        );

        const date2 = new Date(
          `${y2}-${m2}-${d2} ${b.time || "00:00"}`
        );

        return date1.getTime() - date2.getTime();
      });

      setProgrammes(programmeData);

      // Load Results
      const resultSnapshot = await getDocs(
        collection(db, "results")
      );

      const resultData = resultSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setResults(resultData);
    } catch (error) {
      console.error("Error loading schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // Initial Load
  // ===========================

  useEffect(() => {
    loadData();
  }, []);

  // ===========================
  // Search + Category Filter
  // ===========================

  const filteredProgrammes = useMemo(() => {
    return programmes.filter((item: any) => {
      const programmeName =
        item.programmeName?.toLowerCase() || "";

      const searchText = search.toLowerCase();

      const matchesSearch =
        programmeName.includes(searchText);

      const matchesCategory =
        categoryFilter === "All" ||
        item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [programmes, search, categoryFilter]);

  // ===========================
  // Group Programmes By Date
  // ===========================

  const groupedProgrammes = useMemo(() => {
    return filteredProgrammes.reduce(
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
  }, [filteredProgrammes]);

  // ===========================
  // Loading Screen
  // ===========================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="text-3xl mb-3">⏳</div>

          <p className="text-lg font-semibold text-gray-700">
            Loading Schedule...
          </p>
        </div>
      </div>
    );
  }

  // ===========================
  // Page
  // ===========================

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ===========================
            Header
        =========================== */}

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-green-700">
            📅 Programme Schedule
          </h1>

          <p className="text-gray-600 mt-2">
            Meelad Fest 2026
          </p>
        </div>

        {/* ===========================
            Search
        =========================== */}

        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <input
            type="text"
            placeholder="🔍 Search Programme..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* ===========================
            Category Filter
        =========================== */}

        <div className="bg-white rounded-xl shadow p-5 mb-8">
          <h2 className="font-bold text-lg mb-4">
            Filter by Category
          </h2>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() =>
                  setCategoryFilter(category.value)
                }
                className={`px-5 py-2 rounded-full font-semibold transition ${
                  categoryFilter === category.value
                    ? "bg-green-700 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* ===========================
            No Programmes
        =========================== */}

        {Object.keys(groupedProgrammes).length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <div className="text-5xl mb-4">
              📭
            </div>

            <h2 className="text-2xl font-bold text-gray-700">
              No Programmes Found
            </h2>

            <p className="text-gray-500 mt-2">
              Try changing the search or category filter.
            </p>
          </div>
        ) : (

          /* ===========================
             Date Wise Programmes
          =========================== */

          Object.keys(groupedProgrammes).map((date) => (
            <div key={date} className="mb-10">

              {/* Date Heading */}

              <div className="bg-green-700 text-white px-5 py-4 rounded-xl mb-5 shadow">
                <h2 className="text-2xl font-bold">
                  📅 {date}
                </h2>
              </div>

              {/* Programme Cards */}

              <div className="grid md:grid-cols-2 gap-6">

                {groupedProgrammes[date].map(
                  (item: any) => {

                    const resultPublished = results.some(
                      (result: any) =>
                        result.programmeId === item.id
                    );

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl shadow-lg border-l-4 border-green-600 p-6 hover:shadow-xl transition"
                      >

                        {/* Programme Name */}

                        <h3 className="text-2xl font-bold text-green-700 mb-4">
                          {item.programmeName || "-"}
                        </h3>

                        {/* Result Published */}

                        {resultPublished && (
                          <div className="mb-4">
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              🏆 Result Published
                            </span>
                          </div>
                        )}

                        {/* Programme Details */}

                        <div className="space-y-3 text-gray-700">

                          {/* Category */}

                          <p>
                            📂{" "}
                            <strong>
                              Category :
                            </strong>{" "}
                            {getCategoryName(
                              item.category
                            )}
                          </p>

                          {/* Gender */}

                          <p>
                            👤{" "}
                            <strong>
                              Gender :
                            </strong>{" "}
                            {item.gender || "-"}
                          </p>

                          {/* Stage */}

                          <p>
                            🎭{" "}
                            <strong>
                              Stage :
                            </strong>{" "}
                            {item.stage || "-"}
                          </p>

                          {/* Venue */}

                          {item.venue && (
                            <p>
                              📍{" "}
                              <strong>
                                Venue :
                              </strong>{" "}
                              {item.venue}
                            </p>
                          )}

                          {/* Time */}

                          <p>
                            🕘{" "}
                            <strong>
                              Time :
                            </strong>{" "}
                            {item.time || "-"}
                          </p>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default Schedule;