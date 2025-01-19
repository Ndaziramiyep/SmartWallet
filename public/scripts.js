// Fetch and display transactions
async function fetchTransactions() {
    try {
        const response = await fetch('/transactions/all');
        const transactions = await response.json();
        populateTransactionTable(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
}

// Populate transaction table
function populateTransactionTable(transactions) {
    const tableBody = document.getElementById('transactionTable');
    tableBody.innerHTML = '';
    transactions.forEach(transaction => {
        const row = `
            <tr>
                <td>${transaction.id}</td>
                <td>${transaction.accountType}</td>
                <td>${transaction.amount}</td>
                <td>${transaction.transactionType}</td>
                <td>${transaction.category}</td>
                <td>${transaction.subcategory || 'N/A'}</td>
                <td>${transaction.date}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Add a new transaction
document.getElementById('transactionForm').addEventListener('submit', async event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const transaction = {
        accountType: formData.get('accountType'),
        amount: formData.get('amount'),
        transactionType: formData.get('transactionType'),
        category: formData.get('category'),
        subcategory: formData.get('subcategory')
    };

    try {
        const response = await fetch('/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction)
        });
        const result = await response.json();
        document.getElementById('notification').textContent = result.message;
        fetchTransactions();
    } catch (error) {
        console.error('Error adding transaction:', error);
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', fetchTransactions);
