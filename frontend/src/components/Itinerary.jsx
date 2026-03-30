import { useState } from 'react';

const MealBadge = ({ label, included }) => (
  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
    included
      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 line-through'
  }`}>
    {label}
  </span>
);

export default function Itinerary({ itinerary }) {
  const [openDay, setOpenDay] = useState(1);

  if (!itinerary || itinerary.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
        Itinerary coming soon
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {itinerary.map((day) => {
        const isOpen = openDay === day.day;
        return (
          <div
            key={day.day}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden"
          >
            {/* Day header — clickable */}
            <button
              onClick={() => setOpenDay(isOpen ? null : day.day)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              {/* Day number */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-semibold text-sm transition-colors ${
                isOpen
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}>
                {day.day}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{day.title}</div>
                {!isOpen && (
                  <div className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                    {day.activities?.slice(0, 2).join(' · ')}
                  </div>
                )}
              </div>

              {/* Chevron */}
              <svg
                className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Day content */}
            {isOpen && (
              <div className="px-5 pb-5 border-t border-slate-50 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 mb-4 leading-relaxed">
                  {day.description}
                </p>

                {/* Activities */}
                {day.activities?.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                      Activities
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {day.activities.map((activity, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0" />
                          {activity}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-4">
                  {/* Accommodation */}
                  {day.accommodation && (
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                        Accommodation
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300">
                        <svg className="w-3.5 h-3.5 text-brand-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {day.accommodation}
                      </div>
                    </div>
                  )}

                  {/* Meals */}
                  {day.meals && (
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                        Meals included
                      </div>
                      <div className="flex gap-1.5">
                        <MealBadge label="Breakfast" included={day.meals.breakfast} />
                        <MealBadge label="Lunch" included={day.meals.lunch} />
                        <MealBadge label="Dinner" included={day.meals.dinner} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}