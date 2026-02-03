import { useState, useEffect, useRef, useMemo } from 'react';
import { CATEGORIES } from '../utils/categories';

function ActivityModal({ hour, activity, onSave, onClear, onClose, recentCategories = [] }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [otherText, setOtherText] = useState('');
  const modalRef = useRef(null);
  const startYRef = useRef(null);
  const currentYRef = useRef(null);

  // Initialize from existing activity
  useEffect(() => {
    if (activity) {
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

  // Sort categories by recency (most recent first)
  const sortedCategories = useMemo(() => {
    const categoryOrder = new Map();
    recentCategories.forEach((catId, index) => {
      if (!categoryOrder.has(catId)) {
        categoryOrder.set(catId, index);
      }
    });

    return [...CATEGORIES].sort((a, b) => {
      const aOrder = categoryOrder.has(a.id) ? categoryOrder.get(a.id) : 999;
      const bOrder = categoryOrder.has(b.id) ? categoryOrder.get(b.id) : 999;
      return aOrder - bOrder;
    });
  }, [recentCategories]);

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

  // Auto-save when categories change
  const saveActivity = (categories, text) => {
    if (categories.length > 0) {
      const data = { categories };
      if (categories.includes('other') && text.trim()) {
        data.otherText = text.trim();
      }
      onSave(data);
    } else {
      onClear();
    }
  };

  const toggleCategory = (catId) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(catId)
        ? prev.filter(id => id !== catId)
        : [...prev, catId];

      // Auto-save immediately
      setTimeout(() => saveActivity(newCategories, otherText), 0);

      return newCategories;
    });
  };

  // Handle other text changes with debounced save
  const handleOtherTextChange = (e) => {
    const text = e.target.value;
    setOtherText(text);
    // Save after a brief delay for text input
    setTimeout(() => {
      if (selectedCategories.includes('other')) {
        saveActivity(selectedCategories, text);
      }
    }, 300);
  };

  // Swipe down to close
  const handleTouchStart = (e) => {
    startYRef.current = e.touches[0].clientY;
    currentYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    currentYRef.current = e.touches[0].clientY;
    const diff = currentYRef.current - startYRef.current;

    if (diff > 0 && modalRef.current) {
      modalRef.current.style.transform = `translateY(${diff}px)`;
    }
  };

  const handleTouchEnd = () => {
    const diff = currentYRef.current - startYRef.current;

    if (diff > 100) {
      // Swipe was long enough, close modal
      onClose();
    } else if (modalRef.current) {
      // Reset position
      modalRef.current.style.transform = 'translateY(0)';
    }

    startYRef.current = null;
    currentYRef.current = null;
  };

  const hasOtherSelected = selectedCategories.includes('other');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        className="modal"
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="modal-handle" />
        <div className="modal-header">
          <h2>{formatHourRange()}</h2>
        </div>

        <div className="category-grid">
          {sortedCategories.map(cat => {
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
            onChange={handleOtherTextChange}
          />
        )}
      </div>
    </div>
  );
}

export default ActivityModal;
