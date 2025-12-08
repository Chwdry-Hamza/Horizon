const fs = require('fs');
const path = require('path');

function getAdmin() {
    const filePath = path.join(process.cwd(), 'data', 'admin.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

module.exports = (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        try {
            const admin = getAdmin();
            return res.status(200).json({
                username: admin.username,
                email: admin.email
            });
        } catch (error) {
            console.error('Error reading settings:', error);
            return res.status(500).json({ error: 'Failed to load settings' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
