

  // Fetch total study time per day
router.get("/study-sessions/:userId", async (req, res) => {
    const { userId } = req.params;
  
    try {
      const sessions = await StudySession.find({ userId }).sort({ date: 1 });
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  });
  
  module.exports = router;