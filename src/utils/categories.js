export const CATEGORIES = [
  // School - blues
  { id: 'class', name: 'Class', color: '#5c7a99' },       // slate blue
  { id: 'studying', name: 'Studying', color: '#6b8cae' }, // dusty blue
  { id: 'homework', name: 'Homework', color: '#7a9bb8' }, // soft blue
  { id: 'clubs', name: 'Clubs', color: '#8faec4' },       // light steel

  // Health & Fitness - greens
  { id: 'gym', name: 'Gym', color: '#5a8a6e' },           // forest
  { id: 'sleep', name: 'Sleep', color: '#4a6670' },       // deep slate
  { id: 'meals', name: 'Meals', color: '#7da68a' },       // sage

  // Social - warm tones
  { id: 'girlfriend', name: 'Girlfriend', color: '#b88a8a' }, // dusty rose
  { id: 'friends', name: 'Friends', color: '#c9a66b' },       // warm sand
  { id: 'adventures', name: 'Adventures', color: '#d4a574' }, // terracotta

  // Personal - purples and teals
  { id: 'gaming', name: 'Gaming', color: '#8a7a9b' },     // muted purple
  { id: 'projects', name: 'Projects', color: '#6a9a9a' }, // teal
  { id: 'youtube', name: 'YouTube', color: '#c47a7a' },   // soft coral
  { id: 'relax', name: 'Relax', color: '#a8b4a0' },       // pale sage

  // Other - neutrals
  { id: 'work', name: 'Work', color: '#7a8a7a' },         // gray green
  { id: 'errands', name: 'Errands', color: '#9a8a7a' },   // taupe
  { id: 'other', name: 'Other', color: '#a0a0a0' },       // gray
];

export const getCategoryById = (id) => {
  return CATEGORIES.find(cat => cat.id === id) || CATEGORIES[CATEGORIES.length - 1];
};
