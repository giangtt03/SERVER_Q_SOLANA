const WeeklyRanking = require('../../models/api/WeeklyRanking');
const TKNguoiDung = require('../../models/api/User');
const Session = require('../../models/api/Session');
const cron = require('node-cron');

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

        weeklyRankings.sort((a, b) => b.scoreWithinSevenDays - a.scoreWithinSevenDays);

        for (let i = 0; i < weeklyRankings.length; i++) {
            const ranking = weeklyRankings[i];

            await WeeklyRanking.findOneAndUpdate(
                { userId: ranking._id },
                { scoreWithinSevenDays: ranking.scoreWithinSevenDays },
                { upsert: true }
            );

            if (i === 0) {
                const topUserScore = await UserScore.findOne({ userId: ranking._id });

                if (topUserScore) {
                    topUserScore.totalScore += 200;
                    await topUserScore.save();
                    console.log(`Added 200 points to the total score of user ${ranking._id}`);
                }
            }
        }

        console.log('Weekly rankings updated successfully');
    } catch (error) {
        console.error("Error updating weekly rankings:", error);
    }
};

const getWeeklyRankings = async (req, res) => {
    try {
        const rankings = await WeeklyRanking.find();

        rankings.sort((a, b) => b.scoreWithinSevenDays - a.scoreWithinSevenDays);
        
        rankings.forEach((ranking, index) => {
            ranking.rank = index + 1;
        });

        const userIds = rankings.map(ranking => ranking.userId);
        const users = await TKNguoiDung.find({ _id: { $in: userIds } });

        const updatedRankings = rankings.map(ranking => {
            const user = users.find(user => user._id.equals(ranking.userId));
            return {
                ...ranking.toObject(), 
                user: user ? { avatar: user.avatar, name: user.username, _id: user._id } : null            };
        });

        res.json(updatedRankings);
    } catch (error) {
        console.error("Error fetching weekly rankings:", error);
        res.status(500).json({ message: error.message });
    }
};


const updateRankingOnTestCompletion = async (userId, score) => {
    try {
        let weeklyRanking = await WeeklyRanking.findOne({ userId });

        if (!weeklyRanking) {
            weeklyRanking = new WeeklyRanking({ userId, scoreWithinSevenDays: score });
            await weeklyRanking.save();
            console.log(`New weekly ranking added for user ${userId} with score ${score}`);
        } else {
            weeklyRanking.scoreWithinSevenDays += score;
            await weeklyRanking.save();
            console.log(`Updating weekly ranking for user ${userId} with score ${score}`);
        }
    } catch (error) {
        console.error("Error updating ranking:", error);
        throw error;
    }
};

module.exports = {
    updateWeeklyRankings,
    getWeeklyRankings,
    updateRankingOnTestCompletion, 
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
