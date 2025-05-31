import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const months = [
  'Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος',
  'Μάιος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος',
  'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// foodDatabase: Θρεπτικές αξίες ανά 100 γραμμάρια (ή ανά μονάδα όπου αναφέρεται)
const foodDatabase = {
  // Δημητριακά, Ψωμί, Ζυμαρικά, Ρύζι
  'oats': { name: 'Βρώμη', protein: 13, fat: 5, carbs: 66, unit: 'g' },
  'Weetabix Original': { name: 'δημημητριακά ολικής άλεσης', protein: 12, fat: 2, carbs: 69, unit: 'g' },
  'breadWholeWheat': { name: 'Ψωμί Ολικής', protein: 13, fat: 3, carbs: 45, unit: 'g' },
  'riceCooked': { name: 'Ρύζι Μαγειρεμένο', protein: 2.7, fat: 0.3, carbs: 28, unit: 'g' }, // μαγειρεμένο ρύζι
  'mashedPotatoes': { name: 'Πουρές Πατάτας', protein: 2, fat: 5, carbs: 15, unit: 'g' }, // σπιτικός, με λίγο βούτυρο/γάλα

  // Πρωτεΐνες (Κρέας, Ψάρι, Αυγά, Όσπρια)
  'egg': { name: 'Αυγό', protein: 6, fat: 5.3, carbs: 0.6, unit: 'τεμάχιο' }, // ανά 1 τεμάχιο αυγό (περίπου 50γρ)
  'chickenBreast': { name: 'Στήθος Κοτόπουλου', protein: 31, fat: 3.6, carbs: 0, unit: 'g' },
  'salmon': { name: 'Σολομός', protein: 20, fat: 13, carbs: 0, unit: 'g' },
  'beefLean': { name: 'Μοσχάρι Άπαχο', protein: 26, fat: 15, carbs: 0, unit: 'g' },
  'tunaInWater': { name: 'Τόνος σε Νερό', protein: 25, fat: 0.5, carbs: 0, unit: 'g' },
  'fishWhite': { name: 'Λευκό Ψάρι', protein: 18, fat: 1, carbs: 0, unit: 'g' },
  'chickenthigh': { name: 'Μπούτι κοτόπουλου', protein: 26, fat: 6, carbs: 0, unit: 'g' },
  'mincedMeatLean': { name: 'Κιμάς Άπαχος', protein: 20, fat: 15, carbs: 0, unit: 'g' }, // βοδινός άπαχος
  'fetaCheese': { name: 'Φέτα', protein: 14, fat: 21, carbs: 4, unit: 'g' },

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
  'walnuts': { name: 'Καρύδια', protein: 15, fat: 65, carbs: 11, unit: 'g' },
  'almonds': { name: 'Αμύγδαλα', protein: 21, fat: 49, carbs: 22, unit: 'g' },
  'peanutButter': { name: 'Φυστικοβούτυρο', protein: 28, fat: 48, carbs: 13, unit: 'g' },
  'hummus': { name: 'Χούμους', protein: 7.9, fat: 9.6, carbs: 14.3, unit: 'g' },
  'mixedNuts': { name: 'Ανάμεικτοι Ξηροί Καρποί', protein: 15, fat: 50, carbs: 20, unit: 'g' },

  // Άλλα
  'honey': { name: 'Μέλι', protein: 0.3, fat: 0, carbs: 82, unit: 'g' },
  'PureisolatAM': { name: 'WHEY', protein: 90, fat: 1.7, carbs: 4, unit: 'g' },
};

// Μετατροπή του foodDatabase σε ένα array για εύκολο mapping σε dropdowns
const foodOptions = Object.keys(foodDatabase).map(foodId => ({
    id: foodId,
    name: foodDatabase[foodId].name,
    unit: foodDatabase[foodId].unit // Περιλαμβάνουμε και τη μονάδα για εμφάνιση
}));


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
        { foodId: 'Weetabix Original', quantity: 20 },
        { foodId: 'peanutButter', quantity: 20 }
    ]},
    { meal: 'Μεσημεριανό', type: 'meal', ingredients: [
        { foodId: 'fishWhite', quantity: 180 },
        { foodId: 'mixedVegetables', quantity: 150 }
    ]},
    { meal: 'Σνακ 2', type: 'meal', ingredients: [{ foodId: 'greekYogurt2pct', quantity: 100 }] }, // Αντικατάσταση "Σμούθι φρούτων"
    { meal: 'Βραδινό', type: 'meal', ingredients: [
        { foodId: 'chickenthigh', quantity: 150 },
        { foodId: 'zucchini', quantity: 100 }
    ]},
    { type: 'activity', activity: 'Τρέξιμο 30λ', burn: 400 }
  ],
  Thursday: [
    { meal: 'Πρωινό', type: 'meal', ingredients: [
        { foodId: 'breadWholeWheat', quantity: 60 }, // π.χ. 2 φέτες ψωμί
        { foodId: 'egg', quantity: 2 }
    ]},
    { meal: 'Σνακ 1', type: 'meal', ingredients: [{ foodId: 'PureisolatAM', quantity: 30 }] },
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
        { foodId: 'greekYogurt2pct', quantity: 100 }, // Αντικατάθεση "Σμούθι με σπανάκι"
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
    { meal: 'Σνακ 2', type: 'meal', ingredients: [{ foodId: 'greekYogurt2pct', quantity: 100 }] }, // Αντικατάθεση "Γλυκό με stevia"
    { meal: 'Βραδινό', type: 'meal', ingredients: [
        { foodId: 'tunaInWater', quantity: 150 },
        { foodId: 'lettuce', quantity: 100 }
    ]},
    { type: 'activity', activity: 'Περπάτημα ελαφρύ', burn: 150 }
  ]
};

function kcal(p, f, c) {
  return Math.round(p * 4 + f * 9 + c * 4);
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
      // Υπολογισμός με βάση την ποσότητα και τις τιμές ανά μονάδα/100g/100ml
      let multiplier;
      if (foodInfo.unit === 'τεμάχιο') {
        multiplier = item.quantity; // If unit is 'τεμάχιο', quantity is the number of items
      } else { // For 'g' and 'ml', values are typically per 100g/100ml
        multiplier = item.quantity / 100; // <-- Αυτό είναι το σωστό για 'ml' και 'g'
      }

      protein += foodInfo.protein * multiplier;
      fat += foodInfo.fat * multiplier;
      carbs += foodInfo.carbs * multiplier;
    }
  });

  return {
    // Στρογγυλοποίηση εδώ για ακρίβεια 1 δεκαδικού
    protein: parseFloat(protein.toFixed(1)),
    fat: parseFloat(fat.toFixed(1)),
    carbs: parseFloat(carbs.toFixed(1))
  };
}

