const WeeklyRanking = require('../../models/api/WeeklyRanking');
const Session = require('../../models/api/Session');
const cron = require('node-cron');

module.exports = {
    updateWeeklyRankings: async () => {
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


                await module.exports.updateRankingOnTestCompletion(ranking._id, ranking.scoreWithinSevenDays);
            }

            console.log('Weekly rankings updated successfully');
        } catch (error) {
            console.error("Error updating weekly rankings:", error);
        }
    },

    getWeeklyRankings: async (req, res) => {
        try {
            const rankings = await WeeklyRanking.find().populate('userId');

            res.json(rankings);
        } catch (error) {
            console.error("Error fetching weekly rankings:", error);
            res.status(500).json({ message: error.message });
        }
    },

    updateRankingOnTestCompletion: async (userId, score) => {
        try {
            console.log("UserId in updateRankingOnTestCompletion:", userId);

            if (!userId) {
                console.error("Error: userId is null or undefined");
                return;
            }

            let weeklyRanking = await WeeklyRanking.findOne({ userId: userId });

            if (!weeklyRanking) {
                weeklyRanking = await WeeklyRanking.create({
                    userId: userId,
                    scoreWithinSevenDays: 0

                });
            }

            const updatedRanking = await WeeklyRanking.findOneAndUpdate(
                { userId: userId },
                { $inc: { scoreWithinSevenDays: score } },
                { new: true }
            );

            console.log(`Updated ranking for user ${userId} with score ${score}`);

            if (updatedRanking) {
                console.log("Updated ranking saved successfully");
            } else {
                console.error(`User ${userId} not found in weekly rankings`);
            }
        } catch (error) {
            console.error("Error updating weekly rankings on test completion:", error);
        }
    },


    scheduleWeeklyRankingUpdate: () => {
        cron.schedule('0 0 * * *', () => {
            console.log('Running updateWeeklyRankings...');
            module.exports.updateWeeklyRankings();
        }, {
            scheduled: true,
            timezone: 'Asia/Ho_Chi_Minh'
        });
    }
};

module.exports.scheduleWeeklyRankingUpdate();
