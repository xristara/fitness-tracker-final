﻿import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer
} from 'recharts';

const initialPlan = {
  Monday: [
    { meal: 'Πρωινό', food: 'Αυγά (3) + Αβοκάντο', protein: 21, fat: 30, carbs: 3 },
    { meal: 'Σνακ 1', food: 'Γιαούρτι + καρύδια', protein: 10, fat: 10, carbs: 5 },
    { meal: 'Μεσημεριανό', food: 'Κοτόπουλο (200g) + Σαλάτα', protein: 40, fat: 18, carbs: 5 },
    { meal: 'Σνακ 2', food: 'Μπανάνα', protein: 1, fat: 0, carbs: 20 },
    { meal: 'Βραδινό', food: 'Σολομός (150g) + Μπρόκολο', protein: 30, fat: 15, carbs: 4 },
    { activity: 'Γυμναστήριο (βάρη)', burn: 600 }
  ],
  Tuesday: [
    { meal: 'Πρωινό', food: 'Ομελέτα με μανιτάρια', protein: 25, fat: 22, carbs: 4 },
    { meal: 'Σνακ 1', food: 'Αμύγδαλα', protein: 6, fat: 14, carbs: 6 },
    { meal: 'Μεσημεριανό', food: 'Μοσχάρι + Σπανάκι', protein: 45, fat: 20, carbs: 4 },
    { meal: 'Σνακ 2', food: 'Μήλο', protein: 0, fat: 0, carbs: 20 },
    { meal: 'Βραδινό', food: 'Τόνος + ντομάτα', protein: 28, fat: 12, carbs: 5 },
    { activity: 'Περπάτημα 60λ', burn: 300 }
  ],
  Wednesday: [
    { meal: 'Πρωινό', food: 'Βρώμη με γάλα', protein: 12, fat: 8, carbs: 30 },
    { meal: 'Σνακ 1', food: 'Ρυζογκοφρέτες + φυστικοβούτυρο', protein: 6, fat: 10, carbs: 15 },
    { meal: 'Μεσημεριανό', food: 'Ψάρι + λαχανικά', protein: 35, fat: 14, carbs: 6 },
    { meal: 'Σνακ 2', food: 'Σμούθι φρούτων', protein: 2, fat: 0, carbs: 25 },
    { meal: 'Βραδινό', food: 'Γαλοπούλα + κολοκύθι', protein: 28, fat: 10, carbs: 3 },
    { activity: 'Τρέξιμο 30λ', burn: 400 }
  ],
  Thursday: [
    { meal: 'Πρωινό', food: 'Τοστ με αυγό', protein: 18, fat: 14, carbs: 20 },
    { meal: 'Σνακ 1', food: 'Μπάρα πρωτεΐνης', protein: 15, fat: 7, carbs: 12 },
    { meal: 'Μεσημεριανό', food: 'Κιμάς με ρύζι', protein: 40, fat: 18, carbs: 35 },
    { meal: 'Σνακ 2', food: 'Καρότα + χούμους', protein: 2, fat: 5, carbs: 10 },
    { meal: 'Βραδινό', food: 'Αυγά + σαλάτα', protein: 20, fat: 18, carbs: 3 },
    { activity: 'Γιόγκα 45λ', burn: 250 }
  ],
  Friday: [
    { meal: 'Πρωινό', food: 'Σαλάτα με τόνο', protein: 25, fat: 12, carbs: 6 },
    { meal: 'Σνακ 1', food: 'Φρούτα εποχής', protein: 1, fat: 0, carbs: 18 },
    { meal: 'Μεσημεριανό', food: 'Στήθος κοτόπουλο + πουρές', protein: 40, fat: 12, carbs: 30 },
    { meal: 'Σνακ 2', food: 'Γιαούρτι + μέλι', protein: 10, fat: 4, carbs: 20 },
    { meal: 'Βραδινό', food: 'Ομελέτα με λαχανικά', protein: 22, fat: 15, carbs: 5 },
    { activity: 'Περπάτημα 45λ', burn: 250 }
  ],
  Saturday: [
    { meal: 'Πρωινό', food: 'Αυγά + κασέρι', protein: 20, fat: 20, carbs: 1 },
    { meal: 'Σνακ 1', food: 'Σμούθι με σπανάκι', protein: 4, fat: 2, carbs: 10 },
    { meal: 'Μεσημεριανό', food: 'Σουβλάκια κοτόπουλο + πατάτες φούρνου', protein: 35, fat: 18, carbs: 30 },
    { meal: 'Σνακ 2', food: 'Ξηροί καρποί', protein: 6, fat: 12, carbs: 8 },
    { meal: 'Βραδινό', food: 'Ψητά λαχανικά + φέτα', protein: 15, fat: 14, carbs: 6 },
    { activity: 'Ξεκούραση', burn: 0 }
  ],
  Sunday: [
    { meal: 'Πρωινό', food: 'Πανκέικς βρώμης', protein: 15, fat: 10, carbs: 35 },
    { meal: 'Σνακ 1', food: 'Χυμός πορτοκάλι', protein: 1, fat: 0, carbs: 22 },
    { meal: 'Μεσημεριανό', food: 'Λαδερό + φέτα', protein: 20, fat: 18, carbs: 20 },
    { meal: 'Σνακ 2', food: 'Γλυκό με stevia', protein: 2, fat: 5, carbs: 15 },
    { meal: 'Βραδινό', food: 'Τονοσαλάτα', protein: 25, fat: 10, carbs: 3 },
    { activity: 'Περπάτημα ελαφρύ', burn: 150 }
  ]
};

function kcal(p, f, c) {
  return p * 4 + f * 9 + c * 4;
}

export default function App() {
  const [plan, setPlan] = useState(initialPlan);
  const [weights, setWeights] = useState({});

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
      <h1 style={{ textAlign: 'center' }}>📊 Εβδομαδιαίο Πλάνο Διατροφής & Βάρους</h1>
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
          <div key={day} style={{ marginBottom: '40px' }}>
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
              <label>Βάρος σώματος (kg): </label>
              <input
                type="number"
                value={weights[day] || ''}
                onChange={e => handleWeightChange(day, e.target.value)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

