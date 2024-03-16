const WeeklyRanking = require('../../models/api/WeeklyRanking');
const TKNguoiDung = require('../../models/api/User');
const Session = require('../../models/api/Session');
const cron = require('node-cron');

// Function to update weekly rankings
const updateWeeklyRankings = async () => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const weeklyRankings = await Session.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: "$userId",
                    scoreWithinSevenDays: { $sum: "$score" }
                }
            }
        ]);

        console.log("Weekly rankings:", weeklyRankings);

        for (const ranking of weeklyRankings) {
            console.log("Updating ranking for user:", ranking._id);
            await WeeklyRanking.findOneAndUpdate(
                { userId: ranking._id },
                {
                    scoreWithinSevenDays: ranking.scoreWithinSevenDays,
                },
                { upsert: true }
            );

        }

        console.log('Weekly rankings updated successfully');
    } catch (error) {
        console.error("Error updating weekly rankings:", error);
    }
};

// Function to get weekly rankings
const getWeeklyRankings = async (req, res) => {
    try {
        const rankings = await WeeklyRanking.find();
        
        const userIds = rankings.map(ranking => ranking.userId);
        const users = await TKNguoiDung.find({ _id: { $in: userIds } });

        const updatedRankings = rankings.map(ranking => {
            const user = users.find(user => user._id.equals(ranking.userId));
            return {
                ...ranking.toObject(), // Convert Mongoose document to plain JavaScript object
                user: user ? { avatar: user.avatar, name: user.username } : null
            };
        });

        res.json(updatedRankings);
    } catch (error) {
        console.error("Error fetching weekly rankings:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    updateWeeklyRankings,
    getWeeklyRankings,
    scheduleWeeklyRankingUpdate: () => {
        cron.schedule('0 0 * * *', () => {
            console.log('Running updateWeeklyRankings...');
            updateWeeklyRankings();
        }, {
            scheduled: true,
            timezone: 'Asia/Ho_Chi_Minh'
        });
    }
};
