import { useState } from 'react';
import { useIntl } from 'react-intl';
import { Question } from '@/models/quiz.model';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlashcardProps {
  question: Question;
  isLearned?: boolean;
  onMarkLearned?: () => void;
}

export function Flashcard({ question, isLearned = false, onMarkLearned }: FlashcardProps) {
  const intl = useIntl();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (question.audioUrl) {
      const audio = new Audio(question.audioUrl);
      audio.play();
    }
  };

  return (
    <div className="perspective-1000">
      <div
        className={cn(
          'relative w-full h-[400px] transition-transform duration-500 transform-style-3d cursor-pointer',
          isFlipped && 'rotate-y-180'
        )}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <Card
          className={cn(
            'absolute w-full h-full backface-hidden',
            'flex flex-col justify-center items-center p-8'
          )}
        >
          <CardContent className="text-center space-y-6 w-full">
            <div className="flex items-center justify-between w-full">
              <Badge variant={isLearned ? 'primary' : 'outline'}>
                {isLearned ? intl.formatMessage({ id: 'FLASHCARD.LEARNED' }) : intl.formatMessage({ id: 'FLASHCARD.NEW' })}
              </Badge>

              {question.audioUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={playAudio}
                  className="gap-2"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            {question.imageUrl && (
              <img
                src={question.imageUrl}
                alt="Question"
                className="max-h-40 object-contain mx-auto rounded-lg"
              />
            )}

            <h2 className="text-3xl font-bold">{question.text}</h2>

            <div className="flex items-center gap-2 text-muted-foreground mt-auto">
              <RotateCw className="h-4 w-4" />
              <span className="text-sm">{intl.formatMessage({ id: 'FLASHCARD.CLICK_TO_FLIP' })}</span>
            </div>
          </CardContent>
        </Card>

        {/* Back of card */}
        <Card
          className={cn(
            'absolute w-full h-full backface-hidden rotate-y-180',
            'flex flex-col justify-center items-center p-8'
          )}
        >
          <CardContent className="text-center space-y-6 w-full">
            <Badge variant="secondary">{intl.formatMessage({ id: 'FLASHCARD.ANSWER' })}</Badge>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-green-600 dark:text-green-400">
                {question.correctAnswer}
              </h2>

              {question.explanation && (
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  {question.explanation}
                </p>
              )}
            </div>

            {onMarkLearned && !isLearned && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkLearned();
                }}
                variant="outline"
                className="mt-6"
              >
                {intl.formatMessage({ id: 'FLASHCARD.MARK_AS_LEARNED' })}
              </Button>
            )}

            <div className="flex items-center gap-2 text-muted-foreground mt-auto">
              <RotateCw className="h-4 w-4" />
              <span className="text-sm">{intl.formatMessage({ id: 'FLASHCARD.CLICK_TO_FLIP_BACK' })}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
