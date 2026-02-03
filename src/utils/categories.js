export const CATEGORIES = [
  // School - blues
  { id: 'class', name: 'Class', color: '#4a90c2' },       // sky blue
  { id: 'studying', name: 'Studying', color: '#5ba0d0' }, // bright blue
  { id: 'homework', name: 'Homework', color: '#3d7ab8' }, // medium blue
  { id: 'clubs', name: 'Clubs', color: '#6eb5e0' },       // light blue

  // Health & Fitness - greens
  { id: 'gym', name: 'Gym', color: '#4caf50' },           // green
  { id: 'sleep', name: 'Sleep', color: '#5c6bc0' },       // indigo
  { id: 'meals', name: 'Meals', color: '#66bb6a' },       // light green

  // Social - warm reds and oranges
  { id: 'girlfriend', name: 'Girlfriend', color: '#e57373' }, // soft red
  { id: 'friends', name: 'Friends', color: '#ffb74d' },       // orange
  { id: 'adventures', name: 'Adventures', color: '#ff8a65' }, // coral

  // Personal - purples and yellows
  { id: 'gaming', name: 'Gaming', color: '#9575cd' },     // purple
  { id: 'projects', name: 'Projects', color: '#4db6ac' }, // teal
  { id: 'youtube', name: 'YouTube', color: '#ef5350' },   // red
  { id: 'relax', name: 'Relax', color: '#81c784' },       // soft green

  // Other - varied
  { id: 'work', name: 'Work', color: '#78909c' },         // blue gray
  { id: 'errands', name: 'Errands', color: '#ffd54f' },   // yellow
  { id: 'other', name: 'Other', color: '#90a4ae' },       // light blue gray
];

export const getCategoryById = (id) => {
  return CATEGORIES.find(cat => cat.id === id) || CATEGORIES[CATEGORIES.length - 1];
};
