// Route to get all open walk requests with dog and owner details
app.get('/api/walkrequests/open', async (req, res) => {
    try {
        // SQL query to get open walk requests with related dog and owner info
        const query = `
            SELECT 
                wr.request_id,
                d.name as dog_name,
                wr.requested_time,
                wr.duration_minutes,
                wr.location,
                u.username as owner_username
            FROM WalkRequests wr
            JOIN Dogs d ON wr.dog_id = d.dog_id
            JOIN Users u ON d.owner_id = u.user_id
            WHERE wr.status = 'open'
            ORDER BY wr.requested_time
        `;
        
        // Execute the query
        const [results] = await db.execute(query);
        
        // Return results as JSON
        res.json(results);
        
    } catch (error) {
        console.error('Error fetching open walk requests:', error);
        res.status(500).json({ 
            error: 'Failed to fetch open walk requests',
            message: error.message 
        });
    }
});