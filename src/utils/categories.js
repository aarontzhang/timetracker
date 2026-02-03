export const CATEGORIES = [
  // School - light teals
  { id: 'class', name: 'Class', color: '#4db6ac' },       // teal
  { id: 'studying', name: 'Studying', color: '#26a69a' }, // medium teal
  { id: 'homework', name: 'Homework', color: '#80cbc4' }, // light teal
  { id: 'clubs', name: 'Clubs', color: '#b2dfdb' },       // pale teal

  // Health & Fitness - greens and blues
  { id: 'gym', name: 'Gym', color: '#66bb6a' },           // green
  { id: 'sleep', name: 'Sleep', color: '#5c6bc0' },       // indigo blue
  { id: 'meals', name: 'Meals', color: '#81c784' },       // light green

  // Social - blues and teals
  { id: 'girlfriend', name: 'Girlfriend', color: '#7986cb' }, // soft indigo
  { id: 'friends', name: 'Friends', color: '#64b5f6' },       // light blue
  { id: 'adventures', name: 'Adventures', color: '#4fc3f7' }, // sky blue

  // Personal - light greens and blues
  { id: 'gaming', name: 'Gaming', color: '#9575cd' },     // light purple
  { id: 'projects', name: 'Projects', color: '#4dd0e1' }, // cyan
  { id: 'youtube', name: 'YouTube', color: '#4db6ac' },   // teal
  { id: 'relax', name: 'Relax', color: '#a5d6a7' },       // pale green

  // Other
  { id: 'work', name: 'Work', color: '#42a5f5' },         // blue
  { id: 'errands', name: 'Errands', color: '#aed581' },   // lime
  { id: 'other', name: 'Other', color: '#90a4ae' },       // blue gray
];

export const getCategoryById = (id) => {
  return CATEGORIES.find(cat => cat.id === id) || CATEGORIES[CATEGORIES.length - 1];
};
