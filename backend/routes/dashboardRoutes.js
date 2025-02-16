const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

// GET requests
router.get("/stats", dashboardController.getStats);
router.get("/activities", dashboardController.getActivities);
router.get("/progress", dashboardController.getProgress);

// Single POST request for all dashboard data
router.post("/", (req, res) => {
    const { type, data } = req.body;

    if (!type || !data) {
        return res.status(400).json({ error: "Type and data are required" });
    }

    let message = "";
    switch (type) {
        case "stats":
            message = "Stats updated successfully!";
            break;
        case "activities":
            message = "Activity added successfully!";
            break;
        case "progress":
            message = "Progress added successfully!";
            break;
        default:
            return res.status(400).json({ error: "Invalid type" });
    }

    res.status(201).json({
        message,
        data
    });
});

module.exports = router;
