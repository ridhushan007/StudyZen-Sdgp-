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
      
      return {
        flagged: false,
        reason: null,
        categories: result.categories,
        category_scores: result.category_scores
      };
    } catch (error) {
      console.error('OpenAI Moderation API error:', error);
      // In case of API failure, let content through but log the error
      return {
        flagged: false,
        reason: 'Moderation API error: ' + error.message,
        error: true
      };
    }
  }
  
  // Method to detect duplicate/spam content
  async isDuplicateOrSpam(text, recentConfessions) {
    // Simple duplicate detection - check if exact text already exists
    const isDuplicate = recentConfessions.some(confession => 
      confession.text.toLowerCase() === text.toLowerCase()
    );
    
    if (isDuplicate) {
      return {
        flagged: true,
        reason: 'DUPLICATE: Similar confession was recently posted'
      };
    }
    
    // Basic spam detection - check for repetitive patterns or excessive URLs
    const urlCount = (text.match(/https?:\/\//g) || []).length;
    if (urlCount > 3) {
      return {
        flagged: true,
        reason: 'SPAM: Excessive URLs detected'
      };
    }
    
    // Check for repetitive text patterns
    const words = text.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    
    // If the text has many words but very few unique words, it might be spam
    if (words.length > 20 && uniqueWords.size / words.length < 0.3) {
      return {
        flagged: true,
        reason: 'SPAM: Repetitive content detected'
      };
    }
    
    return {
      flagged: false
    };
  }
}

module.exports = new ModerationService();