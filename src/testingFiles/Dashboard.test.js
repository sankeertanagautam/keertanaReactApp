import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from '../components/Dashboard';
import mockAccountsData from '../SampleData/mockAccounts';

jest.mock('../SampleData/mockAccounts', () => [
  { accountNumber: '1122334455', balance: 12000, currency: 'INR' },
  { accountNumber: '2233445566', balance: 30000, currency: 'SEK' },
  { accountNumber: '3344556677', balance: 25000, currency: 'GBP' },
]);

describe('Dashboard Component', () => {

  beforeEach(() => {
    render(<Dashboard />);
  });

  test('should render the payment form correctly', () => {
    expect(screen.getByLabelText(/Payer Account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Payee Account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Currency/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit Payment/i)).toBeInTheDocument();
  });

  test('should initialize state with empty form fields', () => {
    expect(screen.getByLabelText(/Payer Account/i).value).toBe('');
    expect(screen.getByLabelText(/Payee Account/i).value).toBe('');
    expect(screen.getByLabelText(/Amount/i).value).toBe('');
    expect(screen.getByLabelText(/Currency/i).value).toBe('GBP');
  });

  test('should show validation error when fields are empty', () => {
    fireEvent.click(screen.getByText(/Submit Payment/i));

    expect(screen.getByText(/Fill in Payer account details./i)).toBeInTheDocument();
    expect(screen.getByText(/Fill in Payee account details./i)).toBeInTheDocument();
    expect(screen.getByText(/Please enter a valid amount./i)).toBeInTheDocument();
  });


  test('should show error message for invalid account number', async () => {
    fireEvent.change(screen.getByLabelText(/Payer Account/i), { target: { value: '0000000000' } });
    fireEvent.change(screen.getByLabelText(/Payee Account/i), { target: { value: '2233445566' } });
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '3000' } });

    fireEvent.click(screen.getByText(/Submit Payment/i));

    await waitFor(() => {
      expect(screen.getByText(/Invalid account number./i)).toBeInTheDocument();
    });
  });

  test('should update account balances after payment', async () => {

    fireEvent.change(screen.getByLabelText(/Payer Account/i), { target: { value: '1122334455' } });
    fireEvent.change(screen.getByLabelText(/Payee Account/i), { target: { value: '2233445566' } });
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '3000' } });
    fireEvent.change(screen.getByLabelText(/Currency/i), { target: { value: 'INR' } });

    fireEvent.click(screen.getByText(/Submit Payment/i));

    await waitFor(() => {
      expect(screen.getByText(/Payment successful!/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      const updatedPayerAccount = mockAccountsData.find(acc => acc.accountNumber === '1122334455');
      const updatedPayeeAccount = mockAccountsData.find(acc => acc.accountNumber === '2233445566');

      expect(updatedPayerAccount.balance).toBe(9000); // 12000 - 3000 = 9000
      expect(updatedPayeeAccount.balance).toBe(33000); // 30000 + 3000 = 33000
    });
  });

});

