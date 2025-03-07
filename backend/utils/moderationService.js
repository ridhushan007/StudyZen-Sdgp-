const { OpenAI } = require('openai');

class ModerationService {
  constructor() {
    // Initialize OpenAI client with API key
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'placeholder', // Will be replaced with actual key
    });
  }

  async moderateContent(text) {
    try {
      const response = await this.openai.moderations.create({
        input: text,
      });
      const result = response.results[0];
      
      // Check if the content is flagged
      if (result.flagged) {
        // Find the categories that were flagged
        const flaggedCategories = Object.entries(result.categories)
          .filter(([_, value]) => value === true)
          .map(([key]) => key);
          
        // Determine the reason for flagging
        let reason = 'Content flagged for: ' + flaggedCategories.join(', ');
        
        // Handle specific case for self-harm which needs human review
        if (result.categories.self_harm) {
          reason = 'REQUIRES_REVIEW: Potential self-harm content detected';
        }
        
        // Handle violent content which should be auto-removed
        if (result.categories.violence) {
          reason = 'AUTO_REMOVED: Violent content or threats detected';
        }
        
        return {
          flagged: true,
          reason: reason,
          categories: result.categories,
          category_scores: result.category_scores
        };
      }


module.exports = new ModerationService();