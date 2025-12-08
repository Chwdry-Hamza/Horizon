const fs = require('fs');
const path = require('path');

function getProperties() {
    const filePath = path.join(process.cwd(), 'data', 'properties.json');
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

    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const properties = getProperties();
            const property = properties.find(p => p.id === id);

            if (property) {
                return res.status(200).json(property);
            } else {
                return res.status(404).json({ error: 'Property not found' });
            }
        } catch (error) {
            console.error('Error reading property:', error);
            return res.status(500).json({ error: 'Failed to load property' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
