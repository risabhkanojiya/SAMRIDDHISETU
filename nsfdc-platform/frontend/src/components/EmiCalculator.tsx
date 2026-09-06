'use client';

import { useState } from 'react';

interface EmiResult {
  emi: number;
  total_payment: number;
  total_interest: number;
  effective_tenure_months: number;
}

export default function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [tenureMonths, setTenureMonths] = useState(60);
  const [moratoriumMonths, setMoratoriumMonths] = useState(6);
  const [result, setResult] = useState<EmiResult | null>(null);

  const calculateEmi = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / (12 * 100);
    const n = tenureMonths - moratoriumMonths;

    let emi: number;
    if (monthlyRate === 0) {
      emi = principal / n;
    } else {
      emi = principal * monthlyRate * Math.pow(1 + monthlyRate, n) / (Math.pow(1 + monthlyRate, n) - 1);
    }

    setResult({
      emi: Math.round(emi * 100) / 100,
      total_payment: Math.round(emi * n * 100) / 100,
      total_interest: Math.round((emi * n - principal) * 100) / 100,
      effective_tenure_months: n,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">EMI Calculator</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loan Amount: ₹{loanAmount.toLocaleString('en-IN')}
          </label>
          <input
            type="range"
            min="10000"
            max="5000000"
            step="10000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Interest Rate: {interestRate}%
          </label>
          <input
            type="range"
            min="6.5"
            max="15"
            step="0.5"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tenure: {tenureMonths} months
          </label>
          <input
            type="range"
            min="12"
            max="120"
            step="6"
            value={tenureMonths}
            onChange={(e) => setTenureMonths(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Moratorium Period: {moratoriumMonths} months
          </label>
          <input
            type="range"
            min="0"
            max="12"
            step="1"
            value={moratoriumMonths}
            onChange={(e) => setMoratoriumMonths(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <button
          onClick={calculateEmi}
          className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
        >
          Calculate EMI
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Monthly EMI</p>
              <p className="text-2xl font-bold text-blue-900">₹{result.emi.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Payment</p>
              <p className="text-lg font-semibold text-gray-800">₹{result.total_payment.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Interest</p>
              <p className="text-lg font-semibold text-gray-800">₹{result.total_interest.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Effective Tenure</p>
              <p className="text-lg font-semibold text-gray-800">{result.effective_tenure_months} months</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
