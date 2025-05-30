import React, { useState, useEffect } from 'react';

const months = [
  'Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος',
  'Μάιος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος',
  'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'
];

// foodDatabase: Θρεπτικές αξίες ανά 100 γραμμάρια (ή ανά μονάδα όπου αναφέρεται)
const foodDatabase = {
  // Δημητριακά, Ψωμί, Ζυμαρικά, Ρύζι
  'oats': { name: 'Βρώμη', protein: 13, fat: 5, carbs: 66, unit: 'g' },
  'riceCakes': { name: 'Ρυζογκοφρέτες', protein: 7, fat: 3, carbs: 80, unit: 'g' },
  'breadWholeWheat': { name: 'Ψωμί Ολικής', protein: 13, fat: 3, carbs: 45, unit: 'g' },
  'riceCooked': { name: 'Ρύζι Μαγειρεμένο', protein: 2.7, fat: 0.3, carbs: 28, unit: 'g' }, // μαγειρεμένο ρύζι
  'mashedPotatoes': { name: 'Πουρές Πατάτας', protein: 2, fat: 5, carbs: 15, unit: 'g' }, // σπιτικός, με λίγο βούτυρο/γάλα

  // Πρωτεΐνες (Κρέας, Ψάρι, Αυγά, Όσπρια)
  'egg': { name: 'Αυγό', protein: 13, fat: 11, carbs: 1.1, unit: 'τεμάχιο' }, // ανά 1 τεμάχιο αυγό (περίπου 50γρ)
  'chickenBreast': { name: 'Στήθος Κοτόπουλου', protein: 31, fat: 3.6, carbs: 0, unit: 'g' },
  'salmon': { name: 'Σολομός', protein: 20, fat: 13, carbs: 0, unit: 'g' },
  'beefLean': { name: 'Μοσχάρι Άπαχο', protein: 26, fat: 15, carbs: 0, unit: 'g' },
  'tunaInWater': { name: 'Τόνος σε Νερό', protein: 25, fat: 0.5, carbs: 0, unit: 'g' },
  'fishWhite': { name: 'Λευκό Ψάρι', protein: 18, fat: 1, carbs: 0, unit: 'g' },
  'turkeyBreast': { name: 'Στήθος Γαλοπούλας', protein: 29, fat: 1, carbs: 0, unit: 'g' },
  'mincedMeatLean': { name: 'Κιμάς Άπαχος', protein: 20, fat: 15, carbs: 0, unit: 'g' }, // βοδινός άπαχος
  'fetaCheese': { name: 'Φέτα', protein: 14, fat: 21, carbs: 4.1, unit: 'g' },

  // Γαλακτοκομικά
  'greekYogurt2pct': { name: 'Γιαούρτι Στραγγιστό 2%', protein: 10, fat: 2, carbs: 4, unit: 'g' },
  'milkSemiSkimmed': { name: 'Γάλα Ημιάπαχο', protein: 3.3, fat: 1.8, carbs: 4.8, unit: 'ml' },
  'cheeseCheddar': { name: 'Τυρί Cheddar', protein: 25, fat: 33, carbs: 1.3, unit: 'g' }, // Γενικό τυρί

  // Λαχανικά
  'avocado': { name: 'Αβοκάντο', protein: 2, fat: 15, carbs: 9, unit: 'g' },
  'broccoli': { name: 'Μπρόκολο', protein: 2.8, fat: 0.4, carbs: 5.2, unit: 'g' },
  'lettuce': { name: 'Μαρούλι', protein: 1.4, fat: 0.2, carbs: 2.9, unit: 'g' },
  'spinach': { name: 'Σπανάκι', protein: 2.9, fat: 0.4, carbs: 3.6, unit: 'g' },
  'tomato': { name: 'Ντομάτα', protein: 0.9, fat: 0.2, carbs: 3.9, unit: 'g' },
  'zucchini': { name: 'Κολοκύθι', protein: 1.2, fat: 0.3, carbs: 3.1, unit: 'g' },
  'carrots': { name: 'Καρότα', protein: 0.9, fat: 0.2, carbs: 9.6, unit: 'g' },
  'mixedVegetables': { name: 'Μικτά Λαχανικά', protein: 2, fat: 0.5, carbs: 8, unit: 'g' }, // Γενική τιμή

  // Φρούτα
  'banana': { name: 'Μπανάνα', protein: 1.1, fat: 0.3, carbs: 23, unit: 'g' },
  'apple': { name: 'Μήλο', protein: 0.3, fat: 0.2, carbs: 14, unit: 'g' },
  'orangeJuice': { name: 'Χυμός Πορτοκαλιού', protein: 0.7, fat: 0.2, carbs: 11.8, unit: 'ml' },
  'seasonalFruits': { name: 'Φρούτα Εποχής', protein: 0.5, fat: 0.2, carbs: 15, unit: 'g' }, // Γενική τιμή

  // Ξηροί καρποί, Σπόροι, Βούτυρα
  'walnuts': { name: 'Καρύδια', protein: 15, fat: 65, carbs: 14, unit: 'g' },
  'almonds': { name: 'Αμύγδαλα', protein: 21, fat: 49, carbs: 22, unit: 'g' },
  'peanutButter': { name: 'Φυστικοβούτυρο', protein: 25, fat: 50, carbs: 20, unit: 'g' },
  'hummus': { name: 'Χούμους', protein: 7.9, fat: 9.6, carbs: 14.3, unit: 'g' },
  'mixedNuts': { name: 'Ανάμεικτοι Ξηροί Καρποί', protein: 15, fat: 50, carbs: 20, unit: 'g' },

  // Άλλα
  'honey': { name: 'Μέλι', protein: 0.3, fat: 0, carbs: 82, unit: 'g' },
  'proteinBar': { name: 'Μπάρα Πρωτεΐνης', protein: 20, fat: 10, carbs: 30, unit: 'τεμάχιο' }, // ανά 1 τεμάχιο μπάρας (τυπική)
};


