import { useParams } from 'react-router-dom';
import { ExamListPage } from './exam-list';
import { ExamSessionPage } from './exam-session';

export function ExamPage() {
  const { examId } = useParams<{ examId: string }>();

  // If no examId, show the exam list
  if (!examId) {
    return <ExamListPage />;
  }

  // Otherwise, show the exam session
  return <ExamSessionPage examId={examId} />;
}
