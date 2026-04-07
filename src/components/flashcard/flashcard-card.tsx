import { useState } from 'react';
import { useIntl } from 'react-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StudyCard, FlashcardStatus } from '@/models/flashcard.model';

interface FlashcardCardProps {
    card: StudyCard;
    isFlipped?: boolean;
    onFlip?: () => void;
    showStatus?: boolean;
    className?: string;
}

const getStatusConfig = (intl: ReturnType<typeof useIntl>): Record<
    FlashcardStatus,
    { label: string; variant: 'primary' | 'secondary' | 'outline' | 'destructive' }
> => ({
    [FlashcardStatus.New]: { label: intl.formatMessage({ id: 'FLASHCARD.NEW' }), variant: 'outline' },
    [FlashcardStatus.Learning]: { label: intl.formatMessage({ id: 'FLASHCARD.LEARNING' }), variant: 'secondary' },
    [FlashcardStatus.Review]: { label: intl.formatMessage({ id: 'FLASHCARD.STUDY.REVIEW' }), variant: 'primary' },
    [FlashcardStatus.Mastered]: { label: intl.formatMessage({ id: 'FLASHCARD.MASTERED' }), variant: 'primary' },
});

export function FlashcardCard({
    card,
    isFlipped = false,
    onFlip,
    showStatus = true,
    className,
}: FlashcardCardProps) {
    const intl = useIntl();
    const [internalFlipped, setInternalFlipped] = useState(false);

    const flipped = onFlip ? isFlipped : internalFlipped;

    const handleFlip = () => {
        if (onFlip) {
            onFlip();
        } else {
            setInternalFlipped(!internalFlipped);
        }
    };

    const playAudio = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (card.audioUrl) {
            const audio = new Audio(card.audioUrl);
            audio.play();
        }
    };

    const statusInfo = getStatusConfig(intl)[card.status];

    return (
        <div className={cn('perspective-1000', className)}>
            <div
                className={cn(
                    'relative w-full min-h-[350px] transition-transform duration-500 cursor-pointer',
                    '[transform-style:preserve-3d]',
                    flipped && '[transform:rotateY(180deg)]',
                )}
                onClick={handleFlip}
            >
                {/* Front of card - English */}
                <Card
                    className={cn(
                        'absolute inset-0 [backface-visibility:hidden]',
                        'bg-gradient-to-br from-background via-background to-primary/5',
                        'border-primary/20 shadow-xl',
                        'flex flex-col',
                    )}
                >
                    <CardContent className="flex flex-col h-full p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                {showStatus && (
                                    <Badge variant={statusInfo.variant} className="text-xs">
                                        {statusInfo.label}
                                    </Badge>
                                )}
                                {card.partOfSpeech && (
                                    <Badge variant="outline" className="text-xs italic">
                                        {card.partOfSpeech}
                                    </Badge>
                                )}
                            </div>

                            {card.audioUrl && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={playAudio}
                                    className="h-8 w-8 text-primary hover:bg-primary/10"
                                >
                                    <Volume2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        {/* Image */}
                        {card.imageUrl && (
                            <div className="flex-shrink-0 mb-4">
                                <img
                                    src={card.imageUrl}
                                    alt={card.englishTerm}
                                    className="max-h-32 w-auto mx-auto rounded-lg object-contain"
                                />
                            </div>
                        )}

                        {/* Main Content */}
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                                {card.englishTerm}
                            </h2>

                            {card.pronunciation && (
                                <p className="text-lg text-muted-foreground font-mono">
                                    {card.pronunciation}
                                </p>
                            )}

                            {card.englishExample && (
                                <p className="text-sm text-muted-foreground italic max-w-md">
                                    "{card.englishExample}"
                                </p>
                            )}
                        </div>

                        {/* Tags */}
                        {card.tags && card.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-4 justify-center">
                                {card.tags.slice(0, 3).map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* Flip hint */}
                        <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground">
                            <RotateCw className="h-4 w-4" />
                            <span className="text-sm">{intl.formatMessage({ id: 'FLASHCARD.CLICK_TO_FLIP' })}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Back of card - Vietnamese */}
                <Card
                    className={cn(
                        'absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]',
                        'bg-gradient-to-br from-green-500/10 via-background to-emerald-500/10',
                        'border-green-500/30 shadow-xl',
                        'flex flex-col',
                    )}
                >
                    <CardContent className="flex flex-col h-full p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-700 dark:text-green-400">
                                Tiếng Việt
                            </Badge>

                            {card.audioUrl && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={playAudio}
                                    className="h-8 w-8 text-green-600 hover:bg-green-500/10"
                                >
                                    <Volume2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                            <div className="space-y-2">
                                <p className="text-lg text-muted-foreground">
                                    {card.englishTerm}
                                </p>
                                <h2 className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
                                    {card.vietnameseTerm}
                                </h2>
                            </div>

                            {card.vietnameseExample && (
                                <div className="space-y-2 max-w-md">
                                    <p className="text-sm text-muted-foreground italic">
                                        "{card.englishExample}"
                                    </p>
                                    <p className="text-sm text-green-600 dark:text-green-400 italic">
                                        "{card.vietnameseExample}"
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Flip hint */}
                        <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground">
                            <RotateCw className="h-4 w-4" />
                            <span className="text-sm">{intl.formatMessage({ id: 'FLASHCARD.CLICK_TO_FLIP_BACK' })}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