const initialPlan = {
  Monday: [
    { meal: 'Πρωινό', type: 'meal', ingredients: [
        { foodId: 'egg', quantity: 3 }, // 3 τεμάχια αυγών
        { foodId: 'avocado', quantity: 70 } // 70 γραμμάρια αβοκάντο
    ]},
    { meal: 'Σνακ 1', type: 'meal', ingredients: [
        { foodId: 'greekYogurt2pct', quantity: 150 }, // 150 γραμμάρια γιαούρτι
        { foodId: 'walnuts', quantity: 20 } // 20 γραμμάρια καρύδια
    ]},
    { meal: 'Μεσημεριανό', type: 'meal', ingredients: [
        { foodId: 'chickenBreast', quantity: 200 }, // 200 γραμμάρια κοτόπουλο
        { foodId: 'lettuce', quantity: 100 } // 100 γραμμάρια μαρούλι (σαλάτα)
    ]},
    { meal: 'Σνακ 2', type: 'meal', ingredients: [{ foodId: 'banana', quantity: 120 }] }, // 120 γραμμάρια μπανάνα
    { meal: 'Βραδινό', type: 'meal', ingredients: [
        { foodId: 'salmon', quantity: 150 }, // 150 γραμμάρια σολομός
        { foodId: 'broccoli', quantity: 100 } // 100 γραμμάρια μπρόκολο
    ]},
    { type: 'activity', activity: 'Γυμναστήριο (βάρη)', burn: 600 }
  ],
  Tuesday: [
    { meal: 'Πρωινό', type: 'meal', ingredients: [
        { foodId: 'egg', quantity: 2 },
        { foodId: 'mixedVegetables', quantity: 100 } // Για τα μανιτάρια + άλλα λαχανικά
    ]},
    { meal: 'Σνακ 1', type: 'meal', ingredients: [{ foodId: 'almonds', quantity: 30 }] },
    { meal: 'Μεσημεριανό', type: 'meal', ingredients: [
        { foodId: 'beefLean', quantity: 180 },
        { foodId: 'spinach', quantity: 100 }
    ]},
    { meal: 'Σνακ 2', type: 'meal', ingredients: [{ foodId: 'apple', quantity: 150 }] },
    { meal: 'Βραδινό', type: 'meal', ingredients: [
        { foodId: 'tunaInWater', quantity: 150 },
        { foodId: 'tomato', quantity: 100 }
    ]},
    { type: 'activity', activity: 'Περπάτημα 60λ', burn: 300 }
  ],
  Wednesday: [
    { meal: 'Πρωινό', type: 'meal', ingredients: [
        { foodId: 'oats', quantity: 50 },
        { foodId: 'milkSemiSkimmed', quantity: 200 }
    ]},
    { meal: 'Σνακ 1', type: 'meal', ingredients: [
        { foodId: 'riceCakes', quantity: 20 }, // 2 ρυζογκοφρέτες περίπου 20γρ
        { foodId: 'peanutButter', quantity: 20 }
    ]},
    { meal: 'Μεσημεριανό', type: 'meal', ingredients: [
        { foodId: 'fishWhite', quantity: 180 },
        { foodId: 'mixedVegetables', quantity: 150 }
    ]},
    { meal: 'Σνακ 2', type: 'meal', ingredients: [{ foodId: 'greekYogurt2pct', quantity: 100 }] }, // Αντικατάσταση "Σμούθι φρούτων"
    { meal: 'Βραδινό', type: 'meal', ingredients: [
        { foodId: 'turkeyBreast', quantity: 150 },
        { foodId: 'zucchini', quantity: 100 }
    ]},
    { type: 'activity', activity: 'Τρέξιμο 30λ', burn: 400 }
  ],
  Thursday: [
    { meal: 'Πρωινό', type: 'meal', ingredients: [
        { foodId: 'breadWholeWheat', quantity: 60 }, // π.χ. 2 φέτες ψωμί
        { foodId: 'egg', quantity: 2 }
    ]},
    { meal: 'Σνακ 1', type: 'meal', ingredients: [{ foodId: 'proteinBar', quantity: 60 }] }, // π.χ. 60γρ μπάρα
    { meal: 'Μεσημεριανό', type: 'meal', ingredients: [
        { foodId: 'mincedMeatLean', quantity: 150 },
        { foodId: 'riceCooked', quantity: 200 }
    ]},
    { meal: 'Σνακ 2', type: 'meal', ingredients: [
        { foodId: 'carrots', quantity: 100 },
        { foodId: 'hummus', quantity: 50 }
    ]},
    { meal: 'Βραδινό', type: 'meal', ingredients: [
        { foodId: 'egg', quantity: 3 },
        { foodId: 'lettuce', quantity: 100 }
    ]},
    { type: 'activity', activity: 'Γιόγκα 45λ', burn: 250 }
  ],
  Friday: [
    { meal: 'Πρωινό', type: 'meal', ingredients: [
        { foodId: 'tunaInWater', quantity: 100 },
        { foodId: 'lettuce', quantity: 100 }
    ]},
    { meal: 'Σνακ 1', type: 'meal', ingredients: [{ foodId: 'seasonalFruits', quantity: 150 }] },
    { meal: 'Μεσημεριανό', type: 'meal', ingredients: [
        { foodId: 'chickenBreast', quantity: 200 },
        { foodId: 'mashedPotatoes', quantity: 150 }
    ]},
    { meal: 'Σνακ 2', type: 'meal', ingredients: [
        { foodId: 'greekYogurt2pct', quantity: 150 },
        { foodId: 'honey', quantity: 15 }
    ]},
    { meal: 'Βραδινό', type: 'meal', ingredients: [
        { foodId: 'egg', quantity: 2 },
        { foodId: 'mixedVegetables', quantity: 100 }
    ]},
    { type: 'activity', activity: 'Περπάτημα 45λ', burn: 250 }
  ],
  Saturday: [
    { meal: 'Πρωινό', type: 'meal', ingredients: [
        { foodId: 'egg', quantity: 2 },
        { foodId: 'cheeseCheddar', quantity: 30 }
    ]},
    { meal: 'Σνακ 1', type: 'meal', ingredients: [
        { foodId: 'greekYogurt2pct', quantity: 100 }, // Αντικατάσταση "Σμούθι με σπανάκι"
        { foodId: 'spinach', quantity: 50 } // Προσθήκη σπανάκι για την ιδέα
    ]},
    { meal: 'Μεσημεριανό', type: 'meal', ingredients: [
        { foodId: 'chickenBreast', quantity: 150 }, // Για σουβλάκια
        { foodId: 'mashedPotatoes', quantity: 100 } // Για πατάτες φούρνου
    ]},
    { meal: 'Σνακ 2', type: 'meal', ingredients: [{ foodId: 'mixedNuts', quantity: 30 }] },
    { meal: 'Βραδινό', type: 'meal', ingredients: [
        { foodId: 'mixedVegetables', quantity: 200 },
        { foodId: 'fetaCheese', quantity: 50 }
    ]},
    { type: 'activity', activity: 'Ξεκούραση', burn: 0 }
  ],
  Sunday: [
    { meal: 'Πρωινό', type: 'meal', ingredients: [
        { foodId: 'oats', quantity: 50 }, // Για pancakes βρώμης
        { foodId: 'egg', quantity: 1 } // Για pancakes
    ]},
    { meal: 'Σνακ 1', type: 'meal', ingredients: [{ foodId: 'orangeJuice', quantity: 200 }] },
    { meal: 'Μεσημεριανό', type: 'meal', ingredients: [
        { foodId: 'mixedVegetables', quantity: 250 }, // Για λαδερό
        { foodId: 'fetaCheese', quantity: 50 }
    ]},
    { meal: 'Σνακ 2', type: 'meal', ingredients: [{ foodId: 'greekYogurt2pct', quantity: 100 }] }, // Αντικατάσταση "Γλυκό με stevia"
    { meal: 'Βραδινό', type: 'meal', ingredients: [
        { foodId: 'tunaInWater', quantity: 150 },
        { foodId: 'lettuce', quantity: 100 }
    ]},
    { type: 'activity', activity: 'Περπάτημα ελαφρύ', burn: 150 }
  ]
};

