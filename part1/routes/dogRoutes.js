// Route to get all dogs with their size and owner's username
app.get('/api/dogs', async (req, res) => {
    try {
        // SQL query to join Dogs table with Users table to get owner username
        const query = `
            SELECT 
                d.name as dog_name,
                d.size,
                u.username as owner_username
            FROM Dogs d
            JOIN Users u ON d.owner_id = u.user_id
            ORDER BY d.name
        `;
        
        // Execute the query
        const [results] = await db.execute(query);
        
        // Return results as JSON
        res.json(results);
        
    } catch (error) {
        console.error('Error fetching dogs:', error);
        res.status(500).json({ 
            error: 'Failed to fetch dogs',
            message: error.message 
        });
    }
});