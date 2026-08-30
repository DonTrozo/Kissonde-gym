import fs from 'node:fs';

const requiredFiles = [
  'src/screens/OnboardingScreen.tsx',
  'src/screens/NotificationsScreen.tsx',
  'src/screens/IntegrationsScreen.tsx',
  'src/screens/ChallengesScreen.tsx',
  'src/screens/MembershipScreen.tsx',
  'src/screens/AdminDashboardScreen.tsx',
  'src/screens/ExerciseDetailScreen.tsx',
  'src/screens/WorkoutHistoryScreen.tsx',
  'src/product.ts',
  'src/uxStates.tsx',
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) throw new Error(`Missing pitch-critical file: ${file}`);
}

const product = fs.readFileSync('src/product.ts', 'utf8');
const app = fs.readFileSync('App.tsx', 'utf8');
const classes = fs.readFileSync('src/screens/ClassesScreen.tsx', 'utf8');
const training = fs.readFileSync('src/screens/TrainScreen.tsx', 'utf8');

const expectations = [
  ['Apple Health', product],
  ['Health Connect', product],
  ['Garmin', product],
  ['Strava', product],
  ['Apple Wallet', product],
  ['Google Wallet', product],
  ['AdminDashboard', app],
  ['OnboardingScreen', app],
  ['rateInstructor', classes],
  ['waitlistProbability', classes],
  ['ExerciseDetail', training],
  ['WorkoutHistory', training],
];

for (const [needle, source] of expectations) {
  if (!source.includes(needle)) throw new Error(`Pitch scope regression: ${needle} is missing`);
}

console.log('Pitch scope validation passed.');
