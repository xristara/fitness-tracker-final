import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer
} from 'recharts';

const initialPlan = {
  Monday: [
    { meal: 'Πρωιν?', food: 'Αυγ? (3) + Αβοκ?ντο', protein: 21, fat: 30, carbs: 3 },
    { meal: 'Σνακ 1', food: 'Γιαο?ρτι + καρ?δια', protein: 10, fat: 10, carbs: 5 },
    { meal: 'Μεσημεριαν?', food: 'Κοτ?πουλο (200g) + Σαλ?τα', protein: 40, fat: 18, carbs: 5 },
    { meal: 'Σνακ 2', food: 'Μπαν?να', protein: 1, fat: 0, carbs: 20 },
    { meal: 'Βραδιν?', food: 'Σολωμ?? (150g) + Μπρ?κολο', protein: 30, fat: 15, carbs: 4 },
    { activity: 'Γυμναστ?ριο (β?ρη)', burn: 600 }
  ],
  Tuesday: [
    { meal: 'Πρωιν?', food: 'Ομελ?τα με μανιτ?ρια', protein: 25, fat: 22, carbs: 4 },
    { meal: 'Σνακ 1', food: 'Αμ?γδαλα', protein: 6, fat: 14, carbs: 6 },
    { meal: 'Μεσημεριαν?', food: 'Μοσχ?ρι + Σπαν?κι', protein: 45, fat: 20, carbs: 4 },
    { meal: 'Σνακ 2', food: 'Μ?λο', protein: 0, fat: 0, carbs: 20 },
    { meal: 'Βραδιν?', food: 'Τ?νο? + ντομ?τα', protein: 28, fat: 12, carbs: 5 },
    { activity: 'Περπ?τημα 60λ', burn: 300 }
  ],
  Wednesday: [
    { meal: 'Πρωιν?', food: 'Βρ?μη με γ?λα', protein: 12, fat: 8, carbs: 30 },
    { meal: 'Σνακ 1', food: 'Ρυζογκοφρ?τε? + φυστικοβο?τυρο', protein: 6, fat: 10, carbs: 15 },
    { meal: 'Μεσημεριαν?', food: 'Ψ?ρι + λαχανικ?', protein: 35, fat: 14, carbs: 6 },
    { meal: 'Σνακ 2', food: 'Σμο?θι φρο?των', protein: 2, fat: 0, carbs: 25 },
    { meal: 'Βραδιν?', food: 'Γαλοπο?λα + κολοκ?θι', protein: 28, fat: 10, carbs: 3 },
    { activity: 'Τρ?ξιμο 30λ', burn: 400 }
  ],
  Thursday: [
    { meal: 'Πρωιν?', food: 'Τ?στ με αυγ?', protein: 18, fat: 14, carbs: 20 },
    { meal: 'Σνακ 1', food: 'Μπ?ρα πρωτε?νη?', protein: 15, fat: 7, carbs: 12 },
    { meal: 'Μεσημεριαν?', food: 'Κιμ?? με ρ?ζι', protein: 40, fat: 18, carbs: 35 },
    { meal: 'Σνακ 2', food: 'Καρ?τα + χο?μου?', protein: 2, fat: 5, carbs: 10 },
    { meal: 'Βραδιν?', food: 'Αυγ? + σαλ?τα', protein: 20, fat: 18, carbs: 3 },
    { activity: 'Γι?γκα 45λ', burn: 250 }
  ],
  Friday: [
    { meal: 'Πρωιν?', food: 'Σαλ?τα με τ?νο', protein: 25, fat: 12, carbs: 6 },
    { meal: 'Σνακ 1', food: 'Φρο?τα εποχ??', protein: 1, fat: 0, carbs: 18 },
    { meal: 'Μεσημεριαν?', food: 'Στ?θο? κοτ?πουλο + πουρ??', protein: 40, fat: 12, carbs: 30 },
    { meal: 'Σνακ 2', food: 'Γιαο?ρτι + μ?λι', protein: 10, fat: 4, carbs: 20 },
    { meal: 'Βραδιν?', food: 'Ομελ?τα με λαχανικ?', protein: 22, fat: 15, carbs: 5 },
    { activity: 'Περπ?τημα 45λ', burn: 250 }
  ],
  Saturday: [
    { meal: 'Πρωιν?', food: 'Αυγ? + κασ?ρι', protein: 20, fat: 20, carbs: 1 },
    { meal: 'Σνακ 1', food: 'Σμο?θι με σπαν?κι', protein: 4, fat: 2, carbs: 10 },
    { meal: 'Μεσημεριαν?', food: 'Σουβλ?κια κοτ?πουλο + πατ?τε? φο?ρνου', protein: 35, fat: 18, carbs: 30 },
    { meal: 'Σνακ 2', food: 'Ξηρο? καρπο?', protein: 6, fat: 12, carbs: 8 },
    { meal: 'Βραδιν?', food: 'Ψητ? λαχανικ? + φ?τα', protein: 15, fat: 14, carbs: 6 },
    { activity: 'Ξεκο?ραση', burn: 0 }
  ],
  Sunday: [
    { meal: 'Πρωιν?', food: 'Πανκ?ικ? βρ?μη?', protein: 15, fat: 10, carbs: 35 },
    { meal: 'Σνακ 1', food: 'Χυμ?? πορτοκ?λι', protein: 1, fat: 0, carbs: 22 },
    { meal: 'Μεσημεριαν?', food: 'Λαδερ? + φ?τα', protein: 20, fat: 18, carbs: 20 },
    { meal: 'Σνακ 2', food: 'Γλυκ? με stevia', protein: 2, fat: 5, carbs: 15 },
    { meal: 'Βραδιν?', food: 'Τονοσαλ?τα', protein: 25, fat: 10, carbs: 3 },
    { activity: 'Περπ?τημα ελαφρ?', burn: 150 }
  ]
};

