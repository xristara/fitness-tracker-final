import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer
} from 'recharts';

const initialPlan = {
  

function kcal(p, f, c) {
  return p * 4 + f * 9 + c * 4;
}

export default function App() {
  const [plan, setPlan] = useState(() => {
    const stored = localStorage.getItem('plan');
    return stored ? JSON.parse(stored) : initialPlan;
  });
  const [weights, setWeights] = useState(() => {
    const stored = localStorage.getItem('weights');
    return stored ? JSON.parse(stored) : {};
  });
  const [height, setHeight] = useState(() => {
    const stored = localStorage.getItem('height');
    return stored ? parseFloat(stored) : 1.7;
  });

  useEffect(() => {
    localStorage.setItem('plan', JSON.stringify(plan));
  }, [plan]);
  useEffect(() => {
    localStorage.setItem('weights', JSON.stringify(weights));
  }, [weights]);
  useEffect(() => {
    localStorage.setItem('height', height);
  }, [height]);

  const summary = Object.entries(plan).map(([day, items]) => {
    let p = 0, f = 0, c = 0, burn = 0;
    items.forEach(item => {
      if (item.meal) {
        p += item.protein; f += item.fat; c += item.carbs;
      } else if (item.activity) {
        burn += item.burn;
      }
    });
    return {
      day,
      protein: p * 4,
      fat: f * 9,
      carbs: c * 4,
      netCalories: kcal(p, f, c) - burn
    };
  });

  return (
    <div>
      <h1>Πλάνο Διατροφής</h1>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={summary}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="netCalories" fill="#8884d8" name="Καθ. Θερμίδες" />
          <Bar dataKey="protein" fill="#82ca9d" name="Πρωτεΐνη" />
          <Bar dataKey="fat" fill="#ffc658" name="Λίπος" />
          <Bar dataKey="carbs" fill="#ff8042" name="Υδατάνθρακες" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
