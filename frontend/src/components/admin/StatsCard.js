import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color = 'bg-blue-500', trend }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p
              className={`text-sm mt-2 ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className={`${color} p-4 rounded-lg`}>
          <Icon className="text-white text-2xl" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
