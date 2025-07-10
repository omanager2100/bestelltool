import { useState } from "react";
import "./App.css";

function App() {
  const [rows, setRows] = useState([{ artikelnummer: "", menge: "", einheit: "Stück", bezeichnung: "" }]);
  const einheiten = ["Stück", "VE", "kg"];

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;

    // Dummy: Bezeichnung aus Artikelnummer ergänzen (später via Backend!)
    if (field === "artikelnummer") {
      updated[index].bezeichnung = value === "760-01" ? "Lisa" : "";
    }

    setRows(updated);
  };

  const addRow = () => {
    if (rows.length % 5 === 0) {
      setRows([...rows, { artikelnummer: "", menge: "", einheit: "Stück", bezeichnung: "" }]);
    }
  };

  return (
    <div className="App">
      <h2>Bestellformular</h2>
      <table>
        <thead>
          <tr>
            <th>Artikelnummer</th>
            <th>Bezeichnung</th>
            <th>Menge</th>
            <th>Einheit</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              <td>
                <input
                  type="text"
                  value={row.artikelnummer}
                  onChange={(e) => handleChange(idx, "artikelnummer", e.target.value)}
                  onBlur={addRow}
                />
              </td>
              <td><strong>{row.bezeichnung}</strong></td>
              <td>
                <input
                  type="number"
                  value={row.menge}
                  onChange={(e) => handleChange(idx, "menge", e.target.value)}
                />
              </td>
              <td>
                <select
                  value={row.einheit}
                  onChange={(e) => handleChange(idx, "einheit", e.target.value)}
                >
                  {einheiten.map((e) => <option key={e}>{e}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