// ΝΕΑ ΣΥΝΑΡΤΗΣΗ: Υπολογίζει το χρώμα με βάση τη σύγκριση προηγούμενης/τρέχουσας τιμής
function getComparisonColor(currentValue, previousValue, isWeight = true) {
  if (currentValue === null || previousValue === null || isNaN(currentValue) || isNaN(previousValue) || previousValue === 0) {
    return 'black'; // Εάν δεν υπάρχουν τιμές, μένει μαύρο
  }

  // Για το βάρος και BMI, πράσινο σημαίνει μείωση, κόκκινο αύξηση
  if (isWeight) {
    if (currentValue < previousValue) {
      return 'green'; // Έχει πέσει
    } else if (currentValue > previousValue) {
      return 'red'; // Έχει ανέβει
    }
  } else { // Για BMI, η λογική είναι ίδια με το βάρος
    if (currentValue < previousValue) {
        return 'green'; // Έχει πέσει
    } else if (currentValue > previousValue) {
        return 'red'; // Έχει ανέβει
    }
  }
  return 'black'; // Δεν έχει αλλάξει
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

  return Math.round(finalCalories); // Στρογγυλοποίηση στην κοντινότερη ακέραιη
}

// ΣΥΝΑΡΤΗΣΕΙΣ ΓΙΑ ΥΠΟΛΟΓΙΣΜΟ ΗΜΕΡΗΣΙΩΝ ΜΑΚΡΟΣΤΟΙΧΕΙΩΝ
function calculateDailyProtein(dailyCalories, goal) {
  let proteinPercentage;
  if (goal === 'cut') {
    proteinPercentage = 0.35; // Υψηλότερη πρωτεΐνη για γράμμωση
  } else if (goal === 'bulk') {
    proteinPercentage = 0.25; // Μέτρια προς υψηλή για όγκο
  } else {
    proteinPercentage = 0.20; // Κανονική για διατήρηση
  }
  return Math.round((dailyCalories * proteinPercentage) / 4); // Στρογγυλοποίηση στην κοντινότερη ακέραιη
}

function calculateDailyFat(dailyCalories, goal) {
  let fatPercentage;
  if (goal === 'cut') {
    fatPercentage = 0.25; // Μέτριο λίπος για γράμμωση
  } else if (goal === 'bulk') {
    fatPercentage = 0.30; // Υψηλότερο λίπος για όγκο
  }
  else {
    fatPercentage = 0.25; // Κανονικό για διατήρηση
  }
  return Math.round((dailyCalories * fatPercentage) / 9); // Στρογγυλοποίηση στην κοντινότερη ακέραιη
}

