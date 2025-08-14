export default function Footer() {
    return (
      <footer
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px 0",
          textAlign: "center",
          fontSize: "0.9rem",
          borderTop: "1px solid #ddd",
          marginTop: "40px",
        }}
      >
        <div style={{ marginBottom: "8px" }}>
          <img
            src="/TMDB_logo/TMDB.jpg"
            alt="TMDB Logo"
            style={{ height: "30px", marginRight: "8px", verticalAlign: "middle" }}
          />
        </div>
        <p style={{ margin: 0, color: "#6c757d" }}>
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </footer>
    );
  }