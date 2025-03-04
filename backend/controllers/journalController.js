const JournalEntry = require('../models/JournalEntry');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Helper function to generate recommendations based on a reflection prompt
async function generateRecommendations(reflection) {
  const prompt = `Based on the following study reflection, recommend some additional resources and study tips:\n\n${reflection}`;

  // Initialize the Generative AI client with your API key from the environment
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  // Get the model instance (ensure "gemini-2.0-flash" is correct per your docs)
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);
  return result.response.text();
}

exports.getJournalEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.find().sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    res.status(500).json({ error: "Failed to fetch journal entries" });
  }
};

exports.createJournalEntry = async (req, res) => {
  try {
    const entryData = req.body;
    if (!entryData.lectureTitle) {
      return res.status(400).json({ error: "Lecture title is required" });
    }

    // Create and save the new journal entry without recommendations
    const newEntry = new JournalEntry(entryData);
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    console.error("Error saving journal entry:", error);
    res.status(500).json({ error: "Failed to save journal entry" });
  }
};

// New endpoint: Generate recommendations for an existing journal entry
exports.generateRecommendations = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await JournalEntry.findById(id);
    
    if (!entry) {
      return res.status(404).json({ error: "Journal entry not found" });
    }
    
    // Combine relevant reflection fields into one prompt
    let reflection = entry.additionalNotes || "";
    if (entry.learningSummary) {
      reflection += "\nWhat Did I Learn: " + entry.learningSummary;
    }
    if (entry.challenges) {
      reflection += "\nChallenges: " + entry.challenges;
    }
    if (entry.futureActions) {
      reflection += "\nFuture Actions: " + entry.futureActions;
    }
    
    // Generate recommendations using the helper function
    const recommendations = await generateRecommendations(reflection);
    // Update the journal entry with the recommendations
    entry.recommendations = recommendations;
    const updatedEntry = await entry.save();
    
    res.json(updatedEntry);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
};

exports.deleteJournalEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEntry = await JournalEntry.findByIdAndDelete(id);
    if (!deletedEntry) {
      return res.status(404).json({ error: "Journal entry not found" });
    }
    res.json({ message: "Journal entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    res.status(500).json({ error: "Failed to delete journal entry" });
  }
};