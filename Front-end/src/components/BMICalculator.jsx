import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";

function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: "Underweight", color: "#4fc3f7", tip: "Consider increasing caloric intake with nutrient-rich foods." };
  if (bmi < 25)   return { label: "Normal",      color: "#c6f135", tip: "Great job! Maintain your healthy lifestyle." };
  if (bmi < 30)   return { label: "Overweight",  color: "#ffa940", tip: "Light cardio and a balanced diet can help." };
  return           { label: "Obese",             color: "#ff4d4f", tip: "Consult a health professional for a tailored plan." };
}

function getNeedleAngle(bmi) {
  const clamped = Math.min(Math.max(bmi, 10), 40);
  return ((clamped - 10) / 30) * 180 - 90;
}

export default function BMICalculator() {
  const { state } = useApp();
  const [unit,   setUnit]   = useState("metric");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi,    setBmi]    = useState(null);
  const [result, setResult] = useState(null);

  function prefillFromProfile() {
    const u = state.user;
    if (u?.height) setHeight(u.height.replace(/[^0-9.]/g, ""));
    if (u?.weight) setWeight(u.weight.replace(/[^0-9.]/g, ""));
  }

  function calculate() {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w || h <= 0 || w <= 0) return;

    let bmiVal;
    if (unit === "metric") {
      const hm = h / 100;
      bmiVal = w / (hm * hm);
    } else {
      bmiVal = (703 * w) / (h * h);
    }

    bmiVal = parseFloat(bmiVal.toFixed(1));
    setBmi(bmiVal);
    setResult(getBMICategory(bmiVal));
  }

  function reset() {
    setHeight("");
    setWeight("");
    setBmi(null);
    setResult(null);
  }

  const needleAngle = bmi ? getNeedleAngle(bmi) : -90;

  const segments = [
    { color: "#4fc3f7", label: "< 18.5"  },
    { color: "#c6f135", label: "18.5–25" },
    { color: "#ffa940", label: "25–30"   },
    { color: "#ff4d4f", label: "> 30"    },
  ];

  return (
    <div className="card bmi-card">
      <div className="card__header">
        <h3>BMI Calculator</h3>
        <div className="bmi-toggle">
          <button
            className={`bmi-toggle__btn ${unit === "metric" ? "bmi-toggle__btn--active" : ""}`}
            onClick={() => { setUnit("metric"); reset(); }}
          >
            Metric
          </button>
          <button
            className={`bmi-toggle__btn ${unit === "imperial" ? "bmi-toggle__btn--active" : ""}`}
            onClick={() => { setUnit("imperial"); reset(); }}
          >
            Imperial
          </button>
        </div>
      </div>

      {/* Gauge */}
      <div className="bmi-gauge">
        <svg viewBox="0 0 200 110" className="bmi-gauge__svg">
          <path d="M 10,100 A 90,90 0 0,1 55,22"   fill="none" stroke="#4fc3f7" strokeWidth="14" strokeLinecap="round" />
          <path d="M 55,22 A 90,90 0 0,1 100,10"   fill="none" stroke="#c6f135" strokeWidth="14" strokeLinecap="round" />
          <path d="M 100,10 A 90,90 0 0,1 145,22"  fill="none" stroke="#ffa940" strokeWidth="14" strokeLinecap="round" />
          <path d="M 145,22 A 90,90 0 0,1 190,100" fill="none" stroke="#ff4d4f" strokeWidth="14" strokeLinecap="round" />

          <g
            transform={`translate(100,100) rotate(${needleAngle})`}
            style={{ transition: "transform 0.6s cubic-bezier(.34,1.56,.64,1)" }}
          >
            <line x1="0" y1="0" x2="0" y2="-72" stroke={result?.color || "#ccc"} strokeWidth="3" strokeLinecap="round" />
            <circle cx="0" cy="0" r="7" fill={result?.color || "#e0e0e0"} />
            <circle cx="0" cy="0" r="3" fill="#fff" />
          </g>

          {bmi ? (
            <text x="100" y="92" textAnchor="middle" fontSize="18" fontWeight="700" fill={result.color}>
              {bmi}
            </text>
          ) : (
            <text x="100" y="92" textAnchor="middle" fontSize="12" fill="#aaa">—</text>
          )}
        </svg>

        <div className="bmi-gauge__legend">
          {segments.map((s) => (
            <div key={s.label} className="bmi-gauge__legend-item">
              <span className="bmi-gauge__legend-dot" style={{ background: s.color }} />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="bmi-inputs">
        <div className="bmi-input-group">
          <label className="bmi-label">
            Height <small>({unit === "metric" ? "cm" : "inches"})</small>
          </label>
          <input
            className="bmi-input"
            type="number"
            placeholder={unit === "metric" ? "e.g. 170" : "e.g. 67"}
            value={height}
            min="1"
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>
        <div className="bmi-input-group">
          <label className="bmi-label">
            Weight <small>({unit === "metric" ? "kg" : "lbs"})</small>
          </label>
          <input
            className="bmi-input"
            type="number"
            placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
            value={weight}
            min="1"
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
      </div>

      {(state.user?.height || state.user?.weight) && !bmi && (
        <button className="bmi-prefill" onClick={prefillFromProfile}>
          ✨ Use my profile data
        </button>
      )}

      {result && (
        <div className="bmi-result" style={{ borderColor: result.color }}>
          <div className="bmi-result__top">
            <span className="bmi-result__label" style={{ color: result.color }}>
              {result.label}
            </span>
            <span className="bmi-result__value" style={{ color: result.color }}>
              BMI {bmi}
            </span>
          </div>
          <p className="bmi-result__tip">{result.tip}</p>
        </div>
      )}

      <div className="bmi-actions">
        <button className="btn btn--primary" onClick={calculate} style={{ flex: 1 }}>
          Calculate BMI
        </button>
        {bmi && (
          <button className="btn btn--outline" onClick={reset}>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
