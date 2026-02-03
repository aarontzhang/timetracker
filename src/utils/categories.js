export const CATEGORIES = [
  // School - light greens
  { id: 'class', name: 'Class', color: '#81c784' },       // soft green
  { id: 'studying', name: 'Studying', color: '#a5d6a7' }, // pale green
  { id: 'homework', name: 'Homework', color: '#c5e1a5' }, // light lime
  { id: 'clubs', name: 'Clubs', color: '#aed581' },       // lime

  // Health & Fitness - greens and blues
  { id: 'gym', name: 'Gym', color: '#66bb6a' },           // green
  { id: 'sleep', name: 'Sleep', color: '#1976d2' },       // darker blue
  { id: 'meals', name: 'Meals', color: '#9ccc65' },       // light green

  // Social - blues
  { id: 'girlfriend', name: 'Girlfriend', color: '#42a5f5' }, // blue
  { id: 'friends', name: 'Friends', color: '#64b5f6' },       // light blue
  { id: 'adventures', name: 'Adventures', color: '#90caf9' }, // pale blue

  // Personal - greens and blues
  { id: 'gaming', name: 'Gaming', color: '#2196f3' },     // medium blue
  { id: 'projects', name: 'Projects', color: '#8bc34a' }, // lime green
  { id: 'youtube', name: 'YouTube', color: '#1e88e5' },   // blue
  { id: 'relax', name: 'Relax', color: '#dcedc8' },       // very pale green

  // Other
  { id: 'work', name: 'Work', color: '#1565c0' },         // darker blue
  { id: 'errands', name: 'Errands', color: '#7cb342' },   // green
  { id: 'other', name: 'Other', color: '#bbdefb' },       // very light blue
];

export const getCategoryById = (id) => {
  return CATEGORIES.find(cat => cat.id === id) || CATEGORIES[CATEGORIES.length - 1];
};
