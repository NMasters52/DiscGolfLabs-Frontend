import { useGameSessions } from "../../queries/useGameSession";

export function PuttingProgressView({ gameSlug, courseId }) {
  const {
    data: sessions,
    isLoading,
    error,
  } = useGameSessions(gameSlug, courseId);

  if (isLoading) return <div>Loading your progress...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!sessions?.length)
    return <div>No sessions yet. Play your first game!</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Your Putting Progress</h2>
      <p>Total Sessions: {sessions.length}</p>

      {sessions.map((session, idx) => (
        <div
          key={session.id}
          style={{
            marginBottom: "2rem",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h3>
            Session {idx + 1}
            {session.dayNumber && ` • Day ${session.dayNumber}`}
          </h3>

          <p>
            <strong>Max Distance:</strong> {session.maxDistanceFt}ft
          </p>
          <p>
            <strong>Duration:</strong>{" "}
            {Math.floor(session.durationSeconds / 60)}m{" "}
            {session.durationSeconds % 60}s
          </p>
          <p>
            <strong>Overall:</strong> {session.overall.made}/
            {session.overall.attempted}({session.overall.percentage}%)
          </p>

          <h4>Performance by Distance:</h4>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {Object.entries(session.distanceStats)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([distance, stats]) => (
                <div
                  key={distance}
                  style={{ display: "flex", gap: "1rem", alignItems: "center" }}
                >
                  <span style={{ fontWeight: "bold", width: "40px" }}>
                    {distance}ft:
                  </span>
                  <span style={{ width: "120px" }}>
                    {stats.made}/{stats.attempted} ({stats.percentage}%)
                  </span>
                  <progress
                    value={stats.percentage}
                    max="100"
                    style={{ flex: 1 }}
                  />
                </div>
              ))}
          </div>

          <p
            style={{ fontSize: "0.875rem", color: "#666", marginTop: "0.5rem" }}
          >
            {new Date(session.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
