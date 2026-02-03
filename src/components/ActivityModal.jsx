import { useState, useEffect } from 'react';
import { CATEGORIES } from '../utils/categories';

function ActivityModal({ hour, activity, onSave, onClear, onClose }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [note, setNote] = useState('');

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
      setNote(activity.note || '');
    } else {
      setSelectedCategories([]);
      setNote('');
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
      onSave({ categories: selectedCategories, note: note.trim() });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{formatHourRange()}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="category-grid">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategories.includes(cat.id) ? 'selected' : ''}`}
              onClick={() => toggleCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <input
          type="text"
          className="note-input"
          placeholder="Add a note"
          value={note}
          onChange={e => setNote(e.target.value)}
        />

        <div className="modal-actions">
          {activity && (
            <button className="clear-btn" onClick={onClear}>Clear</button>
          )}
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={selectedCategories.length === 0}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActivityModal;
