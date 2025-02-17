'use client';

import React, { useState } from 'react';
import { BookOpen, Plus, Star, CheckCircle2, HelpCircle, Lightbulb, X } from 'lucide-react';
import type { JournalEntry, StudyMethod } from '@/types';

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
  });
  const [newQuestion, setNewQuestion] = useState({ description: '', resources: [''] });
  const [customMethod, setCustomMethod] = useState('');

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

  const handleSave = () => {
    if (!currentEntry.lectureTitle) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...currentEntry as Omit<JournalEntry, 'id' | 'date'>,
    };

    setEntries([newEntry, ...entries]);
    setShowForm(false);
    setCurrentEntry({
      lectureTitle: '',
      keyPoints: [''],
      additionalNotes: '',
      questions: [],
      studyMethods: [],
      mood: 'good',
    });
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Reflection Journal</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-black text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
          >
            <Plus size={20} />
            <span>New Entry</span>
          </button>
        </div>

        {showForm ? (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            {/* Lecture Information */}
            <div>
              <h2 className="text-lg font-medium mb-4">Today's Lecture</h2>
              <input
                type="text"
                value={currentEntry.lectureTitle}
                onChange={(e) => setCurrentEntry({ ...currentEntry, lectureTitle: e.target.value })}
                placeholder="Lecture/Tutorial Title"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Key Points */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Key Points Learned</h2>
                <button
                  onClick={handleAddKeyPoint}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="space-y-2">
                {currentEntry.keyPoints?.map((point, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={point}
                      onChange={(e) => handleKeyPointChange(index, e.target.value)}
                      placeholder="Enter a key point..."
                      className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => handleRemoveKeyPoint(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Questions & Doubts */}
            <div>
              <h2 className="text-lg font-medium mb-4">Questions & Doubts</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <textarea
                    value={newQuestion.description}
                    onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
                    placeholder="What concepts are you unsure about?"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={3}
                  />
                  <input
                    type="text"
                    value={newQuestion.resources[0] || ''}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        resources: [e.target.value],
                      })
                    }
                    placeholder="Add a resource link (optional)"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddQuestion}
                    className="w-full p-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100"
                  >
                    Add Question
                  </button>
                </div>

                <div className="space-y-2">
                  {currentEntry.questions?.map((question) => (
                    <div
                      key={question.id}
                      className="p-3 bg-gray-50 rounded-lg flex items-start justify-between"
                    >
                      <div>
                        <p>{question.description}</p>
                        {question.resources.map((resource, index) => (
                          <a
                            key={index}
                            href={resource}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-600 hover:text-indigo-700"
                          >
                            Resource {index + 1}
                          </a>
                        ))}
                      </div>
                      <button
                        onClick={() =>
                          setCurrentEntry(prev => ({
                            ...prev,
                            questions: prev.questions?.map(q =>
                              q.id === question.id
                                ? { ...q, isResolved: !q.isResolved }
                                : q
                            ),
                          }))
                        }
                        className={`p-1 rounded-full ${
                          question.isResolved
                            ? 'text-green-500 hover:text-green-600'
                            : 'text-gray-400 hover:text-gray-500'
                        }`}
                      >
                        {question.isResolved ? <CheckCircle2 size={20} /> : <HelpCircle size={20} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Study Methods */}
            <div>
              <h2 className="text-lg font-medium mb-4">What Helped Me Learn?</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {STUDY_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handleAddStudyMethod(method.id)}
                      className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <span>{method.icon}</span>
                      <span>{method.name}</span>
                    </button>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={customMethod}
                    onChange={(e) => setCustomMethod(e.target.value)}
                    placeholder="Or add your own method..."
                    className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddCustomMethod}
                    className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {currentEntry.studyMethods?.map((method, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{method.method}</span>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() =>
                                setCurrentEntry(prev => ({
                                  ...prev,
                                  studyMethods: prev.studyMethods?.map((m, i) =>
                                    i === index ? { ...m, effectiveness: rating } : m
                                  ),
                                }))
                              }
                              className={`p-1 ${
                                rating <= method.effectiveness
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            >
                              <Star size={16} fill={rating <= method.effectiveness ? 'currentColor' : 'none'} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
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
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Save Entry
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">{entry.lectureTitle}</h2>
                  <span className="text-sm text-gray-500">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Key Points</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {entry.keyPoints.map((point, index) => (
                        <li key={index} className="text-gray-700">{point}</li>
                      ))}
                    </ul>
                  </div>

                  {entry.questions.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Questions & Doubts</h3>
                      <div className="space-y-2">
                        {entry.questions.map((question) => (
                          <div
                            key={question.id}
                            className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg"
                          >
                            {question.isResolved ? (
                              <CheckCircle2 className="text-green-500" size={20} />
                            ) : (
                              <HelpCircle className="text-yellow-500" size={20} />
                            )}
                            <span>{question.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {entry.studyMethods.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Effective Study Methods</h3>
                      <div className="space-y-2">
                        {entry.studyMethods.map((method, index) => (
                          <div key={index} className="p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span>{method.method}</span>
                              <div className="flex">
                                {[...Array(method.effectiveness)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    className="text-yellow-400"
                                    fill="currentColor"
                                  />
                                ))}
                              </div>
                            </div>
                            {method.notes && (
                              <p className="text-sm text-gray-600 mt-1">{method.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {entries.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No journal entries yet</h3>
                <p className="mt-1 text-gray-500">Start reflecting on your learning journey!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
