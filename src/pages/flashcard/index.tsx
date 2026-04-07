import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import {
  BookOpen,
  Sparkles,
  Trophy,
  Flame,
  Clock,
  Search,
  Plus,
  ArrowLeft,
  LayoutGrid,
  Filter,
  FolderPlus,
  Edit,
  Play,
  CreditCard,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DeckCard } from '@/components/flashcard/deck-card';
import { StudySession } from '@/components/flashcard/study-session';
import { AIGenerateFlashcard } from '@/components/flashcard/ai-generate-flashcard';
import { DeckFormDialog } from '@/components/flashcard/deck-form-dialog';
import { FlashcardFormDialog } from '@/components/flashcard/flashcard-form-dialog';
import { FlashcardCard } from '@/components/flashcard/flashcard-card';
import {
  useDecks,
  useOverallProgress,
  useStudySession,
  useSubmitAnswer,
  useDeckProgress,
  useDeckWithCards,
  useDeleteFlashcard,
  useDeleteDeck,
  useCopyDeck,
} from '@/hooks/use-flashcard';
import { FlashcardRating, FlashcardDeck, Flashcard, FlashcardStatus } from '@/models/flashcard.model';
import { ROUTE_PATHS } from '@/routing/paths';
import { cn } from '@/lib/utils';

type ViewMode = 'dashboard' | 'study' | 'ai-generate' | 'deck-detail';

