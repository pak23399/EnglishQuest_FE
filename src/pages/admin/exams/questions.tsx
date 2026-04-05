import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit2, GripVertical, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import {
    useAdminExam,
    useAdminExamQuestions,
    useAddExamQuestions,
    useUpdateExamQuestion,
    useDeleteExamQuestion,
    useImportExamQuestions,
} from '@/hooks/admin/use-admin-exams';
import { AdminExamQuestion, CreateExamQuestionRequest, ImportQuestionsResponse } from '@/models/exam.model';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { ContentLoader } from '@/components/common/content-loader';

interface QuestionFormData {
    text: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
}

export function AdminExamQuestionsPage() {
    const { examId } = useParams<{ examId: string }>();
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const [importJson, setImportJson] = useState('');
    const [replaceExisting, setReplaceExisting] = useState(false);
    const [importResult, setImportResult] = useState<ImportQuestionsResponse | null>(null);
    const [editingQuestion, setEditingQuestion] = useState<AdminExamQuestion | null>(null);

    const { data: exam, isLoading: isLoadingExam } = useAdminExam(examId || '', !!examId);
    const { data: questions, isLoading: isLoadingQuestions } = useAdminExamQuestions(examId || '', !!examId);

    const addQuestionsMutation = useAddExamQuestions();
    const updateQuestionMutation = useUpdateExamQuestion();
    const deleteQuestionMutation = useDeleteExamQuestion();
    const importQuestionsMutation = useImportExamQuestions();

    const form = useForm<QuestionFormData>({
        defaultValues: {
            text: '',
            options: ['', '', '', ''],
            correctAnswer: '',
            explanation: '',
        },
    });

    const handleOpenCreate = () => {
        setEditingQuestion(null);
        form.reset({
            text: '',
            options: ['', '', '', ''],
            correctAnswer: '',
            explanation: '',
        });
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (question: AdminExamQuestion) => {
        setEditingQuestion(question);
        form.reset({
            text: question.text,
            options: question.options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation || '',
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = (data: QuestionFormData) => {
        if (!examId) return;

        // Validate correctAnswer is one of the options
        if (!data.options.includes(data.correctAnswer)) {
            alert('Correct answer must be one of the options');
            return;
        }

        if (editingQuestion) {
            updateQuestionMutation.mutate(
                {
                    questionId: editingQuestion.id,
                    examId,
                    data: {
                        text: data.text,
                        options: data.options,
                        correctAnswer: data.correctAnswer,
                        explanation: data.explanation,
                    },
                },
                {
                    onSuccess: () => {
                        setIsDialogOpen(false);
                        setEditingQuestion(null);
                    },
                },
            );
        } else {
            const questionRequest: CreateExamQuestionRequest = {
                text: data.text,
                options: data.options,
                correctAnswer: data.correctAnswer,
                explanation: data.explanation,
            };

            addQuestionsMutation.mutate(
                {
                    examId,
                    data: { questions: [questionRequest] },
                },
                {
                    onSuccess: () => {
                        setIsDialogOpen(false);
                    },
                },
            );
        }
    };

    const handleDelete = (questionId: string) => {
        if (!examId) return;
        if (confirm('Are you sure you want to delete this question?')) {
            deleteQuestionMutation.mutate({ questionId, examId });
        }
    };

    const handleImport = () => {
        if (!examId || !importJson.trim()) return;

        try {
            const parsed = JSON.parse(importJson);
            const questions = Array.isArray(parsed) ? parsed : parsed.questions;

            if (!Array.isArray(questions)) {
                setImportResult({
                    isSuccess: false,
                    importedCount: 0,
                    failedCount: 0,
                    totalQuestions: 0,
                    errors: ['Invalid JSON format. Expected an array of questions or { questions: [...] }'],
                });
                return;
            }

            importQuestionsMutation.mutate(
                {
                    examId,
                    data: {
                        replaceExisting,
                        questions: questions.map((q: any) => ({
                            text: q.text,
                            options: q.options,
                            correctAnswer: q.correctAnswer,
                            explanation: q.explanation,
                        })),
                    },
                },
                {
                    onSuccess: (result) => {
                        setImportResult(result);
                        if (result.isSuccess) {
                            setImportJson('');
                        }
                    },
                    onError: (error: any) => {
                        setImportResult({
                            isSuccess: false,
                            importedCount: 0,
                            failedCount: 0,
                            totalQuestions: 0,
                            errors: [error.message || 'Import failed'],
                        });
                    },
                },
            );
        } catch {
            setImportResult({
                isSuccess: false,
                importedCount: 0,
                failedCount: 0,
                totalQuestions: 0,
                errors: ['Invalid JSON format'],
            });
        }
    };

    if (isLoadingExam || isLoadingQuestions) {
        return <ContentLoader className="min-h-[400px]" />;
    }

    if (!exam) {
        return (
            <div className="container mx-auto p-6">
                <p className="text-muted-foreground">Exam not found</p>
                <Button onClick={() => navigate('/admin/exams')} className="mt-4">
                    Back to Exams
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/admin/exams')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{exam.title}</h1>
                        <p className="text-muted-foreground">
                            Manage questions for this exam
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Import JSON
                    </Button>
                    <Button onClick={handleOpenCreate}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Question
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4">
                <Badge variant="outline" className="text-base px-4 py-2">
                    {questions?.length || 0} Questions
                </Badge>
                <Badge variant="outline" className="text-base px-4 py-2">
                    {exam.durationMinutes} min Duration
                </Badge>
                <Badge variant="outline" className="text-base px-4 py-2">
                    {exam.passingScore}% Passing Score
                </Badge>
            </div>

            {/* Questions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Questions</CardTitle>
                </CardHeader>
                <CardContent>
                    {questions && questions.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">#</TableHead>
                                    <TableHead>Question</TableHead>
                                    <TableHead>Correct Answer</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {questions.map((question, index) => (
                                    <TableRow key={question.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                                {index + 1}
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-md">
                                            <p className="truncate">{question.text}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{question.correctAnswer}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={question.isActive ? 'success' : 'secondary'}>
                                                {question.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleOpenEdit(question)}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(question.id)}
                                                    disabled={deleteQuestionMutation.isPending}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No questions yet</p>
                            <Button className="mt-4" onClick={handleOpenCreate}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add First Question
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Question Form Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingQuestion ? 'Edit Question' : 'Add Question'}
                        </DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                            {/* Question Text */}
                            <FormField
                                control={form.control}
                                name="text"
                                rules={{ required: 'Question text is required' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel required>Question Text</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                placeholder="Enter the question..."
                                                rows={3}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Options */}
                            <div className="space-y-3">
                                <FormLabel required>Options (4 required)</FormLabel>
                                {[0, 1, 2, 3].map((index) => (
                                    <FormField
                                        key={index}
                                        control={form.control}
                                        name={`options.${index}` as any}
                                        rules={{ required: `Option ${index + 1} is required` }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        value={field.value || ''}
                                                        onChange={field.onChange}
                                                        placeholder={`Option ${index + 1}`}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>

                            {/* Correct Answer */}
                            <FormField
                                control={form.control}
                                name="correctAnswer"
                                rules={{ required: 'Correct answer is required' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel required>Correct Answer</FormLabel>
                                        <FormControl>
                                            <Input
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Enter the correct answer (must match one of the options exactly)"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            {/* Explanation */}
                            <FormField
                                control={form.control}
                                name="explanation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Explanation (optional)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                value={field.value || ''}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                placeholder="Explain why this is the correct answer..."
                                                rows={2}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Actions */}
                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={addQuestionsMutation.isPending || updateQuestionMutation.isPending}
                                >
                                    {addQuestionsMutation.isPending || updateQuestionMutation.isPending
                                        ? 'Saving...'
                                        : editingQuestion
                                            ? 'Update Question'
                                            : 'Add Question'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Import JSON Dialog */}
            <Dialog open={isImportDialogOpen} onOpenChange={(open) => {
                setIsImportDialogOpen(open);
                if (!open) {
                    setImportResult(null);
                }
            }}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Import Questions from JSON</DialogTitle>
                        <DialogDescription>
                            Paste a JSON array of questions. Each question needs: text, options (array), correctAnswer.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Example Format */}
                        <div className="p-3 bg-muted rounded-lg text-sm">
                            <p className="font-medium mb-2">Example format:</p>
                            <pre className="text-xs overflow-x-auto">{`[
  {
    "text": "What is 2 + 2?",
    "options": ["3", "4", "5", "6"],
    "correctAnswer": "4",
    "explanation": "Basic addition"
  }
]`}</pre>
                        </div>

                        {/* JSON Input */}
                        <Textarea
                            value={importJson}
                            onChange={(e) => setImportJson(e.target.value)}
                            placeholder="Paste your JSON here..."
                            rows={8}
                            className="font-mono text-sm"
                        />

                        {/* Replace Existing Checkbox */}
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="replace-existing"
                                checked={replaceExisting}
                                onCheckedChange={(checked) => setReplaceExisting(checked === true)}
                            />
                            <label htmlFor="replace-existing" className="text-sm cursor-pointer">
                                Replace all existing questions
                            </label>
                        </div>

                        {/* Import Result */}
                        {importResult && (
                            <div className={`p-3 rounded-lg flex items-start gap-2 ${importResult.isSuccess
                                ? 'bg-green-500/10 text-green-700 dark:text-green-300'
                                : 'bg-red-500/10 text-red-700 dark:text-red-300'
                                }`}>
                                {importResult.isSuccess ? (
                                    <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                )}
                                <div>
                                    {importResult.isSuccess ? (
                                        <p>Successfully imported {importResult.importedCount} questions. Total: {importResult.totalQuestions}</p>
                                    ) : (
                                        <div>
                                            <p>Import failed</p>
                                            {importResult.errors?.map((err, i) => (
                                                <p key={i} className="text-sm">{err}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsImportDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleImport}
                                disabled={!importJson.trim() || importQuestionsMutation.isPending}
                            >
                                {importQuestionsMutation.isPending ? 'Importing...' : 'Import Questions'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
