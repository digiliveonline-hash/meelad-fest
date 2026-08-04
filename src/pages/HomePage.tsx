import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* ===========================
          HERO SECTION
      ============================ */}

      <section className="bg-gradient-to-r from-green-700 via-green-600 to-green-500 text-white">

        <div className="max-w-7xl mx-auto px-6 py-24">

          <div className="text-center">

            <h1 className="text-5xl md:text-6xl font-extrabold mb-5">

              🕌 Meelad Fest 2026

            </h1>

            <p className="text-2xl mb-6 text-green-100">

              Knowledge • Unity • Excellence

            </p>

            <p className="max-w-3xl mx-auto text-lg leading-8">

              Welcome to the Official Meelad Fest Website.

              Watch Live Results, Leaderboard,

              Programme Schedule and Announcements

              in Real Time.

            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-5">

              <Link
                to="/schedule"
                className="bg-white text-green-700 px-7 py-3 rounded-lg font-bold shadow hover:bg-green-100 transition"
              >
                📅 Programme Schedule
              </Link>

              <Link
                to="/leaderboard"
                className="bg-yellow-400 text-black px-7 py-3 rounded-lg font-bold shadow hover:bg-yellow-300 transition"
              >
                🏆 Live Leaderboard
              </Link>

              <Link
                to="/results"
                className="bg-red-500 text-white px-7 py-3 rounded-lg font-bold shadow hover:bg-red-600 transition"
              >
                🥇 Live Results
              </Link>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;
