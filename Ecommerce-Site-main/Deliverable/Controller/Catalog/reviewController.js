const Review = require('../../Models/Review');
const User = require('../../Models/User');

exports.createReview = async (req, res) => {
    try {
        const { vehicleId, userId, rating, comment } = req.body;
        const review = await Review.create({ vehicleId, userId, rating, comment });
        res.status(201).json(review);
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ error: 'Failed to add review' });
    }
};

exports.getReviews = async (req, res) => {
    try {
        const vehicleId = req.params.id;

        // Fetch reviews for the vehicle
        const reviews = await Review.findAll({
            where: { vehicleId }
        });

        // Fetch user details for each review
        const reviewsWithUserData = await Promise.all(
            reviews.map(async (review) => {
                const user = await User.findOne({
                    where: { id: review.userId },
                    attributes: ['fName', 'lName'] // Retrieve first and last name
                });
                return {
                    ...review.dataValues, // Include review data
                    user: {
                        fName: user.fName,
                        lName: user.lName,
                    }
                };
            })
        );

        res.json(reviewsWithUserData);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};
