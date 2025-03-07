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
      
      

module.exports = new ModerationService();