import React, { useState } from 'react';
import mockAccountsData from '../SampleData/mockAccounts';
import AccountInfo from './AccountInfo';

const Dashboard = () => {
  const [accounts, setAccounts] = useState(mockAccountsData);
  const [formData, setFormData] = useState({
    payerAccount: '',
    payeeAccount: '',
    amount: '',
    currency: 'GBP',
  });

  const [errors, setErrors] = useState({});
  const [paymentStatus, setPaymentStatus] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.payerAccount) newErrors.payerAccount = 'Fill in Payer account details.';
    if (!formData.payeeAccount) newErrors.payeeAccount = 'Fill in Payee account details.';
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const payerIndex = accounts.findIndex((acc) => acc.accountNumber === formData.payerAccount);
      const payeeIndex = accounts.findIndex((acc) => acc.accountNumber === formData.payeeAccount);

      if (payerIndex !== -1 && payeeIndex !== -1) {
        const newAccounts = [...accounts];
        const amount = parseFloat(formData.amount);

        newAccounts[payerIndex].balance -= amount;

        newAccounts[payeeIndex].balance += amount;

        setPaymentStatus('Processing payment...');
        await new Promise((resolve) => setTimeout(resolve, 800));

        setAccounts(newAccounts);
        setPaymentStatus('Payment successful!');
        setTimeout(() => {
          setPaymentStatus('');
        }, 3000);
      } else {
        setPaymentStatus('Invalid account number.');
      }

      setFormData({ payerAccount: '', payeeAccount: '', amount: '', currency: 'USD' });
      setErrors({});
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800 text-center">Treasury Management System</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {accounts.map((account, index) => (
          <AccountInfo key={`${account.accountNumber}-${index}`} account={account} />
        ))}

      </div>
      <div>
        {paymentStatus && (
          <div className="mt-4 text-center text-lg font-semibold">
            <p>{paymentStatus}</p>
          </div>
        )}
      </div>
      <br></br>
      <form onSubmit={onSubmit} className="bg-white shadow-lg rounded-lg p-6 max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-center"> Payment Form </h2>

        <div className="mb-4">
          <label htmlFor="payerAccount" className="block text-sm font-medium text-gray-700">Payer Account</label>
          <input
            type="text"
            id="payerAccount"
            name="payerAccount"
            value={formData.payerAccount}
            onChange={inputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.payerAccount && <p className="text-red-500 text-sm">{errors.payerAccount}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="payeeAccount" className="block text-sm font-medium text-gray-700">Payee Account</label>
          <input
            type="text"
            id="payeeAccount"
            name="payeeAccount"
            value={formData.payeeAccount}
            onChange={inputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.payeeAccount && <p className="text-red-500 text-sm">{errors.payeeAccount}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="text"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={inputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={inputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="USD">USD</option>
            <option value="EUR">SEK</option>
            <option value="GBP">GBP</option>
            <option value="INR">INR</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-green-500 focus:outline-none"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
};

export default Dashboard;

