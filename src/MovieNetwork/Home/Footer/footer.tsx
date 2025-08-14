import { Button } from "react-bootstrap";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#f8f9fa",
        padding: "20px 0",
        fontSize: "0.9rem",
        borderTop: "1px solid #ddd",
        marginTop: "40px",
      }}
    >
      <div style={{ marginBottom: "8px" }} className="text-center">
        <img
          src="/TMDB_logo/TMDB.jpg"
          alt="TMDB Logo"
          style={{ height: "30px", marginRight: "8px", verticalAlign: "middle" }}
        />
      </div>
      <p style={{ margin: 0, color: "#6c757d" }} className="text-center">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
      <div className="ms-3 d-flex justify-content-between align-items-center">
        <small style={{ margin: 0, color: "#6c757d" }}>
          © {new Date().getFullYear()} Movify. All rights reserved. <br />
          Development Team: Junyao HAN, Qiuzi WU, Jiaming PEI, Runyuan FENG
        </small>
        <div>
          <Button variant="link" className="p-0">
            <a href="https://github.com/NEU-CS5610-Final-Project/Social-Network-Demo-Project" style={{ color: "#6c757d" }} className="me-2"><small>React Project</small></a>
          </Button>
          <Button variant="link" className="p-0">
            <a href="https://github.com/NEU-CS5610-Final-Project/Social-Network-Demo-Remote-Server" style={{ color: "#6c757d" }} className="me-2"><small>Server Project</small></a>
          </Button>
        </div>
      </div>
    </footer>
  );
}