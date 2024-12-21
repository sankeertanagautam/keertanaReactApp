import React, { useEffect, useState } from 'react';
import mockTransactionsData from '../SampleData/mockTransactions';

const TransactionHistory = ({ accountNumber }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const sampleData = mockTransactionsData[accountNumber];
        if (!sampleData) {
          throw new Error('No transactions found for this account.');
        }
        setTransactions(sampleData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [accountNumber]);

  if (loading) {
    return <p className="text-blue-500">Loading transactions...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="mt-4">
      <h4 className="text-lg font-semibold mb-2">Transaction History : </h4>
      <div className="bg-blue-50 p-4 rounded-md">
        {transactions.length > 0 ? (
          <ul>
            {transactions.map((transaction) => (
              <li key={`${accountNumber}-${transaction.id}`} className="flex justify-between py-2 border-b last:border-b-0">
                <span className="text-gray-700">{transaction.date}</span>
                <span className="text-gray-700">{transaction.description}</span>
                <span className={transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}>
                  {transaction.amount > 0 ? '+' : ''}
                  {transaction.amount}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No transactions available.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
