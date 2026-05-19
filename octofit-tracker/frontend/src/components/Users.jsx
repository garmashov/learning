import { useEffect, useMemo, useState } from "react";

const endpoint = "users";
const codespaceName = import.meta.env.VITE_REACT_APP_CODESPACE_NAME || import.meta.env.REACT_APP_CODESPACE_NAME;
const apiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/${endpoint}/`
  : `/api/${endpoint}/`;

const normalizeData = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const pickColumns = (items) => {
  const preferred = ["id", "username", "email", "first_name", "last_name", "is_active"];
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

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalData, setModalData] = useState(null);

  const fetchUsers = () => {
    setIsLoading(true);
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log("Users endpoint:", apiUrl);
        console.log("Users fetched data:", data);
        setUsers(normalizeData(data));
        setError(null);
      })
      .catch((fetchError) => {
        console.error("Users fetch error:", fetchError);
        setError(fetchError.message || "Fetch failed");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const term = search.toLowerCase();
    return users.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(term)
      )
    );
  }, [users, search]);

  const columns = useMemo(() => pickColumns(filteredUsers), [filteredUsers]);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
        <div>
          <h2 className="h4 mb-1">Users</h2>
          <p className="text-muted mb-0">User profiles and account records from the backend REST API.</p>
        </div>
        <div className="btn-toolbar">
          <button type="button" className="btn btn-outline-primary me-2" onClick={fetchUsers}>
            Refresh
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setModalData({ section: "Users", data: filteredUsers })}>
            View raw JSON
          </button>
        </div>
      </div>
      <div className="card-body">
        <p className="small text-muted">Endpoint: {apiUrl}</p>
        <form className="row g-2 align-items-center mb-3" onSubmit={(evt) => evt.preventDefault()}>
          <div className="col-sm-8">
            <label htmlFor="usersSearch" className="visually-hidden">
              Search users
            </label>
            <input
              id="usersSearch"
              className="form-control"
              placeholder="Filter users"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="col-auto">
            <span className="text-muted">{filteredUsers.length} results</span>
          </div>
        </form>
        {error && <div className="alert alert-danger">{error}</div>}
        {isLoading ? (
          <div className="alert alert-info">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="alert alert-warning">No users available.</div>
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
                {filteredUsers.map((item, index) => (
                  <tr key={item.id || index} className="cursor-pointer" onClick={() => setModalData({ section: "Users", data: item })}>
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
