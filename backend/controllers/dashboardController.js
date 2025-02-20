const getStats = (req, res) => {
    res.json({
        studyHours: {
            total: 24.5,
            change: "+2.5 from last week"
        },
        quizzes: {
            completed: 15,
            change: "+3 this week"
        },
        streak: {
            days: 7,
            message: "Keep it up!"
        },
        achievements: {
            total: 12,
            new: "2 new unlocked"
        }
    });
};

const getActivities = (req, res) => {
    res.json([
        {
            type: "quiz",
            title: "Completed Quiz: JavaScript Basics",
            timestamp: new Date(),
            timeAgo: "Just now"
        },
        {
            type: "study",
            title: "Studied for 2 hours",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            timeAgo: "2 hours ago"
        },
        {
            type: "achievement",
            title: "Earned Achievement: Week Warrior",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            timeAgo: "Yesterday"
        }
    ]);
};

const getProgress = (req, res) => {
    res.json({
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: [2, 4, 3, 5, 4, 3, 3.5]
    });
};

module.exports = {
    getStats,
    getActivities,
    getProgress
};
