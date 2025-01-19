# SmartWallet

SmartWallet is a full-stack Node.js web application designed to help users track their financial transactions across multiple accounts. With intuitive features for categorizing transactions, setting budgets, and viewing detailed reports, SmartWallet empowers users to manage their finances efficiently.

<h3>What to Expect</h3>

SmartWallet comes with the following key functionalities:<br>
<ul>
<li>Track Transactions: Users can log and track transactions across multiple accounts (e.g., bank, mobile money, cash).</li>

<li>Categorization: Transactions are categorized into custom categories and subcategories to keep spending organized.</li>

<li>Budget Management: Set a budget limit and receive notifications when spending exceeds the defined limit.
</li>
<li>Visual Reports: Visualizations such as bar charts and pie charts display expenses by category and account type.</li>
<li>Responsive Design: The project is fully responsive and optimized for both desktop and mobile devices.</li>
<li>Data Persistence: The project uses a MySQL database to persist transaction and budget data.</li>
</ul>

# Live Project

You can access the live version of the SmartWallet application here:
<h3><a href='https://smartwallet.onrender.com/index.html' >SmartWallet Live Project</a></h3>

# Prerequisites

Before setting up this project locally, ensure you have the following installed:
<ul>
<li>
Node.js with expres: The latest stable version of Node.js.</li>
<li>
npm: Node Package Manager (comes with Node.js).</li>
<li>
MySQL: A MySQL database [clever cloud ] .

# Folder Structure

smartwallet/
├── public/                # Static files (HTML, CSS, JS)
│   ├── index.html         # Homepage
│   ├── transactions.html  # Transactions Page
│   ├── reports.html       # Reports Page
│   ├── budget.html        # Budget Page
│   └── style.css          # Main styles
├── views/                 # EJS templates
│   └── index.ejs          # Homepage template
├── app.js                 # Main application logic (Node.js)
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation

</li>
<ul>