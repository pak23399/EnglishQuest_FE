import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
    Sparkles,
    Loader2,
    Check,
    X,
    Edit3,
    Save,
    RefreshCw,
    AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGenerateFlashcards, useQuotaStatus } from '@/hooks/use-ai';
import { AIFeatureType } from '@/models/ai.model';
import { LottieAnimation } from '@/components/ui/lottie-animation';
import EditAnimation from '@/assets/lottie/Edit.json';

interface GeneratedCard {
    id: string;
    englishTerm: string;
    vietnameseTerm: string;
    englishExample?: string;
    vietnameseExample?: string;
    pronunciation?: string;
    status: 'pending' | 'approved' | 'rejected' | 'editing';
}
type SaveMeta = {
  deckTitle: string;
  deckDescription?: string;
  isPublic: boolean;
};

interface AIGenerateFlashcardProps {
    deckId?: string;
    onSaveCards: (cards: GeneratedCard[], meta: SaveMeta) => void | Promise<void>;
    onCancel: () => void;
}

/**
 * AI-powered flashcard generation component
 * Integrates with the AI API to generate English-Vietnamese flashcards
 */
export function AIGenerateFlashcard({
    deckId,
    onSaveCards,
    onCancel,
}: AIGenerateFlashcardProps) {
    const [topic, setTopic] = useState('');
    const [count, setCount] = useState(10);
    const [deckTitle, setDeckTitle] = useState('');
    const [deckDescription, setDeckDescription] = useState('');
    const [generatedCards, setGeneratedCards] = useState<GeneratedCard[]>([]);
    const [editingCard, setEditingCard] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const generateMutation = useGenerateFlashcards();
    const { data: quotaStatus, isLoading: isLoadingQuota } = useQuotaStatus(
        AIFeatureType.FlashcardGeneration
    );

    const handleGenerate = async () => {
        if (!topic.trim()) return;

        setError(null);

        try {
            const response = await generateMutation.mutateAsync({
                topic,
                count,
                deckTitle: deckTitle || `AI: ${topic}`,
                deckDescription: deckDescription || `AI-generated flashcards about ${topic}`,
                isPublic: false,
            });

            // Map API response to component format
            const cards: GeneratedCard[] = response.flashcards.map((fc) => ({
                id: fc.id,
                englishTerm: fc.englishTerm,
                vietnameseTerm: fc.vietnameseTerm,
                englishExample: fc.englishExample,
                vietnameseExample: fc.vietnameseExample,
                pronunciation: fc.pronunciation,
                status: 'pending' as const,
            }));

            setGeneratedCards(cards);
        } catch (err: any) {
            if (err?.response?.status === 429) {
                setError('Daily quota exceeded. Please upgrade your plan or try again tomorrow.');
            } else {
                setError(err?.response?.data?.message || 'Failed to generate flashcards. Please try again.');
            }
        }
    };

    const handleApprove = (cardId: string) => {
        setGeneratedCards((cards) =>
            cards.map((c) =>
                c.id === cardId ? { ...c, status: 'approved' as const } : c,
            ),
        );
    };

    const handleReject = (cardId: string) => {
        setGeneratedCards((cards) =>
            cards.map((c) =>
                c.id === cardId ? { ...c, status: 'rejected' as const } : c,
            ),
        );
    };

    const handleEdit = (cardId: string) => {
        setEditingCard(cardId);
        setGeneratedCards((cards) =>
            cards.map((c) =>
                c.id === cardId ? { ...c, status: 'editing' as const } : c,
            ),
        );
    };

    const handleSaveEdit = (cardId: string, englishTerm: string, vietnameseTerm: string) => {
        setGeneratedCards((cards) =>
            cards.map((c) =>
                c.id === cardId
                    ? { ...c, englishTerm, vietnameseTerm, status: 'approved' as const }
                    : c,
            ),
        );
        setEditingCard(null);
    };

    const handleSaveAll = async () => {
        const approvedCards = generatedCards.filter((c) => c.status === 'approved');

        const meta = {
            deckTitle: deckTitle || `AI: ${topic}`,
            deckDescription: deckDescription || undefined,
            isPublic: false,
        };

        await onSaveCards(approvedCards, meta);
    };

    const approvedCount = generatedCards.filter((c) => c.status === 'approved').length;
    const pendingCount = generatedCards.filter((c) => c.status === 'pending').length;

    const canGenerate = quotaStatus?.canMakeRequest ?? true;
    const quotaText = quotaStatus
        ? quotaStatus.dailyLimit === -1
            ? 'Unlimited'
            : `${quotaStatus.remainingToday} of ${quotaStatus.dailyLimit} remaining today`
        : '';

    return (
        <>
            {/* Loading Overlay */}
            {generateMutation.isPending && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-[200px] h-[200px]">
                            <LottieAnimation animationData={EditAnimation} />
                        </div>
                        <p className="text-lg font-medium text-muted-foreground animate-pulse">
                            Generating flashcards...
                        </p>
                    </div>
                </div>
            )}

            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                        AI Flashcard Generator
                        {!isLoadingQuota && quotaStatus && (
                            <Badge variant="secondary" className="ml-2">
                                {quotaText}
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Input section */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">
                                Enter a topic or paste vocabulary
                            </label>
                            <Textarea
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., Common business English phrases, Travel vocabulary, IELTS speaking topics..."
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Deck Title (optional)
                                </label>
                                <Input
                                    value={deckTitle}
                                    onChange={(value) => setDeckTitle(value || '')}
                                    placeholder="My AI Flashcards"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Number of cards
                                </label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={50}
                                    value={count}
                                    onChange={(value) => setCount(Number(value) || 10)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">
                                Description (optional)
                            </label>
                            <Input
                                value={deckDescription}
                                onChange={(value) => setDeckDescription(value || '')}
                                placeholder="A short description of your flashcard deck"
                            />
                        </div>

                        <Button
                            onClick={handleGenerate}
                            disabled={!topic.trim() || generateMutation.isPending || !canGenerate}
                            className="w-full"
                        >
                            {generateMutation.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Generate Cards
                                </>
                            )}
                        </Button>

                        {!canGenerate && (
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                    Daily quota exceeded. Upgrade your plan for more generations.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Generated cards preview */}
                    {generatedCards.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">
                                    Generated Cards ({approvedCount} approved, {pendingCount} pending)
                                </h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleGenerate}
                                    disabled={generateMutation.isPending}
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Regenerate
                                </Button>
                            </div>

                            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                {generatedCards.map((card) => (
                                    <Card
                                        key={card.id}
                                        className={cn(
                                            'transition-all',
                                            card.status === 'approved' && 'border-green-500/50 bg-green-500/5',
                                            card.status === 'rejected' && 'border-red-500/50 bg-red-500/5 opacity-50',
                                            card.status === 'editing' && 'border-primary',
                                        )}
                                    >
                                        <CardContent className="py-3">
                                            {editingCard === card.id ? (
                                                <div className="space-y-2">
                                                    <Input
                                                        defaultValue={card.englishTerm}
                                                        id={`edit-en-${card.id}`}
                                                        placeholder="English term"
                                                    />
                                                    <Input
                                                        defaultValue={card.vietnameseTerm}
                                                        id={`edit-vi-${card.id}`}
                                                        placeholder="Vietnamese translation"
                                                    />
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => {
                                                                const enInput = document.getElementById(`edit-en-${card.id}`) as HTMLInputElement;
                                                                const viInput = document.getElementById(`edit-vi-${card.id}`) as HTMLInputElement;
                                                                handleSaveEdit(card.id, enInput.value, viInput.value);
                                                            }}
                                                        >
                                                            <Save className="h-4 w-4 mr-1" />
                                                            Save
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => setEditingCard(null)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium">{card.englishTerm}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {card.vietnameseTerm}
                                                        </p>
                                                        {card.pronunciation && (
                                                            <p className="text-xs text-muted-foreground italic">
                                                                {card.pronunciation}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-1 ml-4">
                                                        {card.status === 'pending' && (
                                                            <>
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="h-8 w-8 text-green-600 hover:bg-green-100"
                                                                    onClick={() => handleApprove(card.id)}
                                                                >
                                                                    <Check className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="h-8 w-8 text-red-600 hover:bg-red-100"
                                                                    onClick={() => handleReject(card.id)}
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="h-8 w-8"
                                                                    onClick={() => handleEdit(card.id)}
                                                                >
                                                                    <Edit3 className="h-4 w-4" />
                                                                </Button>
                                                            </>
                                                        )}
                                                        {card.status === 'approved' && (
                                                            <Badge variant="success" className="bg-green-500">
                                                                Approved
                                                            </Badge>
                                                        )}
                                                        {card.status === 'rejected' && (
                                                            <Badge variant="secondary">Rejected</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveAll}
                            disabled={approvedCount === 0}
                        >
                            Save {approvedCount} Cards
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
