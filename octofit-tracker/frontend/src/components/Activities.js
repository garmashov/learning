import { useEffect, useMemo, useState } from "react";

const endpoint = "activities";
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
  const preferred = ["id", "name", "type", "duration", "distance", "date", "created", "status"];
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

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalData, setModalData] = useState(null);

  const fetchActivities = () => {
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
        console.log("Activities endpoint:", apiUrl);
        console.log("Activities fetched data:", data);
        setActivities(normalizeData(data));
        setError(null);
      })
      .catch((fetchError) => {
        console.error("Activities fetch error:", fetchError);
        setError(fetchError.message || "Fetch failed");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const filteredActivities = useMemo(() => {
    if (!search.trim()) return activities;
    const term = search.toLowerCase();
    return activities.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(term)
      )
    );
  }, [activities, search]);

  const columns = useMemo(() => pickColumns(filteredActivities), [filteredActivities]);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
        <div>
          <h2 className="h4 mb-1">Activities</h2>
          <p className="text-muted mb-0">Live activity records pulled from your backend REST API.</p>
        </div>
        <div className="btn-toolbar">
          <button type="button" className="btn btn-outline-primary me-2" onClick={fetchActivities}>
            Refresh
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setModalData({ section: "Activities", data: filteredActivities })}>
            View raw JSON
          </button>
        </div>
      </div>
      <div className="card-body">
        <p className="small text-muted">Endpoint: {apiUrl}</p>
        <form className="row g-2 align-items-center mb-3" onSubmit={(evt) => evt.preventDefault()}>
          <div className="col-sm-8">
            <label htmlFor="activitiesSearch" className="visually-hidden">
              Search activities
            </label>
            <input
              id="activitiesSearch"
              className="form-control"
              placeholder="Filter activities"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="col-auto">
            <span className="text-muted">{filteredActivities.length} results</span>
          </div>
        </form>
        {error && <div className="alert alert-danger">{error}</div>}
        {isLoading ? (
          <div className="alert alert-info">Loading activities...</div>
        ) : filteredActivities.length === 0 ? (
          <div className="alert alert-warning">No activities found.</div>
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
                {filteredActivities.map((item, index) => (
                  <tr key={item.id || index} className="cursor-pointer" onClick={() => setModalData({ section: "Activities", data: item })}>
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
