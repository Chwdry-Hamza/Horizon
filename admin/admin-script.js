// =============================================
// ADMIN PANEL - PROPERTY MANAGEMENT
// =============================================

const API_URL = '/api';
let properties = [];
let editingPropertyId = null;

// Check authentication
function checkAuth() {
    const admin = sessionStorage.getItem('admin');
    if (!admin) {
        window.location.href = 'login.html';
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('admin');
        window.location.href = 'login.html';
    }
}

// Load properties
async function loadProperties() {
    try {
        const response = await fetch(`${API_URL}/properties`);
        properties = await response.json();
        updateStats();
        renderPropertiesCards();
    } catch (error) {
        console.error('Error loading properties:', error);
        showAlert('Failed to load properties', 'error');
        document.getElementById('propertiesContainer').innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <h3 style="color: var(--admin-danger); margin-bottom: 15px;">Unable to load properties</h3>
                <p style="color: var(--admin-text-muted);">Please make sure the server is running.</p>
            </div>
        `;
    }
}

// Update stats
function updateStats() {
    const totalProperties = properties.length;
    const totalValue = properties.reduce((sum, p) => sum + p.price, 0);
    const featuredCount = properties.filter(p => p.featured).length;
    const forSaleCount = properties.filter(p => p.status === 'for-sale').length;

    document.getElementById('totalProperties').textContent = totalProperties;
    document.getElementById('totalValue').textContent = `AED ${formatNumber(totalValue)}`;
    document.getElementById('featuredCount').textContent = featuredCount;
    document.getElementById('forSaleCount').textContent = forSaleCount;
}

// Format number
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Render properties as cards
function renderPropertiesCards() {
    const container = document.getElementById('propertiesContainer');

    if (properties.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <h3 style="color: var(--admin-accent); margin-bottom: 15px;">No properties yet</h3>
                <p style="color: var(--admin-text-muted); margin-bottom: 25px;">Click "Add Property" to get started.</p>
                <button class="btn-primary" onclick="openAddModal()">
                    <span class="btn-icon">➕</span> Add Your First Property
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = properties.map(property => {
        const defaultImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop';
        const image = property.images && property.images.length > 0 ? property.images[0] : defaultImage;
        const statusClass = property.status.replace('-', '');

        return `
            <div class="property-admin-card">
                <div class="property-admin-image" style="background-image: url('${image}');">
                    ${property.featured ? '<span class="badge badge-featured">⭐ Featured</span>' : ''}
                    <span class="badge badge-${statusClass}">${capitalizeFirst(property.status)}</span>
                </div>
                <div class="property-admin-content">
                    <h3 class="property-admin-title">${property.title}</h3>
                    <p class="property-admin-location">📍 ${property.location}</p>
                    <p class="property-admin-price">AED ${formatNumber(property.price)}</p>
                    <div class="property-admin-stats">
                        <span>🛏️ ${property.bedrooms} Beds</span>
                        <span>🛁 ${property.bathrooms} Baths</span>
                        <span>📐 ${formatNumber(property.area)} sqft</span>
                    </div>
                    <div class="property-admin-actions">
                        <button class="btn-icon-action btn-edit" onclick="editProperty('${property.id}')" title="Edit">
                            ✏️ Edit
                        </button>
                        <button class="btn-icon-action btn-view" onclick="viewProperty('${property.id}')" title="View">
                            👁️ View
                        </button>
                        <button class="btn-icon-action btn-delete" onclick="deleteProperty('${property.id}')" title="Delete">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Capitalize first letter
function capitalizeFirst(str) {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// View property
function viewProperty(id) {
    window.open(`../property.html?id=${id}`, '_blank');
}

// Open add modal
function openAddModal() {
    editingPropertyId = null;
    document.getElementById('modalTitle').textContent = 'Add New Property';
    document.getElementById('propertyForm').reset();
    document.getElementById('propertyId').value = '';
    openModal();
}

// Edit property
function editProperty(id) {
    const property = properties.find(p => p.id === id);
    if (!property) return;

    editingPropertyId = id;
    document.getElementById('modalTitle').textContent = 'Edit Property';

    // Fill form
    document.getElementById('propertyId').value = property.id;
    document.getElementById('title').value = property.title;
    document.getElementById('location').value = property.location;
    document.getElementById('price').value = property.price;
    document.getElementById('type').value = property.type;
    document.getElementById('bedrooms').value = property.bedrooms;
    document.getElementById('bathrooms').value = property.bathrooms;
    document.getElementById('area').value = property.area;
    document.getElementById('parking').value = property.parking;
    document.getElementById('yearBuilt').value = property.yearBuilt;
    document.getElementById('status').value = property.status;
    document.getElementById('featured').checked = property.featured;
    document.getElementById('description').value = property.description;
    document.getElementById('features').value = property.features ? property.features.join('\n') : '';
    document.getElementById('images').value = property.images ? property.images.join('\n') : '';

    openModal();
}

// Delete property
async function deleteProperty(id) {
    const property = properties.find(p => p.id === id);
    if (!property) return;

    if (!confirm(`Are you sure you want to delete "${property.title}"?\n\nThis action cannot be undone.`)) return;

    try {
        const response = await fetch(`${API_URL}/properties/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showAlert('Property deleted successfully', 'success');
            loadProperties();
        } else {
            throw new Error('Failed to delete');
        }
    } catch (error) {
        console.error('Error deleting property:', error);
        showAlert('Failed to delete property', 'error');
    }
}

// Open/Close modal
function openModal() {
    document.getElementById('propertyModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('propertyModal').classList.remove('active');
    document.getElementById('propertyForm').reset();
    document.body.style.overflow = '';
    editingPropertyId = null;
}

// Handle form submit
document.getElementById('propertyForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        title: document.getElementById('title').value.trim(),
        location: document.getElementById('location').value.trim(),
        price: parseInt(document.getElementById('price').value),
        type: document.getElementById('type').value,
        bedrooms: parseInt(document.getElementById('bedrooms').value),
        bathrooms: parseInt(document.getElementById('bathrooms').value),
        area: parseInt(document.getElementById('area').value),
        parking: parseInt(document.getElementById('parking').value),
        yearBuilt: parseInt(document.getElementById('yearBuilt').value),
        status: document.getElementById('status').value,
        featured: document.getElementById('featured').checked,
        description: document.getElementById('description').value.trim(),
        features: document.getElementById('features').value.split('\n').filter(f => f.trim()),
        images: document.getElementById('images').value.split('\n').filter(i => i.trim())
    };

    try {
        let response;
        if (editingPropertyId) {
            response = await fetch(`${API_URL}/properties/${editingPropertyId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        } else {
            response = await fetch(`${API_URL}/properties`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        }

        if (response.ok) {
            showAlert(
                editingPropertyId ? 'Property updated successfully' : 'Property created successfully',
                'success'
            );
            closeModal();
            loadProperties();
        } else {
            throw new Error('Failed to save');
        }
    } catch (error) {
        console.error('Error saving property:', error);
        showAlert('Failed to save property', 'error');
    }
});

// Show alert
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <span>${type === 'success' ? '✅' : '❌'}</span>
        <span>${message}</span>
    `;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '10001';
    alertDiv.style.minWidth = '300px';
    alertDiv.style.animation = 'slideIn 0.3s ease';

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// Initialize
if (document.querySelector('.admin-body')) {
    checkAuth();
    loadProperties();
}

// Close modal on outside click
document.getElementById('propertyModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'propertyModal') {
        closeModal();
    }
});

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);