function kcal(p, f, c) {
  return p * 4 + f * 9 + c * 4;
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

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return '';
    const bmi = weight / (height * height);
    return bmi.toFixed(1);
  };

  const weeklySummary = Object.entries(plan).map(([day, items]) => {
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

    return {
      day,
      protein: totalP * 4,
      fat: totalF * 9,
      carbs: totalC * 4,
      netCalories: netKcal
    };
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>? Εβδομαδια?ο Πλ?νο Διατροφ?? & BMI</h1>

      <h2 style={{ textAlign: 'center', marginTop: '40px' }}>? Εβδομαδια?α Αναφορ? Θερμ?δων</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={weeklySummary} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="netCalories" fill="#82ca9d" name="Καθαρ?? Θερμ?δε?" />
          <Bar dataKey="protein" fill="#8884d8" name="Πρωτε?νη (kcal)" />
          <Bar dataKey="fat" fill="#ffbb28" name="Λ?πο? (kcal)" />
          <Bar dataKey="carbs" fill="#ff8042" name="Υδατ?νθρακε? (kcal)" />
        </BarChart>
      </ResponsiveContainer>

      <div style={{ marginBottom: '20px', marginTop: '20px' }}>
        <label><strong>?ψο? (σε μ?τρα):</strong> </label>
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
                  <th>Γε?μα</th>
                  <th>Περιγραφ?</th>
                  <th>Πρ.</th>
                  <th>Λ?π.</th>
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
                  <td colSpan="5">Σ?νολο Θερμ?δων</td>
                  <td>{totalKcal}</td>
                </tr>
                {burn > 0 && (
                  <>
                    <tr style={{ color: 'green' }}>
                      <td colSpan="5">Καταν?λωση θερμ?δων</td>
                      <td>-{burn}</td>
                    </tr>
                    <tr style={{ background: '#e0ffe0', fontWeight: 'bold' }}>
                      <td colSpan="5">Καθαρ? θερμιδικ? ισοζ?γιο</td>
                      <td>{netKcal}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
            <div style={{ marginTop: '10px' }}>
              <label>?? Β?ρο? σ?ματο? (kg): </label>
              <input
                type="number"
                value={weight || ''}
                onChange={e => handleWeightChange(day, e.target.value)}
              />
              {bmi && <span style={{ marginLeft: '20px' }}>? BMI: <strong>{bmi}</strong></span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
