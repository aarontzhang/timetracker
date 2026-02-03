import { getCategoryById } from '../utils/categories';

function TimeBlock({ hour, activity, onEdit, onToggleQuiet, categoryFrequencies = {}, isExcluded = false, notificationSelectionMode = false }) {
  const formatHour = (h) => {
    if (h === 0) return '12am';
    if (h === 12) return '12pm';
    return h < 12 ? `${h}am` : `${h - 12}pm`;
  };

  const getCategories = () => {
    if (!activity) return [];
    if (activity.categories) {
      return activity.categories.map(id => getCategoryById(id));
    } else if (activity.category) {
      return [getCategoryById(activity.category)];
    }
    return [];
  };

  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 200, g: 200, b: 200 };
  };

  // Get weighted background color - weights towards less common categories
  const getBackgroundColor = (cats) => {
    if (cats.length === 0) return null;
    if (cats.length === 1) {
      return cats[0].color;
    }

    // Calculate inverse frequency weights (rarer = higher weight)
    const maxFreq = Math.max(...cats.map(cat => categoryFrequencies[cat.id] || 1));
    const weights = cats.map(cat => {
      const freq = categoryFrequencies[cat.id] || 1;
      return maxFreq / freq;
    });
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);

    const rgbValues = cats.map(cat => hexToRgb(cat.color));
    const avgR = Math.round(rgbValues.reduce((sum, c, i) => sum + c.r * weights[i], 0) / totalWeight);
    const avgG = Math.round(rgbValues.reduce((sum, c, i) => sum + c.g * weights[i], 0) / totalWeight);
    const avgB = Math.round(rgbValues.reduce((sum, c, i) => sum + c.b * weights[i], 0) / totalWeight);

    return `rgb(${avgR}, ${avgG}, ${avgB})`;
  };

  const categories = getCategories();
  const backgroundColor = getBackgroundColor(categories);

  const handleClick = () => {
    if (notificationSelectionMode) {
      onToggleQuiet(hour);
    }
  };

  return (
    <div
      className={`time-block ${categories.length > 0 ? 'has-activity' : ''} ${isExcluded ? 'excluded' : ''} ${notificationSelectionMode ? 'selection-mode' : ''}`}
      onClick={handleClick}
    >
      <div
        className="time-block-indicator"
        style={backgroundColor ? { backgroundColor } : {}}
      />
      <span className="time-label">{formatHour(hour)}</span>
      {categories.length > 0 && (
        <div className="activity-info">
          <div className="category-tags">
            {categories.map(cat => (
              <span
                key={cat.id}
                className="category-tag"
              >
                {cat.id === 'other' && activity.otherText ? activity.otherText : cat.name}
              </span>
            ))}
          </div>
        </div>
      )}
      {notificationSelectionMode ? (
        <div className={`quiet-toggle ${isExcluded ? 'active' : ''}`}>
          {isExcluded ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          )}
        </div>
      ) : (
        <button
          className="edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(hour);
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default TimeBlock;
