import React from 'react';

const plan = {
  Monday: [
    { meal: 'Πρωινό', food: 'Αυγά (3) + Αβοκάντο (1/2)', protein: 21, fat: 30, carbs: 3 },
    { meal: 'Μεσημεριανό', food: 'Κοτόπουλο (200g) + Σαλάτα με ελαιόλαδο', protein: 40, fat: 18, carbs: 5 },
    { meal: 'Βραδινό', food: 'Σολωμός (150g) + Μπρόκολο βραστό', protein: 30, fat: 15, carbs: 4 },
    { activity: 'Γυμναστήριο (βάρη)', burn: 600 } // Δευτέρα είναι μέρα προπόνησης
  ],
  Tuesday: [
    { meal: 'Πρωινό', food: 'Ομελέτα με τυρί & μανιτάρια', protein: 25, fat: 22, carbs: 4 },
    { meal: 'Μεσημεριανό', food: 'Μοσχάρι (200g) + Σπανάκι σωτέ', protein: 45, fat: 20, carbs: 4 },
    { meal: 'Βραδινό', food: 'Τόνος (1 κονσέρβα) + αγγουροντομάτα με λάδι', protein: 28, fat: 12, carbs: 5 },
    { activity: 'Περπάτημα 60λ', burn: 300 }
  ],
  Wednesday: [
    { meal: 'Πρωινό', food: 'Αυγά ποσέ (2) + φέτα + ντομάτα', protein: 22, fat: 18, carbs: 3 },
    { meal: 'Μεσημεριανό', food: 'Γαλοπούλα (150g) + κολοκυθάκια στον ατμό', protein: 35, fat: 10, carbs: 4 },
    { meal: 'Βραδινό', food: 'Ομελέτα (3 αυγά) + μανιτάρια', protein: 23, fat: 25, carbs: 2 },
    { activity: 'Γυμναστήριο (βάρη)', burn: 600 }
  ],
  Thursday: [
    { meal: 'Πρωινό', food: 'Γιαούρτι πλήρες (200g) + ξηροί καρποί', protein: 20, fat: 25, carbs: 8 },
    { meal: 'Μεσημεριανό', food: 'Κοτόπουλο (200g) + πράσινη σαλάτα με λάδι', protein: 40, fat: 18, carbs: 4 },
    { meal: 'Βραδινό', food: 'Σολομός (180g) + κολοκυθάκια', protein: 33, fat: 17, carbs: 3 },
    { activity: 'Περπάτημα 45λ', burn: 200 }
  ],
  Friday: [
    { meal: 'Πρωινό', food: 'Ομελέτα με μπέικον & σπανάκι', protein: 27, fat: 28, carbs: 2 },
    { meal: 'Μεσημεριανό', food: 'Μοσχάρι (200g) + αγκινάρες', protein: 45, fat: 20, carbs: 6 },
    { meal: 'Βραδινό', food: 'Τυρί χαμηλών λιπαρών (100g) + αγγουράκι', protein: 18, fat: 10, carbs: 2 },
    { activity: 'Γυμναστήριο (βάρη)', burn: 600 }
  ],
  Saturday: [
    { meal: 'Πρωινό', food: 'Αυγά scrambled (3) + φέτα + λάδι', protein: 24, fat: 30, carbs: 2 },
    { meal: 'Μεσημεριανό', food: 'Ψάρι (200g) + σαλάτα λάχανο', protein: 38, fat: 15, carbs: 4 },
    { meal: 'Βραδινό', food: 'Γαλοπούλα (150g) + κολοκυθάκια με ελαιόλαδο', protein: 32, fat: 16, carbs: 3 },
    { activity: 'Περπάτημα 30λ', burn: 150 }
  ],
  Sunday: [
    { meal: 'Πρωινό', food: 'Γιαούρτι 10% (200g) + αμύγδαλα', protein: 22, fat: 25, carbs: 5 },
    { meal: 'Μεσημεριανό', food: 'Μοσχάρι (180g) + σαλάτα ρόκα με ελαιόλαδο', protein: 40, fat: 18, carbs: 5 },
    { meal: 'Βραδινό', food: 'Αυγά (2) + τυρί & ελιές', protein: 20, fat: 22, carbs: 2 },
    { activity: 'Περπάτημα 60λ', burn: 300 }
  ]
};

function kcal(p, f, c) {
  return p * 4 + f * 9 + c * 4;
}

export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Πλάνο Διατροφής – Άντρας 60 ετών</h1>
      {Object.entries(plan).map(([day, items]) => {
        let totalProtein = 0, totalFat = 0, totalCarbs = 0, burned = 0;

        items.forEach(entry => {
          if (entry.meal) {
            totalProtein += entry.protein;
            totalFat += entry.fat;
            totalCarbs += entry.carbs;
          } else if (entry.activity) {
            burned += entry.burn;
          }
        });

        const totalKcal = kcal(totalProtein, totalFat, totalCarbs);
        const netKcal = totalKcal - burned;

        return (
          <div key={day} style={{ marginTop: '30px' }}>
            <h2>{day}</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  <th>Γεύμα</th>
                  <th>Περιγραφή</th>
                  <th>Πρωτεΐνη (g)</th>
                  <th>Λίπος (g)</th>
                  <th>Υδατάνθρακες (g)</th>
                  <th>Θερμίδες</th>
                </tr>
              </thead>
              <tbody>
                {items.map((entry, idx) => entry.meal ? (
                  <tr key={idx} style={{ borderBottom: '1px solid #ddd' }}>
                    <td>{entry.meal}</td>
                    <td>{entry.food}</td>
                    <td>{entry.protein}</td>
                    <td>{entry.fat}</td>
                    <td>{entry.carbs}</td>
                    <td>{kcal(entry.protein, entry.fat, entry.carbs)}</td>
                  </tr>
                ) : null)}
                <tr style={{ fontWeight: 'bold', background: '#f9f9f9' }}>
                  <td colSpan="5">Σύνολο Θερμίδων</td>
                  <td>{totalKcal}</td>
                </tr>
                {burned > 0 && (
                  <>
                    <tr style={{ color: 'green' }}>
                      <td colSpan="5">Κατανάλωση από {items.find(i => i.activity).activity}</td>
                      <td>-{burned}</td>
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
