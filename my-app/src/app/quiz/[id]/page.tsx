import TakeQuizClient from './TakeQuizClient';

export default function QuizPage({ params }: { params: { id: string } }) {
  return <TakeQuizClient quizId={params.id} />;
}