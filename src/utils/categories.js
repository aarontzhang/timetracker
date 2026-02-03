export const CATEGORIES = [
  // School - darker leaf greens
  { id: 'class', name: 'Class', color: '#2e7d32' },       // forest green
  { id: 'studying', name: 'Studying', color: '#388e3c' }, // medium green
  { id: 'homework', name: 'Homework', color: '#43a047' }, // leaf green
  { id: 'clubs', name: 'Clubs', color: '#4caf50' },       // green

  // Health & Fitness - vibrant greens
  { id: 'gym', name: 'Gym', color: '#1b5e20' },           // dark green
  { id: 'sleep', name: 'Sleep', color: '#33691e' },       // deep leaf
  { id: 'meals', name: 'Meals', color: '#7cb342' },       // light green

  // Social - warm greens
  { id: 'girlfriend', name: 'Girlfriend', color: '#558b2f' }, // olive green
  { id: 'friends', name: 'Friends', color: '#689f38' },       // lime green
  { id: 'adventures', name: 'Adventures', color: '#8bc34a' }, // light lime

  // Personal - varied leaf greens
  { id: 'gaming', name: 'Gaming', color: '#66bb6a' },     // medium light
  { id: 'projects', name: 'Projects', color: '#4e9a51' }, // balanced green
  { id: 'youtube', name: 'YouTube', color: '#81c784' },   // soft green
  { id: 'relax', name: 'Relax', color: '#a5d6a7' },       // pale green

  // Other - muted leaf greens
  { id: 'work', name: 'Work', color: '#5a8f5c' },         // sage leaf
  { id: 'errands', name: 'Errands', color: '#6b9b6d' },   // dusty green
  { id: 'other', name: 'Other', color: '#8aba8c' },       // light leaf
];

export const getCategoryById = (id) => {
  return CATEGORIES.find(cat => cat.id === id) || CATEGORIES[CATEGORIES.length - 1];
};