export function FlashcardPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const intl = useIntl();

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [myDecksOnly, setMyDecksOnly] = useState(false);

  // Dialog state
  const [deckDialogOpen, setDeckDialogOpen] = useState(false);
  const [flashcardDialogOpen, setFlashcardDialogOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<FlashcardDeck | null>(null);
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(null);

  // Delete confirmation dialog state
  const [deleteFlashcardDialogOpen, setDeleteFlashcardDialogOpen] = useState(false);
  const [deleteDeckDialogOpen, setDeleteDeckDialogOpen] = useState(false);
  const [flashcardToDelete, setFlashcardToDelete] = useState<string | null>(null);
  const [deckToDelete, setDeckToDelete] = useState<FlashcardDeck | null>(null);

  // Data hooks
  const { data: decksData, isLoading: isLoadingDecks, refetch: refetchDecks } = useDecks({
    page: 1,
    limit: 50,
    searchText: searchQuery || undefined,
    difficulty:
      difficultyFilter !== 'all' ? Number(difficultyFilter) : undefined,
    myDecksOnly: myDecksOnly || undefined,
  });

  const { data: overallProgress } = useOverallProgress();
  const copyDeck = useCopyDeck();

  const {
    data: studySession,
    refetch: refetchSession,
  } = useStudySession(selectedDeckId || '', 20, viewMode === 'study' && !!selectedDeckId);

  const { data: deckWithCards, refetch: refetchDeckCards } = useDeckWithCards(
    selectedDeckId || '',
    viewMode === 'deck-detail' && !!selectedDeckId,
  );

  const { data: selectedDeckProgress } = useDeckProgress(
    selectedDeckId || '',
    !!selectedDeckId,
  );

  const submitAnswer = useSubmitAnswer();
  const deleteFlashcard = useDeleteFlashcard();
  const deleteDeck = useDeleteDeck();

  // Handle URL params for deep linking
  useEffect(() => {
    const deckId = searchParams.get('deck');
    const mode = searchParams.get('mode');

    if (deckId) {
      setSelectedDeckId(deckId);
      if (mode === 'study') {
        setViewMode('study');
      } else if (mode === 'detail') {
        setViewMode('deck-detail');
      }
    }
  }, [searchParams]);

  // Start studying a deck
  const handleStartStudy = (deck: FlashcardDeck) => {
    setSelectedDeckId(deck.id);
    setViewMode('study');
    setSearchParams({ deck: deck.id, mode: 'study' });
  };

  // View deck details
  const handleViewDeck = (deck: FlashcardDeck) => {
    setSelectedDeckId(deck.id);
    setViewMode('deck-detail');
    setSearchParams({ deck: deck.id, mode: 'detail' });
  };

  // Exit study/detail mode
  const handleExitView = () => {
    setViewMode('dashboard');
    setSelectedDeckId(null);
    setSearchParams({});
  };

  // Submit answer in study session
  const handleSubmitAnswer = (flashcardId: string, rating: FlashcardRating) => {
    submitAnswer.mutate({ flashcardId, rating });
  };

  // Complete study session
  const handleCompleteSession = () => {
    refetchSession();
    handleExitView();
  };

  // Open AI generator
  const handleOpenAIGenerator = () => {
    setViewMode('ai-generate');
  };

  // Save AI generated cards
  const handleSaveAICards = (cards: unknown[]) => {
    console.log('Saving AI generated cards:', cards);
    setViewMode('dashboard');
  };

  // Create deck handlers
  const handleCreateDeck = () => {
    setEditingDeck(null);
    setDeckDialogOpen(true);
  };

  const handleEditDeck = (deck: FlashcardDeck) => {
    setEditingDeck(deck);
    setDeckDialogOpen(true);
  };

  // Create flashcard handlers
  const handleCreateFlashcard = () => {
    setEditingFlashcard(null);
    setFlashcardDialogOpen(true);
  };

  const handleEditFlashcard = (flashcard: Flashcard) => {
    setEditingFlashcard(flashcard);
    setFlashcardDialogOpen(true);
  };

  const handleDeleteFlashcardClick = (flashcardId: string) => {
    setFlashcardToDelete(flashcardId);
    setDeleteFlashcardDialogOpen(true);
  };

  const handleConfirmDeleteFlashcard = async () => {
    if (flashcardToDelete) {
      await deleteFlashcard.mutateAsync(flashcardToDelete);
      refetchDeckCards();
      setFlashcardToDelete(null);
    }
    setDeleteFlashcardDialogOpen(false);
  };

  const handleDeleteDeckClick = (deck: FlashcardDeck) => {
    setDeckToDelete(deck);
    setDeleteDeckDialogOpen(true);
  };

  const handleConfirmDeleteDeck = async () => {
    if (deckToDelete) {
      await deleteDeck.mutateAsync(deckToDelete.id);
      refetchDecks();
      if (selectedDeckId === deckToDelete.id) {
        handleExitView();
      }
      setDeckToDelete(null);
    }
    setDeleteDeckDialogOpen(false);
  };

  const handleCopyDeck = async (deck: FlashcardDeck) => {
    try {
      await copyDeck.mutateAsync({ sourceDeckId: deck.id });
      refetchDecks();
    } catch (error) {
      console.error('Failed to copy deck:', error);
    }
  };

  const decks = decksData?.items || [];

  // Study mode view
  if (viewMode === 'study' && studySession) {
    return (
      <div className="container mx-auto p-6 max-w-4xl min-h-screen">
        <StudySession
          session={studySession}
          onSubmitAnswer={handleSubmitAnswer}
          onComplete={handleCompleteSession}
          onExit={handleExitView}
          isSubmitting={submitAnswer.isPending}
        />
      </div>
    );
  }

  // AI Generate view
  if (viewMode === 'ai-generate') {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => setViewMode('dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Flashcards
        </Button>
        <AIGenerateFlashcard
          deckId={selectedDeckId || undefined}
          onSaveCards={handleSaveAICards}
          onCancel={() => setViewMode('dashboard')}
        />
      </div>
    );
  }

  // Deck detail view
  if (viewMode === 'deck-detail' && deckWithCards) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleExitView}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{deckWithCards.title}</h1>
              {deckWithCards.description && (
                <p className="text-muted-foreground">{deckWithCards.description}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleEditDeck(deckWithCards)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Deck
            </Button>
            <Button onClick={() => handleStartStudy(deckWithCards)}>
              <Play className="h-4 w-4 mr-2" />
              Start Study
            </Button>
          </div>
        </div>

        {/* Progress */}
        {selectedDeckProgress && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{selectedDeckProgress.totalCards}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{selectedDeckProgress.masteredCards}</p>
                  <p className="text-sm text-muted-foreground">Mastered</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{selectedDeckProgress.learningCards}</p>
                  <p className="text-sm text-muted-foreground">Learning</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{selectedDeckProgress.dueToday}</p>
                  <p className="text-sm text-muted-foreground">Due Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cards List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Cards ({deckWithCards.flashcards?.length || 0})
            </h2>
            <Button onClick={handleCreateFlashcard}>
              <Plus className="h-4 w-4 mr-2" />
              Add Card
            </Button>
          </div>

          {deckWithCards.flashcards && deckWithCards.flashcards.length > 0 ? (
            <div className="grid gap-3">
              {deckWithCards.flashcards.map((card) => (
                <Card key={card.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{card.englishTerm}</span>
                          {card.pronunciation && (
                            <span className="text-sm text-muted-foreground font-mono">
                              {card.pronunciation}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          {card.vietnameseTerm}
                        </p>
                        {card.tags && card.tags.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {card.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditFlashcard(card)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteFlashcardClick(card.id)}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center space-y-4">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="font-semibold">No cards yet</h3>
                  <p className="text-muted-foreground">
                    Add your first flashcard to this deck
                  </p>
                </div>
                <Button onClick={handleCreateFlashcard}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Card
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Dialogs */}
        <DeckFormDialog
          open={deckDialogOpen}
          onOpenChange={setDeckDialogOpen}
          deck={editingDeck}
          onSuccess={() => {
            refetchDecks();
            refetchDeckCards();
          }}
        />

        <FlashcardFormDialog
          open={flashcardDialogOpen}
          onOpenChange={setFlashcardDialogOpen}
          deckId={selectedDeckId || ''}
          flashcard={editingFlashcard}
          onSuccess={() => refetchDeckCards()}
        />

        {/* Delete Flashcard Confirmation Dialog */}
        <AlertDialog open={deleteFlashcardDialogOpen} onOpenChange={setDeleteFlashcardDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {intl.formatMessage({ id: 'FLASHCARD.DELETE_CARD_TITLE' })}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {intl.formatMessage({ id: 'FLASHCARD.DELETE_CARD_DESC' })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {intl.formatMessage({ id: 'COMMON.CANCEL' })}
              </AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={handleConfirmDeleteFlashcard}>
                {intl.formatMessage({ id: 'COMMON.DELETE' })}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Deck Confirmation Dialog */}
        <AlertDialog open={deleteDeckDialogOpen} onOpenChange={setDeleteDeckDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {intl.formatMessage({ id: 'FLASHCARD.DELETE_DECK_TITLE' })}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {intl.formatMessage(
                  { id: 'FLASHCARD.DELETE_DECK_DESC' },
                  { deckName: deckToDelete?.title || '' }
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {intl.formatMessage({ id: 'COMMON.CANCEL' })}
              </AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={handleConfirmDeleteDeck}>
                {intl.formatMessage({ id: 'COMMON.DELETE' })}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Dashboard view
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-primary/60 rounded-xl text-primary-foreground">
              <BookOpen className="h-6 w-6" />
            </div>
            Flashcards
          </h1>
          <p className="text-muted-foreground mt-1">
            Master vocabulary with spaced repetition
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCreateDeck}>
            <FolderPlus className="h-4 w-4 mr-2" />
            New Deck
          </Button>
          <Button variant="outline" onClick={handleOpenAIGenerator}>
            <Sparkles className="h-4 w-4 mr-2" />
            AI Generate
          </Button>
          <Button onClick={() => navigate(ROUTE_PATHS.HOME)}>
            Back to Home
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Trophy className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {overallProgress?.totalMastered ?? 0}
                </p>
                <p className="text-sm text-muted-foreground">Mastered</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {overallProgress?.totalDueToday ?? 0}
                </p>
                <p className="text-sm text-muted-foreground">Due Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border-red-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Flame className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {overallProgress?.studyStreak ?? 0}
                </p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {overallProgress?.totalCards ?? 0}
                </p>
                <p className="text-sm text-muted-foreground">Total Cards</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      {overallProgress && overallProgress.totalCards > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(
                  (overallProgress.totalMastered / overallProgress.totalCards) *
                  100,
                )}
                % mastered
              </span>
            </div>
            <Progress
              value={
                (overallProgress.totalMastered / overallProgress.totalCards) *
                100
              }
              className="h-3"
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>{overallProgress.totalLearning} learning</span>
              <span>{overallProgress.totalMastered} mastered</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deck Browser */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <LayoutGrid className="h-5 w-5" />
              {myDecksOnly ? 'My Decks' : 'All Decks'}
            </h2>
            <div className="flex gap-1">
              <Button
                variant={myDecksOnly ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setMyDecksOnly(true)}
              >
                My Decks
              </Button>
              <Button
                variant={!myDecksOnly ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setMyDecksOnly(false)}
              >
                Public
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search decks..."
                value={searchQuery}
                onChange={(value) => setSearchQuery(value ?? '')}
                className="pl-9 w-full sm:w-64"
              />
            </div>

            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="0">Beginner</SelectItem>
                <SelectItem value="1">Intermediate</SelectItem>
                <SelectItem value="2">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Deck Grid */}
        {isLoadingDecks ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-48 animate-pulse bg-muted" />
            ))}
          </div>
        ) : decks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {decks.map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                progress={
                  overallProgress?.deckProgress?.find(
                    (p) => p.deckId === deck.id,
                  ) as any
                }
                onClick={() => handleViewDeck(deck)}
                onCopy={() => handleCopyDeck(deck)}
                onDelete={() => handleDeleteDeckClick(deck)}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">No decks found</h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? 'Try a different search term'
                    : 'Create your first deck to get started'}
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={handleCreateDeck}>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Create Deck
                </Button>
                <Button onClick={handleOpenAIGenerator}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate with AI
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Dialogs */}
      <DeckFormDialog
        open={deckDialogOpen}
        onOpenChange={setDeckDialogOpen}
        deck={editingDeck}
        onSuccess={() => refetchDecks()}
      />

      <FlashcardFormDialog
        open={flashcardDialogOpen}
        onOpenChange={setFlashcardDialogOpen}
        deckId={selectedDeckId || ''}
        flashcard={editingFlashcard}
        onSuccess={() => refetchDeckCards()}
      />

      {/* Delete Flashcard Confirmation Dialog */}
      <AlertDialog open={deleteFlashcardDialogOpen} onOpenChange={setDeleteFlashcardDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {intl.formatMessage({ id: 'FLASHCARD.DELETE_CARD_TITLE' })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {intl.formatMessage({ id: 'FLASHCARD.DELETE_CARD_DESC' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {intl.formatMessage({ id: 'COMMON.CANCEL' })}
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleConfirmDeleteFlashcard}>
              {intl.formatMessage({ id: 'COMMON.DELETE' })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Deck Confirmation Dialog */}
      <AlertDialog open={deleteDeckDialogOpen} onOpenChange={setDeleteDeckDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {intl.formatMessage({ id: 'FLASHCARD.DELETE_DECK_TITLE' })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {intl.formatMessage(
                { id: 'FLASHCARD.DELETE_DECK_DESC' },
                { deckName: deckToDelete?.title || '' }
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {intl.formatMessage({ id: 'COMMON.CANCEL' })}
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleConfirmDeleteDeck}>
              {intl.formatMessage({ id: 'COMMON.DELETE' })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
