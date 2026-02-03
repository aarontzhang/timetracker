export const CATEGORIES = [
  // School - teal greens
  { id: 'class', name: 'Class', color: '#2d7d6f' },       // deep teal
  { id: 'studying', name: 'Studying', color: '#3d9182' }, // teal
  { id: 'homework', name: 'Homework', color: '#4aa391' }, // light teal
  { id: 'clubs', name: 'Clubs', color: '#5bb5a2' },       // bright teal

  // Health & Fitness - forest greens
  { id: 'gym', name: 'Gym', color: '#2e7d32' },           // forest green
  { id: 'sleep', name: 'Sleep', color: '#1b4d3e' },       // dark forest
  { id: 'meals', name: 'Meals', color: '#66a96c' },       // sage green

  // Social - warm accents
  { id: 'girlfriend', name: 'Girlfriend', color: '#b5838d' }, // dusty rose
  { id: 'friends', name: 'Friends', color: '#c9a66b' },       // warm sand
  { id: 'adventures', name: 'Adventures', color: '#7cb08a' }, // fresh green

  // Personal - varied greens
  { id: 'gaming', name: 'Gaming', color: '#558b6e' },     // muted green
  { id: 'projects', name: 'Projects', color: '#3e8e75' }, // medium teal
  { id: 'youtube', name: 'YouTube', color: '#8fbc8f' },   // light sage
  { id: 'relax', name: 'Relax', color: '#a8d5a2' },       // pale mint

  // Other
  { id: 'work', name: 'Work', color: '#4a7c6f' },         // slate green
  { id: 'errands', name: 'Errands', color: '#6b9b7a' },   // dusty green
  { id: 'other', name: 'Other', color: '#8a9a8c' },       // gray green
];

export const getCategoryById = (id) => {
  return CATEGORIES.find(cat => cat.id === id) || CATEGORIES[CATEGORIES.length - 1];
};
