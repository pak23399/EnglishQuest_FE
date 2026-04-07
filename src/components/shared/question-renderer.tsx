import { Question, QuestionType } from '@/models/quiz.model';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

interface QuestionRendererProps {
  question: Question;
  selectedAnswer?: string;
  onAnswerSelect?: (answer: string) => void;
  showCorrectAnswer?: boolean;
  disabled?: boolean;
  mode?: 'quiz' | 'flashcard' | 'exam' | 'review';
}

export function QuestionRenderer({
  question,
  selectedAnswer,
  onAnswerSelect,
  showCorrectAnswer = false,
  disabled = false,
  mode = 'quiz',
}: QuestionRendererProps) {
  const isCorrect = selectedAnswer === question.correctAnswer;
  const isFlashcardMode = mode === 'flashcard';

  const handleOptionClick = (optionText: string) => {
    if (!disabled && onAnswerSelect) {
      onAnswerSelect(optionText);
    }
  };

  const playAudio = () => {
    if (question.media?.audioUrl) {
      const audio = new Audio(question.media.audioUrl);
      audio.play();
    }
  };

  return (
    <div className="space-y-4">
      {/* Question Text */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline">
            {question.type === QuestionType.MultipleChoice && 'Multiple Choice'}
            {question.type === QuestionType.TrueFalse && 'True/False'}
            {question.type === QuestionType.FillInTheBlank && 'Fill in the Blank'}
            {question.type === QuestionType.Matching && 'Matching'}
            {question.type === QuestionType.Ordering && 'Ordering'}
          </Badge>
          
          {question.media?.audioUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={playAudio}
              className="gap-2"
            >
              <Volume2 className="h-4 w-4" />
              Play Audio
            </Button>
          )}
        </div>

        <h3 className="text-2xl font-semibold">{question.text}</h3>

        {question.media?.imageUrl && (
          <img
            src={question.media.imageUrl}
            alt="Question illustration"
            className="rounded-lg max-h-64 object-contain mx-auto"
          />
        )}
      </div>

      {/* Options */}
      {!isFlashcardMode && question.options && question.options.length > 0 && (
        <div className="space-y-2">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option.text;
            const isCorrectOption = option.isCorrect || option.text === question.correctAnswer;
            
            let buttonVariant: 'outline' | 'default' | 'destructive' | 'secondary' = 'outline';
            if (showCorrectAnswer) {
              if (isCorrectOption) buttonVariant = 'default';
              else if (isSelected && !isCorrect) buttonVariant = 'destructive';
            } else if (isSelected) {
              buttonVariant = 'secondary';
            }

            return (
              <Button
                key={index}
                variant={buttonVariant}
                className="w-full justify-start text-left h-auto py-3 px-4"
                onClick={() => handleOptionClick(option.text)}
                disabled={disabled}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                <span>{option.text}</span>
              </Button>
            );
          })}
        </div>
      )}

      {/* Correct Answer (for flashcard back or review mode) */}
      {(isFlashcardMode || showCorrectAnswer) && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="font-semibold text-green-900 dark:text-green-100 mb-2">
            ✓ Correct Answer:
          </p>
          <p className="text-lg">{question.correctAnswer}</p>
          
          {question.explanation && (
            <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200">
                {question.explanation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* User's answer feedback (review mode) */}
      {showCorrectAnswer && selectedAnswer && selectedAnswer !== question.correctAnswer && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="font-semibold text-red-900 dark:text-red-100 mb-2">
            ✗ Your Answer:
          </p>
          <p className="text-lg">{selectedAnswer}</p>
        </div>
      )}
    </div>
  );
}
