import { useState, useEffect } from 'react';
import { CATEGORIES } from '../utils/categories';

function ActivityModal({ hour, activity, onSave, onClear, onClose }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [otherText, setOtherText] = useState('');

  useEffect(() => {
    if (activity) {
      // Handle both old format (single category) and new format (array)
      if (activity.categories) {
        setSelectedCategories(activity.categories);
      } else if (activity.category) {
        setSelectedCategories([activity.category]);
      } else {
        setSelectedCategories([]);
      }
      setOtherText(activity.otherText || '');
    } else {
      setSelectedCategories([]);
      setOtherText('');
    }
  }, [activity]);

  const formatHour = (h) => {
    if (h === 0) return '12am';
    if (h === 12) return '12pm';
    return h < 12 ? `${h}am` : `${h - 12}pm`;
  };

  const formatHourRange = () => {
    if (Array.isArray(hour)) {
      if (hour.length === 1) return formatHour(hour[0]);
      const start = Math.min(...hour);
      const end = Math.max(...hour);
      return `${formatHour(start)} – ${formatHour(end + 1)}`;
    }
    return formatHour(hour);
  };

  const toggleCategory = (catId) => {
    setSelectedCategories(prev => {
      if (prev.includes(catId)) {
        return prev.filter(id => id !== catId);
      } else {
        return [...prev, catId];
      }
    });
  };

  const handleSave = () => {
    if (selectedCategories.length > 0) {
      const data = { categories: selectedCategories };
      if (selectedCategories.includes('other') && otherText.trim()) {
        data.otherText = otherText.trim();
      }
      onSave(data);
    } else {
      // No categories selected = clear the activity
      onClear();
    }
  };

  const hasOtherSelected = selectedCategories.includes('other');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{formatHourRange()}</h2>
          <button className="check-btn" onClick={handleSave}>
            &#10003;
          </button>
        </div>

        <div className="category-grid">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategories.includes(cat.id);
            return (
              <button
                key={cat.id}
                className={`category-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleCategory(cat.id)}
              >
                {isSelected && (
                  <span className="category-indicator" style={{ backgroundColor: cat.color }} />
                )}
                {cat.name}
              </button>
            );
          })}
        </div>

        {hasOtherSelected && (
          <input
            type="text"
            className="note-input"
            placeholder="What activity?"
            value={otherText}
            onChange={e => setOtherText(e.target.value)}
          />
        )}
      </div>
    </div>
  );
}

export default ActivityModal;
