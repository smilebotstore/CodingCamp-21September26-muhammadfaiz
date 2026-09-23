// Expense & Budget Visualizer - Main Application Script

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const transactionForm = document.getElementById('transactionForm');
const itemNameInput = document.getElementById('itemName');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const addCustomCategoryBtn = document.getElementById('addCustomCategoryBtn');
const customCategoryGroup = document.getElementById('customCategoryGroup');
const customCategoryInput = document.getElementById('customCategory');
const transactionList = document.getElementById('transactionList');
const totalBalanceEl = document.getElementById('totalBalance');
const totalSpentEl = document.getElementById('totalSpent');
const budgetRemainingEl = document.getElementById('budgetRemaining');
const transactionCountEl = document.getElementById('transactionCount');
const saveBudgetBtn = document.getElementById('saveBudgetBtn');
const monthlyBudgetInput = document.getElementById('monthlyBudget');

// Data
let transactions = [];
let categories = ['Food', 'Transport', 'Fun'];
let monthlyBudget = 0;
let chartInstance = null;

// Initialize Application
function init() {
    loadData();
    setupEventListeners();
    setupTheme();
    updateUI();
}

// Load Data from Local Storage
function loadData() {
    const savedTransactions = localStorage.getItem('expenseTransactions');
    const savedCategories = localStorage.getItem('expenseCategories');
    const savedBudget = localStorage.getItem('expenseMonthlyBudget');
    const savedTheme = localStorage.getItem('expenseTheme');

    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
    }

    if (savedCategories) {
        categories = JSON.parse(savedCategories);
        updateCategorySelect();
    }

    if (savedBudget) {
        monthlyBudget = parseFloat(savedBudget);
        monthlyBudgetInput.value = monthlyBudget;
    }

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
}

// Save Data to Local Storage
function saveData() {
    localStorage.setItem('expenseTransactions', JSON.stringify(transactions));
    localStorage.setItem('expenseCategories', JSON.stringify(categories));
}

// Event Listeners
function setupEventListeners() {
    themeToggle.addEventListener('click', toggleTheme);
    
    // Toggle custom category input AND handle adding category when Done is clicked
    addCustomCategoryBtn.addEventListener('click', function(e) {
        if (customCategoryGroup.style.display === 'none') {
            // Show custom category input
            customCategoryGroup.style.display = 'flex';
            customCategoryInput.focus();
            addCustomCategoryBtn.innerHTML = '<i class="fa-solid fa-check"></i> Done';
            
            // Store original onclick to restore later
            customCategoryInput.dataset.originalOnclick = '';
            
            // Add event listener for Enter key
            customCategoryInput.onkeydown = function(event) {
                if (event.key === 'Enter') {
                    const category = customCategoryInput.value.trim();
                    if (category) {
                        addCategory(category);
                        customCategoryInput.value = '';
                        customCategoryGroup.style.display = 'none';
                        addCustomCategoryBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Custom';
                        categorySelect.focus();
                    }
                }
            };
        } else {
            // Check if there's a value in the input and add it
            if (customCategoryInput.value.trim()) {
                addCategory(customCategoryInput.value.trim());
                customCategoryInput.value = '';
                customCategoryGroup.style.display = 'none';
                addCustomCategoryBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Custom';
                categorySelect.focus();
            } else {
                // Just hide the input
                customCategoryGroup.style.display = 'none';
                addCustomCategoryBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Custom';
            }
        }
    });
    
    transactionForm.addEventListener('submit', handleTransactionSubmit);
    saveBudgetBtn.addEventListener('click', handleBudgetSave);
}

// Helper function to update select element when categories change
function updateCategorySelect() {
    const currentSelection = categorySelect.value;
    categorySelect.innerHTML = '<option value="" disabled selected>Select category</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
    
    if (currentSelection && categories.includes(currentSelection)) {
        categorySelect.value = currentSelection;
    } else if (categories.length > 0) {
        categorySelect.value = categories[0];
    }
}

