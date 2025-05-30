import React, { useState } from 'react';

const initialPlan = {
  Monday: [
    { meal: '���Ѧئɦ�?', food: '���Ԧ�? (3) + ���¦Ϧ�?�ͦӦ�', protein: 21, fat: 30, carbs: 3 },
    { meal: '���ͦ��� 1', food: '���ɦ���?�ѦӦ� + �ʦ���?�Ħɦ�', protein: 10, fat: 10, carbs: 5 },
    { meal: '���ŦҦǦ̦ŦѦɦ���?', food: '���Ϧ�?�ЦϦԦ˦� (200g) + ������?�Ӧ�', protein: 40, fat: 18, carbs: 5 },
    { meal: '���ͦ��� 2', food: '���Ц���?�ͦ�', protein: 1, fat: 0, carbs: 20 },
    { meal: '���Ѧ��Ħɦ�?', food: '���Ϧ˦ئ�?? (150g) + ���Ц�?�ʦϦ˦�', protein: 30, fat: 15, carbs: 4 },
    { activity: '���Ԧ̦ͦ��Ҧ�?�Ѧɦ� (��?�Ѧ�)', burn: 600 }
  ],
  Tuesday: [
    { meal: '���Ѧئɦ�?', food: '���̦Ŧ�?�Ӧ� �̦� �̦��ͦɦ�?�Ѧɦ�', protein: 25, fat: 22, carbs: 4 },
    { meal: '���ͦ��� 1', food: '����?�æĦ��˦�', protein: 6, fat: 14, carbs: 6 },
    { meal: '���ŦҦǦ̦ŦѦɦ���?', food: '���ϦҦ�?�Ѧ� + ���Ц���?�ʦ�', protein: 45, fat: 20, carbs: 4 },
    { meal: '���ͦ��� 2', food: '��?�˦�', protein: 0, fat: 0, carbs: 20 },
    { meal: '���Ѧ��Ħɦ�?', food: '��?�ͦ�? + �ͦӦϦ�?�Ӧ�', protein: 28, fat: 12, carbs: 5 },
    { activity: '���ŦѦ�?�ӦǦ̦� 60��', burn: 300 }
  ],
  Wednesday: [
    { meal: '���Ѧئɦ�?', food: '����?�̦� �̦� ��?�˦�', protein: 12, fat: 8, carbs: 30 },
    { meal: '���ͦ��� 1', food: '���ԦƦϦæʦϦզ�?�Ӧ�? + �զԦҦӦɦʦϦ¦�?�ӦԦѦ�', protein: 6, fat: 10, carbs: 15 },
    { meal: '���ŦҦǦ̦ŦѦɦ���?', food: '��?�Ѧ� + �˦��֦��ͦɦ�?', protein: 35, fat: 14, carbs: 6 },
    { meal: '���ͦ��� 2', food: '���̦�?�Ȧ� �զѦ�?�Ӧئ�', protein: 2, fat: 0, carbs: 25 },
    { meal: '���Ѧ��Ħɦ�?', food: '�����˦ϦЦ�?�˦� + �ʦϦ˦Ϧ�?�Ȧ�', protein: 28, fat: 10, carbs: 3 },
    { activity: '����?�Φɦ̦� 30��', burn: 400 }
  ],
  Thursday: [
    { meal: '���Ѧئɦ�?', food: '��?�Ҧ� �̦� ���Ԧ�?', protein: 18, fat: 14, carbs: 20 },
    { meal: '���ͦ��� 1', food: '����?�Ѧ� �ЦѦئӦ�?�ͦ�?', protein: 15, fat: 7, carbs: 12 },
    { meal: '���ŦҦǦ̦ŦѦɦ���?', food: '���ɦ�?? �̦� ��?�Ʀ�', protein: 40, fat: 18, carbs: 35 },
    { meal: '���ͦ��� 2', food: '������?�Ӧ� + �֦�?�̦Ϧ�?', protein: 2, fat: 5, carbs: 10 },
    { meal: '���Ѧ��Ħɦ�?', food: '���Ԧ�? + �Ҧ���?�Ӧ�', protein: 20, fat: 18, carbs: 3 },
    { activity: '����?�æʦ� 45��', burn: 250 }
  ],
  Friday: [
    { meal: '���Ѧئɦ�?', food: '������?�Ӧ� �̦� ��?�ͦ�', protein: 25, fat: 12, carbs: 6 },
    { meal: '���ͦ��� 1', food: '���Ѧ�?�Ӧ� �ŦЦϦ�??', protein: 1, fat: 0, carbs: 18 },
    { meal: '���ŦҦǦ̦ŦѦɦ���?', food: '����?�Ȧ�? �ʦϦ�?�ЦϦԦ˦� + �ЦϦԦ�??', protein: 40, fat: 12, carbs: 30 },
    { meal: '���ͦ��� 2', food: '���ɦ���?�ѦӦ� + ��?�˦�', protein: 10, fat: 4, carbs: 20 },
    { meal: '���Ѧ��Ħɦ�?', food: '���̦Ŧ�?�Ӧ� �̦� �˦��֦��ͦɦ�?', protein: 22, fat: 15, carbs: 5 },
    { activity: '���ŦѦ�?�ӦǦ̦� 45��', burn: 250 }
  ],
  Saturday: [
    { meal: '���Ѧئɦ�?', food: '���Ԧ�? + �ʦ���?�Ѧ�', protein: 20, fat: 20, carbs: 1 },
    { meal: '���ͦ��� 1', food: '���̦�?�Ȧ� �̦� �ҦЦ���?�ʦ�', protein: 4, fat: 2, carbs: 10 },
    { meal: '���ŦҦǦ̦ŦѦɦ���?', food: '���ϦԦ¦�?�ʦɦ� �ʦϦ�?�ЦϦԦ˦� + �Ц���?�Ӧ�? �զ�?�ѦͦϦ�', protein: 35, fat: 18, carbs: 30 },
    { meal: '���ͦ��� 2', food: '���ǦѦ�? �ʦ��ѦЦ�?', protein: 6, fat: 12, carbs: 8 },
    { meal: '���Ѧ��Ħɦ�?', food: '���Ǧ�? �˦��֦��ͦɦ�? + ��?�Ӧ�', protein: 15, fat: 14, carbs: 6 },
    { activity: '���Ŧʦ�?�Ѧ��Ҧ�', burn: 0 }
  ],
  Sunday: [
    { meal: '���Ѧئɦ�?', food: '�����ͦ�?�ɦ�? �¦�?�̦�?', protein: 15, fat: 10, carbs: 35 },
    { meal: '���ͦ��� 1', food: '���Ԧ�?? �ЦϦѦӦϦ�?�˦�', protein: 1, fat: 0, carbs: 22 },
    { meal: '���ŦҦǦ̦ŦѦɦ���?', food: '�����ĦŦ�? + ��?�Ӧ�', protein: 20, fat: 18, carbs: 20 },
    { meal: '���ͦ��� 2', food: '���˦Ԧ�? �̦� stevia', protein: 2, fat: 5, carbs: 15 },
    { meal: '���Ѧ��Ħɦ�?', food: '���ϦͦϦҦ���?�Ӧ�', protein: 25, fat: 10, carbs: 3 },
    { activity: '���ŦѦ�?�ӦǦ̦� �Ŧ˦��զ�?', burn: 150 }
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
      <h1 style={{ textAlign: 'center' }}>? ���¦ĦϦ̦��Ħɦ�?�� ����?�ͦ� ���ɦ��ӦѦϦ�?? & ��?�ѦϦ�?</h1>
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
                  <th>����?�̦�</th>
                  <th>���ŦѦɦæѦ���?</th>
                  <th>����.</th>
                  <th>��?��.</th>
                  <th>����.</th>
                  <th>���ŦѦ�.</th>
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
                  <td colSpan="5">��?�ͦϦ˦� ���ŦѦ�?�Ħئ�</td>
                  <td>{totalKcal}</td>
                </tr>
                {burn > 0 && (
                  <>
                    <tr style={{ color: 'green' }}>
                      <td colSpan="5">�����Ӧ���?�˦ئҦ� �ȦŦѦ�?�Ħئ�</td>
                      <td>-{burn}</td>
                    </tr>
                    <tr style={{ background: '#e0ffe0', fontWeight: 'bold' }}>
                      <td colSpan="5">�����Ȧ���? �ȦŦѦ̦ɦĦɦ�? �ɦҦϦ�?�æɦ�</td>
                      <td>{netKcal}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
            <div style={{ marginTop: '10px' }}>
              <label>��?�Ѧ�? ��?�̦��Ӧ�? (kg): </label>
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