function calculateDailyCarbs(dailyCalories, dailyProtein, dailyFat) {
  // Υπολογίζουμε τους υδατάνθρακες από τις υπόλοιπες θερμίδες
  const caloriesFromProtein = dailyProtein * 4;
  const caloriesFromFat = dailyFat * 9;
  const caloriesFromCarbs = dailyCalories - caloriesFromProtein - caloriesFromFat;
  // Προσοχή: Εάν οι θερμίδες υδατανθράκων βγούν αρνητικές (π.χ. λόγω πολύ υψηλής πρωτεΐνης/λίπους σε cut),
  // τις θέτουμε στο 0.
  return Math.round(Math.max(0, caloriesFromCarbs / 4)); // Στρογγυλοποίηση στην κοντινότερη ακέραιη
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
  // Το `weights` state θα αποθηκεύει μόνο το βάρος της Κυριακής
  const [weights, setWeights] = useState(() => getInitialState('weeklyWeights', { Sunday: '' }));
  const [height, setHeight] = useState(() => getInitialState('userHeight', 1.7));
  const [age, setAge] = useState(() => getInitialState('userAge', 30));
  const [gender, setGender] = useState(() => getInitialState('userGender', 'male'));
  const [activityLevel, setActivityLevel] = useState(() => getInitialState('userActivityLevel', 'moderate'));
  const [goal, setGoal] = useState(() => getInitialState('userGoal', 'maintain'));
  const [history, setHistory] = useState(() => {
    // Merge generated history with stored history to handle new years/months
    const generated = generateYearHistory();
    const storedHistory = getInitialState('weightHistory', {});
    // This deep merge ensures that new months/years from generateYearHistory are added
    // without overwriting existing data from storedHistory.
    const mergedHistory = { ...generated };
    for (const year in storedHistory) {
      if (storedHistory.hasOwnProperty(year)) {
        mergedHistory[year] = { ...mergedHistory[year], ...storedHistory[year] };
      }
    }
    return mergedHistory;
  });

  // State για το επιλεγμένο έτος στο ιστορικό
  const [selectedYear, setSelectedYear] = useState(() => {
    const currentYear = new Date().getFullYear();
    const storedYear = getInitialState('selectedHistoryYear', currentYear);
    // Ensure the selected year exists in history, otherwise default to current or latest
    const availableYears = Object.keys(history).map(Number).sort((a, b) => b - a);
    if (availableYears.includes(storedYear)) {
        return storedYear;
    } else if (availableYears.length > 0) {
        return availableYears[0]; // Use the latest year if stored not found
    }
    return currentYear; // Fallback
  });

  // State για τις υπολογιζόμενες ημερήσιες θερμίδες και μακροστοιχεία
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(null);
  const [dailyProteinTarget, setDailyProteinTarget] = useState(null);
  const [dailyFatTarget, setDailyFatTarget] = useState(null);
  const [dailyCarbsTarget, setDailyCarbsTarget] = useState(null);

  // States για Autocomplete
  const [autocompleteInput, setAutocompleteInput] = useState({}); // {day: {mealIdx: {ingredientIdx: 'current_input_text'}}}
  const [filteredFoodOptions, setFilteredFoodOptions] = useState({}); // {day: {mealIdx: {ingredientIdx: [filtered_options]}}}
  // Χρήση του useRef για να διαχειριστούμε το κλείσιμο του autocomplete όταν ο χρήστης κάνει κλικ έξω
  // Αυτή η ref δομή θα περιέχει δυναμικά αναφορές σε κάθε πεδίο autocomplete
  const autocompleteContainerRefs = useRef({});

  // ΤΡΟΠΟΠΟΙΗΜΕΝΗ ΣΥΝΑΡΤΗΣΗ: handleMealIngredientChange
  // Τώρα μπορεί να ενημερώσει foodId και quantity
  const handleMealIngredientChange = (day, mealIdx, ingredientIdx, field, value) => {
    setPlan(prevPlan => {
      const updatedPlan = { ...prevPlan };
      const entry = updatedPlan[day][mealIdx];

      if (entry.type === 'meal') {
        const updatedIngredients = [...entry.ingredients];
        updatedIngredients[ingredientIdx] = {
          ...updatedIngredients[ingredientIdx],
          [field]: (field === 'foodId' ? value : parseFloat(value) || 0)
        };
        entry.ingredients = updatedIngredients;
        // Ενημέρωση του input value για το autocomplete όταν αλλάζει το foodId
        if (field === 'foodId') {
          const foodName = foodDatabase[value]?.name || '';
          setAutocompleteInput(prev => ({
            ...prev,
            [day]: {
              ...(prev[day] || {}),
              [mealIdx]: {
                ...(prev[day]?.[mealIdx] || {}),
                [ingredientIdx]: foodName
              }
            }
          }));
        }
      } else if (entry.type === 'activity') {
          entry[field] = (field === 'burn' ? parseInt(value) || 0 : value); // Allow text for activity name
      }
      return updatedPlan;
    });
  };

  // ΝΕΑ ΣΥΝΑΡΤΗΣΗ: Χειρισμός αλλαγής στο input του autocomplete
  const handleAutocompleteInputChange = (day, mealIdx, ingredientIdx, value) => {
    setAutocompleteInput(prev => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [mealIdx]: {
          ...(prev[day]?.[mealIdx] || {}),
          [ingredientIdx]: value
        }
      }
    }));

    // Φιλτράρισμα των επιλογών
    const lowerCaseValue = value.toLowerCase();
    const filtered = foodOptions.filter(food =>
      food.name.toLowerCase().includes(lowerCaseValue)
    ).slice(0, 10); // Περιορισμός σε 10 αποτελέσματα

    setFilteredFoodOptions(prev => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [mealIdx]: {
          ...(prev[day]?.[mealIdx] || {}),
          [ingredientIdx]: filtered
        }
      }
    }));
  };

  // ΝΕΑ ΣΥΝΑΡΤΗΣΗ: Επιλογή τροφής από το autocomplete
  const handleFoodSelect = (day, mealIdx, ingredientIdx, foodId) => {
    handleMealIngredientChange(day, mealIdx, ingredientIdx, 'foodId', foodId);
    // Κύψιμο των προτάσεων
    setFilteredFoodOptions(prev => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [mealIdx]: {
          ...(prev[day]?.[mealIdx] || {}),
          [ingredientIdx]: [] // Άδειασμα των προτάσεων
        }
      }
    }));
  };

  // ΝΕΑ ΣΥΝΑΡΤΗΣΗ: Προσθήκη νέου συστατικού σε γεύμα
  const addIngredient = (day, mealIdx) => {
    setPlan(prevPlan => {
      const updatedPlan = { ...prevPlan };
      const entry = updatedPlan[day][mealIdx];
      if (entry.type === 'meal') {
        // Προσθήκη ενός κενού (ή προεπιλεγμένου) συστατικού
        entry.ingredients = [...entry.ingredients, { foodId: '', quantity: 0 }];
      }
      return updatedPlan;
    });
    // Επίσης, πρέπει να ενημερώσουμε το autocompleteInput state για το νέο συστατικό
    setAutocompleteInput(prev => {
        const newIngredientIndex = (plan[day][mealIdx]?.ingredients?.length || 0); // Το index του νέου συστατικού
        return {
            ...prev,
            [day]: {
                ...(prev[day] || {}),
                [mealIdx]: {
                    ...(prev[day]?.[mealIdx] || {}),
                    [newIngredientIndex]: '' // Άδειο αρχικά
                }
            }
        };
    });
  };

  // ΝΕΑ ΣΥΝΑΡΤΗΣΗ: Αφαίρεση συστατικού από γεύμα
  const removeIngredient = (day, mealIdx, ingredientIdx) => {
    setPlan(prevPlan => {
      const updatedPlan = { ...prevPlan };
      const entry = updatedPlan[day][mealIdx];
      if (entry.type === 'meal') {
        entry.ingredients = entry.ingredients.filter((_, i) => i !== ingredientIdx);
      }
      return updatedPlan;
    });
    // Καθαρισμός των autocomplete states για το αφαιρεθέν συστατικό
    setAutocompleteInput(prev => {
        const newDay = { ...prev[day] };
        if (newDay[mealIdx]) {
            const newMeal = { ...newDay[mealIdx] };
            // Ενημέρωση των indexes μετά την αφαίρεση
            const updatedMealIngredients = Object.keys(newMeal)
                                            .filter(key => parseInt(key) !== ingredientIdx)
                                            .reduce((acc, key, newIdx) => {
                                                acc[newIdx] = newMeal[key];
                                                return acc;
                                            }, {});
            newDay[mealIdx] = updatedMealIngredients;
        }
        return { ...prev, [day]: newDay };
    });
    setFilteredFoodOptions(prev => {
        const newDay = { ...prev[day] };
        if (newDay[mealIdx]) {
            const newMeal = { ...newDay[mealIdx] };
            const updatedMealFiltered = Object.keys(newMeal)
                                            .filter(key => parseInt(key) !== ingredientIdx)
                                            .reduce((acc, key, newIdx) => {
                                                acc[newIdx] = newMeal[key];
                                                return acc;
                                            }, {});
            newDay[mealIdx] = updatedMealFiltered;
        }
        return { ...prev, [day]: newDay };
    });
  };

  // ΝΕΑ ΣΥΝΑΡΤΗΣΗ: Προσθήκη γεύματος σε μια ημέρα
  const addMeal = (day, mealType) => {
    setPlan(prevPlan => {
      const updatedPlan = { ...prevPlan };
      const newMeal = { meal: mealType, type: 'meal', ingredients: [{ foodId: '', quantity: 0 }] };
      // Βρίσκουμε την τελευταία θέση για γεύμα και το εισάγουμε μετά από αυτό
      // Ή στο τέλος αν δεν υπάρχουν άλλα γεύματα
      let insertIndex = updatedPlan[day].length;
      for (let i = updatedPlan[day].length - 1; i >= 0; i--) {
        if (updatedPlan[day][i].type === 'meal') {
          insertIndex = i + 1;
          break;
        }
      }
      updatedPlan[day] = [...updatedPlan[day].slice(0, insertIndex), newMeal, ...updatedPlan[day].slice(insertIndex)];
      return updatedPlan;
    });
  };

  // ΝΕΑ ΣΥΝΑΡΤΗΣΗ: Προσθήκη δραστηριότητας σε μια ημέρα
  const addActivity = (day) => {
    setPlan(prevPlan => {
      const updatedPlan = { ...prevPlan };
      updatedPlan[day] = [...updatedPlan[day], { type: 'activity', activity: '', burn: 0 }];
      return updatedPlan;
    });
  };

  // ΝΕΑ ΣΥΝΑΡΤΗΣΗ: Αφαίρεση γεύματος ή δραστηριότητας
  const removeEntry = (day, entryIdx) => {
    setPlan(prevPlan => {
      const updatedPlan = { ...prevPlan };
      updatedPlan[day] = updatedPlan[day].filter((_, i) => i !== entryIdx);
      return updatedPlan;
    });
    // Καθαρισμός των autocomplete states αν αφαιρέθηκε γεύμα
    setAutocompleteInput(prev => {
      const newDay = { ...prev[day] };
      delete newDay[entryIdx]; // Αφαίρεση του entry
      // Ενημέρωση των indexes μετά την αφαίρεση
      const updatedDayEntries = Object.keys(newDay)
                                .filter(key => parseInt(key) !== entryIdx)
                                .reduce((acc, key, newIdx) => {
                                    acc[newIdx] = newDay[key];
                                    return acc;
                                }, {});
      return { ...prev, [day]: updatedDayEntries };
    });
    setFilteredFoodOptions(prev => {
      const newDay = { ...prev[day] };
      delete newDay[entryIdx];
      const updatedDayEntries = Object.keys(newDay)
                                .filter(key => parseInt(key) !== entryIdx)
                                .reduce((acc, key, newIdx) => {
                                    acc[newIdx] = newDay[key];
                                    return acc;
                                }, {});
      return { ...prev, [day]: newDay };
    });
  };


  const handleSundayWeightChange = (value) => {
    setWeights(prevWeights => ({ ...prevWeights, Sunday: value }));
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

  // Αυτόματη αποθήκευση τρέχοντος εβδομαδιαίου βάρους (μόνο της Κυριακής) στο τρέχον μήνα/έτος
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = months[now.getMonth()];

    const sundayWeight = parseFloat(weights.Sunday);

    if (!isNaN(sundayWeight)) {
      setHistory(prev => ({
        ...prev,
        [year]: {
          ...prev[year],
          [month]: {
            ...prev[year]?.[month], // Keep existing BMI if any
            weight: sundayWeight,
            bmi: calculateBMI(sundayWeight, height)
          }
        }
      }));
    }
  }, [weights.Sunday, height]); // Εξαρτάται μόνο από το βάρος της Κυριακής και το ύψος

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

  useEffect(() => {
    localStorage.setItem('selectedHistoryYear', JSON.stringify(selectedYear));
  }, [selectedYear]);

  // useEffect για τον υπολογισμό των ημερήσιων θερμίδων και μακροστοιχείων όταν αλλάζουν τα σχετικά δεδομένα
  useEffect(() => {
    // Εύρεση του βάρους από την Κυριακή ή από το ιστορικό
    let currentWeight = 70; // Default βάρος

    // Προτεραιότητα 1: Βάρος από την Κυριακή του τρέχοντος `weights` state
    if (weights.Sunday && !isNaN(parseFloat(weights.Sunday))) {
      currentWeight = parseFloat(weights.Sunday);
    } else {
      // Προτεραιότητα 2: Το πιο πρόσφατο βάρος από το ιστορικό
      const sortedYears = Object.keys(history).sort();
      for (let i = sortedYears.length - 1; i >= 0; i--) {
        const year = sortedYears[i];
        // Λαμβάνουμε τους μήνες και τους ταξινομούμε για να πάρουμε τον πιο πρόσφατο
        const sortedMonths = Object.keys(history[year]).sort((a, b) => months.indexOf(a) - months.indexOf(b));
        for (let j = sortedMonths.length - 1; j >= 0; j--) {
          const month = sortedMonths[j];
          if (history[year][month]?.weight && !isNaN(parseFloat(history[year][month].weight))) { // Check if weight exists and is not empty
            currentWeight = parseFloat(history[year][month].weight);
            break; // Βρέθηκε βάρος, διακοπή εσωτερικού βρόχου
          }
        }
        if (currentWeight !== 70) break; // Βρέθηκε βάρος, διακοπή εξωτερικού βρόχου
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

    if (calculatedCalories) {
      const calculatedProtein = calculateDailyProtein(calculatedCalories, goal);
      const calculatedFat = calculateDailyFat(calculatedCalories, goal); // Διόρθωση ονόματος συνάρτησης
      const calculatedCarbs = calculateDailyCarbs(calculatedCalories, calculatedProtein, calculatedFat);

      setDailyProteinTarget(calculatedProtein);
      setDailyFatTarget(calculatedFat);
      setDailyCarbsTarget(calculatedCarbs);
    } else {
      setDailyProteinTarget(null);
      setDailyFatTarget(null);
      setDailyCarbsTarget(null);
    }

  }, [weights.Sunday, height, age, gender, activityLevel, goal, history]);

  // useEffect για να αρχικοποιήσει τα autocomplete inputs όταν φορτώνει το πλάνο
  // (Προσοχή: αυτό μπορεί να γίνει ένα bottleneck αν το πλάνο είναι τεράστιο,
  // αλλά για λογικά μεγέθη είναι εντάξει)
  useEffect(() => {
    const initialAutocompleteValues = {};
    for (const day in plan) {
      if (plan.hasOwnProperty(day)) {
        initialAutocompleteValues[day] = {};
        plan[day].forEach((meal, mealIdx) => {
          if (meal.type === 'meal') {
            initialAutocompleteValues[day][mealIdx] = {};
            meal.ingredients.forEach((ingredient, ingredientIdx) => {
              initialAutocompleteValues[day][mealIdx][ingredientIdx] = foodDatabase[ingredient.foodId]?.name || '';
            });
          }
        });
      }
    }
    setAutocompleteInput(initialAutocompleteValues);
  }, [plan]); // Εξαρτάται από το plan για την αρχική φόρτωση

  // useEffect για να κλείνει το autocomplete όταν κάνεις κλικ έξω
  useEffect(() => {
    function handleClickOutside(event) {
      // Ελέγχουμε όλες τις refs για τα autocomplete components
      for (const day in autocompleteContainerRefs.current) {
        for (const mealIdx in autocompleteContainerRefs.current[day]) {
          for (const ingredientIdx in autocompleteContainerRefs.current[day][mealIdx]) {
            if (autocompleteContainerRefs.current[day][mealIdx][ingredientIdx] &&
                !autocompleteContainerRefs.current[day][mealIdx][ingredientIdx].contains(event.target)) {
              // Κλείσε το autocomplete αν το κλικ έγινε έξω από αυτό το συγκεκριμένο autocomplete
              setFilteredFoodOptions(prev => ({
                ...prev,
                [day]: {
                  ...(prev[day] || {}),
                  [mealIdx]: {
                    ...(prev[day]?.[mealIdx] || {}),
                    [ingredientIdx]: []
                  }
                }
              }));
            }
          }
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Τρέχει μόνο μία φορά κατά το mount


  // Λογική για το γράφημα (BMI & Weight History)
  const chartLabels = [];
  const weightData = [];
  const bmiData = [];

  // Συλλέγουμε δεδομένα μόνο για το επιλεγμένο έτος
  const selectedYearData = history[selectedYear] || {};
  months.forEach(month => {
    const data = selectedYearData[month];
    if (data && (data.weight || data.bmi)) {
      chartLabels.push(`${month.substring(0, 3)}.`);
      weightData.push(data.weight ? parseFloat(data.weight) : null);
      bmiData.push(data.bmi ? parseFloat(data.bmi) : null);
    } else {
        // Προσθέτουμε κενά σημεία για μήνες χωρίς δεδομένα,
        // ώστε να μην "κολλάνε" οι γραμμές του γραφήματος
        chartLabels.push(`${month.substring(0, 3)}.`);
        weightData.push(null);
        bmiData.push(null);
    }
  });


  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Βάρος (kg)',
        data: weightData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
        yAxisID: 'y',
      },
      {
        label: 'BMI',
        data: bmiData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
        yAxisID: 'y1',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows chart to take parent div's height
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Ιστορικό Βάρους και BMI για το ${selectedYear}`,
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Βάρος (kg)'
        },
        min: 40, // Ελάχιστη τιμή για το βάρος
        max: 150 // Μέγιστη τιμή για το βάρος
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'BMI'
        },
        grid: {
          drawOnChartArea: false, // only draw borders for this axis
        },
        min: 15, // Ελάχιστη τιμή για το BMI
        max: 40 // Μέγιστη τιμή για το BMI
      },
    },
  };

  // Σύνοψη Εβδομάδας
  const weeklySummary = daysOfWeek.reduce((acc, day) => {
    plan[day].forEach(entry => {
      if (entry.type === 'meal') {
        const mealMacros = calculateMealMacros(entry.ingredients);
        acc.protein += mealMacros.protein;
        acc.fat += mealMacros.fat;
        acc.carbs += mealMacros.carbs;
        acc.calories += kcal(mealMacros.protein, mealMacros.fat, mealMacros.carbs);
      } else if (entry.type === 'activity') {
        acc.burnedCalories += entry.burn;
      }
    });
    return acc;
  }, { protein: 0, fat: 0, carbs: 0, calories: 0, burnedCalories: 0 });


  // **Λειτουργίες Export/Import**
  const exportData = () => {
    const data = {
      plan,
      weights,
      height,
      age,
      gender,
      activityLevel,
      goal,
      history
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fitness_tracker_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (importedData.plan) setPlan(importedData.plan);
          if (importedData.weights) setWeights(importedData.weights);
          if (importedData.height) setHeight(importedData.height);
          if (importedData.age) setAge(importedData.age);
          if (importedData.gender) setGender(importedData.gender);
          if (importedData.activityLevel) setActivityLevel(importedData.activityLevel);
          if (importedData.goal) setGoal(importedData.goal);
          if (importedData.history) {
            // Merge with generated history to ensure all years/months exist
            const generated = generateYearHistory();
            const mergedImportedHistory = { ...generated };
            for (const year in importedData.history) {
                if (importedData.history.hasOwnProperty(year)) {
                    mergedImportedHistory[year] = { ...mergedImportedHistory[year], ...importedData.history[year] };
                }
            }
            setHistory(mergedImportedHistory);
          }
          alert('Δεδομένα εισήχθησαν επιτυχώς!');
        } catch (error) {
          alert('Σφάλμα κατά την εισαγωγή δεδομένων: ' + error.message);
          console.error('Error importing data:', error);
        }
      };
      reader.readAsText(file);
    }
  };


  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>📊 Εβδομαδιαίο Πλάνο Διατροφής & Βάρους</h1>

      <div style={{ marginBottom: '30px', padding: '20px', borderRadius: '8px', background: '#f9f9f9', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginBottom: '20px', color: '#555', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Πληροφορίες Χρήστη & Στόχος</h2>

        {/* ΕΔΩ ΕΙΝΑΙ Η ΜΟΝΗ ΑΛΛΑΓΗ ΓΙΑ ΟΡΙΖΟΝΤΙΑ ΔΙΑΤΑΞΗ */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'space-between'
        }}>
            <div style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column' }}> {/* Ρύθμιση flex-basis για να χωράνε 5 στοιχεία */}
                <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>📏 Ύψος (σε μέτρα): </label>
                <input
                    type="number"
                    step="0.01"
                    value={height}
                    onChange={(e) => setHeight(parseFloat(e.target.value))}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
            </div>
            <div style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column' }}>
                <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>🎂 Ηλικία: </label>
                <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value))}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
            </div>
            <div style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column' }}>
                <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>🚻 Φύλο: </label>
                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                    <option value="male">Άνδρας</option>
                    <option value="female">Γυναίκα</option>
                </select>
            </div>
            <div style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column' }}>
                <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>🏃 Επίπεδο Δραστηριότητας: </label>
                <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                    <option value="sedentary">Καθιστική (Ελάχιστη άσκηση)</option>
                    <option value="light">Ελαφριά (1-3 φορές/εβδ.)</option>
                    <option value="moderate">Μέτρια (3-5 φορές/εβδ.)</option>
                    <option value="active">Ενεργή (6-7 φορές/εβδ.)</option>
                    <option value="veryActive">Πολύ Ενεργή (Σκληρή άσκηση/Φυσική εργασία)</option>
                </select>
            </div>
            <div style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column' }}>
                <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>🎯 Στόχος: </label>
                <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                    <option value="maintain">Διατήρηση</option>
                    <option value="bulk">Όγκος</option>
                    <option value="cut">Γράμμωση</option>
                </select>
            </div>
        </div>

        {dailyCalorieTarget && (
          <div style={{
            marginTop: '25px',
            padding: '15px',
            background: '#e8f5e9',
            borderRadius: '6px',
            textAlign: 'center',
            boxShadow: '0 1px 5px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#388e3c' }}>Συνιστώμενοι Ημερήσιοι Στόχοι:</h3>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '15px' }}>
                <div style={{ flex: '1 1 150px', padding: '10px', background: '#fff', borderRadius: '5px', border: '1px solid #c8e6c9' }}>
                    <p style={{ margin: '0', fontSize: '0.9em', color: '#555' }}>Θερμίδες</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '1.5em', fontWeight: 'bold', color: '#4caf50' }}>{dailyCalorieTarget} kcal</p>
                </div>
                <div style={{ flex: '1 1 150px', padding: '10px', background: '#fff', borderRadius: '5px', border: '1px solid #b3e5fc' }}>
                    <p style={{ margin: '0', fontSize: '0.9em', color: '#555' }}>Πρωτεΐνη</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '1.5em', fontWeight: 'bold', color: '#03a9f4' }}>{dailyProteinTarget} g</p>
                </div>
                <div style={{ flex: '1 1 150px', padding: '10px', background: '#fff', borderRadius: '5px', border: '1px solid #ffecb3' }}>
                    <p style={{ margin: '0', fontSize: '0.9em', color: '#555' }}>Λίπος</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '1.5em', fontWeight: 'bold', color: '#ffc107' }}>{dailyFatTarget} g</p>
                </div>
                <div style={{ flex: '1 1 150px', padding: '10px', background: '#fff', borderRadius: '5px', border: '1px solid #ffcdd2' }}>
                    <p style={{ margin: '0', fontSize: '0.9em', color: '#555' }}>Υδατάνθρακες</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '1.5em', fontWeight: 'bold', color: '#f44336' }}>{dailyCarbsTarget} g</p>
                </div>
            </div>
          </div>
        )}
      </div>

      {Object.entries(plan).map(([day, entriesForDay], dayIndex) => {
        let totalP = 0, totalF = 0, totalC = 0, burn = 0;

        entriesForDay.forEach(entry => {
          if (entry.type === 'meal') {
            const mealMacros = calculateMealMacros(entry.ingredients);
            totalP += mealMacros.protein;
            totalF += mealMacros.fat;
            totalC += mealMacros.carbs;
          } else if (entry.type === 'activity') {
            burn += entry.burn;
          }
        });

        // Στρογγυλοποίηση των συνολικών για την ημέρα
        const totalKcal = kcal(totalP, totalF, totalC);
        const netKcal = totalKcal - burn;
        const bmi = calculateBMI(weights.Sunday, height);


        return (
          <div key={day} style={{ marginBottom: '40px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h2 style={{ color: '#333', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>{day}</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#eee' }}>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Γεύμα / Δραστηριότητα</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Τροφή / Συστατικό</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Ποσότητα</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Πρωτεΐνη (g)</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Λίπος (g)</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Υδατάνθρακες (g)</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Θερμίδες (kcal)</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Ενέργεια που καίγεται (kcal)</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Ενέργεια Καθαρή (kcal)</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Ενέργεια Διατήρησης (kcal)</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Ενέργεια για Όγκο (kcal)</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Ενέργεια για Γράμμωση (kcal)</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Ενέργεια Στόχου (kcal)</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Ενέργεια Εβδομαδιαία (kcal)</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Βάρος (kg)</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>BMI</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Ενέργεια καίγεται (kcal)</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Ενέργεια από άσκηση (kcal)</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Δράση</th>
                </tr>
              </thead>
              <tbody>
                {entriesForDay.map((entry, entryIdx) => {
                  let mealP = 0, mealF = 0, mealC = 0, mealKcal = 0;
                  if (entry.type === 'meal') {
                    const mealMacros = calculateMealMacros(entry.ingredients);
                    mealP = mealMacros.protein;
                    mealF = mealMacros.fat;
                    mealC = mealMacros.carbs;
                    mealKcal = kcal(mealP, mealF, mealC);
                  }

                  const previousWeight = dayIndex > 0 && history[selectedYear] && history[selectedYear][months[new Date().getMonth()]]?.weight
                                       ? parseFloat(history[selectedYear][months[new Date().getMonth()]].weight) : null;
                  const previousBmi = dayIndex > 0 && history[selectedYear] && history[selectedYear][months[new Date().getMonth()]]?.bmi
                                    ? parseFloat(history[selectedYear][months[new Date().getMonth()]].bmi) : null;

                  return (
                    <React.Fragment key={entryIdx}>
                      <tr style={{ background: entry.type === 'meal' ? '#f0f8ff' : '#fff3e0' }}>
                        <td style={{ padding: '10px', border: '1px solid #ccc', fontWeight: 'bold' }}>
                          {entry.type === 'meal' ? entry.meal : entry.activity}
                          <div style={{ marginTop: '5px' }}>
                            {entry.type === 'meal' && (
                              <button onClick={() => addIngredient(day, entryIdx)} style={{ marginRight: '5px', padding: '5px 10px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Προσθήκη Συστατικού</button>
                            )}
                            <button onClick={() => removeEntry(day, entryIdx)} style={{ padding: '5px 10px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Αφαίρεση</button>
                          </div>
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                          {entry.type === 'meal' ? (
                            <div>
                              {entry.ingredients.map((ingredient, ingredientIdx) => {
                                const foodInfo = foodDatabase[ingredient.foodId];
                                const currentAutocompleteInput = autocompleteInput[day]?.[entryIdx]?.[ingredientIdx] || '';
                                const currentFilteredOptions = filteredFoodOptions[day]?.[entryIdx]?.[ingredientIdx] || [];

                                // Δυναμική ρύθμιση του ref για κάθε κοντέινερ autocomplete
                                if (!autocompleteContainerRefs.current[day]) autocompleteContainerRefs.current[day] = {};
                                if (!autocompleteContainerRefs.current[day][entryIdx]) autocompleteContainerRefs.current[day][entryIdx] = {};

                                return (
                                  <div
                                    key={ingredientIdx}
                                    style={{ marginBottom: '5px', position: 'relative' }}
                                    ref={el => {
                                      autocompleteContainerRefs.current[day][entryIdx][ingredientIdx] = el;
                                    }}
                                  >
                                    <input
                                      type="text"
                                      value={currentAutocompleteInput}
                                      onChange={(e) => handleAutocompleteInputChange(day, entryIdx, ingredientIdx, e.target.value)}
                                      placeholder="Αναζήτηση τροφής..."
                                      style={{ padding: '5px', width: '90%', borderRadius: '3px', border: '1px solid #ccc' }}
                                    />
                                    {currentFilteredOptions.length > 0 && (
                                      <ul style={{
                                        position: 'absolute',
                                        zIndex: 1000,
                                        background: 'white',
                                        border: '1px solid #ddd',
                                        listStyle: 'none',
                                        margin: '0',
                                        padding: '0',
                                        width: '100%',
                                        maxHeight: '150px',
                                        overflowY: 'auto',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                      }}>
                                        {currentFilteredOptions.map(option => (
                                          <li
                                            key={option.id}
                                            onClick={() => handleFoodSelect(day, entryIdx, ingredientIdx, option.id)}
                                            style={{ padding: '8px', cursor: 'pointer', '&:hover': { background: '#f0f0f0' } }}
                                          >
                                            {option.name} ({option.unit})
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                    <button onClick={() => removeIngredient(day, entryIdx, ingredientIdx)} style={{ marginLeft: '5px', padding: '3px 8px', background: '#e0e0e0', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>X</button>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={entry.activity}
                              onChange={(e) => handleMealIngredientChange(day, entryIdx, null, 'activity', e.target.value)}
                              style={{ padding: '5px', width: '100%', borderRadius: '3px', border: '1px solid #ccc' }}
                            />
                          )}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                          {entry.type === 'meal' ? (
                            entry.ingredients.map((ingredient, ingredientIdx) => (
                              <div key={ingredientIdx} style={{ marginBottom: '5px' }}>
                                <input
                                  type="number"
                                  value={ingredient.quantity}
                                  onChange={(e) => handleMealIngredientChange(day, entryIdx, ingredientIdx, 'quantity', e.target.value)}
                                  style={{ padding: '5px', width: '80px', borderRadius: '3px', border: '1px solid #ccc' }}
                                />
                                <span style={{ marginLeft: '5px', fontSize: '0.9em', color: '#777' }}>
                                  {foodDatabase[ingredient.foodId]?.unit || 'g'}
                                </span>
                              </div>
                            ))
                          ) : (
                            <input
                              type="number"
                              value={entry.burn}
                              onChange={(e) => handleMealIngredientChange(day, entryIdx, null, 'burn', e.target.value)}
                              style={{ padding: '5px', width: '80px', borderRadius: '3px', border: '1px solid #ccc' }}
                            />
                          )}
                        </td>
                        {/* Εμφάνιση μακροστοιχείων και θερμίδων ανά γεύμα/δραστηριότητα */}
                        <td style={{ padding: '10px', border: '1px solid #ccc' }}>{entry.type === 'meal' ? mealP : '-'}</td>
                        <td style={{ padding: '10px', border: '1px solid #ccc' }}>{entry.type === 'meal' ? mealF : '-'}</td>
                        <td style={{ padding: '10px', border: '1px solid #ccc' }}>{entry.type === 'meal' ? mealC : '-'}</td>
                        <td style={{ padding: '10px', border: '1px solid #ccc' }}>{entry.type === 'meal' ? mealKcal : '-'}</td>
                        <td style={{ padding: '10px', border: '1px solid #ccc' }}>{entry.type === 'activity' ? entry.burn : '-'}</td>
                        <td style={{ padding: '10px', border: '1px solid #ccc' }}>{entry.type === 'meal' ? mealKcal : -entry.burn || '-'}</td>
                        <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                            {dailyCalorieTarget ? Math.round(dailyCalorieTarget) : '-'}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                            {calculateDailyCalories(weights.Sunday || 70, height, age, gender, activityLevel, 'bulk') || '-'}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                            {calculateDailyCalories(weights.Sunday || 70, height, age, gender, activityLevel, 'cut') || '-'}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                            {dailyCalorieTarget || '-'}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                            {dailyCalorieTarget ? dailyCalorieTarget * 7 : '-'}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                          {day === 'Sunday' ? (
                            <input
                              type="number"
                              step="0.1"
                              value={weights.Sunday}
                              onChange={(e) => handleSundayWeightChange(e.target.value)}
                              style={{
                                padding: '5px',
                                width: '60px',
                                borderRadius: '3px',
                                border: '1px solid #ddd',
                                color: getComparisonColor(parseFloat(weights.Sunday), previousWeight, true)
                              }}
                            />
                          ) : '-'}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                          {day === 'Sunday' ? (
                            <span style={{ color: getComparisonColor(bmi, previousBmi, false) }}>
                              {bmi !== null ? bmi : '-'}
                            </span>
                          ) : '-'}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ccc' }}>{entry.type === 'activity' ? entry.burn : '-'}</td>
                        <td style={{ padding: '10px', border: '1px solid #ccc' }}>{entry.type === 'activity' ? entry.burn : '-'}</td>
                        <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
                {/* Γραμμή για τα σύνολα της ημέρας */}
                <tr style={{ background: '#e6f7ff', fontWeight: 'bold' }}>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>Σύνολα Ημέρας</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}></td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}></td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{totalP.toFixed(1)}</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{totalF.toFixed(1)}</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{totalC.toFixed(1)}</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{totalKcal}</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{burn}</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{netKcal}</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                    {dailyCalorieTarget ? Math.round(dailyCalorieTarget) : '-'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                    {calculateDailyCalories(weights.Sunday || 70, height, age, gender, activityLevel, 'bulk') || '-'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                    {calculateDailyCalories(weights.Sunday || 70, height, age, gender, activityLevel, 'cut') || '-'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                    {dailyCalorieTarget || '-'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                      {dailyCalorieTarget ? dailyCalorieTarget * 7 : '-'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{day === 'Sunday' ? weights.Sunday || '-' : '-'}</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{day === 'Sunday' && weights.Sunday ? calculateBMI(parseFloat(weights.Sunday), height) : '-'}</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{burn}</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{burn}</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}></td>
                </tr>
              </tbody>
            </table>
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              <button onClick={() => addMeal(day, 'Νέο Γεύμα')} style={{ padding: '8px 15px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Προσθήκη Γεύματος</button>
              <button onClick={() => addActivity(day)} style={{ padding: '8px 15px', background: '#FF9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Προσθήκη Δραστηριότητας</button>
            </div>
          </div>
        );
      })}

      <div style={{ marginTop: '40px', padding: '20px', borderRadius: '8px', background: '#f9f9f9', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginBottom: '20px', color: '#555', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Σύνοψη Εβδομάδας</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px', textAlign: 'center' }}>
          <div style={{ flex: '1 1 180px', padding: '15px', background: '#e3f2fd', borderRadius: '6px', border: '1px solid #bbdefb' }}>
            <p style={{ margin: '0', fontSize: '1em', color: '#42a5f5', fontWeight: 'bold' }}>Συνολική Πρωτεΐνη</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '1.8em', fontWeight: 'bold', color: '#1e88e5' }}>{weeklySummary.protein.toFixed(1)} g</p>
          </div>
          <div style={{ flex: '1 1 180px', padding: '15px', background: '#fff3e0', borderRadius: '6px', border: '1px solid #ffe0b2' }}>
            <p style={{ margin: '0', fontSize: '1em', color: '#ffb300', fontWeight: 'bold' }}>Συνολικό Λίπος</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '1.8em', fontWeight: 'bold', color: '#fb8c00' }}>{weeklySummary.fat.toFixed(1)} g</p>
          </div>
          <div style={{ flex: '1 1 180px', padding: '15px', background: '#ffebee', borderRadius: '6px', border: '1px solid #ffcdd2' }}>
            <p style={{ margin: '0', fontSize: '1em', color: '#e57373', fontWeight: 'bold' }}>Συνολικοί Υδατάνθρακες</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '1.8em', fontWeight: 'bold', color: '#ef5350' }}>{weeklySummary.carbs.toFixed(1)} g</p>
          </div>
          <div style={{ flex: '1 1 180px', padding: '15px', background: '#e8f5e9', borderRadius: '6px', border: '1px solid #c8e6c9' }}>
            <p style={{ margin: '0', fontSize: '1em', color: '#66bb6a', fontWeight: 'bold' }}>Συνολικές Θερμίδες (Κατανάλωση)</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '1.8em', fontWeight: 'bold', color: '#43a047' }}>{weeklySummary.calories} kcal</p>
          </div>
          <div style={{ flex: '1 1 180px', padding: '15px', background: '#e0f2f7', borderRadius: '6px', border: '1px solid #b2ebf2' }}>
            <p style={{ margin: '0', fontSize: '1em', color: '#4dd0e1', fontWeight: 'bold' }}>Συνολικές Θερμίδες (Καμένες)</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '1.8em', fontWeight: 'bold', color: '#00bcd4' }}>{weeklySummary.burnedCalories} kcal</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', borderRadius: '8px', background: '#f9f9f9', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginBottom: '20px', color: '#555', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Ιστορικό Βάρους & BMI</h2>

        <div style={{ marginBottom: '20px' }}>
            <label style={{ marginRight: '10px', fontWeight: 'bold', color: '#666' }}>Επιλογή Έτους: </label>
            <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
                {Object.keys(history).sort((a, b) => b - a).map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
        </div>

        <div style={{ height: '400px', width: '100%' }}> {/* Εδώ ορίζουμε σταθερό ύψος για το γράφημα */}
          <Line data={chartData} options={chartOptions} />
        </div>

        <div style={{ marginTop: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#555' }}>Εισαγωγή/Επεξεργασία Ιστορικού:</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#eee' }}>
                <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Μήνας</th>
                <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Βάρος (kg)</th>
                <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>BMI</th>
              </tr>
            </thead>
            <tbody>
              {months.map(month => {
                const currentWeight = history[selectedYear]?.[month]?.weight;
                const currentBmi = history[selectedYear]?.[month]?.bmi;

                // Βρίσκουμε τον προηγούμενο μήνα στο επιλεγμένο έτος (ή το τελευταίο διαθέσιμο)
                const monthIndex = months.indexOf(month);
                let previousWeightForColor = null;
                let previousBmiForColor = null;

                if (monthIndex > 0) {
                    // Ελέγχουμε τον προηγούμενο μήνα στο ίδιο έτος
                    previousWeightForColor = history[selectedYear]?.[months[monthIndex - 1]]?.weight;
                    previousBmiForColor = history[selectedYear]?.[months[monthIndex - 1]]?.bmi;
                } else if (selectedYear > Object.keys(history).map(Number).sort((a,b)=>a-b)[0]) { // Αν είναι Ιανουάριος, ελέγχουμε τον Δεκέμβριο του προηγούμενου έτους
                    const prevYear = selectedYear - 1;
                    previousWeightForColor = history[prevYear]?.[months[11]]?.weight;
                    previousBmiForColor = history[prevYear]?.[months[11]]?.bmi;
                }


                return (
                  <tr key={month}>
                    <td style={{ padding: '10px', border: '1px solid #ccc' }}>{month}</td>
                    <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                      <input
                        type="number"
                        step="0.1"
                        value={currentWeight}
                        onChange={(e) => handleHistoryChange(selectedYear, month, e.target.value, 'weight')}
                        style={{
                          padding: '5px',
                          width: '80px',
                          borderRadius: '3px',
                          border: '1px solid #ddd',
                          color: getComparisonColor(currentWeight, previousWeightForColor, true)
                        }}
                      />
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                      <span style={{ color: getComparisonColor(currentBmi, previousBmiForColor, false) }}>
                        {currentBmi !== null ? currentBmi : '-'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', borderRadius: '8px', background: '#f9f9f9', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px', color: '#555', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Διαχείριση Δεδομένων</h2>
        <button onClick={exportData} style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>
          Εξαγωγή Δεδομένων
        </button>
        <input
          type="file"
          accept=".json"
          onChange={importData}
          style={{ display: 'none' }}
          id="importFile"
        />
        <label htmlFor="importFile" style={{ padding: '10px 20px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Εισαγωγή Δεδομένων
        </label>
      </div>

    </div>
  );
}
