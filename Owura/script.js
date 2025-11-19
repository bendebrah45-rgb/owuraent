// Data Management
let debtors = [];
let profits = [];
let payments = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initializeEventListeners();
    updateDashboard();
    renderDebtorsTable();
    renderProfitsTable();
    
    // Set today's date as default for date inputs
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('profitDate').value = today;
    document.getElementById('paymentDate').value = today;
});

// Event Listeners
function initializeEventListeners() {
    // Form submissions
    document.getElementById('addDebtorForm').addEventListener('submit', handleAddDebtor);
    document.getElementById('addProfitForm').addEventListener('submit', handleAddProfit);
    document.getElementById('paymentForm').addEventListener('submit', handlePayment);
    
    // Import file
    document.getElementById('importFile').addEventListener('change', handleImportFile);
}

// Data Persistence
function saveData() {
    const data = {
        debtors: debtors,
        profits: profits,
        payments: payments
    };
    localStorage.setItem('debtorsProfitsData', JSON.stringify(data));
}

function loadData() {
    const savedData = localStorage.getItem('debtorsProfitsData');
    if (savedData) {
        const data = JSON.parse(savedData);
        debtors = data.debtors || [];
        profits = data.profits || [];
        payments = data.payments || [];
    } else {
        // Load sample data for demonstration
        loadSampleData();
    }
}

function loadSampleData() {
    // Sample debtors
    debtors = [
        {
            id: generateId(),
            name: 'Kwame Asante',
            contact: 'kwame@example.com',
            amount: 5000.00,
            paid: 2000.00,
            dueDate: '2024-02-15',
            notes: 'Payment for consulting services',
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            name: 'Ama Mensah',
            contact: '+233-20-123-4567',
            amount: 7500.00,
            paid: 0.00,
            dueDate: '2024-01-30',
            notes: 'Outstanding invoice for goods supplied',
            createdAt: new Date().toISOString()
        }
    ];
    
    // Sample profits
    profits = [
        {
            id: generateId(),
            date: '2024-01-10',
            description: 'Website Development Project',
            category: 'service',
            amount: 15000.00,
            paymentMethod: 'mobile_money',
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            date: '2024-01-15',
            description: 'Product Sales - Accra Market',
            category: 'sale',
            amount: 8500.00,
            paymentMethod: 'cash',
            createdAt: new Date().toISOString()
        }
    ];
    
    // Sample payments
    payments = [
        {
            id: generateId(),
            debtorId: debtors[0].id,
            amount: 2000.00,
            date: '2024-01-20',
            method: 'mobile_money',
            notes: 'Partial payment via MTN MoMo',
            createdAt: new Date().toISOString()
        }
    ];
    
    saveData();
}

// Utility Functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency: 'GHS'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatPaymentMethod(method) {
    const methods = {
        'cash': 'Cash',
        'mobile_money': 'Mobile Money',
        'bank': 'Bank Transfer',
        'card': 'Credit Card',
        'check': 'Check',
        'other': 'Other'
    };
    return methods[method] || method;
}

function getDebtorStatus(debtor) {
    const balance = debtor.amount - debtor.paid;
    const dueDate = new Date(debtor.dueDate);
    const today = new Date();
    
    if (balance <= 0) return 'paid';
    if (dueDate < today) return 'overdue';
    if (debtor.paid > 0) return 'partial';
    return 'pending';
}

// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to clicked nav button
    event.target.closest('.nav-btn').classList.add('active');
}

// Modal Functions
function showAddDebtorModal() {
    document.getElementById('addDebtorModal').style.display = 'block';
    document.getElementById('addDebtorForm').reset();
}

function showAddProfitModal() {
    document.getElementById('addProfitModal').style.display = 'block';
    document.getElementById('addProfitForm').reset();
    document.getElementById('profitDate').value = new Date().toISOString().split('T')[0];
}

