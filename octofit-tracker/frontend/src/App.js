import { Routes, Route, NavLink } from "react-router-dom";
import Activities from "./components/Activities";
import Leaderboard from "./components/Leaderboard";
import Teams from "./components/Teams";
import Users from "./components/Users";
import Workouts from "./components/Workouts";

const navLinkClass = ({ isActive }) =>
  isActive ? "nav-link active" : "nav-link text-secondary";

export default function App() {
  return (
    <div className="min-vh-100 bg-light app-shell">
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm mb-4">
        <div className="container">
          <NavLink className="navbar-brand fw-bold" to="/">
            OctoFit Tracker
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMain"
            aria-controls="navbarMain"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarMain">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink end to="/" className={navLinkClass}>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/activities" className={navLinkClass}>
                  Activities
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/leaderboard" className={navLinkClass}>
                  Leaderboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/teams" className={navLinkClass}>
                  Teams
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/users" className={navLinkClass}>
                  Users
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/workouts" className={navLinkClass}>
                  Workouts
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container pb-5">
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/activities" element={<Activities />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/teams" element={<Teams />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/workouts" element={<Workouts />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Home() {
  return (
    <div>
      <div className="d-flex align-items-start justify-content-between mb-4">
        <div>
          <h1 className="display-6 fw-bold">OctoFit Tracker</h1>
          <p className="lead text-muted mb-0">
            A polished React frontend for your Django REST backend. Use the navigation menu to explore records, teams, workouts, users, and leaderboard standings.
          </p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6 col-xl-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h2 className="h5">Activities</h2>
              <p className="text-muted">
                Browse activity records fetched from your API and inspect details in a responsive Bootstrap table.
              </p>
              <NavLink to="/activities" className="btn btn-outline-primary">
                View Activities
              </NavLink>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h2 className="h5">Leaderboard</h2>
              <p className="text-muted">
                Track top performers with modern table styling and REST API connectivity.
              </p>
              <NavLink to="/leaderboard" className="btn btn-outline-primary">
                View Leaderboard
              </NavLink>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h2 className="h5">Teams</h2>
              <p className="text-muted">Manage team records and collaborators pulled from the Django REST endpoint.</p>
              <NavLink to="/teams" className="btn btn-outline-primary">
                View Teams
              </NavLink>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h2 className="h5">Users</h2>
              <p className="text-muted">Review registered users and profile data returned from the backend.</p>
              <NavLink to="/users" className="btn btn-outline-primary">
                View Users
              </NavLink>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h2 className="h5">Workouts</h2>
              <p className="text-muted">See workout entries retrieved from your REST API in a clean, modern layout.</p>
              <NavLink to="/workouts" className="btn btn-outline-primary">
                View Workouts
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
