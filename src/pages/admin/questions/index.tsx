import { useState } from 'react';
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
import { Difficulty, Question, QuestionType } from '@/models/quiz.model';
import { FileJson, HelpCircle, Plus, Search, Upload } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useLevelsBySection } from '@/hooks/admin/use-admin-levels';
import {
  useCreateQuestion,
  useDeleteQuestion,
  useExportQuestions,
  useImportQuestionsJson,
  useQuestionsByLevel,
  useUpdateQuestion,
} from '@/hooks/admin/use-admin-questions';
import { useAllSections } from '@/hooks/admin/use-admin-sections';
import {
  CreateQuestionRequest,
  QuestionOption,
} from '@/services/admin/question.service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { QuestionFormDialog } from '@/components/admin/question-form-dialog';
import { QuestionImportDialog } from '@/components/admin/question-import-dialog';
import { ImportQuestionItem } from '@/services/admin/question.service';
import { ContentLoader } from '@/components/common/content-loader';

// Internal form data structure with QuestionOption objects
interface QuestionFormData {
  levelId: string;
  type: QuestionType;
  text: string;
  correctAnswer: string;
  explanation?: string;
  difficulty: Difficulty;
  order: number;
  points: number;
  options: QuestionOption[];
  audioUrl?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
}

const questionTypeLabels: Record<QuestionType | string, string> = {
  [QuestionType.MultipleChoice]: 'Multiple Choice',
  [QuestionType.FillInTheBlank]: 'Fill in the Blank',
  [QuestionType.Meaning]: 'Meaning',
  [QuestionType.CorrectSentence]: 'Correct Sentence',
  [QuestionType.Pattern]: 'Pattern',
  [QuestionType.Listening]: 'Listening',
  [QuestionType.TrueFalse]: 'True/False',
  [QuestionType.Matching]: 'Matching',
  [QuestionType.Ordering]: 'Ordering',
};

const difficultyLabels = {
  [Difficulty.Beginner]: 'Beginner',
  [Difficulty.Intermediate]: 'Intermediate',
  [Difficulty.Advanced]: 'Advanced',
};

export function AdminQuestionsPage() {
  const { levelId } = useParams<{ levelId?: string }>();
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [selectedLevelId, setSelectedLevelId] = useState<string>(levelId || '');
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);

  const { data: sections } = useAllSections();
  const { data: levels } = useLevelsBySection(selectedSectionId);
  const { data: questions, isLoading } = useQuestionsByLevel(selectedLevelId);
  const { mutate: deleteQuestion, isPending: isDeleting } = useDeleteQuestion();
  const { mutate: exportQuestions } = useExportQuestions();
  const { mutate: createQuestion, isPending: isCreating } = useCreateQuestion();
  const { mutate: updateQuestion, isPending: isUpdating } = useUpdateQuestion();
  const { mutate: importQuestions, isPending: isImporting } = useImportQuestionsJson();

  const handleDeleteClick = (id: string) => {
    setQuestionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (questionToDelete) {
      deleteQuestion(questionToDelete, {
        onSuccess: () => {
          toast.success('Question deleted successfully');
          setDeleteDialogOpen(false);
          setQuestionToDelete(null);
        },
        onError: () => {
          toast.error('Failed to delete question');
        },
      });
    }
  };

  const handleExport = () => {
    if (!selectedLevelId) return;

    exportQuestions(selectedLevelId, {
      onSuccess: () => {
        toast.success('Questions exported successfully');
      },
      onError: () => {
        toast.error('Failed to export questions');
      },
    });
  };

  const handleCreate = () => {
    if (!selectedLevelId) {
      alert('Please select a section and level first');
      return;
    }
    setEditingQuestionId(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (question: Question) => {
    setEditingQuestionId(question.id);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: QuestionFormData) => {
    // Transform options from objects to strings array for API
    const transformedData: CreateQuestionRequest = {
      ...data,
      options: data.options.map((opt) => opt.text),
    };

    if (editingQuestionId) {
      updateQuestion(
        { id: editingQuestionId, ...transformedData },
        {
          onSuccess: () => {
            toast.success('Question updated successfully');
            setIsDialogOpen(false);
            setEditingQuestionId(null);
          },
          onError: () => {
            toast.error('Failed to update question');
          },
        },
      );
    } else {
      createQuestion(transformedData, {
        onSuccess: () => {
          toast.success('Question created successfully');
          setIsDialogOpen(false);
        },
        onError: () => {
          toast.error('Failed to create question');
        },
      });
    }
  };

  const handleImportQuestions = (data: {
    levelId: string;
    replaceExisting: boolean;
    questions: ImportQuestionItem[];
  }) => {
    importQuestions(data, {
      onSuccess: (result) => {
        if (result.isSuccess) {
          toast.success(result.message);
        } else {
          toast.warning(result.message);
        }
        setIsImportDialogOpen(false);
      },
      onError: () => {
        toast.error('Failed to import questions');
      },
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <HelpCircle className="h-8 w-8" />
            Manage Questions
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage quiz questions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={!selectedLevelId}
          >
            <FileJson className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsImportDialogOpen(true)}
            disabled={!selectedLevelId}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import JSON
          </Button>
          <Button disabled={!selectedLevelId} onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Question
          </Button>
        </div>
      </div>

      {/* Section & Level Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Select Section
              </label>
              <Select
                value={selectedSectionId}
                onValueChange={(value) => {
                  setSelectedSectionId(value);
                  setSelectedLevelId('');
                }}
              >
                <SelectTrigger className="w-full" size="lg">
                  <SelectValue placeholder="-- Select a section --" />
                </SelectTrigger>
                <SelectContent>
                  {sections?.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Select Level
              </label>
              <Select
                value={selectedLevelId}
                onValueChange={(value) => setSelectedLevelId(value)}
                disabled={!selectedSectionId}
              >
                <SelectTrigger className="w-full" size="lg">
                  <SelectValue placeholder="-- Select a level --" />
                </SelectTrigger>
                <SelectContent>
                  {levels?.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedLevelId && (
            <div className="flex items-center gap-2 mt-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={search}
                onChange={(value) => setSearch(value || '')}
                className="max-w-sm"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Questions Table */}
      {selectedLevelId && (
        <Card>
          <CardHeader>
            <CardTitle>Questions ({questions?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ContentLoader className="min-h-[200px]" />
            ) : questions && questions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Media</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="font-medium">
                        {question.order}
                      </TableCell>
                      <TableCell className="max-w-md truncate font-semibold">
                        {question.text}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {questionTypeLabels[question.type]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {difficultyLabels[question.difficulty]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {question.hasMedia ? (
                          <Badge variant="secondary">
                            {question.audioUrl && 'Audio'}
                            {question.imageUrl && 'Image'}
                            {question.videoUrl && 'Video'}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            None
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(question)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(question.id)}
                            disabled={isDeleting}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <HelpCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No questions in this level yet</p>
                <Button className="mt-4" onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Question
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedLevelId && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center text-muted-foreground">
              <HelpCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Select a section and level to view and manage questions</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Question Form Dialog */}
      <QuestionFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        questionId={editingQuestionId}
        isLoading={isCreating || isUpdating}
        levelId={selectedLevelId}
      />

      {/* Question Import Dialog */}
      <QuestionImportDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        levelId={selectedLevelId}
        onImport={handleImportQuestions}
        isLoading={isImporting}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Question</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this question? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
