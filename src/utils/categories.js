export const CATEGORIES = [
  // School - blue
  { id: 'class', name: 'Class', color: '#2196f3' },       // blue
  { id: 'studying', name: 'Studying', color: '#2196f3' }, // blue
  { id: 'homework', name: 'Homework', color: '#2196f3' }, // blue
  { id: 'clubs', name: 'Clubs', color: '#2196f3' },       // blue

  // Health & Fitness - green
  { id: 'gym', name: 'Gym', color: '#4caf50' },           // green
  { id: 'sleep', name: 'Sleep', color: '#9c27b0' },       // purple
  { id: 'meals', name: 'Meals', color: '#ff9800' },       // orange

  // Social - red
  { id: 'girlfriend', name: 'Girlfriend', color: '#f44336' }, // red
  { id: 'friends', name: 'Friends', color: '#ff9800' },       // orange
  { id: 'adventures', name: 'Adventures', color: '#ffeb3b' }, // yellow

  // Personal - purple/yellow
  { id: 'gaming', name: 'Gaming', color: '#9c27b0' },     // purple
  { id: 'projects', name: 'Projects', color: '#4caf50' }, // green
  { id: 'youtube', name: 'YouTube', color: '#f44336' },   // red
  { id: 'relax', name: 'Relax', color: '#4caf50' },       // green

  // Other
  { id: 'work', name: 'Work', color: '#2196f3' },         // blue
  { id: 'errands', name: 'Errands', color: '#ffeb3b' },   // yellow
  { id: 'other', name: 'Other', color: '#9e9e9e' },       // gray
];

export const getCategoryById = (id) => {
  return CATEGORIES.find(cat => cat.id === id) || CATEGORIES[CATEGORIES.length - 1];
};
