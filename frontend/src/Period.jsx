import useStore from './store';
import React from 'react'

const Period = () => {
    const { selectedPeriod, setSelectedPeriod } = useStore();

  const handlePeriodChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedPeriod(selectedValue);
  };
  return (
    <div className="w-full p-2 flex justify-center">
    <ul className="flex gap-4 bg-gray-100 p-4">
      <li>
        <label>
          <input
            type="radio"
            name="period"
            value="1 week"
            checked={selectedPeriod === '1 week'}
            onChange={handlePeriodChange}
          />
          1 week
        </label>
      </li>
      <li>
        <label>
          <input
            type="radio"
            name="period"
            value="1 month"
            checked={selectedPeriod === '1 month'}
            onChange={handlePeriodChange}
          />
          1 month
        </label>
      </li>
      <li>
        <label>
          <input
            type="radio"
            name="period"
            value="3 months"
            checked={selectedPeriod === '3 months'}
            onChange={handlePeriodChange}
          />
          3 months
        </label>
      </li>
      <li>
        <label>
          <input
            type="radio"
            name="period"
            value="6 months"
            checked={selectedPeriod === '6 months'}
            onChange={handlePeriodChange}
          />
          6 months
        </label>
      </li>
      <li>
        <label>
          <input
            type="radio"
            name="period"
            value="1 year"
            checked={selectedPeriod === '1 year'}
            onChange={handlePeriodChange}
          />
          1 year
        </label>
      </li>
      <li>
        <label>
          <input
            type="radio"
            name="period"
            value="all periods"
            checked={selectedPeriod === 'all periods'}
            onChange={handlePeriodChange}
          />
          all periods
        </label>
      </li>
    </ul>
  </div>
  )
}

export default Period