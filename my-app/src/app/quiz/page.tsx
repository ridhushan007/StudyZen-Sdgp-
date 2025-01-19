'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const questions = [
    {
      question: "What is the key feature of encapsulation in OOP?",
      options: ["It allows multiple inheritance in classes", "It hides the implementation details of an object", "It creates relationships between different classes", "It supports polymorphism"],
      correctAnswer: "It hides the implementation details of an object."
    },
    {
      question: "Which of the following correctly describes inheritance in OOP?",
      options: ["Creating multiple methods with the same name in a class", "Sharing behavior from a parent class to a derived class.", "Binding a function call to the correct method at runtime", "Restricting access to specific class members"],
      correctAnswer: "Sharing behavior from a parent class to a derived class"
    },
    {
      question: "What does polymorphism allow in OOP?",
      options: ["Writing code that applies to objects of multiple types", "Adding private attributes to a class", "Implementing class hierarchies without overriding methods", "Instantiating abstract classes directly"],
      correctAnswer: "Writing code that applies to objects of multiple types"
    }
  ]

  const handleNext = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer("")
    } else {
      setShowResults(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer("")
    setScore(0)
    setShowResults(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Quiz</h1>

      <Card className="max-w-2xl mx-auto">
        {!showResults ? (
          <>
            <CardHeader>
              <CardTitle>Question {currentQuestion + 1} of {questions.length}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg">{questions[currentQuestion].question}</p>
              <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                {questions[currentQuestion].options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
              <Button 
                onClick={handleNext} 
                disabled={!selectedAnswer}
                className="w-full"
              >
                {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
              </Button>
            </CardContent>
          </>
        ) : (
          <CardContent className="py-6 text-center space-y-4">
            <h2 className="text-2xl font-bold">Quiz Complete!</h2>
            <p className="text-lg">Your score: {score} out of {questions.length}</p>
            <Button onClick={handleRestart}>Try Again</Button>
          </CardContent>
        )}
      </Card>
    </div>
  )
}