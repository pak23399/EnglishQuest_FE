import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Trophy, Globe, User, Copy, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FlashcardDeck, DeckProgress } from '@/models/flashcard.model';
import { useIntl } from 'react-intl';

interface DeckCardProps {
    deck: FlashcardDeck;
    progress?: DeckProgress | null;
    onClick?: () => void;
    onCopy?: () => void;
    onDelete?: () => void;
    className?: string;
}

export function DeckCard({
    deck,
    progress,
    onClick,
    onCopy,
    onDelete,
    className,
}: DeckCardProps) {
    const intl = useIntl();
    const masteredPercentage = progress
        ? Math.round((progress.masteredCards / progress.totalCards) * 100)
        : 0;

    const dueToday = progress?.dueToday ?? 0;

    return (
        <Card
            className={cn(
                'group relative overflow-hidden cursor-pointer transition-all duration-300',
                'hover:shadow-xl hover:scale-[1.02] hover:border-primary/50',
                'bg-gradient-to-br from-background via-background to-primary/5',
                className,
            )}
            onClick={onClick}
        >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Cover image */}
            {deck.imageUrl && (
                <div className="h-32 w-full overflow-hidden">
                    <img
                        src={deck.imageUrl}
                        alt={deck.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                </div>
            )}

            <CardContent className={cn('p-4', !deck.imageUrl && 'pt-6')}>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                            {deck.title}
                        </h3>
                        {deck.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {deck.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-1 ml-2 shrink-0">
                        {deck.isPublic && (
                            <Badge variant="outline" className="text-xs">
                                <Globe className="h-3 w-3 mr-1" />
                                {intl.formatMessage({ id: 'FLASHCARD.PUBLIC' })}
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Owner info for public decks */}
                {deck.ownerUsername && !deck.isOwner && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <User className="h-3 w-3" />
                        <span>{intl.formatMessage({ id: 'FLASHCARD.BY_OWNER' }, { owner: deck.ownerUsername })}</span>
                        {deck.copyCount > 0 && (
                            <span className="ml-2">• {intl.formatMessage({ id: 'FLASHCARD.COPIES' }, { count: deck.copyCount })}</span>
                        )}
                    </div>
                )}

                {/* Stats row */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{intl.formatMessage({ id: 'FLASHCARD.CARDS' }, { count: deck.cardCount })}</span>
                    </div>

                    {dueToday > 0 && (
                        <div className="flex items-center gap-1 text-orange-500">
                            <Clock className="h-4 w-4" />
                            <span>{intl.formatMessage({ id: 'FLASHCARD.DUE' }, { count: dueToday })}</span>
                        </div>
                    )}

                    {progress && progress.masteredCards > 0 && (
                        <div className="flex items-center gap-1 text-green-500">
                            <Trophy className="h-4 w-4" />
                            <span>{intl.formatMessage({ id: 'FLASHCARD.MASTERED_COUNT' }, { count: progress.masteredCards })}</span>
                        </div>
                    )}
                </div>

                {/* Progress bar */}
                {progress && progress.totalCards > 0 && (
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{intl.formatMessage({ id: 'FLASHCARD.PROGRESS' })}</span>
                            <span>{masteredPercentage}%</span>
                        </div>
                        <Progress value={masteredPercentage} className="h-2" />
                    </div>
                )}

                {/* Footer row */}
                <div className="flex items-center justify-between mt-3">
                    <Badge
                        variant="outline"
                        className={cn(
                            'text-xs',
                            deck.difficulty === 0 && 'border-green-500/50 text-green-600',
                            deck.difficulty === 1 && 'border-yellow-500/50 text-yellow-600',
                            deck.difficulty === 2 && 'border-red-500/50 text-red-600',
                        )}
                    >
                        {deck.difficulty === 0
                            ? intl.formatMessage({ id: 'FLASHCARD.BEGINNER' })
                            : deck.difficulty === 1
                                ? intl.formatMessage({ id: 'FLASHCARD.INTERMEDIATE' })
                                : intl.formatMessage({ id: 'FLASHCARD.ADVANCED' })}
                    </Badge>

                    {/* Copy button for public decks not owned by user */}
                    {deck.isPublic && !deck.isOwner && onCopy && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCopy();
                            }}
                        >
                            <Copy className="h-3 w-3 mr-1" />
                            {intl.formatMessage({ id: 'COMMON.COPY' })}
                        </Button>
                    )}

                    {/* Delete button for owned decks */}
                    {deck.isOwner && onDelete && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                        >
                            <Trash2 className="h-3 w-3 mr-1" />
                            {intl.formatMessage({ id: 'COMMON.DELETE' })}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
