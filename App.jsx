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
    // Στρογγυλοποίηση εδώ για ακρίβεια 1 δεκαδικού
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

// ΝΕΑ ΣΥΝΑΡΤΗΣΗ: Υπολογίζει το χρώμα με βάση τη σύγκριση προηγούμενης/τρέχουσας τιμής
function getComparisonColor(currentValue, previousValue) {
  if (currentValue === null || previousValue === null || isNaN(currentValue) || isNaN(previousValue)) {
    return 'black'; // Εάν δεν υπάρχουν τιμές, μένει μαύρο
  }

  if (currentValue < previousValue) {
    return 'green'; // Έχει πέσει
  } else if (currentValue > previousValue) {
    return 'red'; // Έχει ανέβει
  } else {
    return 'black'; // Δεν έχει αλλάξει
  }
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

  // State για τις υπολογιζόμενες ημερήσιες θερμίδες και μακροστοιχεία
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(null);
  const [dailyProteinTarget, setDailyProteinTarget] = useState(null);
  const [dailyFatTarget, setDailyFatTarget] = useState(null);
  const [dailyCarbsTarget, setDailyCarbsTarget] = useState(null);

  // States για Autocomplete
  const [autocompleteInput, setAutocompleteInput] = useState({}); // {day: {mealIdx: {ingredientIdx: 'current_input_text'}}}
  const [filteredFoodOptions, setFilteredFoodOptions] = useState({}); // {day: {mealIdx: {ingredientIdx: [filtered_options]}}}
  // Χρήση του useRef για να διαχειριστούμε το κλείσιμο του autocomplete όταν ο χρήστης κάνει κλικ έξω
  const autocompleteRefs = useRef({});


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
          entry[field] = parseInt(value) || 0;
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
    // Κρύψιμο των προτάσεων
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
            delete newMeal[ingredientIdx];
            newDay[mealIdx] = newMeal;
        }
        return { ...prev, [day]: newDay };
    });
    setFilteredFoodOptions(prev => {
        const newDay = { ...prev[day] };
        if (newDay[mealIdx]) {
            const newMeal = { ...newDay[mealIdx] };
            delete newMeal[ingredientIdx];
            newDay[mealIdx] = newMeal;
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
      delete newDay[entryIdx];
      return { ...prev, [day]: newDay };
    });
    setFilteredFoodOptions(prev => {
      const newDay = { ...prev[day] };
      delete newDay[entryIdx];
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
          if (history[year][month]?.weight) { // Check if weight exists and is not empty
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
      const calculatedFat = calculateDailyFat(calculatedCalories, goal);
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
      // Ελέγχουμε όλα τα refs για τα autocomplete components
      for (const day in autocompleteRefs.current) {
        for (const mealIdx in autocompleteRefs.current[day]) {
          for (const ingredientIdx in autocompleteRefs.current[day][mealIdx]) {
            if (autocompleteRefs.current[day][mealIdx][ingredientIdx] &&
                !autocompleteRefs.current[day][mealIdx][ingredientIdx].contains(event.target)) {
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

  const sortedYears = Object.keys(history).sort();
  sortedYears.forEach(year => {
    months.forEach(month => {
      const data = history[year]?.[month];
      if (data && (data.weight || data.bmi)) { // Μόνο αν υπάρχει κάποιο δεδομένο
        chartLabels.push(`${month.substring(0, 3)} ${year.slice(-2)}`); // π.χ., "Ιαν 25"
        weightData.push(data.weight ? parseFloat(data.weight) : null);
        bmiData.push(data.bmi ? parseFloat(data.bmi) : null);
      }
    });
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
        text: 'Ιστορικό Βάρους και BMI',
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
          if (importedData.history) setHistory(importedData.history);
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>📏 Ύψος (σε μέτρα): </label>
                <input
                    type="number"
                    step="0.01"
                    value={height}
                    onChange={(e) => setHeight(parseFloat(e.target.value))}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>🎂 Ηλικία: </label>
                <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value))}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column' }}>
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
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Υδατ. (g)</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Θερμίδες (kcal)</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Ενέργειες</th>
                </tr>
              </thead>
              <tbody>
                {entriesForDay.map((entry, entryIdx) => (
                  entry.type === 'meal' ? (
                    <>
                      <tr key={`${day}-${entryIdx}-meal-header`} style={{ background: '#f9f9f9', fontWeight: 'bold' }}>
                        <td rowSpan={entry.ingredients.length + 1} style={{ padding: '10px', border: '1px solid #ccc', verticalAlign: 'top' }}>
                            {entry.meal}
                            <br/>
                            <button
                              onClick={() => removeEntry(day, entryIdx)}
                              style={{ background: '#dc3545', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em', marginTop: '5px' }}
                            >
                              Αφαίρεση Γεύματος
                            </button>
                        </td>
                        <td colSpan="7" style={{ border: 'none' }}></td>
                      </tr>
                      {entry.ingredients.map((ingredient, ingredientIdx) => {
                        const foodInfo = foodDatabase[ingredient.foodId];
                        if (!foodInfo && ingredient.foodId !== '') {
                          console.warn(`Food ID "${ingredient.foodId}" not found in foodDatabase.`);
                        }

                        const multiplier = (foodInfo?.unit === 'τεμάχιο' || foodInfo?.unit === 'ml')
                          ? ingredient.quantity
                          : ingredient.quantity / 100;

                        const p = parseFloat(((foodInfo?.protein || 0) * multiplier).toFixed(1));
                        const f = parseFloat(((foodInfo?.fat || 0) * multiplier).toFixed(1));
                        const c = parseFloat(((foodInfo?.carbs || 0) * multiplier).toFixed(1));
                        const itemKcal = kcal(p, f, c); // Χρησιμοποιεί την τροποποιημένη kcal

                        if (!autocompleteRefs.current[day]) autocompleteRefs.current[day] = {};
                        if (!autocompleteRefs.current[day][entryIdx]) autocompleteRefs.current[day][entryIdx] = {};
                        if (!autocompleteRefs.current[day][entryIdx][ingredientIdx]) {
                            autocompleteRefs.current[day][entryIdx][ingredientIdx] = React.createRef();
                        }

                        return (
                          <tr key={`${day}-${entryIdx}-${ingredientIdx}`}>
                            <td style={{ position: 'relative', padding: '8px', border: '1px solid #eee' }}>
                                <input
                                    type="text"
                                    value={autocompleteInput[day]?.[entryIdx]?.[ingredientIdx] || ''}
                                    onChange={e => handleAutocompleteInputChange(day, entryIdx, ingredientIdx, e.target.value)}
                                    onFocus={e => handleAutocompleteInputChange(day, entryIdx, ingredientIdx, e.target.value)}
                                    placeholder="Αναζήτηση τροφής..."
                                    style={{ width: '150px', padding: '6px', borderRadius: '4px', border: '1px solid #ddd' }}
                                />
                                {filteredFoodOptions[day]?.[entryIdx]?.[ingredientIdx]?.length > 0 && (
                                    <ul
                                        ref={autocompleteRefs.current[day][entryIdx][ingredientIdx]}
                                        style={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            zIndex: 100,
                                            listStyle: 'none',
                                            margin: 0,
                                            padding: 0,
                                            border: '1px solid #ccc',
                                            backgroundColor: 'white',
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                            width: 'calc(100% + 2px)', // +2px for border
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        {filteredFoodOptions[day][entryIdx][ingredientIdx].map(food => (
                                            <li
                                                key={food.id}
                                                onClick={() => handleFoodSelect(day, entryIdx, ingredientIdx, food.id)}
                                                style={{
                                                    padding: '8px',
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid #eee'
                                                }}
                                                onMouseEnter={e => e.target.style.backgroundColor = '#f0f0f0'}
                                                onMouseLeave={e => e.target.style.backgroundColor = 'white'}
                                            >
                                                {food.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </td>
                            <td style={{ padding: '8px', border: '1px solid #eee' }}>
                              <input
                                type="number"
                                step="0.1"
                                value={ingredient.quantity || ''}
                                onChange={e => handleMealIngredientChange(day, entryIdx, ingredientIdx, 'quantity', e.target.value)}
                                style={{ width: '80px', padding: '6px', borderRadius: '4px', border: '1px solid #ddd' }}
                              /> {foodInfo?.unit || ''}
                            </td>
                            <td style={{ padding: '8px', border: '1px solid #eee' }}>{p}</td>
                            <td style={{ padding: '8px', border: '1px solid #eee' }}>{f}</td>
                            <td style={{ padding: '8px', border: '1px solid #eee' }}>{c}</td>
                            <td style={{ padding: '8px', border: '1px solid #eee' }}>{itemKcal}</td>
                            <td style={{ padding: '8px', border: '1px solid #eee' }}>
                              <button onClick={() => removeIngredient(day, entryIdx, ingredientIdx)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                                Αφαίρεση
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {/* Σύνολα για το κάθε γεύμα */}
                      <tr style={{ background: '#f0f0f0', fontWeight: 'bold' }}>
                        <td colSpan="2" style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'right' }}>Σύνολο Γεύματος</td>
                        <td style={{ padding: '10px', border: '1px solid #ccc' }}>{calculateMealMacros(entry.ingredients).protein}</td>
                        <td style={{ padding: '10px', border: '1px solid #ccc' }}>{calculateMealMacros(entry.ingredients).fat}</td>
                        <td style={{ padding: '10px', border: '1px solid #ccc' }}>{calculateMealMacros(entry.ingredients).carbs}</td>
                        <td style={{ padding: '10px', border: '1px solid #ccc' }}>{kcal(calculateMealMacros(entry.ingredients).protein, calculateMealMacros(entry.ingredients).fat, calculateMealMacros(entry.ingredients).carbs)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                          <button onClick={() => addIngredient(day, entryIdx)} style={{ background: '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                            Προσθήκη Συστατικού
                          </button>
                        </td>
                      </tr>
                    </>
                  ) : (
                    // Για δραστηριότητες
                    <tr key={`${day}-${entryIdx}`} style={{ background: '#f0f8ff' }}>
                      <td style={{ padding: '10px', border: '1px solid #ccc', fontWeight: 'bold' }}>
                        <input
                          type="text"
                          value={entry.activity || ''}
                          onChange={e => handleMealIngredientChange(day, entryIdx, null, 'activity', e.target.value)}
                          placeholder="Περιγραφή Δραστηριότητας"
                          style={{ width: '150px', padding: '6px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                        <br/>
                        <button
                          onClick={() => removeEntry(day, entryIdx)}
                          style={{ background: '#dc3545', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em', marginTop: '5px' }}
                        >
                          Αφαίρεση Δραστηριότητας
                        </button>
                      </td>
                      <td colSpan="4" style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'right' }}>Θερμίδες Καύσης:</td>
                      <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                        <input
                          type="number"
                          value={entry.burn || ''}
                          onChange={e => handleMealIngredientChange(day, entryIdx, null, 'burn', e.target.value)}
                          style={{ width: '80px', padding: '6px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                      </td>
                      <td colSpan="2" style={{ border: '1px solid #ccc' }}></td>
                    </tr>
                  )
                ))}
                {/* Συνολικά για την ημέρα */}
                <tr style={{ background: '#d0e0ff', fontWeight: 'bold', fontSize: '1.1em' }}>
                  <td colSpan="6" style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Σύνολο Ημέρας (Θερμίδες):</td> {/* Αλλαγή εδώ */}
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{totalKcal} kcal</td>
                  <td colSpan="1" style={{ border: '1px solid #ccc' }}></td>
                </tr>
                {/* ΝΕΕΣ ΓΡΑΜΜΕΣ ΓΙΑ ΣΥΝΟΛΙΚΑ ΜΑΚΡΟΣΤΟΙΧΕΙΑ ΗΜΕΡΑΣ */}
                <tr style={{ background: '#d0e0ff', fontWeight: 'bold', fontSize: '1.1em' }}>
                  <td colSpan="6" style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Σύνολο Ημέρας (Πρωτεΐνη):</td> {/* Αλλαγή εδώ */}
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{Math.round(totalP)} g</td>
                  <td colSpan="1" style={{ border: '1px solid #ccc' }}></td>
                </tr>
                <tr style={{ background: '#d0e0ff', fontWeight: 'bold', fontSize: '1.1em' }}>
                  <td colSpan="6" style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Σύνολο Ημέρας (Λιπαρά):</td> {/* Αλλαγή εδώ */}
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{Math.round(totalF)} g</td>
                  <td colSpan="1" style={{ border: '1px solid #ccc' }}></td>
                </tr>
                <tr style={{ background: '#d0e0ff', fontWeight: 'bold', fontSize: '1.1em' }}>
                  <td colSpan="6" style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Σύνολο Ημέρας (Υδατάνθρακες):</td> {/* Αλλαγή εδώ */}
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{Math.round(totalC)} g</td>
                  <td colSpan="1" style={{ border: '1px solid #ccc' }}></td>
                </tr>
                {burn > 0 && (
                  <>
                    <tr style={{ color: 'green', background: '#e6ffe6' }}>
                      <td colSpan="6" style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Κατανάλωση θερμίδων από Δραστηριότητες:</td> {/* Αλλαγή εδώ */}
                      <td style={{ padding: '10px', border: '1px solid #ccc' }}>-{burn} kcal</td>
                      <td colSpan="1" style={{ border: '1px solid #ccc' }}></td>
                    </tr>
                    <tr style={{ background: '#ccffcc', fontWeight: 'bold', fontSize: '1.1em' }}>
                      <td colSpan="6" style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Καθαρό θερμιδικό ισοζύγιο:</td> {/* Αλλαγή εδώ */}
                      <td style={{ padding: '10px', border: '1px solid #ccc' }}>{netKcal} kcal</td>
                      <td colSpan="1" style={{ border: '1px solid #ccc' }}></td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <select
                    onChange={(e) => addMeal(day, e.target.value)}
                    value=""
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                    <option value="" disabled>Προσθήκη Γεύματος...</option>
                    <option value="Πρωινό">Πρωινό</option>
                    <option value="Σνακ 1">Σνακ 1</option>
                    <option value="Μεσημεριανό">Μεσημεριανό</option>
                    <option value="Σνακ 2">Σνακ 2</option>
                    <option value="Βραδινό">Βραδινό</option>
                </select>
                <button
                    onClick={() => addActivity(day)}
                    style={{ background: '#6c757d', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Προσθήκη Δραστηριότητας
                </button>
            </div>


            {day === 'Sunday' && (
              <div style={{ marginTop: '20px', padding: '15px', background: '#e8f5e9', borderRadius: '6px', boxShadow: '0 1px 5px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <label style={{ fontWeight: 'bold', color: '#666' }}>Βάρος σώματος (kg): </label>
                <input
                  type="number"
                  step="0.1"
                  value={weights.Sunday || ''}
                  onChange={e => handleSundayWeightChange(e.target.value)}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', width: '100px' }}
                />
                {bmi && (
                  <span style={{ marginLeft: '10px', fontSize: '1.1em', color: '#388e3c' }}>BMI: <strong>{bmi}</strong></span>
                )}
              </div>
            )}
          </div>
        );
      })}

      <h2 style={{ marginTop: '40px', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>📅 Ιστορικό Βάρους & BMI</h2>
      <div style={{ overflowX: 'auto', marginBottom: '20px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', minWidth: '1200px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th rowSpan="2" style={{ background: '#ddd', padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>Έτος</th>
              {months.map(month => (
                <th key={month} colSpan="2" style={{ background: '#cceeff', padding: '10px', textAlign: 'center', border: '1px solid #ccc' }}>{month}</th>
              ))}
            </tr>
            <tr>
              {months.map(month => (
                <React.Fragment key={`${month}-sub`}>
                  <th style={{ background: '#f0f8ff', padding: '8px', textAlign: 'center', border: '1px solid #ccc', fontSize: '0.9em' }}>Βάρος (kg)</th>
                  <th style={{ background: '#f0f8ff', padding: '8px', textAlign: 'center', border: '1px solid #ccc', fontSize: '0.9em' }}>BMI</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(history).sort().map((year, yearIndex, sortedYears) => {
              const currentYearData = history[year] || {}; // Ensure currentYearData exists
              return (
                <tr key={year}>
                  <td style={{ background: '#eee', fontWeight: 'bold', padding: '10px', border: '1px solid #ccc' }}>{year}</td>
                  {months.map((month, monthIndex) => {
                    const values = currentYearData[month] || { weight: '', bmi: '' };

                    // Find previous month's data for comparison
                    let prevWeight = null;
                    let prevBMI = null;

                    if (monthIndex > 0) {
                      // Previous month in the same year
                      const prevMonth = months[monthIndex - 1];
                      prevWeight = currentYearData[prevMonth]?.weight;
                      prevBMI = currentYearData[prevMonth]?.bmi;
                    } else if (yearIndex > 0) {
                      // Previous month is December of the previous year
                      const prevYear = sortedYears[yearIndex - 1];
                      prevWeight = history[prevYear]?.['Δεκέμβριος']?.weight;
                      prevBMI = history[prevYear]?.['Δεκέμβριος']?.bmi;
                    }

                    const weightColor = getComparisonColor(parseFloat(values.weight), parseFloat(prevWeight));
                    const bmiColor = getComparisonColor(parseFloat(values.bmi), parseFloat(prevBMI));

                    return (
                      <React.Fragment key={`${year}-${month}-data`}>
                        <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>
                          <input
                            type="number"
                            step="0.1"
                            value={values.weight || ''}
                            onChange={e => handleHistoryChange(year, month, e.target.value, 'weight')}
                            style={{
                              width: '60px',
                              border: '1px solid #ddd',
                              padding: '6px',
                              borderRadius: '4px',
                              color: weightColor
                            }}
                          />
                        </td>
                        <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc', fontWeight: 'bold', color: bmiColor }}>
                          {values.bmi || ''}
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: '30px', padding: '20px', borderRadius: '8px', background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', height: '400px' }}>
        <h3 style={{ marginBottom: '15px', color: '#555', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Γράφημα Ιστορικού</h3>
        <Line data={chartData} options={chartOptions} />
      </div>

      <div style={{ marginBottom: '30px', padding: '20px', borderRadius: '8px', background: '#e0f7fa', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginBottom: '20px', color: '#00796b', borderBottom: '1px solid #b2ebf2', paddingBottom: '10px' }}>Σύνοψη Εβδομάδας</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '15px', textAlign: 'center' }}>
          <div style={{ flex: '1 1 180px', padding: '10px', background: '#fff', borderRadius: '5px', border: '1px solid #80deea' }}>
            <p style={{ margin: '0', fontSize: '0.9em', color: '#555' }}>Συνολικές Θερμίδες Κατανάλωσης:</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '1.5em', fontWeight: 'bold', color: '#0097a7' }}>{Math.round(weeklySummary.calories)} kcal</p>
          </div>
          <div style={{ flex: '1 1 180px', padding: '10px', background: '#fff', borderRadius: '5px', border: '1px solid #c8e6c9' }}>
            <p style={{ margin: '0', fontSize: '0.9em', color: '#555' }}>Συνολική Πρωτεΐνη:</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '1.5em', fontWeight: 'bold', color: '#4caf50' }}>{Math.round(weeklySummary.protein)} g</p>
          </div>
          <div style={{ flex: '1 1 180px', padding: '10px', background: '#fff', borderRadius: '5px', border: '1px solid #ffecb3' }}>
            <p style={{ margin: '0', fontSize: '0.9em', color: '#555' }}>Συνολικό Λίπος:</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '1.5em', fontWeight: 'bold', color: '#ffc107' }}>{Math.round(weeklySummary.fat)} g</p>
          </div>
          <div style={{ flex: '1 1 180px', padding: '10px', background: '#fff', borderRadius: '5px', border: '1px solid #ffcdd2' }}>
            <p style={{ margin: '0', fontSize: '0.9em', color: '#555' }}>Συνολικοί Υδατάνθρακες:</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '1.5em', fontWeight: 'bold', color: '#f44336' }}>{Math.round(weeklySummary.carbs)} g</p>
          </div>
          <div style={{ flex: '1 1 180px', padding: '10px', background: '#fff', borderRadius: '5px', border: '1px solid #b3e5fc' }}>
            <p style={{ margin: '0', fontSize: '0.9em', color: '#555' }>Συνολικές Καύσεις:</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '1.5em', fontWeight: 'bold', color: '#03a9f4' }}>{Math.round(weeklySummary.burnedCalories)} kcal</p>
          </div>
          <div style={{ flex: '1 1 180px', padding: '10px', background: '#e1f5fe', borderRadius: '5px', border: '1px solid #29b6f6' }}>
            <p style={{ margin: '0', fontSize: '0.9em', color: '#555' }}>Καθαρό Εβδομαδιαίο Ισοζύγιο:</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '1.5em', fontWeight: 'bold', color: '#0288d1' }}>{Math.round(weeklySummary.calories - weeklySummary.burnedCalories)} kcal</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '40px', textAlign: 'center', padding: '20px', background: '#f0f0f0', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginBottom: '20px', color: '#555' }}>Διαχείριση Δεδομένων</h2>
        <button
          onClick={exportData}
          style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '1em', marginRight: '15px' }}
        >
          Εξαγωγή Δεδομένων (JSON)
        </button>
        <label
          htmlFor="import-file"
          style={{ background: '#2196F3', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '1em', display: 'inline-block' }}
        >
          Εισαγωγή Δεδομένων (JSON)
          <input
            type="file"
            id="import-file"
            accept=".json"
            onChange={importData}
            style={{ display: 'none' }}
          />
        </label>
        <p style={{ marginTop: '15px', fontSize: '0.9em', color: '#777' }}>
          Χρησιμοποιήστε την εισαγωγή/εξαγωγή για backup ή μεταφορά των δεδομένων σας.
        </p>
      </div>

    </div>
  );
}
