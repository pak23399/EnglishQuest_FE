import { useState, useRef, useCallback } from 'react';
import { FileJson, Upload, AlertTriangle, CheckCircle2, X, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImportQuestionItem } from '@/services/admin/question.service';

interface QuestionImportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    levelId: string;
    onImport: (data: {
        levelId: string;
        replaceExisting: boolean;
        questions: ImportQuestionItem[];
    }) => void;
    isLoading: boolean;
}

import { QuestionType } from '@/models/quiz.model';

// Question type labels - supports both enum values and string formats
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
    // String-based types from import API
    'fill-in-the-blank': 'Fill in the Blank',
    'meaning': 'Meaning',
    'correct-sentence': 'Correct Sentence',
    'pattern': 'Pattern',
    'listening': 'Listening',
    'multiple-choice': 'Multiple Choice',
    'true-false': 'True/False',
    'matching': 'Matching',
    'ordering': 'Ordering',
};

// Difficulty labels (1-5 scale)
const difficultyLabels: Record<number, string> = {
    1: 'Beginner',
    2: 'Elementary',
    3: 'Intermediate',
    4: 'Upper Intermediate',
    5: 'Advanced',
};

const difficultyColors: Record<number, string> = {
    1: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    2: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    3: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    4: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    5: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export function QuestionImportDialog({
    open,
    onOpenChange,
    levelId,
    onImport,
    isLoading,
}: QuestionImportDialogProps) {
    const [questions, setQuestions] = useState<ImportQuestionItem[]>([]);
    const [replaceExisting, setReplaceExisting] = useState(false);
    const [fileName, setFileName] = useState<string>('');
    const [parseError, setParseError] = useState<string>('');
    const [showPreview, setShowPreview] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetState = useCallback(() => {
        setQuestions([]);
        setFileName('');
        setParseError('');
        setReplaceExisting(false);
        setShowPreview(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setParseError('');
        setQuestions([]);

        try {
            const content = await file.text();
            const parsed = JSON.parse(content);

            // Handle both array format and object with questions property
            let questionsArray: ImportQuestionItem[];
            if (Array.isArray(parsed)) {
                questionsArray = parsed;
            } else if (parsed.questions && Array.isArray(parsed.questions)) {
                questionsArray = parsed.questions;
            } else {
                throw new Error('Invalid format: Expected an array of questions or an object with a "questions" property');
            }

            // Validate that we have at least one question
            if (questionsArray.length === 0) {
                throw new Error('No questions found in the file');
            }

            // Basic validation of each question
            const validatedQuestions = questionsArray.map((q, index) => {
                if (!q.text) {
                    throw new Error(`Question ${index + 1}: Missing "text" property`);
                }
                if (!q.correctAnswer) {
                    throw new Error(`Question ${index + 1}: Missing "correctAnswer" property`);
                }
                if (q.type === undefined || q.type === null) {
                    // Default to multiple-choice if type not specified
                    q.type = 'multiple-choice';
                }
                return q as ImportQuestionItem;
            });

            setQuestions(validatedQuestions);
            setShowPreview(true);
            toast.success(`Parsed ${validatedQuestions.length} questions successfully`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to parse JSON file';
            setParseError(errorMessage);
            toast.error('Failed to parse file');
        }
    };

    const handleImport = () => {
        if (questions.length === 0) {
            toast.error('No questions to import');
            return;
        }

        onImport({
            levelId,
            replaceExisting,
            questions,
        });
    };

    const handleClose = (open: boolean) => {
        if (!open) {
            resetState();
        }
        onOpenChange(open);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileJson className="h-5 w-5" />
                        Import Questions from JSON
                    </DialogTitle>
                    <DialogDescription>
                        Upload a JSON file containing questions to import into the selected level.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden space-y-4">
                    {/* File Upload Section */}
                    <div className="space-y-3">
                        <div
                            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept=".json"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                            <p className="text-sm font-medium">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                JSON files only
                            </p>
                        </div>

                        {fileName && (
                            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                <div className="flex items-center gap-2">
                                    <FileJson className="h-4 w-4" />
                                    <span className="text-sm font-medium">{fileName}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={resetState}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        {parseError && (
                            <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{parseError}</span>
                            </div>
                        )}
                    </div>

                    {/* Preview Section */}
                    {questions.length > 0 && (
                        <Card>
                            <CardHeader className="py-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        Preview ({questions.length} questions)
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowPreview(!showPreview)}
                                    >
                                        {showPreview ? 'Hide' : 'Show'} Preview
                                    </Button>
                                </div>
                            </CardHeader>
                            {showPreview && (
                                <CardContent className="pt-0">
                                    <ScrollArea className="h-[300px]">
                                        <div className="space-y-3">
                                            {questions.map((q, index) => (
                                                <div
                                                    key={index}
                                                    className="p-3 border rounded-lg space-y-2"
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1">
                                                            <p className="font-medium text-sm">
                                                                {index + 1}. {q.text}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                Answer: <span className="font-medium text-green-600 dark:text-green-400">{q.correctAnswer}</span>
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col gap-1 items-end">
                                                            <Badge variant="outline" className="text-xs">
                                                                {questionTypeLabels[q.type] || 'Unknown'}
                                                            </Badge>
                                                            {q.difficulty !== undefined && (
                                                                <Badge className={`text-xs ${difficultyColors[q.difficulty] || ''}`}>
                                                                    {difficultyLabels[q.difficulty] || 'Unknown'}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {q.options && q.options.length > 0 && (
                                                        <div className="flex flex-wrap gap-1">
                                                            {q.options.map((opt, optIndex) => (
                                                                <Badge
                                                                    key={optIndex}
                                                                    variant={opt === q.correctAnswer ? 'primary' : 'secondary'}
                                                                    className="text-xs"
                                                                >
                                                                    {opt}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            )}
                        </Card>
                    )}

                    {/* Options */}
                    {questions.length > 0 && (
                        <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                            <Checkbox
                                id="replace-existing"
                                checked={replaceExisting}
                                onCheckedChange={(checked) => setReplaceExisting(checked === true)}
                            />
                            <Label
                                htmlFor="replace-existing"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Replace existing questions
                            </Label>
                            <span className="text-xs text-muted-foreground">
                                (deletes current questions before import)
                            </span>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => handleClose(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleImport}
                        disabled={questions.length === 0 || isLoading}
                    >
                        {isLoading ? (
                            'Importing...'
                        ) : (
                            <>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Import {questions.length} Questions
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
