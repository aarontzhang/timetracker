import { useState, useMemo } from 'react';
import { CATEGORIES } from '../utils/categories';

const DATE_RANGES = [
  { id: 'today', label: 'Today', days: 1 },
  { id: '3days', label: '3 Days', days: 3 },
  { id: 'week', label: 'Week', days: 7 },
  { id: 'month', label: 'Month', days: 30 },
];

function StatsView({ data, currentDate }) {
  const [range, setRange] = useState('today');

  // Get dates for the selected range
  const getDatesInRange = () => {
    const rangeConfig = DATE_RANGES.find(r => r.id === range);
    const days = rangeConfig?.days || 1;
    const dates = [];

    for (let i = 0; i < days; i++) {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      dates.push(dateStr);
    }
    return dates;
  };

  const stats = useMemo(() => {
    const dates = getDatesInRange();
    const categoryHours = {};
    CATEGORIES.forEach(cat => {
      categoryHours[cat.id] = 0;
    });

    let totalTrackedHours = 0;
    let daysWithData = 0;

    dates.forEach(dateStr => {
      const dayData = data[dateStr] || {};
      let dayHasData = false;

      Object.values(dayData).forEach(activity => {
        if (!activity) return;

        let cats = [];
        if (activity.categories) {
          cats = activity.categories;
        } else if (activity.category) {
          cats = [activity.category];
        }

        if (cats.length > 0) {
          dayHasData = true;
          totalTrackedHours++;
          const hoursPerCategory = 1 / cats.length;
          cats.forEach(catId => {
            if (categoryHours[catId] !== undefined) {
              categoryHours[catId] += hoursPerCategory;
            }
          });
        }
      });

      if (dayHasData) daysWithData++;
    });

    const categoryStats = CATEGORIES.map(cat => ({
      ...cat,
      hours: categoryHours[cat.id]
    })).filter(s => s.hours > 0).sort((a, b) => b.hours - a.hours);

    return {
      categoryStats,
      totalTrackedHours,
      daysWithData,
      daysInRange: dates.length,
      avgPerDay: daysWithData > 0 ? totalTrackedHours / daysWithData : 0,
    };
  }, [data, currentDate, range]);

  const formatHours = (h) => {
    if (h === 0) return '0h';
    if (h === Math.floor(h)) return `${h}h`;
    return `${h.toFixed(1)}h`;
  };

  // Generate conic gradient for pie chart
  const getPieStyle = () => {
    if (stats.totalTrackedHours === 0) return {};

    let gradientStops = [];
    let currentAngle = 0;

    stats.categoryStats.forEach(stat => {
      const percentage = (stat.hours / stats.totalTrackedHours) * 100;
      gradientStops.push(`${stat.color} ${currentAngle}%`);
      currentAngle += percentage;
      gradientStops.push(`${stat.color} ${currentAngle}%`);
    });

    return {
      background: `conic-gradient(${gradientStops.join(', ')})`
    };
  };

  return (
    <div className="stats-view">
      {/* Date Range Toggle */}
      <div className="stats-range-toggle">
        {DATE_RANGES.map(r => (
          <button
            key={r.id}
            className={`range-btn ${range === r.id ? 'active' : ''}`}
            onClick={() => setRange(r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>

      {stats.totalTrackedHours === 0 ? (
        <div className="stats-empty">
          <p>No activities tracked</p>
          <p className="stats-hint">Tap on time blocks to log your activities</p>
        </div>
      ) : (
        <>
          {/* Pie Chart */}
          <div className="pie-chart" style={getPieStyle()}>
            <div className="pie-center">
              <span className="pie-total">{formatHours(stats.totalTrackedHours)}</span>
              <span className="pie-label">tracked</span>
            </div>
          </div>

          {/* Quick Stats - only show avg/day for multi-day ranges */}
          {stats.daysInRange > 1 && (
            <div className="quick-stats">
              <div className="quick-stat">
                <span className="quick-stat-value">{formatHours(stats.avgPerDay)}</span>
                <span className="quick-stat-label">avg/day</span>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="stats-legend">
            {stats.categoryStats.map(stat => {
              const percentage = ((stat.hours / stats.totalTrackedHours) * 100).toFixed(0);
              return (
                <div key={stat.id} className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: stat.color }}></span>
                  <span className="legend-name">{stat.name}</span>
                  <span className="legend-percent">{percentage}%</span>
                  <span className="legend-hours">{formatHours(stat.hours)}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default StatsView;
