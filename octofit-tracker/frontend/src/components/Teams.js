import { useEffect, useMemo, useState } from "react";

const codespaceName = import.meta.env.VITE_REACT_APP_CODESPACE_NAME || import.meta.env.REACT_APP_CODESPACE_NAME;
const apiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
  : `/api/teams/`;

const normalizeData = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const pickColumns = (items) => {
  const preferred = ["id", "name", "team", "members", "owner", "created"];
  if (!items.length) return [];
  const keys = Array.from(new Set(items.flatMap((item) => Object.keys(item))));
  return keys.sort((a, b) => {
    const ai = preferred.indexOf(a);
    const bi = preferred.indexOf(b);
    if (ai >= 0 || bi >= 0) return ai - bi;
    return a.localeCompare(b);
  });
};

const renderCell = (item, key) => {
  const value = item[key];
  if (value === null || value === undefined) return "-";
  if (typeof value === "object") return JSON.stringify(value);
  return value;
};

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalData, setModalData] = useState(null);

  const fetchTeams = () => {
    setIsLoading(true);
    fetch(apiUrl, { cache: "no-store" })
      .then(async (response) => {
        const contentType = response.headers.get("content-type") || "";
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status} ${response.statusText}: ${text || "No response body"}`);
        }
        if (!contentType.includes("application/json")) {
          const text = await response.text();
          throw new Error(`Expected JSON response but received: ${text.slice(0, 300)}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Teams endpoint:", apiUrl);
        console.log("Teams fetched data:", data);
        setTeams(normalizeData(data));
        setError(null);
      })
      .catch((fetchError) => {
        console.error("Teams fetch error:", fetchError);
        setError(fetchError.message || "Fetch failed");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const filteredTeams = useMemo(() => {
    if (!search.trim()) return teams;
    const term = search.toLowerCase();
    return teams.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(term)
      )
    );
  }, [teams, search]);

  const columns = useMemo(() => pickColumns(filteredTeams), [filteredTeams]);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
        <div>
          <h2 className="h4 mb-1">Teams</h2>
          <p className="text-muted mb-0">Team records loaded from your backend API in a clean Bootstrap table.</p>
        </div>
        <div className="btn-toolbar">
          <button type="button" className="btn btn-outline-primary me-2" onClick={fetchTeams}>
            Refresh
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setModalData({ section: "Teams", data: filteredTeams })}>
            View raw JSON
          </button>
        </div>
      </div>
      <div className="card-body">
        <p className="small text-muted">Endpoint: {apiUrl}</p>
        <form className="row g-2 align-items-center mb-3" onSubmit={(evt) => evt.preventDefault()}>
          <div className="col-sm-8">
            <label htmlFor="teamsSearch" className="visually-hidden">
              Search teams
            </label>
            <input
              id="teamsSearch"
              className="form-control"
              placeholder="Filter teams"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="col-auto">
            <span className="text-muted">{filteredTeams.length} results</span>
          </div>
        </form>
        {error && <div className="alert alert-danger">{error}</div>}
        {isLoading ? (
          <div className="alert alert-info">Loading teams...</div>
        ) : filteredTeams.length === 0 ? (
          <div className="alert alert-warning">No teams available.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  {columns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((item, index) => (
                  <tr key={item.id || index} className="cursor-pointer" onClick={() => setModalData({ section: "Teams", data: item })}>
                    {columns.map((column) => (
                      <td key={column}>{renderCell(item, column)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalData && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-backdrop fade show"></div>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalData.section} JSON Preview</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setModalData(null)} />
              </div>
              <div className="modal-body">
                <pre className="small text-break" style={{ maxHeight: "40vh", overflowY: "auto" }}>
                  {JSON.stringify(modalData.data, null, 2)}
                </pre>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalData(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
