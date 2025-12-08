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
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            const admin = getAdmin();
            const { username, password } = req.body;

            if (admin && admin.username === username && admin.password === password) {
                return res.status(200).json({
                    success: true,
                    user: { username: admin.username, email: admin.email }
                });
            } else {
                return res.status(401).json({ success: false, error: 'Invalid credentials' });
            }
        } catch (error) {
            console.error('Error during login:', error);
            return res.status(500).json({ error: 'Login failed' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
