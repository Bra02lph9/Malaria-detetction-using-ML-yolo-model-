import React, { useMemo, useState } from "react";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const legendItems = [
    { key: "red_blood_cell", label: "Red Blood Cell", className: "legendDot rbc" },
    { key: "leukocyte", label: "Leukocyte", className: "legendDot leukocyte" },
    { key: "trophozoite", label: "Trophozoite", className: "legendDot trophozoite" },
    { key: "ring", label: "Ring", className: "legendDot ring" },
    { key: "schizont", label: "Schizont", className: "legendDot schizont" },
    { key: "gametocyte", label: "Gametocyte", className: "legendDot gametocyte" },
  ];

  const classBadge = (name) => {
    const map = {
      red_blood_cell: "badge rbc",
      leukocyte: "badge leukocyte",
      trophozoite: "badge trophozoite",
      ring: "badge ring",
      schizont: "badge schizont",
      gametocyte: "badge gametocyte",
    };
    return map[name] || "badge";
  };

  const formatCellType = (name) => {
    const map = {
      red_blood_cell: "Red Blood Cell",
      leukocyte: "Leukocyte",
      trophozoite: "Trophozoite",
      ring: "Ring",
      schizont: "Schizont",
      gametocyte: "Gametocyte",
    };
    return map[name] || name.replaceAll("_", " ");
  };

  const getReliabilityLabel = (confidence) => {
    if (confidence >= 0.8) return "High";
    if (confidence >= 0.5) return "Medium";
    return "Low";
  };

  const sortedDetections = useMemo(() => {
    if (!result?.detections) return [];
    return [...result.detections].sort((a, b) => b.confidence - a.confidence);
  }, [result]);

  const totalInfected = useMemo(() => {
    if (!result?.counts) return 0;
    return (
      (result.counts.trophozoite || 0) +
      (result.counts.ring || 0) +
      (result.counts.schizont || 0) +
      (result.counts.gametocyte || 0)
    );
  }, [result]);

  const infectionRate = useMemo(() => {
    if (!result?.total_detections) return 0;
    return ((totalInfected / result.total_detections) * 100).toFixed(1);
  }, [result, totalInfected]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError("");
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError("Please choose an image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Prediction failed");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="hero">
        <div>
          <p className="eyebrow">Bioinformatics ML</p>
          <h1>Malaria Cell Analysis Dashboard</h1>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h2>Upload Image</h2>

          <label className="uploadBox">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <span>Select microscopy image</span>
          </label>

          <button className="predictBtn" onClick={handlePredict} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Image"}
          </button>

          {error && <div className="errorBox">{error}</div>}

          {previewUrl && (
            <div className="imageBlock">
              <div className="sectionHeader">
                <h3>Original Image</h3>
              </div>
              <img src={previewUrl} alt="preview" className="image" />
            </div>
          )}
        </div>

        <div className="card">
          <h2>Analysis Summary</h2>

          {!result && <p className="muted">Analysis results will appear here.</p>}

          {result && (
            <>
              <div className="stats">
                <div className="statCard">
                  <span>Total Cells Detected</span>
                  <strong>{result.total_detections}</strong>
                </div>

                <div className="statCard">
                  <span>Infected Cells</span>
                  <strong>{totalInfected}</strong>
                </div>

                <div className="statCard">
                  <span>Infection Rate</span>
                  <strong>{infectionRate}%</strong>
                </div>

                <div className="statCard">
                  <span>Leukocytes</span>
                  <strong>{result.counts?.leukocyte || 0}</strong>
                </div>
              </div>

              <div className="legendBar">
                {legendItems.map((item) => (
                  <div className="legendItem" key={item.key}>
                    <span className={item.className}></span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="imageBlock">
                <div className="sectionHeader">
                  <div>
                    <h3>Annotated Image</h3>
                    <p className="helperText">
                    </p>
                  </div>
                </div>

                <img src={result.image_url} alt="annotated result" className="image" />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card detectionsCard">
        <div className="sectionHeader">
          <div>
            <h2>Detection Details</h2>
            <p className="helperText">
            </p>
          </div>
        </div>

        {!result?.detections?.length ? (
          <p className="muted">No detections yet.</p>
        ) : (
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Cell Type</th>
                  <th>Reliability</th>
                </tr>
              </thead>
              <tbody>
                {sortedDetections.map((det, idx) => (
                  <tr key={idx}>
                    <td>
                      <span className={classBadge(det.class_name)}>
                        {formatCellType(det.class_name)}
                      </span>
                    </td>
                    <td>{getReliabilityLabel(det.confidence)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
