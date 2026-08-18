import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-green-700 text-white p-4">
      <div className="flex gap-6 flex-wrap justify-center">

        <Link to="/">Home</Link>

        <Link to="/schedule">Schedule</Link>

        <Link to="/results">Results</Link>

        <Link to="/admin">Admin</Link>

        <Link to="/candidate-registration">
          Candidate Registration
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;