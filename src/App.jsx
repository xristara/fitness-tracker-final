import React, { useState } from 'react';

const initialPlan = {
  Monday: [
    { meal: '¦°¦Ñ¦Ø¦É¦Í?', food: '¦¡¦Ô¦Ã? (3) + ¦¡¦Â¦Ï¦Ê?¦Í¦Ó¦Ï', protein: 21, fat: 30, carbs: 3 },
    { meal: '¦²¦Í¦Á¦Ê 1', food: '¦£¦É¦Á¦Ï?¦Ñ¦Ó¦É + ¦Ê¦Á¦Ñ?¦Ä¦É¦Á', protein: 10, fat: 10, carbs: 5 },
    { meal: '¦¬¦Å¦Ò¦Ç¦Ì¦Å¦Ñ¦É¦Á¦Í?', food: '¦ª¦Ï¦Ó?¦Ð¦Ï¦Ô¦Ë¦Ï (200g) + ¦²¦Á¦Ë?¦Ó¦Á', protein: 40, fat: 18, carbs: 5 },
    { meal: '¦²¦Í¦Á¦Ê 2', food: '¦¬¦Ð¦Á¦Í?¦Í¦Á', protein: 1, fat: 0, carbs: 20 },
    { meal: '¦¢¦Ñ¦Á¦Ä¦É¦Í?', food: '¦²¦Ï¦Ë¦Ø¦Ì?? (150g) + ¦¬¦Ð¦Ñ?¦Ê¦Ï¦Ë¦Ï', protein: 30, fat: 15, carbs: 4 },
    { activity: '¦£¦Ô¦Ì¦Í¦Á¦Ò¦Ó?¦Ñ¦É¦Ï (¦Â?¦Ñ¦Ç)', burn: 600 }
  ],
  Tuesday: [
    { meal: '¦°¦Ñ¦Ø¦É¦Í?', food: '¦¯¦Ì¦Å¦Ë?¦Ó¦Á ¦Ì¦Å ¦Ì¦Á¦Í¦É¦Ó?¦Ñ¦É¦Á', protein: 25, fat: 22, carbs: 4 },
    { meal: '¦²¦Í¦Á¦Ê 1', food: '¦¡¦Ì?¦Ã¦Ä¦Á¦Ë¦Á', protein: 6, fat: 14, carbs: 6 },
    { meal: '¦¬¦Å¦Ò¦Ç¦Ì¦Å¦Ñ¦É¦Á¦Í?', food: '¦¬¦Ï¦Ò¦Ö?¦Ñ¦É + ¦²¦Ð¦Á¦Í?¦Ê¦É', protein: 45, fat: 20, carbs: 4 },
    { meal: '¦²¦Í¦Á¦Ê 2', food: '¦¬?¦Ë¦Ï', protein: 0, fat: 0, carbs: 20 },
    { meal: '¦¢¦Ñ¦Á¦Ä¦É¦Í?', food: '¦³?¦Í¦Ï? + ¦Í¦Ó¦Ï¦Ì?¦Ó¦Á', protein: 28, fat: 12, carbs: 5 },
    { activity: '¦°¦Å¦Ñ¦Ð?¦Ó¦Ç¦Ì¦Á 60¦Ë', burn: 300 }
  ],
  Wednesday: [
    { meal: '¦°¦Ñ¦Ø¦É¦Í?', food: '¦¢¦Ñ?¦Ì¦Ç ¦Ì¦Å ¦Ã?¦Ë¦Á', protein: 12, fat: 8, carbs: 30 },
    { meal: '¦²¦Í¦Á¦Ê 1', food: '¦±¦Ô¦Æ¦Ï¦Ã¦Ê¦Ï¦Õ¦Ñ?¦Ó¦Å? + ¦Õ¦Ô¦Ò¦Ó¦É¦Ê¦Ï¦Â¦Ï?¦Ó¦Ô¦Ñ¦Ï', protein: 6, fat: 10, carbs: 15 },
    { meal: '¦¬¦Å¦Ò¦Ç¦Ì¦Å¦Ñ¦É¦Á¦Í?', food: '¦·?¦Ñ¦É + ¦Ë¦Á¦Ö¦Á¦Í¦É¦Ê?', protein: 35, fat: 14, carbs: 6 },
    { meal: '¦²¦Í¦Á¦Ê 2', food: '¦²¦Ì¦Ï?¦È¦É ¦Õ¦Ñ¦Ï?¦Ó¦Ø¦Í', protein: 2, fat: 0, carbs: 25 },
    { meal: '¦¢¦Ñ¦Á¦Ä¦É¦Í?', food: '¦£¦Á¦Ë¦Ï¦Ð¦Ï?¦Ë¦Á + ¦Ê¦Ï¦Ë¦Ï¦Ê?¦È¦É', protein: 28, fat: 10, carbs: 3 },
    { activity: '¦³¦Ñ?¦Î¦É¦Ì¦Ï 30¦Ë', burn: 400 }
  ],
  Thursday: [
    { meal: '¦°¦Ñ¦Ø¦É¦Í?', food: '¦³?¦Ò¦Ó ¦Ì¦Å ¦Á¦Ô¦Ã?', protein: 18, fat: 14, carbs: 20 },
    { meal: '¦²¦Í¦Á¦Ê 1', food: '¦¬¦Ð?¦Ñ¦Á ¦Ð¦Ñ¦Ø¦Ó¦Å?¦Í¦Ç?', protein: 15, fat: 7, carbs: 12 },
    { meal: '¦¬¦Å¦Ò¦Ç¦Ì¦Å¦Ñ¦É¦Á¦Í?', food: '¦ª¦É¦Ì?? ¦Ì¦Å ¦Ñ?¦Æ¦É', protein: 40, fat: 18, carbs: 35 },
    { meal: '¦²¦Í¦Á¦Ê 2', food: '¦ª¦Á¦Ñ?¦Ó¦Á + ¦Ö¦Ï?¦Ì¦Ï¦Ô?', protein: 2, fat: 5, carbs: 10 },
    { meal: '¦¢¦Ñ¦Á¦Ä¦É¦Í?', food: '¦¡¦Ô¦Ã? + ¦Ò¦Á¦Ë?¦Ó¦Á', protein: 20, fat: 18, carbs: 3 },
    { activity: '¦£¦É?¦Ã¦Ê¦Á 45¦Ë', burn: 250 }
  ],
  Friday: [
    { meal: '¦°¦Ñ¦Ø¦É¦Í?', food: '¦²¦Á¦Ë?¦Ó¦Á ¦Ì¦Å ¦Ó?¦Í¦Ï', protein: 25, fat: 12, carbs: 6 },
    { meal: '¦²¦Í¦Á¦Ê 1', food: '¦µ¦Ñ¦Ï?¦Ó¦Á ¦Å¦Ð¦Ï¦Ö??', protein: 1, fat: 0, carbs: 18 },
    { meal: '¦¬¦Å¦Ò¦Ç¦Ì¦Å¦Ñ¦É¦Á¦Í?', food: '¦²¦Ó?¦È¦Ï? ¦Ê¦Ï¦Ó?¦Ð¦Ï¦Ô¦Ë¦Ï + ¦Ð¦Ï¦Ô¦Ñ??', protein: 40, fat: 12, carbs: 30 },
    { meal: '¦²¦Í¦Á¦Ê 2', food: '¦£¦É¦Á¦Ï?¦Ñ¦Ó¦É + ¦Ì?¦Ë¦É', protein: 10, fat: 4, carbs: 20 },
    { meal: '¦¢¦Ñ¦Á¦Ä¦É¦Í?', food: '¦¯¦Ì¦Å¦Ë?¦Ó¦Á ¦Ì¦Å ¦Ë¦Á¦Ö¦Á¦Í¦É¦Ê?', protein: 22, fat: 15, carbs: 5 },
    { activity: '¦°¦Å¦Ñ¦Ð?¦Ó¦Ç¦Ì¦Á 45¦Ë', burn: 250 }
  ],
  Saturday: [
    { meal: '¦°¦Ñ¦Ø¦É¦Í?', food: '¦¡¦Ô¦Ã? + ¦Ê¦Á¦Ò?¦Ñ¦É', protein: 20, fat: 20, carbs: 1 },
    { meal: '¦²¦Í¦Á¦Ê 1', food: '¦²¦Ì¦Ï?¦È¦É ¦Ì¦Å ¦Ò¦Ð¦Á¦Í?¦Ê¦É', protein: 4, fat: 2, carbs: 10 },
    { meal: '¦¬¦Å¦Ò¦Ç¦Ì¦Å¦Ñ¦É¦Á¦Í?', food: '¦²¦Ï¦Ô¦Â¦Ë?¦Ê¦É¦Á ¦Ê¦Ï¦Ó?¦Ð¦Ï¦Ô¦Ë¦Ï + ¦Ð¦Á¦Ó?¦Ó¦Å? ¦Õ¦Ï?¦Ñ¦Í¦Ï¦Ô', protein: 35, fat: 18, carbs: 30 },
    { meal: '¦²¦Í¦Á¦Ê 2', food: '¦®¦Ç¦Ñ¦Ï? ¦Ê¦Á¦Ñ¦Ð¦Ï?', protein: 6, fat: 12, carbs: 8 },
    { meal: '¦¢¦Ñ¦Á¦Ä¦É¦Í?', food: '¦·¦Ç¦Ó? ¦Ë¦Á¦Ö¦Á¦Í¦É¦Ê? + ¦Õ?¦Ó¦Á', protein: 15, fat: 14, carbs: 6 },
    { activity: '¦®¦Å¦Ê¦Ï?¦Ñ¦Á¦Ò¦Ç', burn: 0 }
  ],
  Sunday: [
    { meal: '¦°¦Ñ¦Ø¦É¦Í?', food: '¦°¦Á¦Í¦Ê?¦É¦Ê? ¦Â¦Ñ?¦Ì¦Ç?', protein: 15, fat: 10, carbs: 35 },
    { meal: '¦²¦Í¦Á¦Ê 1', food: '¦¶¦Ô¦Ì?? ¦Ð¦Ï¦Ñ¦Ó¦Ï¦Ê?¦Ë¦É', protein: 1, fat: 0, carbs: 22 },
    { meal: '¦¬¦Å¦Ò¦Ç¦Ì¦Å¦Ñ¦É¦Á¦Í?', food: '¦«¦Á¦Ä¦Å¦Ñ? + ¦Õ?¦Ó¦Á', protein: 20, fat: 18, carbs: 20 },
    { meal: '¦²¦Í¦Á¦Ê 2', food: '¦£¦Ë¦Ô¦Ê? ¦Ì¦Å stevia', protein: 2, fat: 5, carbs: 15 },
    { meal: '¦¢¦Ñ¦Á¦Ä¦É¦Í?', food: '¦³¦Ï¦Í¦Ï¦Ò¦Á¦Ë?¦Ó¦Á', protein: 25, fat: 10, carbs: 3 },
    { activity: '¦°¦Å¦Ñ¦Ð?¦Ó¦Ç¦Ì¦Á ¦Å¦Ë¦Á¦Õ¦Ñ?', burn: 150 }
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
      <h1 style={{ textAlign: 'center' }}>? ¦¥¦Â¦Ä¦Ï¦Ì¦Á¦Ä¦É¦Á?¦Ï ¦°¦Ë?¦Í¦Ï ¦¤¦É¦Á¦Ó¦Ñ¦Ï¦Õ?? & ¦¢?¦Ñ¦Ï¦Ô?</h1>
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
                  <th>¦£¦Å?¦Ì¦Á</th>
                  <th>¦°¦Å¦Ñ¦É¦Ã¦Ñ¦Á¦Õ?</th>
                  <th>¦°¦Ñ.</th>
                  <th>¦«?¦Ð.</th>
                  <th>¦´¦Ä.</th>
                  <th>¦¨¦Å¦Ñ¦Ì.</th>
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
                  <td colSpan="5">¦²?¦Í¦Ï¦Ë¦Ï ¦¨¦Å¦Ñ¦Ì?¦Ä¦Ø¦Í</td>
                  <td>{totalKcal}</td>
                </tr>
                {burn > 0 && (
                  <>
                    <tr style={{ color: 'green' }}>
                      <td colSpan="5">¦ª¦Á¦Ó¦Á¦Í?¦Ë¦Ø¦Ò¦Ç ¦È¦Å¦Ñ¦Ì?¦Ä¦Ø¦Í</td>
                      <td>-{burn}</td>
                    </tr>
                    <tr style={{ background: '#e0ffe0', fontWeight: 'bold' }}>
                      <td colSpan="5">¦ª¦Á¦È¦Á¦Ñ? ¦È¦Å¦Ñ¦Ì¦É¦Ä¦É¦Ê? ¦É¦Ò¦Ï¦Æ?¦Ã¦É¦Ï</td>
                      <td>{netKcal}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
            <div style={{ marginTop: '10px' }}>
              <label>¦¢?¦Ñ¦Ï? ¦Ò?¦Ì¦Á¦Ó¦Ï? (kg): </label>
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