function showPaymentModal(debtorId) {
    document.getElementById('paymentModal').style.display = 'block';
    document.getElementById('paymentDebtorId').value = debtorId;
    document.getElementById('paymentForm').reset();
    document.getElementById('paymentDate').value = new Date().toISOString().split('T')[0];
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Debtor Management
function handleAddDebtor(e) {
    e.preventDefault();
    
    const debtor = {
        id: generateId(),
        name: document.getElementById('debtorName').value,
        contact: document.getElementById('debtorContact').value,
        amount: parseFloat(document.getElementById('debtorAmount').value),
        paid: 0,
        dueDate: document.getElementById('debtorDueDate').value,
        notes: document.getElementById('debtorNotes').value,
        createdAt: new Date().toISOString()
    };
    
    debtors.push(debtor);
    saveData();
    renderDebtorsTable();
    updateDashboard();
    closeModal('addDebtorModal');
}

function renderDebtorsTable() {
    const tbody = document.getElementById('debtorsTableBody');
    
    if (debtors.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No debtors found</h3>
                    <p>Add your first debtor to get started</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = debtors.map(debtor => {
        const balance = debtor.amount - debtor.paid;
        const status = getDebtorStatus(debtor);
        
        return `
            <tr>
                <td><strong>${debtor.name}</strong></td>
                <td>${debtor.contact || '-'}</td>
                <td>${formatCurrency(debtor.amount)}</td>
                <td>${formatCurrency(debtor.paid)}</td>
                <td><strong>${formatCurrency(balance)}</strong></td>
                <td>${formatDate(debtor.dueDate)}</td>
                <td><span class="status-badge ${status}">${status}</span></td>
                <td>
                    <div class="action-buttons">
                        ${balance > 0 ? `
                            <button class="btn btn-success btn-sm" onclick="showPaymentModal('${debtor.id}')">
                                <i class="fas fa-plus"></i> Pay
                            </button>
                        ` : ''}
                        <button class="btn btn-warning btn-sm" onclick="editDebtor('${debtor.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteDebtor('${debtor.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function editDebtor(debtorId) {
    const debtor = debtors.find(d => d.id === debtorId);
    if (!debtor) return;
    
    // Populate form with existing data
    document.getElementById('debtorName').value = debtor.name;
    document.getElementById('debtorContact').value = debtor.contact;
    document.getElementById('debtorAmount').value = debtor.amount;
    document.getElementById('debtorDueDate').value = debtor.dueDate;
    document.getElementById('debtorNotes').value = debtor.notes;
    
    // Show modal
    showAddDebtorModal();
    
    // Modify form submission to update instead of add
    const form = document.getElementById('addDebtorForm');
    form.onsubmit = function(e) {
        e.preventDefault();
        
        // Update debtor
        debtor.name = document.getElementById('debtorName').value;
        debtor.contact = document.getElementById('debtorContact').value;
        debtor.amount = parseFloat(document.getElementById('debtorAmount').value);
        debtor.dueDate = document.getElementById('debtorDueDate').value;
        debtor.notes = document.getElementById('debtorNotes').value;
        
        saveData();
        renderDebtorsTable();
        updateDashboard();
        closeModal('addDebtorModal');
        
        // Reset form submission
        form.onsubmit = handleAddDebtor;
    };
}

function deleteDebtor(debtorId) {
    if (confirm('Are you sure you want to delete this debtor?')) {
        debtors = debtors.filter(d => d.id !== debtorId);
        payments = payments.filter(p => p.debtorId !== debtorId);
        saveData();
        renderDebtorsTable();
        updateDashboard();
    }
}

function filterDebtors() {
    const searchTerm = document.getElementById('debtorSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    const filteredDebtors = debtors.filter(debtor => {
        const matchesSearch = debtor.name.toLowerCase().includes(searchTerm) ||
                              (debtor.contact && debtor.contact.toLowerCase().includes(searchTerm));
        const matchesStatus = !statusFilter || getDebtorStatus(debtor) === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
    
    const tbody = document.getElementById('debtorsTableBody');
    if (filteredDebtors.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No debtors found</h3>
                    <p>Try adjusting your search criteria</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Temporarily replace debtors array and render
    const originalDebtors = debtors;
    debtors = filteredDebtors;
    renderDebtorsTable();
    debtors = originalDebtors;
}

// Payment Management
function handlePayment(e) {
    e.preventDefault();
    
    const debtorId = document.getElementById('paymentDebtorId').value;
    const payment = {
        id: generateId(),
        debtorId: debtorId,
        amount: parseFloat(document.getElementById('paymentAmount').value),
        date: document.getElementById('paymentDate').value,
        method: document.getElementById('paymentMethod').value,
        notes: document.getElementById('paymentNotes').value,
        createdAt: new Date().toISOString()
    };
    
    payments.push(payment);
    
    // Update debtor's paid amount
    const debtor = debtors.find(d => d.id === debtorId);
    if (debtor) {
        debtor.paid += payment.amount;
    }
    
    saveData();
    renderDebtorsTable();
    updateDashboard();
    closeModal('paymentModal');
}

// Profit Management
function handleAddProfit(e) {
    e.preventDefault();
    
    const profit = {
        id: generateId(),
        date: document.getElementById('profitDate').value,
        description: document.getElementById('profitDescription').value,
        category: document.getElementById('profitCategory').value,
        amount: parseFloat(document.getElementById('profitAmount').value),
        paymentMethod: document.getElementById('profitPaymentMethod').value,
        createdAt: new Date().toISOString()
    };
    
    profits.push(profit);
    saveData();
    renderProfitsTable();
    updateDashboard();
    closeModal('addProfitModal');
}

function renderProfitsTable() {
    const tbody = document.getElementById('profitsTableBody');
    
    if (profits.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <i class="fas fa-chart-line"></i>
                    <h3>No profit records found</h3>
                    <p>Add your first profit entry to get started</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = profits.map(profit => `
        <tr>
            <td>${formatDate(profit.date)}</td>
            <td><strong>${profit.description}</strong></td>
            <td><span class="category-badge">${profit.category}</span></td>
            <td><strong>${formatCurrency(profit.amount)}</strong></td>
            <td>${formatPaymentMethod(profit.paymentMethod)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning btn-sm" onclick="editProfit('${profit.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProfit('${profit.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function editProfit(profitId) {
    const profit = profits.find(p => p.id === profitId);
    if (!profit) return;
    
    // Populate form with existing data
    document.getElementById('profitDate').value = profit.date;
    document.getElementById('profitDescription').value = profit.description;
    document.getElementById('profitCategory').value = profit.category;
    document.getElementById('profitAmount').value = profit.amount;
    document.getElementById('profitPaymentMethod').value = profit.paymentMethod;
    
    // Show modal
    showAddProfitModal();
    
    // Modify form submission to update instead of add
    const form = document.getElementById('addProfitForm');
    form.onsubmit = function(e) {
        e.preventDefault();
        
        // Update profit
        profit.date = document.getElementById('profitDate').value;
        profit.description = document.getElementById('profitDescription').value;
        profit.category = document.getElementById('profitCategory').value;
        profit.amount = parseFloat(document.getElementById('profitAmount').value);
        profit.paymentMethod = document.getElementById('profitPaymentMethod').value;
        
        saveData();
        renderProfitsTable();
        updateDashboard();
        closeModal('addProfitModal');
        
        // Reset form submission
        form.onsubmit = handleAddProfit;
    };
}

function deleteProfit(profitId) {
    if (confirm('Are you sure you want to delete this profit entry?')) {
        profits = profits.filter(p => p.id !== profitId);
        saveData();
        renderProfitsTable();
        updateDashboard();
    }
}

function filterProfits() {
    const searchTerm = document.getElementById('profitSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('profitFilter').value;
    
    const filteredProfits = profits.filter(profit => {
        const matchesSearch = profit.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || profit.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });
    
    const tbody = document.getElementById('profitsTableBody');
    if (filteredProfits.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No profit records found</h3>
                    <p>Try adjusting your search criteria</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Temporarily replace profits array and render
    const originalProfits = profits;
    profits = filteredProfits;
    renderProfitsTable();
    profits = originalProfits;
}

// Dashboard Updates
function updateDashboard() {
    // Calculate totals
    const totalProfits = profits.reduce((sum, profit) => sum + profit.amount, 0);
    const totalOwed = debtors.reduce((sum, debtor) => sum + (debtor.amount - debtor.paid), 0);
    const activeDebtors = debtors.filter(debtor => (debtor.amount - debtor.paid) > 0).length;
    
    // Calculate monthly collected
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyCollected = payments
        .filter(payment => {
            const paymentDate = new Date(payment.date);
            return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
        })
        .reduce((sum, payment) => sum + payment.amount, 0);
    
    // Update UI
    document.getElementById('totalProfits').textContent = formatCurrency(totalProfits);
    document.getElementById('totalOwed').textContent = formatCurrency(totalOwed);
    document.getElementById('activeDebtors').textContent = activeDebtors;
    document.getElementById('monthlyCollected').textContent = formatCurrency(monthlyCollected);
    
    // Update recent activity
    updateRecentActivity();
    
    // Update payment chart
    updatePaymentChart();
}

function updateRecentActivity() {
    const activityContainer = document.getElementById('recentActivity');
    const allActivities = [];
    
    // Add recent payments
    payments.slice(-5).reverse().forEach(payment => {
        const debtor = debtors.find(d => d.id === payment.debtorId);
        allActivities.push({
            type: 'payment',
            date: payment.date,
            description: `Payment received from ${debtor ? debtor.name : 'Unknown'}`,
            amount: payment.amount,
            icon: 'fa-check-circle'
        });
    });
    
    // Add recent debtors
    debtors.slice(-3).reverse().forEach(debtor => {
        allActivities.push({
            type: 'debt',
            date: debtor.createdAt,
            description: `New debtor: ${debtor.name}`,
            amount: debtor.amount,
            icon: 'fa-user-plus'
        });
    });
    
    // Add recent profits
    profits.slice(-3).reverse().forEach(profit => {
        allActivities.push({
            type: 'profit',
            date: profit.date,
            description: profit.description,
            amount: profit.amount,
            icon: 'fa-chart-line'
        });
    });
    
    // Sort by date and show latest 5
    allActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentActivities = allActivities.slice(0, 5);
    
    if (recentActivities.length === 0) {
        activityContainer.innerHTML = '<p class="empty-state">No recent activity</p>';
        return;
    }
    
    activityContainer.innerHTML = recentActivities.map(activity => `
        <div class="activity-item ${activity.type}">
            <i class="fas ${activity.icon}"></i>
            <div>
                <strong>${activity.description}</strong><br>
                <small>${formatDate(activity.date)} - ${formatCurrency(activity.amount)}</small>
            </div>
        </div>
    `).join('');
}

function updatePaymentChart() {
    const canvas = document.getElementById('paymentChart');
    const ctx = canvas.getContext('2d');
    
    // Count debtors by status
    const statusCounts = {
        paid: 0,
        partial: 0,
        pending: 0,
        overdue: 0
    };
    
    debtors.forEach(debtor => {
        const status = getDebtorStatus(debtor);
        statusCounts[status]++;
    });
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Simple bar chart
    const data = [
        { label: 'Paid', value: statusCounts.paid, color: '#48bb78' },
        { label: 'Partial', value: statusCounts.partial, color: '#ed8936' },
        { label: 'Pending', value: statusCounts.pending, color: '#4299e1' },
        { label: 'Overdue', value: statusCounts.overdue, color: '#f56565' }
    ];
    
    const maxValue = Math.max(...data.map(d => d.value), 1);
    const barWidth = canvas.width / data.length - 20;
    const chartHeight = canvas.height - 40;
    
    data.forEach((item, index) => {
        const barHeight = (item.value / maxValue) * chartHeight;
        const x = index * (barWidth + 20) + 10;
        const y = canvas.height - barHeight - 20;
        
        // Draw bar
        ctx.fillStyle = item.color;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw label
        ctx.fillStyle = '#333';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(item.label, x + barWidth / 2, canvas.height - 5);
        
        // Draw value
        ctx.fillText(item.value.toString(), x + barWidth / 2, y - 5);
    });
}

// Import/Export Functions
function exportData() {
    const data = {
        debtors: debtors,
        profits: profits,
        payments: payments,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debtors-profits-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importData() {
    document.getElementById('importFile').click();
}

function handleImportFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            
            if (data.debtors) debtors = data.debtors;
            if (data.profits) profits = data.profits;
            if (data.payments) payments = data.payments;
            
            saveData();
            renderDebtorsTable();
            renderProfitsTable();
            updateDashboard();
            
            alert('Data imported successfully!');
        } catch (error) {
            alert('Error importing data. Please check the file format.');
        }
    };
    
    reader.readAsText(file);
    e.target.value = ''; // Reset file input
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}