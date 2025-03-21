export interface Activity {
    _id: string;
    type: 'journal' | 'quiz' |'confession';
    title: string;
    description?: string;
    timestamp: Date;
    userId: string;
  }
  
  