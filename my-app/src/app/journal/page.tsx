'use client';

import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import ReactMarkdown from 'react-markdown';
import {
  BookOpen,
  Plus,
  Star,
  CheckCircle2,
  HelpCircle,
  Cloud,
  PenTool,
  GraduationCap,
  Clipboard,
  FileText,
  Bookmark,
  Search,
  Calendar,
  Lightbulb,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StudyMethod {
  id: string;
  name: string;
  icon: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  lectureTitle: string;
  keyPoints: string[];
  additionalNotes: string;
  questions: {
    id: string;
    description: string;
    isResolved: boolean;
    resources: string[];
  }[];
  studyMethods: {
    method: string;
    effectiveness: number;
    notes: string;
  }[];
  mood: string;
  learningSummary?: string;
  challenges?: string;
  futureActions?: string;
  recommendations?: string;
}

const STUDY_METHODS: StudyMethod[] = [
  { id: '1', name: 'Flashcards', icon: '📇' },
  { id: '2', name: 'Practice Problems', icon: '✏️' },
  { id: '3', name: 'Group Study', icon: '👥' },
  { id: '4', name: 'Video Tutorials', icon: '🎥' },
  { id: '5', name: 'Mind Mapping', icon: '🗺️' },
  { id: '6', name: 'Teaching Others', icon: '👨‍🏫' },
  { id: '7', name: 'Note Taking', icon: '📝' },
  { id: '8', name: 'Active Recall', icon: '🧠' },
];

// Child component for each journal entry card
function JournalCard({ entry, updateEntry }: { entry: JournalEntry; updateEntry: (updated: JournalEntry) => void }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateRecommendations = async (entryId: string) => {
    try {
      setIsGenerating(true);
      const response: AxiosResponse<JournalEntry> = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/journal-entries/${entryId}/recommendations`
      );
      updateEntry(response.data);
      setIsGenerating(false);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-white shadow-lg border-blue-200 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <CardHeader className="border-b border-blue-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl text-blue-900">{entry.lectureTitle}</CardTitle>
          <span className="text-sm text-blue-600">{new Date(entry.date).toLocaleDateString()}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {/* Guided Reflection Fields */}
        {entry.learningSummary && (
          <div>
            <h3 className="font-medium text-xl text-blue-800 mb-2">What Did I Learn?</h3>
            <p className="text-blue-900 whitespace-pre-wrap">{entry.learningSummary}</p>
          </div>
        )}
        {entry.challenges && (
          <div>
            <h3 className="font-medium text-xl text-blue-800 mb-2">Challenges & How I Overcame Them</h3>
            <p className="text-blue-900 whitespace-pre-wrap">{entry.challenges}</p>
          </div>
        )}
        {entry.futureActions && (
          <div>
            <h3 className="font-medium text-xl text-blue-800 mb-2">Future Actions</h3>
            <p className="text-blue-900 whitespace-pre-wrap">{entry.futureActions}</p>
          </div>
        )}

        {/* Recommendations Section */}
        <div>
          <h3 className="font-medium text-xl text-blue-800 mb-2">Recommendations</h3>
          {entry.recommendations ? (
            <div className="prose text-blue-900">
              <ReactMarkdown>{entry.recommendations}</ReactMarkdown>
            </div>
          ) : (
            <div className="flex items-center justify-center py-4">
              {isGenerating ? (
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mb-2"></div>
                  <p className="text-blue-700">AI is generating recommendations for you...</p>
                </div>
              ) : (
                <Button
                  onClick={() => handleGenerateRecommendations(entry.id)}
                  className="bg-blue-300 hover:bg-blue-400 text-white transition-all"
                >
                  <img src="/gemini-icon.png" alt="Gemini AI" className="mr-2 h-4 w-4" />
                  Get AI Recommendations
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Key Points */}
        {entry.keyPoints.length > 0 && (
          <div>
            <h3 className="font-medium text-xl text-blue-800 mb-2">Key Points</h3>
            <ul className="list-disc list-inside space-y-1">
              {entry.keyPoints.map((point, i) => (
                <li key={`${entry.id}-keypoint-${i}`} className="text-blue-900">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Questions & Doubts */}
        {entry.questions.length > 0 && (
          <div>
            <h3 className="font-medium text-xl text-blue-800 mb-2">Questions & Doubts</h3>
            <div className="space-y-2">
              {entry.questions.map((question) => (
                <div key={question.id} className="flex items-start space-x-2 p-2 bg-blue-50 rounded-lg">
                  {question.isResolved ? (
                    <CheckCircle2 className="text-blue-600" size={20} />
                  ) : (
                    <HelpCircle className="text-blue-400" size={20} />
                  )}
                  <span className="text-blue-900">{question.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Effective Study Methods */}
        {entry.studyMethods.length > 0 && (
          <div>
            <h3 className="font-medium text-xl text-blue-800 mb-2">Effective Study Methods</h3>
            <div className="space-y-2">
              {entry.studyMethods.map((method, i) => (
                <div key={`${entry.id}-studymethod-${i}`} className="p-2 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-900">{method.method}</span>
                    <div className="flex">
                      {[...Array(method.effectiveness)].map((_, starIdx) => (
                        <Star key={`star-${starIdx}`} size={16} className="text-blue-600" fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  {method.notes && (
                    <p className="text-sm text-blue-700 mt-1">{method.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({
    lectureTitle: '',
    keyPoints: [''],
    additionalNotes: '',
    questions: [],
    studyMethods: [],
    mood: 'good',
    learningSummary: '',
    challenges: '',
    futureActions: '',
  });
  const [newQuestion, setNewQuestion] = useState({ description: '', resources: [''] });
  const [customMethod, setCustomMethod] = useState('');

  // Search and filter state
  const [searchTitle, setSearchTitle] = useState('');
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');

  // Fetch entries on mount
  useEffect(() => {
    async function fetchEntries() {
      try {
        const response: AxiosResponse<JournalEntry[]> = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/journal-entries`
        );
        setEntries(response.data);
      } catch (error) {
        console.error('Failed to fetch journal entries:', error);
      }
    }
    fetchEntries();
  }, []);

  // Form Handlers
  const handleAddKeyPoint = () => {
    setCurrentEntry(prev => ({
      ...prev,
      keyPoints: [...(prev.keyPoints || []), ''],
    }));
  };

  const handleKeyPointChange = (index: number, value: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      keyPoints: prev.keyPoints?.map((point, i) => (i === index ? value : point)),
    }));
  };

  const handleRemoveKeyPoint = (index: number) => {
    setCurrentEntry(prev => ({
      ...prev,
      keyPoints: prev.keyPoints?.filter((_, i) => i !== index),
    }));
  };

  const handleAddQuestion = () => {
    if (!newQuestion.description) return;
    setCurrentEntry(prev => ({
      ...prev,
      questions: [
        ...(prev.questions || []),
        {
          id: Date.now().toString(),
          description: newQuestion.description,
          isResolved: false,
          resources: newQuestion.resources.filter(r => r),
        },
      ],
    }));
    setNewQuestion({ description: '', resources: [''] });
  };

  const handleAddStudyMethod = (methodId: string) => {
    const method = STUDY_METHODS.find(m => m.id === methodId);
    if (!method) return;
    setCurrentEntry(prev => ({
      ...prev,
      studyMethods: [
        ...(prev.studyMethods || []),
        {
          method: method.name,
          effectiveness: 0,
          notes: '',
        },
      ],
    }));
  };

  const handleAddCustomMethod = () => {
    if (!customMethod) return;
    setCurrentEntry(prev => ({
      ...prev,
      studyMethods: [
        ...(prev.studyMethods || []),
        {
          method: customMethod,
          effectiveness: 0,
          notes: '',
        },
      ],
    }));
    setCustomMethod('');
  };

  const handleSave = async () => {
    if (!currentEntry.lectureTitle) return;
    try {
      const response: AxiosResponse<JournalEntry> = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/journal-entries`,
        currentEntry
      );
      setEntries([response.data, ...entries]);
      setShowForm(false);
      setCurrentEntry({
        lectureTitle: '',
        keyPoints: [''],
        additionalNotes: '',
        questions: [],
        studyMethods: [],
        mood: 'good',
        learningSummary: '',
        challenges: '',
        futureActions: '',
      });
    } catch (error) {
      console.error('Failed to save journal entry:', error);
    }
  };

  const filteredEntries = entries.filter((entry) => {
    const titleMatch = entry.lectureTitle.toLowerCase().includes(searchTitle.toLowerCase());
    const entryDate = new Date(entry.date);
    let fromMatch = true;
    let toMatch = true;
    if (searchFrom) {
      fromMatch = entryDate >= new Date(searchFrom);
    }
    if (searchTo) {
      toMatch = entryDate <= new Date(searchTo);
    }
    return titleMatch && fromMatch && toMatch;
  });

  return (
    <div className="p-6 min-h-screen font-mono relative overflow-hidden" style={{ backgroundColor: "#FAF5FF" }}>
      {/* Primary animated background elements */}
      <div className="absolute top-10 left-10 text-blue-300 opacity-20 animate-float">
        <Cloud size={64} />
      </div>
      <div className="absolute bottom-10 right-10 text-blue-300 opacity-20 animate-float" style={{ animationDelay: '1s' }}>
        <Cloud size={48} />
      </div>
      <div className="absolute top-1/2 left-1/4 text-blue-300 opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>
        <Cloud size={56} />
      </div>

      {/* Additional floating study icons */}
      <div className="absolute top-5 left-10 text-blue-300 opacity-20 animate-float" style={{ animationDelay: '0.3s' }}>
        <BookOpen size={40} />
      </div>
      <div className="absolute top-20 right-5 text-blue-300 opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>
        <Lightbulb size={40} />
      </div>
      <div className="absolute bottom-10 left-5 text-blue-300 opacity-20 animate-float" style={{ animationDelay: '0.7s' }}>
        <PenTool size={40} />
      </div>
      <div className="absolute bottom-20 right-10 text-blue-300 opacity-20 animate-float" style={{ animationDelay: '1s' }}>
        <BookOpen size={30} />
      </div>
      <div className="absolute top-1/2 right-0 text-blue-300 opacity-20 animate-float" style={{ animationDelay: '1.2s' }}>
        <Lightbulb size={30} />
      </div>
      <div className="absolute top-10 right-0 text-blue-300 opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>
        <PenTool size={30} />
      </div>
      <div className="absolute top-0 left-0 text-blue-300 opacity-20 animate-float" style={{ animationDelay: '0.4s' }}>
        <GraduationCap size={35} />
      </div>
      <div className="absolute bottom-0 left-0 text-blue-300 opacity-20 animate-float" style={{ animationDelay: '0.6s' }}>
        <Clipboard size={35} />
      </div>
      <div className="absolute top-0 right-20 text-blue-300 opacity-20 animate-float" style={{ animationDelay: '0.8s' }}>
        <FileText size={35} />
      </div>
      <div className="absolute bottom-0 right-0 text-blue-300 opacity-20 animate-float" style={{ animationDelay: '1.0s' }}>
        <Bookmark size={35} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Heading with Gradient */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-500">
            Reflection Journal
          </h1>
          <div className="flex items-center space-x-4">
            <Button onClick={() => setShowForm(true)} className="bg-blue-300 hover:bg-blue-400 text-white transition-all duration-300 ease-in-out transform hover:scale-105">
              <Plus size={20} className="mr-2" />
              <span>New Entry</span>
            </Button>
          </div>
        </div>

        {showForm ? (
          <>
            {/* Back Button */}
            <div className="mb-4">
              <Button onClick={() => setShowForm(false)} variant="outline">
                Back
              </Button>
            </div>
            {/* New Entry Form */}
            <Card className="shadow-lg animate-fade-in mb-6" style={{ backgroundColor: "#ECFDF5", borderColor: "#ECFDF5" }}>
              <CardHeader className="border-b" style={{ borderColor: "#ECFDF5" }}>
                <CardTitle className="text-2xl text-blue-900">New Journal Entry</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Lecture Title */}
                <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <h2 className="text-xl font-medium text-blue-800 mb-4">Today's Lecture</h2>
                  <Input
                    type="text"
                    value={currentEntry.lectureTitle}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, lectureTitle: e.target.value })}
                    placeholder="Lecture/Tutorial Title"
                    className="border-blue-300 focus:border-blue-400 focus:ring-blue-400 transition-all duration-300 bg-white text-blue-900"
                  />
                </div>
                {/* Guided Sections */}
                <div className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
                  <h2 className="text-xl font-medium text-blue-800 mb-4">What Did I Learn?</h2>
                  <Textarea
                    value={currentEntry.learningSummary || ''}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, learningSummary: e.target.value })}
                    placeholder="Summarize the key takeaways from this lecture..."
                    rows={3}
                    className="border-blue-300 focus:border-blue-400 focus:ring-blue-400 transition-all duration-300 bg-white text-blue-900"
                  />
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h2 className="text-xl font-medium text-blue-800 mb-4">Challenges & How I Overcame Them</h2>
                  <Textarea
                    value={currentEntry.challenges || ''}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, challenges: e.target.value })}
                    placeholder="Reflect on any difficulties faced and how you addressed them..."
                    rows={3}
                    className="border-blue-300 focus:border-blue-400 focus:ring-blue-400 transition-all duration-300 bg-white text-blue-900"
                  />
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.25s' }}>
                  <h2 className="text-xl font-medium text-blue-800 mb-4">Future Actions</h2>
                  <Textarea
                    value={currentEntry.futureActions || ''}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, futureActions: e.target.value })}
                    placeholder="Plan your next steps or improvements based on this lecture..."
                    rows={3}
                    className="border-blue-300 focus:border-blue-400 focus:ring-blue-400 transition-all duration-300 bg-white text-blue-900"
                  />
                </div>
                {/* Key Points */}
                <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium text-blue-800">Key Points Learned</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddKeyPoint}
                      className="border-blue-300 text-blue-800 hover:bg-blue-300 hover:text-blue-900 transition-all duration-300"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {currentEntry.keyPoints?.map((point, index) => (
                      <div key={`new-keypoint-${index}`} className="flex items-center space-x-2 animate-fade-in" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                        <Input
                          type="text"
                          value={point}
                          onChange={(e) => handleKeyPointChange(index, e.target.value)}
                          placeholder="Enter a key point..."
                          className="border-blue-300 focus:border-blue-400 focus:ring-blue-400 transition-all duration-300 bg-white text-blue-900"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoveKeyPoint(index)}
                          className="border-blue-300 text-blue-800 hover:bg-blue-300 hover:text-blue-900 transition-all duration-300"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Questions & Doubts */}
                <div className="animate-fade-in" style={{ animationDelay: '0.35s' }}>
                  <h2 className="text-xl font-medium text-blue-800 mb-4">Questions & Doubts</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Textarea
                        value={newQuestion.description}
                        onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
                        placeholder="What concepts are you unsure about?"
                        rows={3}
                        className="border-blue-300 focus:border-blue-400 focus:ring-blue-400 transition-all duration-300 bg-white text-blue-900"
                      />
                      <Input
                        type="text"
                        value={newQuestion.resources[0] || ''}
                        onChange={(e) =>
                          setNewQuestion({
                            ...newQuestion,
                            resources: [e.target.value],
                          })
                        }
                        placeholder="Add a resource link (optional)"
                        className="border-blue-300 focus:border-blue-400 focus:ring-blue-400 transition-all duration-300 bg-white text-blue-900"
                      />
                      <Button
                        onClick={handleAddQuestion}
                        variant="outline"
                        className="w-full border-blue-300 text-blue-800 hover:bg-blue-300 hover:text-blue-900 transition-all duration-300"
                      >
                        Add Question
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {currentEntry.questions?.map((question) => (
                        <Card
                          key={question.id}
                          className="animate-fade-in"
                          style={{ backgroundColor: "#ECFDF5", borderColor: "#ECFDF5", animationDelay: `${0.1 * (Number(question.id) % 5 + 1)}s` }}
                        >
                          <CardContent className="flex items-start justify-between pt-6">
                            <div>
                              <p className="text-blue-900">{question.description}</p>
                              {question.resources.map((resource, idx) => (
                                <a
                                  key={`${question.id}-resource-${idx}`}
                                  href={resource}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-700 hover:text-blue-900 transition-all duration-300"
                                >
                                  Resource {idx + 1}
                                </a>
                              ))}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setCurrentEntry(prev => ({
                                  ...prev,
                                  questions: prev.questions?.map(q =>
                                    q.id === question.id ? { ...q, isResolved: !q.isResolved } : q
                                  ),
                                }))
                              }
                              className={`transition-all duration-300 ${question.isResolved ? 'text-blue-700' : 'text-blue-500'}`}
                            >
                              {question.isResolved ? <CheckCircle2 size={20} /> : <HelpCircle size={20} />}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Study Methods */}
                <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <h2 className="text-xl font-medium text-blue-800 mb-4">What Helped Me Learn?</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {STUDY_METHODS.map((method) => (
                        <Button
                          key={method.id}
                          variant="outline"
                          onClick={() => handleAddStudyMethod(method.id)}
                          className="justify-start border-blue-300 text-blue-800 hover:bg-blue-300 hover:text-blue-900 transition-all duration-300"
                        >
                          <span className="mr-2">{method.icon}</span>
                          <span>{method.name}</span>
                        </Button>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        type="text"
                        value={customMethod}
                        onChange={(e) => setCustomMethod(e.target.value)}
                        placeholder="Or add your own method..."
                        className="border-blue-300 focus:border-blue-400 focus:ring-blue-400 transition-all duration-300 bg-white text-blue-900"
                      />
                      <Button
                        onClick={handleAddCustomMethod}
                        variant="outline"
                        className="border-blue-300 text-blue-800 hover:bg-blue-300 hover:text-blue-900 transition-all duration-300"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {currentEntry.studyMethods?.map((method, index) => (
                        <Card
                          key={`${currentEntry.lectureTitle}-studymethod-${index}`}
                          className="animate-fade-in"
                          style={{ backgroundColor: "#ECFDF5", borderColor: "#ECFDF5", animationDelay: `${0.1 * (index + 1)}s` }}
                        >
                          <CardContent className="pt-6 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-blue-900">{method.method}</span>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((rating, starIdx) => (
                                  <Button
                                    key={`star-${starIdx}`}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setCurrentEntry(prev => ({
                                        ...prev,
                                        studyMethods: prev.studyMethods?.map((m, i) =>
                                          i === index ? { ...m, effectiveness: rating } : m
                                        ),
                                      }))
                                    }
                                    className={`p-1 transition-all duration-300 ${
                                      rating <= method.effectiveness ? 'text-blue-700' : 'text-blue-400'
                                    }`}
                                  >
                                    <Star size={16} fill={rating <= method.effectiveness ? 'currentColor' : 'none'} />
                                  </Button>
                                ))}
                              </div>
                            </div>
                            <Textarea
                              value={method.notes}
                              onChange={(e) =>
                                setCurrentEntry(prev => ({
                                  ...prev,
                                  studyMethods: prev.studyMethods?.map((m, i) =>
                                    i === index ? { ...m, notes: e.target.value } : m
                                  ),
                                }))
                              }
                              placeholder="What worked well about this method?"
                              rows={2}
                              className="border-blue-300 focus:border-blue-400 focus:ring-blue-400 transition-all duration-300 bg-white text-blue-900"
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-center mt-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <Button
                onClick={handleSave}
                className="bg-blue-300 hover:bg-blue-400 text-white transition-all duration-300 ease-in-out transform hover:scale-105 px-12 py-4 text-xl font-bold rounded-full shadow-lg"
              >
                Save Journal Entry
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Search Filters with Icons */}
            <div className="mb-6 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <div className="sm:w-1/3 flex items-center border border-blue-300 rounded-md">
                <Search size={20} className="ml-2 text-blue-400" />
                <Input
                  type="text"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  placeholder="Search by Title"
                  className="w-full border-0 focus:ring-0 pl-2"
                />
              </div>
              <div className="sm:w-1/3 flex items-center border border-blue-300 rounded-md">
                <span className="px-2 text-blue-600">From:</span>
                <Calendar size={20} className="text-blue-400" />
                <Input
                  type="date"
                  value={searchFrom}
                  onChange={(e) => setSearchFrom(e.target.value)}
                  className="w-full border-0 focus:ring-0 pl-2"
                />
              </div>
              <div className="sm:w-1/3 flex items-center border border-blue-300 rounded-md">
                <span className="px-2 text-blue-600">To:</span>
                <Calendar size={20} className="text-blue-400" />
                <Input
                  type="date"
                  value={searchTo}
                  onChange={(e) => setSearchTo(e.target.value)}
                  className="w-full border-0 focus:ring-0 pl-2"
                />
              </div>
            </div>

            {/* Display Filtered Journal Entries */}
            <div className="space-y-6">
              {filteredEntries.map((entry) => (
                <JournalCard
                  key={entry.id}
                  entry={entry}
                  updateEntry={(updated) =>
                    setEntries(entries.map((e) => (e.id === updated.id ? updated : e)))
                  }
                />
              ))}

              {entries.length === 0 && (
                <Card className="text-center py-12 bg-white shadow-lg border-blue-200 animate-fade-in">
                  <CardContent>
                    <BookOpen className="mx-auto h-12 w-12 text-blue-600 animate-bounce-soft" />
                    <h3 className="mt-2 text-xl font-medium text-blue-900">No journal entries yet</h3>
                    <p className="mt-1 text-blue-700">Start reflecting on your learning journey!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}