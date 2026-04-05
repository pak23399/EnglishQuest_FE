import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Difficulty, QuestionType } from '@/models/quiz.model';
import { Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useQuestionById } from '@/hooks/admin/use-admin-questions';
import { QuestionOption } from '@/services/admin/question.service';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ContentLoader } from '@/components/common/content-loader';

// TypeData for pattern-based questions
interface TypeData {
  pattern?: string;
  baseSentence?: string;
  exampleSentence?: string;
}

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
  typeData?: TypeData;
}

interface QuestionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: QuestionFormData) => void;
  questionId?: string | null;
  levelId: string;
  isLoading?: boolean;
}

// Dynamic question type options from enum
const questionTypeOptions = [
  { value: QuestionType.MultipleChoice, label: 'Multiple Choice' },
  { value: QuestionType.FillInTheBlank, label: 'Fill in the Blank' },
  { value: QuestionType.Meaning, label: 'Meaning' },
  { value: QuestionType.CorrectSentence, label: 'Correct Sentence' },
  { value: QuestionType.Pattern, label: 'Pattern' },
  { value: QuestionType.Listening, label: 'Listening' },
  { value: QuestionType.TrueFalse, label: 'True/False' },
  { value: QuestionType.Matching, label: 'Matching' },
  { value: QuestionType.Ordering, label: 'Ordering' },
];

// Dynamic difficulty options
const difficultyOptions = [
  { value: Difficulty.Beginner, label: 'Beginner' },
  { value: Difficulty.Intermediate, label: 'Intermediate' },
  { value: Difficulty.Advanced, label: 'Advanced' },
];

