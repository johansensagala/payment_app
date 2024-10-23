import { addTransactions, checkBalance, checkService, checkTransactions, updateBalance } from '../helpers/TransactionHelper.js';

const getBalance = async (req, res) => {
    const { email } = req.user;

    try {
        const balance = await checkBalance(email);

        res.status(200).json({
            status: 0,
            message: 'Get Balance Berhasil',
            data: balance
        });
    } catch (error) {
        res.status(500).json({
            status: 1,
            message: error.message,
            data: null
        });
    }
};

const topup = async (req, res) => {
    const { email } = req.user;
    const { top_up_amount } = req.body;

    if (typeof top_up_amount !== 'number' || isNaN(top_up_amount) || top_up_amount < 0) {
        return res.status(400).json({
            status: 102,
            message: 'Parameter top_up_amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
            data: null
        });
    }

    try {
        const newBalance = await updateBalance(email, top_up_amount);
        const transaction = await addTransactions(email, null, 'TOPUP', top_up_amount);

        res.status(200).json({
            status: 0,
            message: 'Top Up Balance berhasil',
            data: newBalance
        });
    } catch (error) {
        res.status(500).json({
            status: 1,
            message: error.message,
            data: null
        });
    }
};

const transact = async (req, res) => {
    const { service_code } = req.body;
    const { email } = req.user;

    try {
        const currentBalance = await checkBalance(email);
        if (!currentBalance || parseFloat(currentBalance.balance) <= 0) {
            return res.status(400).json({
                status: 102,
                message: 'Saldo tidak mencukupi',
                data: null
            });
        }

        const service = await checkService(service_code);
        if (!service) {
            return res.status(400).json({
                status: 102,
                message: 'Service atau Layanan tidak ditemukan',
                data: null
            });
        }

        const transactionAmount = service.service_tarif;

        if (parseFloat(currentBalance.balance) < parseFloat(transactionAmount)) {
            return res.status(400).json({
                status: 102,
                message: 'Saldo tidak mencukupi untuk transaksi ini',
                data: null
            });
        }

        const newBalance = await updateBalance(email, -transactionAmount);

        const transaction = await addTransactions(email, service.id, 'PAYMENT', transactionAmount);

        const responseData = {
            invoice_number: transaction.invoiceNumber,
            service_code: service_code,
            service_name: service.service_name,
            transaction_type: 'PAYMENT',
            total_amount: transactionAmount,
            created_on: transaction.created_on
        };

        res.status(200).json({
            status: 0,
            message: 'Transaksi berhasil',
            data: responseData
        });
    } catch (error) {
        res.status(500).json({
            status: 1,
            message: error.message,
            data: null
        });
    }
};

const getHistories = async (req, res) => {
    const { email } = req.user;
    const { offset, limit } = req.query;

    try {
        const transactions = await checkTransactions(
            email, 
            offset !== undefined ? Number(offset) : undefined, 
            limit !== undefined ? Number(limit) : undefined
        );

        const formattedTransactions = transactions.map(transaction => ({
            invoice_number: transaction.invoice_number,
            transaction_type: transaction.transaction_type,
            description: 'Top Up balance',
            amount: transaction.amount,
            created_on: transaction.created_on
        }));
        
        res.status(200).json({
            status: 0,
            message: 'Get History Berhasil',
            data: formattedTransactions
        });
    } catch (error) {
        res.status(500).json({
            status: 1,
            message: error.message,
            data: null
        });
    }
};

export { getBalance, getHistories, topup, transact };

