import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CreateExamRequest, ExamListItem } from '@/models/exam.model';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

interface ExamFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreateExamRequest) => void;
    exam?: ExamListItem | null;
    isLoading?: boolean;
}

export function ExamFormDialog({
    open,
    onOpenChange,
    onSubmit,
    exam,
    isLoading = false,
}: ExamFormDialogProps) {
    const form = useForm<CreateExamRequest>({
        defaultValues: {
            title: '',
            description: '',
            durationMinutes: 45,
            passingScore: 70,
            xpReward: 100,
            shuffleQuestions: true,
            shuffleOptions: true,
            maxAttempts: 0,
            scheduleStart: undefined,
            scheduleEnd: undefined,
            difficulty: 1,
            reviewSettings: {
                allowReview: true,
                showUserAnswers: true,
                showPassFail: true,
                reviewAvailableAfterMinutes: 0,
            },
        },
    });

    // Auto-update fields when exam changes
    useEffect(() => {
        if (exam) {
            form.reset({
                title: exam.title,
                description: exam.description || '',
                durationMinutes: exam.durationMinutes,
                passingScore: exam.passingScore,
                xpReward: exam.xpReward,
                shuffleQuestions: exam.shuffleQuestions,
                shuffleOptions: exam.shuffleOptions,
                maxAttempts: exam.maxAttempts,
                scheduleStart: exam.scheduleStart ? exam.scheduleStart.slice(0, 16) : undefined,
                scheduleEnd: exam.scheduleEnd ? exam.scheduleEnd.slice(0, 16) : undefined,
                difficulty: exam.difficulty,
                reviewSettings: {
                    allowReview: exam.reviewSettings?.allowReview ?? true,
                    showUserAnswers: exam.reviewSettings?.showUserAnswers ?? true,
                    showPassFail: exam.reviewSettings?.showPassFail ?? true,
                    reviewAvailableAfterMinutes: exam.reviewSettings?.reviewAvailableAfterMinutes ?? 0,
                },
            });
        } else {
            form.reset({
                title: '',
                description: '',
                durationMinutes: 45,
                passingScore: 70,
                xpReward: 100,
                shuffleQuestions: true,
                shuffleOptions: true,
                maxAttempts: 0,
                scheduleStart: undefined,
                scheduleEnd: undefined,
                difficulty: 1,
                reviewSettings: {
                    allowReview: true,
                    showUserAnswers: true,
                    showPassFail: true,
                    reviewAvailableAfterMinutes: 0,
                },
            });
        }
    }, [exam, form]);

    const shuffleQuestions = form.watch('shuffleQuestions');
    const shuffleOptions = form.watch('shuffleOptions');
    const showUserAnswers = form.watch('reviewSettings.showUserAnswers');
    const showPassFail = form.watch('reviewSettings.showPassFail');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {exam ? 'Edit Exam' : 'Create New Exam'}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Title */}
                        <FormField
                            control={form.control}
                            name="title"
                            rules={{ required: 'Title is required' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel required>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="e.g., English Proficiency Test Q1 2025"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            value={field.value || ''}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            placeholder="Comprehensive English exam covering all topics"
                                            rows={2}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            {/* Duration */}
                            <FormField
                                control={form.control}
                                name="durationMinutes"
                                rules={{
                                    required: 'Duration is required',
                                    min: { value: 1, message: 'Must be at least 1 minute' },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel required>Duration (minutes)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                value={field.value}
                                                onChange={(value) =>
                                                    field.onChange(value ? Number(value) : 45)
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Passing Score */}
                            <FormField
                                control={form.control}
                                name="passingScore"
                                rules={{
                                    required: 'Passing score is required',
                                    min: { value: 1, message: 'Must be at least 1%' },
                                    max: { value: 100, message: 'Cannot exceed 100%' },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel required>Passing Score (%)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                value={field.value}
                                                onChange={(value) =>
                                                    field.onChange(value ? Number(value) : 70)
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* XP Reward */}
                            <FormField
                                control={form.control}
                                name="xpReward"
                                rules={{
                                    required: 'XP reward is required',
                                    min: { value: 0, message: 'Cannot be negative' },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel required>XP Reward</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                value={field.value}
                                                onChange={(value) =>
                                                    field.onChange(value ? Number(value) : 100)
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Difficulty */}
                            <FormField
                                control={form.control}
                                name="difficulty"
                                rules={{ required: 'Difficulty is required' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel required>Difficulty</FormLabel>
                                        <Select
                                            value={String(field.value)}
                                            onValueChange={(value) => field.onChange(Number(value))}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select difficulty" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="1">Beginner</SelectItem>
                                                <SelectItem value="2">Intermediate</SelectItem>
                                                <SelectItem value="3">Advanced</SelectItem>
                                                <SelectItem value="4">Expert</SelectItem>
                                                <SelectItem value="5">Master</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Max Attempts */}
                        <FormField
                            control={form.control}
                            name="maxAttempts"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Max Attempts (0 = unlimited)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            value={field.value}
                                            onChange={(value) =>
                                                field.onChange(value ? Number(value) : 0)
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Schedule */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="scheduleStart"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Schedule Start (optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="datetime-local"
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="scheduleEnd"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Schedule End (optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="datetime-local"
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Shuffle Options */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="shuffleQuestions"
                                    checked={shuffleQuestions}
                                    onCheckedChange={(checked) => {
                                        form.setValue('shuffleQuestions', checked as boolean);
                                    }}
                                />
                                <FormLabel htmlFor="shuffleQuestions" className="cursor-pointer">
                                    Shuffle Questions
                                </FormLabel>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="shuffleOptions"
                                    checked={shuffleOptions}
                                    onCheckedChange={(checked) => {
                                        form.setValue('shuffleOptions', checked as boolean);
                                    }}
                                />
                                <FormLabel htmlFor="shuffleOptions" className="cursor-pointer">
                                    Shuffle Answer Options
                                </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="showUserAnswers"
                                    checked={showUserAnswers}
                                    onCheckedChange={(checked) => {
                                        form.setValue('reviewSettings.showUserAnswers', checked as boolean);
                                    }}
                                />
                                <FormLabel htmlFor="showUserAnswers" className="cursor-pointer">
                                    Show User Answers in Review
                                </FormLabel>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="showPassFail"
                                    checked={showPassFail}
                                    onCheckedChange={(checked) => {
                                        form.setValue('reviewSettings.showPassFail', checked as boolean);
                                    }}
                                />
                                <FormLabel htmlFor="showPassFail" className="cursor-pointer">
                                    Show Pass/Fail Status in Review
                                </FormLabel>
                            </div>

                            {/* Review Available After Minutes */}
                            <FormField
                                control={form.control}
                                name="reviewSettings.reviewAvailableAfterMinutes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Review Available After (minutes)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                value={field.value ?? 0}
                                                onChange={(value) =>
                                                    field.onChange(value ? Number(value) : 0)
                                                }
                                                placeholder="0 = immediately available"
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
                                    : exam
                                        ? 'Update Exam'
                                        : 'Create Exam'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
