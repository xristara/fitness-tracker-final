import React, { useState } from 'react';

const defaultPlan = {
  Monday: [
    { meal: 'Πρωινό', food: 'Αυγά (3) + Αβοκάντο (1/2)', protein: 21, fat: 30, carbs: 3 },
    { meal: 'Μεσημεριανό', food: 'Κοτόπουλο (200g) + Σαλάτα', protein: 40, fat: 18, carbs: 5 },
    { meal: 'Βραδινό', food: 'Σολωμός (150g) + Μπρόκολο', protein: 30, fat: 15, carbs: 4 },
    { activity: 'Γυμναστήριο (βάρη)', burn: 600 }
  ],
  Tuesday: [
    { meal: 'Πρωινό', food: 'Ομελέτα + τυρί & μανιτάρια', protein: 25, fat: 22, carbs: 4 },
    { meal: 'Μεσημεριανό', food: 'Μοσχάρι + Σπανάκι', protein: 45, fat: 20, carbs: 4 },
    { meal: 'Βραδινό', food: 'Τόνος + αγγουροντομάτα', protein: 28, fat: 12, carbs: 5 },
    { activity: 'Περπάτημα 60λ', burn: 300 }
  ]
};

function kcal(p, f, c) {
  return p * 4 + f * 9 + c * 4;
}

export default function App() {
  const [plan, setPlan] = useState(defaultPlan);

  const handleChange = (day, idx, field, value) => {
    const updated = { ...plan };
    updated[day][idx][field] = field === 'protein' || field === 'fat' || field === 'carbs' || field === 'burn'
      ? parseInt(value) || 0
      : value;
    setPlan(updated);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>💪 Πλάνο Διατροφής & Ενεργειακή Κατανάλωση</h1>
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

        return (
          <div key={day} style={{ marginTop: '30px' }}>
            <h2>{day}</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#eee' }}>
                  <th>Γεύμα</th>
                  <th>Περιγραφή</th>
                  <th>Πρωτεΐνη</th>
                  <th>Λίπος</th>
                  <th>Υδατ.</th>
                  <th>Θερμίδες</th>
                </tr>
              </thead>
              <tbody>
                {items.map((entry, idx) => entry.meal ? (
                  <tr key={idx}>
                    <td>
                      <input value={entry.meal} onChange={e => handleChange(day, idx, 'meal', e.target.value)} />
                    </td>
                    <td>
                      <input value={entry.food} onChange={e => handleChange(day, idx, 'food', e.target.value)} />
                    </td>
                    <td><input type="number" value={entry.protein} onChange={e => handleChange(day, idx, 'protein', e.target.value)} /></td>
                    <td><input type="number" value={entry.fat} onChange={e => handleChange(day, idx, 'fat', e.target.value)} /></td>
                    <td><input type="number" value={entry.carbs} onChange={e => handleChange(day, idx, 'carbs', e.target.value)} /></td>
                    <td>{kcal(entry.protein, entry.fat, entry.carbs)}</td>
                  </tr>
                ) : (
                  <tr key={idx}>
                    <td colSpan="5">
                      {entry.activity}
                    </td>
                    <td>
                      <input type="number" value={entry.burn} onChange={e => handleChange(day, idx, 'burn', e.target.value)} />
                    </td>
                  </tr>
                ))}
                <tr style={{ fontWeight: 'bold', background: '#f9f9f9' }}>
                  <td colSpan="5">Σύνολο Θερμίδων</td>
                  <td>{totalKcal}</td>
                </tr>
                {burn > 0 && (
                  <>
                    <tr style={{ color: 'green' }}>
                      <td colSpan="5">Κατανάλωση θερμίδων</td>
                      <td>-{burn}</td>
                    </tr>
                    <tr style={{ fontWeight: 'bold', background: '#e0ffe0' }}>
                      <td colSpan="5">Καθαρό θερμιδικό σύνολο</td>
                      <td>{netKcal}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
