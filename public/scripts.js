// Global Variables
const API_BASE = '/transactions/all';

// Fetch transactions from the backend
async function fetchTransactions() {
    try {
        const response = await fetch(API_BASE);
        const data = await response.json();
        return data;
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

// Render Bar Chart
function renderBarChart(transactions) {
    const ctx = document.getElementById('barChart').getContext('2d');
    const categories = [...new Set(transactions.map(t => t.category))];
    const categoryTotals = categories.map(category =>
        transactions
            .filter(t => t.category === category && t.transactionType === 'expense')
            .reduce((sum, t) => sum + t.amount, 0)
    );

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Expenses by Category',
                data: categoryTotals,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}

// Render Pie Chart
function renderPieChart(transactions) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    const accountTypes = [...new Set(transactions.map(t => t.accountType))];
    const accountTotals = accountTypes.map(account =>
        transactions
            .filter(t => t.accountType === account && t.transactionType === 'expense')
            .reduce((sum, t) => sum + t.amount, 0)
    );

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: accountTypes,
            datasets: [{
                data: accountTotals,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

// Initialize Page
async function initTransactionsPage() {
    const transactions = await fetchTransactions();
    populateTransactionTable(transactions);
    renderBarChart(transactions);
    renderPieChart(transactions);
}

// Initialize all pages
function initPage() {
    if (document.body.classList.contains('transactions-page')) {
        initTransactionsPage();
    }
}
document.addEventListener('DOMContentLoaded', initPage);