export function QuestionFormDialog({
  open,
  onOpenChange,
  onSubmit,
  questionId,
  levelId,
  isLoading = false,
}: QuestionFormDialogProps) {
  const intl = useIntl();
  // Fetch question data if editing
  const { data: question, isLoading: isFetchingQuestion } = useQuestionById(
    questionId || null,
  );
  const form = useForm<QuestionFormData>({
    defaultValues: {
      levelId,
      type: QuestionType.MultipleChoice,
      text: '',
      correctAnswer: '',
      explanation: '',
      difficulty: Difficulty.Beginner,
      order: 1,
      points: 10,
      options: [
        { text: '', isCorrect: false, mediaUrl: null, explanation: null },
        { text: '', isCorrect: false, mediaUrl: null, explanation: null },
      ],
      audioUrl: null,
      imageUrl: null,
      videoUrl: null,
      typeData: {},
    },
  });

  useEffect(() => {
    if (question) {
      // Transform options from API (string[] or QuestionOption[]) to QuestionOption[]
      const transformedOptions =
        question.options && question.options.length > 0
          ? question.options.map((opt) => {
            // If it's already a QuestionOption object, use it
            if (typeof opt === 'object' && 'text' in opt) {
              return opt;
            }
            // If it's a string, convert it to QuestionOption
            return {
              text: opt as string,
              isCorrect: false,
              mediaUrl: null,
              explanation: null,
            };
          })
          : [
            { text: '', isCorrect: false, mediaUrl: null, explanation: null },
            { text: '', isCorrect: false, mediaUrl: null, explanation: null },
          ];

      // Transform typeData from API (with PascalCase) to form (camelCase)
      // API may return empty objects {} instead of strings, so we check typeof
      const td = question.typeData || {};
      const transformedTypeData: TypeData = {
        pattern: typeof td.Pattern === 'string' ? td.Pattern : (typeof td.pattern === 'string' ? td.pattern : ''),
        baseSentence: typeof td.BaseSentence === 'string' ? td.BaseSentence : (typeof td.baseSentence === 'string' ? td.baseSentence : ''),
        exampleSentence: typeof td.ExampleSentence === 'string' ? td.ExampleSentence : (typeof td.exampleSentence === 'string' ? td.exampleSentence : ''),
      };

      form.reset({
        levelId: question.levelId,
        type: question.type,
        text: question.text,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation || '',
        difficulty: question.difficulty,
        order: question.order,
        points: question.points || 10,
        options: transformedOptions,
        audioUrl: question.audioUrl || null,
        imageUrl: question.imageUrl || null,
        videoUrl: question.videoUrl || null,
        typeData: transformedTypeData,
      });
    } else {
      form.reset({
        levelId,
        type: QuestionType.MultipleChoice,
        text: '',
        correctAnswer: '',
        explanation: '',
        difficulty: Difficulty.Beginner,
        order: 1,
        points: 10,
        options: [
          { text: '', isCorrect: false, mediaUrl: null, explanation: null },
          { text: '', isCorrect: false, mediaUrl: null, explanation: null },
        ],
        audioUrl: null,
        imageUrl: null,
        videoUrl: null,
        typeData: {},
      });
    }
  }, [question, levelId, form]);

  const options = form.watch('options');
  const questionType = form.watch('type');
  const isPatternType = questionType === QuestionType.Pattern;

  const addOption = () => {
    form.setValue('options', [
      ...options,
      { text: '', isCorrect: false, mediaUrl: null, explanation: null },
    ]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      form.setValue(
        'options',
        options.filter((_: QuestionOption, i: number) => i !== index),
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {questionId ? 'Edit Question' : 'Create New Question'}
          </DialogTitle>
        </DialogHeader>

        {isFetchingQuestion ? (
          <ContentLoader className="min-h-[200px]" />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Question Type</FormLabel>
                      <Select
                        value={String(field.value)}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full" size="lg">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {questionTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={String(option.value)}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Difficulty */}
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Difficulty</FormLabel>
                      <Select
                        value={String(field.value)}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full" size="lg">
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {difficultyOptions.map((option) => (
                            <SelectItem key={option.value} value={String(option.value)}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                        placeholder="What is the correct answer?"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        placeholder="The correct answer"
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
                    <FormLabel>Explanation (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="Explain why this is the correct answer"
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pattern Type Data - Only shown for Pattern question type */}
              {isPatternType && (
                <div className="space-y-4 p-4 border rounded-md bg-muted/30">
                  <FormLabel className="text-base font-medium">
                    {intl.formatMessage({ id: 'admin.question.patternTypeData', defaultMessage: 'Pattern Type Data' })}
                  </FormLabel>

                  {/* Pattern */}
                  <FormField
                    control={form.control}
                    name="typeData.pattern"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {intl.formatMessage({ id: 'admin.question.pattern', defaultMessage: 'Pattern Sentence' })}
                        </FormLabel>
                        <FormControl>
                          <Input
                            value={field.value || ''}
                            onChange={field.onChange}
                            placeholder={intl.formatMessage({ id: 'admin.question.patternPlaceholder', defaultMessage: 'e.g., They ___ students.' })}
                          />
                        </FormControl>
                        <p className="text-sm text-muted-foreground">
                          {intl.formatMessage({ id: 'admin.question.patternHint', defaultMessage: 'Use ___ to mark the blank position' })}
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Base Sentence */}
                  <FormField
                    control={form.control}
                    name="typeData.baseSentence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {intl.formatMessage({ id: 'admin.question.baseSentence', defaultMessage: 'Base Sentence' })}
                        </FormLabel>
                        <FormControl>
                          <Input
                            value={field.value || ''}
                            onChange={field.onChange}
                            placeholder={intl.formatMessage({ id: 'admin.question.baseSentencePlaceholder', defaultMessage: 'e.g., He is a teacher.' })}
                          />
                        </FormControl>
                        <p className="text-sm text-muted-foreground">
                          {intl.formatMessage({ id: 'admin.question.baseSentenceHint', defaultMessage: 'The base sentence to demonstrate the pattern' })}
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Example Sentence */}
                  <FormField
                    control={form.control}
                    name="typeData.exampleSentence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {intl.formatMessage({ id: 'admin.question.exampleSentence', defaultMessage: 'Example Sentence' })}
                        </FormLabel>
                        <FormControl>
                          <Input
                            value={field.value || ''}
                            onChange={field.onChange}
                            placeholder={intl.formatMessage({ id: 'admin.question.exampleSentencePlaceholder', defaultMessage: 'e.g., She is a doctor.' })}
                          />
                        </FormControl>
                        <p className="text-sm text-muted-foreground">
                          {intl.formatMessage({ id: 'admin.question.exampleSentenceHint', defaultMessage: 'An example sentence following the same pattern' })}
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Options */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel>Answer Options *</FormLabel>
                  <Button type="button" size="sm" onClick={addOption}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Option
                  </Button>
                </div>

                <div className="space-y-3 border rounded-md p-4">
                  {options.map((option: QuestionOption, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={option.isCorrect}
                        onChange={(e) => {
                          const newOptions = [...options];
                          newOptions[index] = {
                            ...newOptions[index],
                            isCorrect: e.target.checked,
                          };
                          form.setValue('options', newOptions);
                        }}
                        className="h-4 w-4"
                      />
                      <Input
                        value={option.text}
                        onChange={(value) => {
                          const newOptions = [...options];
                          newOptions[index] = {
                            ...newOptions[index],
                            text: value || '',
                          };
                          form.setValue('options', newOptions);
                        }}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1"
                      />
                      {options.length > 2 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeOption(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Check the box for correct options
                </p>
              </div>

              {/* Media URLs */}
              <div className="space-y-2">
                <FormLabel>Media (Optional)</FormLabel>
                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="audioUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            value={field.value || ''}
                            onChange={field.onChange}
                            placeholder="Audio URL"
                            type="url"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            value={field.value || ''}
                            onChange={field.onChange}
                            placeholder="Image URL"
                            type="url"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            value={field.value || ''}
                            onChange={field.onChange}
                            placeholder="Video URL"
                            type="url"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Order */}
                <FormField
                  control={form.control}
                  name="order"
                  rules={{
                    required: 'Order is required',
                    min: { value: 1, message: 'Order must be at least 1' },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Display Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value}
                          onChange={(value) =>
                            field.onChange(value ? Number(value) : 1)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Points */}
                <FormField
                  control={form.control}
                  name="points"
                  rules={{
                    required: 'Points is required',
                    min: { value: 1, message: 'Points must be at least 1' },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Points</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value}
                          onChange={(value) =>
                            field.onChange(value ? Number(value) : 10)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? 'Saving...'
                    : questionId
                      ? 'Update Question'
                      : 'Create Question'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog >
  );
}