function kcal(p, f, c) {
  return p * 4 + f * 9 + c * 4;
}

function calculateBMI(weight, height) {
  if (!weight || !height) return null;
  return +(weight / (height * height)).toFixed(1);
}

function generateYearHistory(start = 2025, end = 2050) {
  const result = {};
  for (let year = start; year <= end; year++) {
    result[year] = {};
    months.forEach(month => {
      result[year][month] = { weight: '', bmi: '' };
    });
  }
  return result;
}

// Συνάρτηση για τον υπολογισμό μακροστοιχείων ενός γεύματος
function calculateMealMacros(ingredients) {
  let protein = 0;
  let fat = 0;
  let carbs = 0;

  ingredients.forEach(item => {
    const foodInfo = foodDatabase[item.foodId];
    if (foodInfo) {
      // Υπολογισμός με βάση την ποσότητα και τις τιμές ανά μονάδα/100g
      // Αν η μονάδα είναι 'τεμάχιο' ή 'ml', ο πολλαπλασιαστής είναι 1 (η ποσότητα είναι ο αριθμός τεμαχίων/ml)
      // Αλλιώς, η ποσότητα είναι σε γραμμάρια, οπότε διαιρούμε με 100
      const multiplier = (foodInfo.unit === 'τεμάχιο' || foodInfo.unit === 'ml')
        ? item.quantity
        : item.quantity / 100;

      protein += foodInfo.protein * multiplier;
      fat += foodInfo.fat * multiplier;
      carbs += foodInfo.carbs * multiplier;
    }
  });

  return {
    protein: parseFloat(protein.toFixed(1)),
    fat: parseFloat(fat.toFixed(1)),
    carbs: parseFloat(carbs.toFixed(1))
  };
}

