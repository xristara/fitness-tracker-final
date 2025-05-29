
import React, { useState } from 'react';

const initialPlan = {
  Monday: [
    { meal: 'Πρωινό', food: 'Αυγά (3) + Αβοκάντο', protein: 21, fat: 30, carbs: 3 },
    { meal: 'Μεσημεριανό', food: 'Κοτόπουλο (200g) + Σαλάτα', protein: 40, fat: 18, carbs: 5 },
    { meal: 'Βραδινό', food: 'Σολωμός (150g) + Μπρόκολο', protein: 30, fat: 15, carbs: 4 },
    { activity: 'Γυμναστήριο (βάρη)', burn: 600 }
  ],
  Tuesday: [
    { meal: 'Πρωινό', food: 'Ομελέτα με μανιτάρια', protein: 25, fat: 22, carbs: 4 },
    { meal: 'Μεσημεριανό', food: 'Μοσχάρι + Σπανάκι', protein: 45, fat: 20, carbs: 4 },
    { meal: 'Βραδινό', food: 'Τόνος + ντομάτα', protein: 28, fat: 12, carbs: 5 },
    { activity: 'Περπάτημα 60λ', burn: 300 }
  ]
};

function kcal(p, f, c) {
  return p * 4 + f * 9 + c * 4;
}

function calculateBMI(weight, height) {
  if (!weight || !height) return '';
  const bmi = weight / (height * height);
  return bmi.toFixed(1);
}

export default function App() {
  const [plan, setPlan] = useState(initialPlan);
  const [weights, setWeights] = useState({});
  const [height, setHeight] = useState(1.7);

  const handleChange = (day, idx, field, value) => {
    const updated = { ...plan };
    updated[day][idx][field] = ['protein', 'fat', 'carbs', 'burn'].includes(field)
      ? parseInt(value) || 0
      : value;
    setPlan(updated);
  };

  const handleWeightChange = (day, value) => {
    setWeights({ ...weights, [day]: value });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>📅 Εβδομαδιαίο Πλάνο Διατροφής & BMI</h1>

      <div style={{ marginBottom: '20px' }}>
        <label><strong>Ύψος (σε μέτρα):</strong> </label>
        <input
          type="number"
          step="0.01"
          value={height}
          onChange={e => setHeight(parseFloat(e.target.value))}
        />
      </div>

      {Object.entries(plan).map(([day, items]) => {
        let totalP = 0, totalF = 0, totalC = 0, burn = 0;

        items.forEach(entry => {
          if (entry.meal) {
            totalP += entry.protein;
            totalF += entry.fat;
            totalC += entry.carbs;
          } else if (entry.activity) {
            burn += entry.burn;
          }
        });

        const totalKcal = kcal(totalP, totalF, totalC);
        const netKcal = totalKcal - burn;
        const weight = weights[day];
        const bmi = calculateBMI(weight, height);

        return (
          <div key={day} style={{ marginBottom: '40px' }}>
            <h2>{day}</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#eee' }}>
                  <th>Γεύμα</th>
                  <th>Περιγραφή</th>
                  <th>Πρ.</th>
                  <th>Λίπ.</th>
                  <th>Υδ.</th>
                  <th>Θερμ.</th>
                </tr>
              </thead>
              <tbody>
                {items.map((entry, idx) =>
                  entry.meal ? (
                    <tr key={idx}>
                      <td><input value={entry.meal} onChange={e => handleChange(day, idx, 'meal', e.target.value)} /></td>
                      <td><input value={entry.food} onChange={e => handleChange(day, idx, 'food', e.target.value)} /></td>
                      <td><input type="number" value={entry.protein} onChange={e => handleChange(day, idx, 'protein', e.target.value)} /></td>
                      <td><input type="number" value={entry.fat} onChange={e => handleChange(day, idx, 'fat', e.target.value)} /></td>
                      <td><input type="number" value={entry.carbs} onChange={e => handleChange(day, idx, 'carbs', e.target.value)} /></td>
                      <td>{kcal(entry.protein, entry.fat, entry.carbs)}</td>
                    </tr>
                  ) : (
                    <tr key={idx}>
                      <td colSpan="5">{entry.activity}</td>
                      <td><input type="number" value={entry.burn} onChange={e => handleChange(day, idx, 'burn', e.target.value)} /></td>
                    </tr>
                  )
                )}
                <tr style={{ background: '#f0f0f0', fontWeight: 'bold' }}>
                  <td colSpan="5">Σύνολο Θερμίδων</td>
                  <td>{totalKcal}</td>
                </tr>
                {burn > 0 && (
                  <>
                    <tr style={{ color: 'green' }}>
                      <td colSpan="5">Κατανάλωση θερμίδων</td>
                      <td>-{burn}</td>
                    </tr>
                    <tr style={{ background: '#e0ffe0', fontWeight: 'bold' }}>
                      <td colSpan="5">Καθαρό θερμιδικό ισοζύγιο</td>
                      <td>{netKcal}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
            <div style={{ marginTop: '10px' }}>
              <label>⚖️ Βάρος σώματος (kg): </label>
              <input
                type="number"
                value={weight || ''}
                onChange={e => handleWeightChange(day, e.target.value)}
              />
              {bmi && <span style={{ marginLeft: '20px' }}>📈 BMI: <strong>{bmi}</strong></span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
