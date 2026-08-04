import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { db } from "../firebase/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";


function Home() {

  const [candidateCount, setCandidateCount] = useState(0);
  const [programmeCount, setProgrammeCount] = useState(0);
  const [teamCount, setTeamCount] = useState(0);
const [festivalName, setFestivalName] = useState("Meelad Fest 2026");
const [festivalLogo, setFestivalLogo] = useState("");
const [festivalBanner, setFestivalBanner] = useState("");
const [_festivalDate, setFestivalDate] = useState("");
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [upcomingProgrammes, setUpcomingProgrammes] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [todayProgrammes, setTodayProgrammes] = useState<any[]>([]);
  const [countdown, setCountdown] = useState({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});



    const loadCounts = async () => {

    const candidateSnap = await getDocs(collection(db, "candidates"));
    setCandidateCount(candidateSnap.size);

    const programmeSnap = await getDocs(collection(db, "schedule"));
    setProgrammeCount(programmeSnap.size);

    const teamSnap = await getDocs(collection(db, "teams"));
    setTeamCount(teamSnap.size);

  };

  const loadAnnouncements = async () => {

    const snap = await getDocs(collection(db, "announcements"));

    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setAnnouncements(list);

  };

  const loadUpcomingProgrammes = async () => {

    const snap = await getDocs(collection(db, "schedule"));

    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

   setUpcomingProgrammes(list);

};



const loadTodayProgrammes = async () => {

  const snap = await getDocs(collection(db, "schedule"));

  const today = new Date().toISOString().split("T")[0];

  const list = snap.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter((item: any) => item.date === today)
    .sort((a: any, b: any) => a.time.localeCompare(b.time));

  setTodayProgrammes(list);

};

const loadLeaderboard = async () => {

  const snap = await getDocs(collection(db, "teams"));

  const list = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  list.sort((a: any, b: any) => (b.score || 0) - (a.score || 0));

  setLeaderboard(list);
  
};

const loadSettings = async () => {
  const snapshot = await getDoc(doc(db, "settings", "festival"));

  if (snapshot.exists()) {
    const data: any = snapshot.data();

    setFestivalName(data.festivalName || "Meelad Fest");
    setFestivalLogo(data.festivalLogo || "");
    setFestivalBanner(data.festivalBanner || "");
    setFestivalDate(data.festivalDate || "");
  }
};

useEffect(() => {

 

  loadCounts();
  loadUpcomingProgrammes();
  loadAnnouncements();
  loadLeaderboard();
  loadTodayProgrammes();
  loadSettings();

  updateCountdown();


  const timer = setInterval(() => {
    updateCountdown();
  }, 1000);

  return () => clearInterval(timer);

}, []);

const getStatus = (time: string) => {

  const now = new Date();

  const current =
    now.getHours() * 60 + now.getMinutes();

  const [hour, minute] = time.split(":");

  const programme =
    Number(hour) * 60 + Number(minute);

  if (current >= programme && current <= programme + 60) {
    return "LIVE";
  }

  if (current < programme) {
    return "UPCOMING";
  }

  return "COMPLETED";

};

const formatTime = (time: string) => {

  const [hour, minute] = time.split(":");

  let h = Number(hour);

  const ampm = h >= 12 ? "PM" : "AM";

  h = h % 12;

  if (h === 0) h = 12;

  return `${h}:${minute} ${ampm}`;

};


const updateCountdown = () => {

  const festDate = new Date("2026-08-26T09:00:00");

  const now = new Date();

  const diff = festDate.getTime() - now.getTime();

  if (diff <= 0) return;

  setCountdown({
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  });

};

  return (

    <div className="min-h-screen bg-gray-100">
            {/* ================= HERO SECTION ================= */}

      <section
  className="text-white bg-cover bg-center"
  style={{
    backgroundImage: festivalBanner
      ? `linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.55)), url(${festivalBanner})`
      : "linear-gradient(to right, #166534, #15803d, #16a34a)",
  }}
>

        <div className="max-w-7xl mx-auto px-6 py-24 text-center">

          {festivalLogo && (
  <img
    src={festivalLogo}
    alt="Festival Logo"
    className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-6 object-contain"
  />
)}


      <h1 className="text-6xl md:text-7xl font-extrabold mb-6">
  🕌 {festivalName}
</h1>

          <p className="text-2xl md:text-3xl text-green-100 mb-10">
            Knowledge • Unity • Excellence
          </p>

<div className="flex flex-wrap justify-center gap-5 mb-10">

  <div className="bg-white/20 rounded-xl p-5 w-28">
    <h2 className="text-4xl font-bold">{countdown.days}</h2>
    <p className="text-green-100">Days</p>
  </div>

  <div className="bg-white/20 rounded-xl p-5 w-28">
    <h2 className="text-4xl font-bold">{countdown.hours}</h2>
    <p className="text-green-100">Hours</p>
  </div>

  <div className="bg-white/20 rounded-xl p-5 w-28">
    <h2 className="text-4xl font-bold">{countdown.minutes}</h2>
    <p className="text-green-100">Minutes</p>
  </div>

  <div className="bg-white/20 rounded-xl p-5 w-28">
    <h2 className="text-4xl font-bold">{countdown.seconds}</h2>
    <p className="text-green-100">Seconds</p>
  </div>

</div>

          <div className="flex flex-wrap justify-center gap-5">

            <Link
              to="/schedule"
              className="bg-white text-green-700 px-7 py-3 rounded-lg font-bold shadow-lg hover:bg-gray-100 transition"
            >
              📅 Schedule
            </Link>

            <Link
              to="/leaderboard"
              className="bg-yellow-400 text-black px-7 py-3 rounded-lg font-bold shadow-lg hover:bg-yellow-300 transition"
            >
              🏆 Leaderboard
            </Link>

            <Link
              to="/results"
              className="bg-red-500 text-white px-7 py-3 rounded-lg font-bold shadow-lg hover:bg-red-600 transition"
            >
              🥇 Results
            </Link>

          </div>

        </div>

      </section>

            {/* ================= FESTIVAL OVERVIEW ================= */}

      <section className="max-w-7xl mx-auto px-6 py-16">

        <h2 className="text-4xl font-bold text-center text-green-700 mb-12">
          Festival Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition">

            <div className="text-5xl">👥</div>

            <h3 className="text-4xl font-bold text-green-700 mt-4">
              {candidateCount}+
            </h3>

            <p className="text-gray-600 mt-3">
              Participants
            </p>

          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition">

            <div className="text-5xl">🎭</div>

            <h3 className="text-4xl font-bold text-blue-700 mt-4">
              {programmeCount}+
            </h3>

            <p className="text-gray-600 mt-3">
              Programmes
            </p>

          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition">

            <div className="text-5xl">🏆</div>

            <h3 className="text-4xl font-bold text-yellow-600 mt-4">
              {teamCount}
            </h3>

            <p className="text-gray-600 mt-3">
              Teams
            </p>

          </div>

        </div>

      </section>
            {/* ================= LATEST ANNOUNCEMENT ================= */}

      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="flex justify-between items-center mb-8">

          <h2 className="text-4xl font-bold text-green-700">
            📢 Latest Announcement
          </h2>

          <Link
            to="/announcements"
            className="text-green-700 font-semibold hover:underline"
          >
            View All →
          </Link>

        </div>

        <div className="bg-green-50 border-l-4 border-green-700 rounded-xl shadow-lg p-8">

          {announcements.length > 0 ? (

            <>
              <h3 className="text-2xl font-bold text-green-700">
                {announcements[0].title}
              </h3>

              <p className="mt-4 text-gray-700 leading-8">
                {announcements[0].message}
              </p>
            </>

          ) : (

            <>
              <h3 className="text-2xl font-bold">
                No Announcement
              </h3>

              <p className="mt-4 text-gray-600">
                No announcements available.
              </p>
            </>

          )}

        </div>

      </section>
            {/* ================= UPCOMING PROGRAMMES ================= */}

      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="flex justify-between items-center mb-8">

          <h2 className="text-4xl font-bold text-green-700">
            🎭 Upcoming Programmes
          </h2>

          <Link
            to="/schedule"
            className="text-green-700 font-semibold hover:underline"
          >
            Full Schedule →
          </Link>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">


          {todayProgrammes.map((item: any) => (
<div
  key={item.id}
  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition border-l-4 border-green-600"
>

  <div className="flex justify-between items-center">

    <h3 className="text-xl font-bold text-green-700">
      {item.programmeName}
    </h3>
<span
  className={`px-3 py-1 rounded-full text-sm font-semibold ${
    getStatus(item.time) === "LIVE"
      ? "bg-red-100 text-red-700"
      : getStatus(item.time) === "UPCOMING"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-gray-200 text-gray-700"
  }`}
>
  {getStatus(item.time)}
</span>

  </div>

  <div className="mt-4 space-y-2 text-gray-600">

    <p>🕒 {formatTime(item.time)}</p>

    <p>📍 {item.venue}</p>

    <p>🎭 {item.category}</p>

    <p>📅 {item.date}</p>

  </div>


    </div>

  ))}

</div>

</section>

{/* ================= TODAY'S PROGRAMMES ================= */}

<section className="max-w-7xl mx-auto px-6 py-16">

  <div className="flex justify-between items-center mb-8">

    <h2 className="text-4xl font-bold text-green-700">
      📅 Today's Programmes
    </h2>

    <Link
      to="/schedule"
      className="text-green-700 font-semibold hover:underline"
    >
      View Full Schedule →
    </Link>

  </div>

  {upcomingProgrammes.length === 0 ? (

    <div className="bg-white rounded-xl shadow-lg p-8 text-center">

      <p className="text-gray-500">
        No programmes available today.
      </p>

    </div>

  ) : (

    <div className="space-y-5">

      {upcomingProgrammes.slice(0, 3).map((item: any) => (

        <div
          key={item.id}
          className="bg-white rounded-xl shadow-lg p-6 flex justify-between items-center hover:shadow-xl transition"
        >

          <div>

            <h3 className="text-2xl font-bold text-green-700">
              {item.programmeName}
            </h3>

            <p className="text-gray-600 mt-2">
              🎭 {item.category}
            </p>

            <p className="text-gray-600">
              📍 {item.venue}
            </p>

          </div>

          <div className="text-right">

            <p className="text-lg font-bold text-green-700">
              {item.time}
            </p>

            <p className="text-gray-500">
              {item.date}
            </p>

          </div>

        </div>

      ))}

    </div>

  )}

</section>
{/* ================= LIVE LEADERBOARD ================= */}

<section className="max-w-7xl mx-auto px-6 py-16">

  <div className="flex justify-between items-center mb-8">

    <h2 className="text-4xl font-bold text-green-700">
      🏆 Live Leaderboard
    </h2>

    <Link
      to="/leaderboard"
      className="text-green-700 font-semibold hover:underline"
    >
      View Full →
    </Link>

  </div>

  {leaderboard.length === 0 ? (

    <div className="bg-white rounded-xl shadow-lg p-10 text-center">
      <p className="text-gray-500 text-lg">
        No team points available.
      </p>
    </div>

  ) : (

    <div className="grid md:grid-cols-3 gap-6">

      {leaderboard.slice(0, 3).map((team: any, index: number) => (

        <div
          key={team.id}
          className={`rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition
          ${
            index === 0
              ? "bg-yellow-100"
              : index === 1
              ? "bg-gray-100"
              : "bg-orange-100"
          }`}
        >

          <div className="text-5xl mb-4">
            {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
          </div>

          <h3 className="text-2xl font-bold text-green-700">
            {team.teamName}
          </h3>

          <p className="text-5xl font-bold text-green-800 mt-5">
            {team.score || 0}
          </p>

          <p className="text-gray-600 mt-2">
            Points
          </p>

        </div>

      ))}

    </div>

  )}

</section>

{/* ================= FOOTER ================= */}

<footer className="bg-green-900 text-white mt-16">

  <div className="max-w-7xl mx-auto px-6 py-14">

    <div className="grid md:grid-cols-3 gap-10">

      <div>

        <h2 className="text-4xl font-bold">
          🕌 Meelad Fest 2026
        </h2>

        <p className="mt-5 text-green-200 leading-8">
          Official Meelad Fest Management System.
          Stay updated with schedules, announcements,
          live leaderboard and results.
        </p>

      </div>

      <div>

        <h3 className="text-2xl font-bold mb-5">
          Quick Links
        </h3>

        <div className="space-y-3">

          <Link to="/" className="block hover:text-yellow-300">Home</Link>
          <Link to="/schedule" className="block hover:text-yellow-300">Schedule</Link>
          <Link to="/leaderboard" className="block hover:text-yellow-300">Leaderboard</Link>
          <Link to="/results" className="block hover:text-yellow-300">Results</Link>
          <Link to="/announcements" className="block hover:text-yellow-300">Announcements</Link>

        </div>

      </div>

      <div>

        <h3 className="text-2xl font-bold mb-5">
          Contact
        </h3>

        <p>📧 digiliveonline@gmail.com</p>
        <p className="mt-3">📞 +91 9562178903</p>
        <p className="mt-3">📍 Kerala, India</p>

      </div>

    </div>

    <hr className="my-8 border-green-700" />

    <p className="text-center text-green-200">
      © 2026 DIGILIVE. Designed & Developed for Fest. All Rights Reserved.
    </p>

  </div>

</footer>

    </div>
  );
}

export default Home;