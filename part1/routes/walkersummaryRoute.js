//Route to get walker summary avg rating and completed walks
app.get('/api/walkers/summary', async (req, res ) => {
    try {
        //Query to get walker statistics
        const query = `
            SELECT 
                u.username as walker_username,
                COUNT(wr.rating_id) as total_ratings,
                CASE 
                    WHEN COUNT(wr.rating_id) > 0 
                    THEN ROUND(AVG(wr.rating), 1)
                    ELSE NULL 
                END as average_rating,
                COUNT(DISTINCT wa.request_id) as completed_walks
            FROM Users u
            LEFT JOIN WalkApplications wa ON u.user_id = wa.walker_id 
                AND wa.status = 'accepted'
            LEFT JOIN WalkRatings wr ON wa.walker_id = wr.walker_id 
                AND wa.request_id = wr.request_id
            WHERE u.role = 'walker'
            GROUP BY u.user_id, u.username
            ORDER BY u.username
        `;

        //Execute the query
        const [results] = await db.execute(query);

        // Convert total_ratings from BigInt to regular number for JSON serialization
        const formattedResults = results.map(row => ({
            ...row,
            total_ratings: Number(row.total_ratings),
            completed_walks: Number(row.completed_walks)
        }));

        //Return results as JSON
        res.json(formattedResults);

    } catch (error) {
        console.error('Error fetching walker summary:', error);
        res.status(500).json({
            error: 'Failed to fetch walker summary',
            message: error.message
        });
    }
});