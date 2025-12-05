const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// File paths
const PROPERTIES_FILE = path.join(__dirname, 'data', 'properties.json');
const ADMIN_FILE = path.join(__dirname, 'data', 'admin.json');

// Helper functions
async function readJSON(filepath) {
    try {
        const data = await fs.readFile(filepath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filepath}:`, error);
        return null;
    }
}

async function writeJSON(filepath, data) {
    try {
        await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error(`Error writing ${filepath}:`, error);
        return false;
    }
}

// ============ PROPERTIES ENDPOINTS ============

// Get all properties
app.get('/api/properties', async (req, res) => {
    const properties = await readJSON(PROPERTIES_FILE);
    if (properties) {
        res.json(properties);
    } else {
        res.status(500).json({ error: 'Failed to load properties' });
    }
});

// Get single property by ID
app.get('/api/properties/:id', async (req, res) => {
    const properties = await readJSON(PROPERTIES_FILE);
    if (properties) {
        const property = properties.find(p => p.id === req.params.id);
        if (property) {
            res.json(property);
        } else {
            res.status(404).json({ error: 'Property not found' });
        }
    } else {
        res.status(500).json({ error: 'Failed to load properties' });
    }
});

// Create new property
app.post('/api/properties', async (req, res) => {
    const properties = await readJSON(PROPERTIES_FILE);
    if (properties) {
        const newProperty = {
            id: `prop-${String(properties.length + 1).padStart(3, '0')}`,
            ...req.body,
            createdAt: new Date().toISOString()
        };
        properties.push(newProperty);
        const success = await writeJSON(PROPERTIES_FILE, properties);
        if (success) {
            res.status(201).json(newProperty);
        } else {
            res.status(500).json({ error: 'Failed to save property' });
        }
    } else {
        res.status(500).json({ error: 'Failed to load properties' });
    }
});

// Update property
app.put('/api/properties/:id', async (req, res) => {
    const properties = await readJSON(PROPERTIES_FILE);
    if (properties) {
        const index = properties.findIndex(p => p.id === req.params.id);
        if (index !== -1) {
            properties[index] = { ...properties[index], ...req.body };
            const success = await writeJSON(PROPERTIES_FILE, properties);
            if (success) {
                res.json(properties[index]);
            } else {
                res.status(500).json({ error: 'Failed to save property' });
            }
        } else {
            res.status(404).json({ error: 'Property not found' });
        }
    } else {
        res.status(500).json({ error: 'Failed to load properties' });
    }
});

// Delete property
app.delete('/api/properties/:id', async (req, res) => {
    const properties = await readJSON(PROPERTIES_FILE);
    if (properties) {
        const filtered = properties.filter(p => p.id !== req.params.id);
        if (filtered.length < properties.length) {
            const success = await writeJSON(PROPERTIES_FILE, filtered);
            if (success) {
                res.json({ message: 'Property deleted successfully' });
            } else {
                res.status(500).json({ error: 'Failed to save properties' });
            }
        } else {
            res.status(404).json({ error: 'Property not found' });
        }
    } else {
        res.status(500).json({ error: 'Failed to load properties' });
    }
});

// ============ ADMIN ENDPOINTS ============

// Admin login
app.post('/api/admin/login', async (req, res) => {
    const admin = await readJSON(ADMIN_FILE);
    const { username, password } = req.body;

    if (admin && admin.username === username && admin.password === password) {
        admin.lastLogin = new Date().toISOString();
        await writeJSON(ADMIN_FILE, admin);
        res.json({ success: true, user: { username: admin.username, email: admin.email } });
    } else {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
});

// Get admin settings
app.get('/api/admin/settings', async (req, res) => {
    const admin = await readJSON(ADMIN_FILE);
    if (admin) {
        res.json({ username: admin.username, email: admin.email });
    } else {
        res.status(500).json({ error: 'Failed to load admin settings' });
    }
});

// Update admin settings
app.put('/api/admin/settings', async (req, res) => {
    const admin = await readJSON(ADMIN_FILE);
    if (admin) {
        const { username, password, email } = req.body;
        if (username) admin.username = username;
        if (password) admin.password = password;
        if (email) admin.email = email;

        const success = await writeJSON(ADMIN_FILE, admin);
        if (success) {
            res.json({ success: true, user: { username: admin.username, email: admin.email } });
        } else {
            res.status(500).json({ error: 'Failed to save settings' });
        }
    } else {
        res.status(500).json({ error: 'Failed to load admin settings' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`📊 API endpoints:`);
    console.log(`   - GET    /api/properties`);
    console.log(`   - GET    /api/properties/:id`);
    console.log(`   - POST   /api/properties`);
    console.log(`   - PUT    /api/properties/:id`);
    console.log(`   - DELETE /api/properties/:id`);
    console.log(`   - POST   /api/admin/login`);
    console.log(`   - GET    /api/admin/settings`);
    console.log(`   - PUT    /api/admin/settings`);
});
