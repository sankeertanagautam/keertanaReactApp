import React from 'react';
import TransactionHistory from './TransactionHistory';

const AccountInfo = ({ account }) => {
  return (
    <div className="bg-gray-600 text-white shadow-md p-4 rounded-md">
      <h3 className="text-lg font-semibold">AccountNumber: {account.accountNumber}</h3>
      <p className="mt-2">Account Balance: <span className="mt-2">{account.balance}</span> {account.currency}</p>
      <br></br>
      <TransactionHistory accountNumber={account.accountNumber} />
    </div>
  );
};

export default AccountInfo;