// ΝΕΑ ΣΥΝΑΡΤΗΣΗ ΓΙΑ ΥΠΟΛΟΓΙΣΜΟ ΘΕΡΜΙΔΩΝ (BMR + TDEE + ΣΤΟΧΟΣ)
function calculateDailyCalories(weight, heightCm, age, gender, activityLevel, goal) {
  if (!weight || !heightCm || !age || !gender || !activityLevel || !goal) return null;

  // Μετατροπή ύψους από μέτρα σε εκατοστά
  const heightInCm = heightCm * 100;

  let bmr;
  // Mifflin-St Jeor Equation
  if (gender === 'male') {
    bmr = (10 * weight) + (6.25 * heightInCm) - (5 * age) + 5;
  } else { // female
    bmr = (10 * weight) + (6.25 * heightInCm) - (5 * age) - 161;
  }

  // Activity Factor (Typical values)
  const activityFactors = {
    sedentary: 1.2, // little or no exercise
    light: 1.375, // light exercise/sports 1-3 days/week
    moderate: 1.55, // moderate exercise/sports 3-5 days/week
    active: 1.725, // hard exercise/sports 6-7 days a week
    veryActive: 1.9 // very hard exercise/physical job
  };

  const tdee = bmr * activityFactors[activityLevel];

  // Adjust for Goal
  let finalCalories = tdee;
  switch (goal) {
    case 'bulk':
      finalCalories += 300; // Προσθήκη θερμίδων για όγκο
      break;
    case 'cut':
      finalCalories -= 500; // Αφαίρεση θερμίδων για γράμμωση
      break;
    case 'maintain':
    default:
      // Διατήρηση
      break;
  }

  return Math.round(finalCalories);
}


