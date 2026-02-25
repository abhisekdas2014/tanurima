import { useState, useEffect } from "react";

export default function CalculatorModal({ show, onClose }) {
  const [value, setValue] = useState("0");

  const press = (v) => {
    setValue(prev => (prev === "0" ? String(v) : prev + v));
  };

  const clear = () => setValue("0");

  const calculate = () => {
    try {
      // eslint-disable-next-line no-eval
      setValue(String(eval(value)));
    } catch {
      alert("Invalid calculation");
    }
  };

  const backspace = () => {
    setValue(prev => (prev.length <= 1 ? "0" : prev.slice(0, -1)));
  };

  useEffect(() => {
    if (!show) return;

    const handleKey = (e) => {
      if (/[0-9]/.test(e.key)) press(e.key);
      if (["+", "-", "*", "/"].includes(e.key)) press(e.key);
      if (e.key === ".") press(".");
      if (e.key === "Enter") calculate();
      if (e.key === "Backspace") backspace();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [show, value]);

  // ✅ RETURN NULL ONLY AFTER HOOKS
  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ background: "#0008" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Calculator</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <input
              autoFocus
              className="form-control text-end fs-4 fw-bold mb-3"
              value={value}
              readOnly
            />

            <div className="row g-2">
              {["7","8","9","/","4","5","6","*","1","2","3","-","0",".","+","="]
                .map(k => (
                  <div className="col-3" key={k}>
                    <button
                      className={`btn w-100 ${k === "=" ? "btn-success" : "btn-light"}`}
                      onClick={() => k === "=" ? calculate() : press(k)}
                    >
                      {k}
                    </button>
                  </div>
                ))}
            </div>

            <button className="btn btn-danger w-100 mt-3" onClick={clear}>
              Clear
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