// Theme Functions
function setupTheme() {
    const savedTheme = localStorage.getItem('expenseTheme');
    if (!savedTheme) {
        localStorage.setItem('expenseTheme', 'light');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('expenseTheme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
}

// Custom Category Functions - REMOVED - functionality moved to event listener

// Transaction Functions
function handleTransactionSubmit(e) {
    e.preventDefault();

    const name = itemNameInput.value.trim();
    const amount = parseFloat(amountInput.value);
    let category = categorySelect.value;

    // If custom category input is visible and has a value
    if (customCategoryGroup.style.display === 'flex' && customCategoryInput.value.trim()) {
        category = customCategoryInput.value.trim();
        addCategory(category);
        customCategoryGroup.style.display = 'none';
        addCustomCategoryBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Custom';
        customCategoryInput.value = '';
    }

    if (!name || isNaN(amount) || amount <= 0 || !category) {
        alert('Please fill in all fields with valid values.');
        return;
    }

    const transaction = {
        id: Date.now(),
        name: name,
        amount: amount,
        category: category,
        date: new Date().toISOString()
    };

    transactions.unshift(transaction);
    saveData();
    updateUI();

    // Reset form
    transactionForm.reset();
    customCategoryInput.value = '';
    customCategoryGroup.style.display = 'none';
    addCustomCategoryBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Custom';
}

function addCategory(category) {
    const normalizedCategory = category.toLowerCase();
    const exists = categories.some(cat => cat.toLowerCase() === normalizedCategory);

    if (!exists) {
        categories.push(category);
        updateCategorySelect();
        saveData();
    }
}



function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveData();
        updateUI();
    }
}

// UI Update Functions
function updateUI() {
    updateBalance();
    updateTransactionList();
    updateMonthlySummary();
    updateChart();
}

function updateBalance() {
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    totalBalanceEl.textContent = formatCurrency(total);
}

function updateTransactionList() {
    if (transactions.length === 0) {
        transactionList.innerHTML = '<div class="empty-state">No transactions yet. Add your first expense!</div>';
        return;
    }

    let html = '';
    transactions.forEach(transaction => {
        html += `
            <div class="transaction-item" data-id="${transaction.id}">
                <div class="transaction-info">
                    <div class="transaction-name">${transaction.name}</div>
                    <div class="transaction-details">
                        <span class="transaction-category">${transaction.category}</span>
                        <span>${formatDate(transaction.date)}</span>
                    </div>
                </div>
                <div class="transaction-amount">${formatCurrency(transaction.amount)}</div>
                <button class="delete-btn" onclick="deleteTransaction(${transaction.id})" aria-label="Delete transaction">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
    });

    transactionList.innerHTML = html;
}

function updateMonthlySummary() {
    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    const remainingBudget = monthlyBudget - totalSpent;
    const transactionCount = transactions.length;

    totalSpentEl.textContent = formatCurrency(totalSpent);
    budgetRemainingEl.textContent = formatCurrency(remainingBudget);
    transactionCountEl.textContent = transactionCount;

    // Style budget remaining based on status
    if (remainingBudget < 0) {
        budgetRemainingEl.style.color = 'var(--danger-color)';
    } else if (remainingBudget < totalSpent * 0.2) {
        budgetRemainingEl.style.color = '#f39c12';
    } else {
        budgetRemainingEl.style.color = 'var(--success-color)';
    }
}

function handleBudgetSave() {
    const newBudget = parseFloat(monthlyBudgetInput.value);

    if (isNaN(newBudget) || newBudget < 0) {
        alert('Please enter a valid budget amount.');
        return;
    }

    monthlyBudget = newBudget;
    localStorage.setItem('expenseMonthlyBudget', monthlyBudget.toString());
    updateUI();
}

// Chart Functions
function updateChart() {
    const ctx = document.getElementById('spendingChart').getContext('2d');

    // Group transactions by category
    const categoryTotals = {};
    categories.forEach(cat => {
        categoryTotals[cat] = transactions
            .filter(t => t.category === cat)
            .reduce((sum, t) => sum + t.amount, 0);
    });

    // Filter out zero values and create chart data
    const labels = [];
    const data = [];
    const backgroundColors = [
        '#4a90e2',
        '#50e3c2',
        '#e74c3c',
        '#f39c12',
        '#9b59b6',
        '#3498db',
        '#e91e63',
        '#00bcd4'
    ];

    let index = 0;
    for (const [category, total] of Object.entries(categoryTotals)) {
        if (total > 0) {
            labels.push(category);
            data.push(total);
        }
        index++;
    }

    // Destroy existing chart if exists
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Create new chart
    if (labels.length > 0) {
        chartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors.slice(0, labels.length),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: false
                    }
                }
            }
        });
    }
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('id-ID', options);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