export default function App() {
  // Functions to get initial state from localStorage or use defaults
  const getInitialState = (key, defaultValue) => {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error(`Error parsing localStorage key "${key}":`, e);
        return defaultValue;
      }
    }
    return defaultValue;
  };

  const [plan, setPlan] = useState(() => getInitialState('mealPlan', initialPlan));
  const [weights, setWeights] = useState(() => getInitialState('weeklyWeights', {}));
  const [height, setHeight] = useState(() => getInitialState('userHeight', 1.7));
  const [age, setAge] = useState(() => getInitialState('userAge', 30));
  const [gender, setGender] = useState(() => getInitialState('userGender', 'male'));
  const [activityLevel, setActivityLevel] = useState(() => getInitialState('userActivityLevel', 'moderate'));
  const [goal, setGoal] = useState(() => getInitialState('userGoal', 'maintain'));
  const [history, setHistory] = useState(() => {
    // Merge generated history with stored history to handle new years/months
    const generated = generateYearHistory();
    const storedHistory = getInitialState('weightHistory', {});
    return { ...generated, ...storedHistory };
  });

  // State για τις υπολογιζόμενες ημερήσιες θερμίδες
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(null);


  const handleMealIngredientChange = (day, mealIdx, ingredientIdx, field, value) => {
    setPlan(prevPlan => {
      const updatedPlan = { ...prevPlan };
      const entry = updatedPlan[day][mealIdx];

      if (entry.type === 'meal') {
        const updatedIngredients = [...entry.ingredients];
        updatedIngredients[ingredientIdx] = {
          ...updatedIngredients[ingredientIdx],
          [field]: parseFloat(value) || 0 // Ποσότητα μπορεί να είναι δεκαδική
        };
        entry.ingredients = updatedIngredients;
      } else if (entry.type === 'activity') {
          entry[field] = parseInt(value) || 0;
      }
      return updatedPlan;
    });
  };

  const handleWeightChange = (day, value) => {
    setWeights(prevWeights => ({ ...prevWeights, [day]: value }));
  };

  const handleHistoryChange = (year, month, value, type) => {
    setHistory(prevHistory => {
      const updated = { ...prevHistory };
      const parsedValue = parseFloat(value);

      // Ensure the year and month objects exist
      if (!updated[year]) updated[year] = {};
      if (!updated[year][month]) updated[year][month] = { weight: '', bmi: '' };

      if (type === 'weight') {
        updated[year][month].weight = isNaN(parsedValue) ? '' : parsedValue;
        // Recalculate BMI if weight changes
        updated[year][month].bmi = calculateBMI(parsedValue, height);
      } else if (type === 'bmi') {
        // We usually calculate BMI from weight, not the other way around.
        // If you want to input BMI directly, you'd need a way to deduce weight or accept BMI as a primary input.
        // For now, BMI is derived from weight.
        updated[year][month].bmi = isNaN(parsedValue) ? '' : parsedValue;
      }
      return updated;
    });
  };

  // Αυτόματη αποθήκευση τρέχοντος εβδομαδιαίου βάρους στο τρέχον μήνα/έτος
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = months[now.getMonth()];
    let sum = 0;
    let count = 0;
    Object.values(weights).forEach(val => {
      const w = parseFloat(val);
      if (!isNaN(w)) {
        sum += w;
        count++;
      }
    });
    const avgWeight = count > 0 ? +(sum / count).toFixed(1) : '';
    if (avgWeight) {
      setHistory(prev => ({
        ...prev,
        [year]: {
          ...prev[year],
          [month]: {
            weight: avgWeight,
            bmi: calculateBMI(avgWeight, height)
          }
        }
      }));
    }
  }, [weights, height]);

  // useEffects for saving to localStorage
  useEffect(() => {
    localStorage.setItem('mealPlan', JSON.stringify(plan));
  }, [plan]);

  useEffect(() => {
    localStorage.setItem('weeklyWeights', JSON.stringify(weights));
  }, [weights]);

  useEffect(() => {
    localStorage.setItem('userHeight', JSON.stringify(height));
  }, [height]);

  useEffect(() => {
    localStorage.setItem('userAge', JSON.stringify(age));
  }, [age]);

  useEffect(() => {
    localStorage.setItem('userGender', JSON.stringify(gender));
  }, [gender]);

  useEffect(() => {
    localStorage.setItem('userActivityLevel', JSON.stringify(activityLevel));
  }, [activityLevel]);

  useEffect(() => {
    localStorage.setItem('userGoal', JSON.stringify(goal));
  }, [goal]);

  useEffect(() => {
    localStorage.setItem('weightHistory', JSON.stringify(history));
  }, [history]);

  // useEffect για τον υπολογισμό των ημερήσιων θερμίδων όταν αλλάζουν τα σχετικά δεδομένα
  useEffect(() => {
    // Εύρεση του πρώτου καταχωρημένου βάρους ή default τιμή
    let currentWeight = 70; // Default βάρος
    const firstDayWithWeight = Object.keys(weights).find(day => weights[day]);
    if (firstDayWithWeight) {
      currentWeight = parseFloat(weights[firstDayWithWeight]);
    } else if (Object.keys(history).length > 0) { // If no current weights, try history
      const lastYear = Object.keys(history).sort().pop();
      if (lastYear) {
        const lastMonth = Object.keys(history[lastYear]).sort((a,b) => months.indexOf(a) - months.indexOf(b)).pop();
        if (lastMonth && history[lastYear][lastMonth].weight) {
          currentWeight = parseFloat(history[lastYear][lastMonth].weight);
        }
      }
    }


    const calculatedCalories = calculateDailyCalories(
      currentWeight,
      parseFloat(height),
      parseInt(age),
      gender,
      activityLevel,
      goal
    );
    setDailyCalorieTarget(calculatedCalories);
  }, [weights, height, age, gender, activityLevel, goal, history]); // Added history to dependency array


  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>📊 Εβδομαδιαίο Πλάνο Διατροφής & Βάρους</h1>

      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
        <h2>Πληροφορίες Χρήστη & Στόχος</h2>
        <div>
          <label>📏 Ύψος (σε μέτρα): </label>
          <input
            type="number"
            step="0.01"
            value={height}
            onChange={(e) => setHeight(parseFloat(e.target.value))}
            style={{ marginRight: '20px' }}
          />
          <label>🎂 Ηλικία: </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value))}
            style={{ width: '60px', marginRight: '20px' }}
          />
          <label>🚻 Φύλο: </label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ marginRight: '20px' }}>
            <option value="male">Άνδρας</option>
            <option value="female">Γυναίκα</option>
          </select>
          <label>🏃 Επίπεδο Δραστηριότητας: </label>
          <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} style={{ marginRight: '20px' }}>
            <option value="sedentary">Καθιστική (Ελάχιστη άσκηση)</option>
            <option value="light">Ελαφριά (1-3 φορές/εβδ.)</option>
            <option value="moderate">Μέτρια (3-5 φορές/εβδ.)</option>
            <option value="active">
