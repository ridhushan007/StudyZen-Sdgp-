import TakeQuizClient from './TakeQuizClient';

interface PageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function QuizPage({ params }: PageProps) {
  return <TakeQuizClient quizId={params.id} />;
}