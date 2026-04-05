import { useEffect } from 'react';
import { Difficulty, Level } from '@/models/content.model';
import { useForm } from 'react-hook-form';
import { useLevelById } from '@/hooks/admin/use-admin-levels';
import { CreateLevelRequest } from '@/services/admin/level.service';
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
import { ContentLoader } from '@/components/common/content-loader';

interface LevelFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateLevelRequest) => void;
  levelId?: string | null;
  isLoading?: boolean;
  sectionId: string;
  allLevels?: Level[];
}

export function LevelFormDialog({
  open,
  onOpenChange,
  onSubmit,
  levelId,
  isLoading = false,
  sectionId,
  allLevels = [],
}: LevelFormDialogProps) {
  // Fetch level data if editing
  const { data: level, isLoading: isFetchingLevel } = useLevelById(
    levelId || null,
  );
  const form = useForm<CreateLevelRequest>({
    defaultValues: {
      sectionId,
      title: '',
      description: '',
      order: allLevels.length + 1,
      difficulty: Difficulty.Beginner,
      prerequisiteIds: [],
      estimatedMinutes: 30,
      passingScore: 70,
      totalQuestions: 10,
      xpReward: 100,
      isRandomized: true,
    },
  });

  // Auto-update fields when level changes
  useEffect(() => {
    if (level) {
      // Handle API response structure - fields may be at root level or in config
      const apiLevel = level as Level & {
        passingScore?: number;
        totalQuestions?: number;
        xpReward?: number;
        estimatedMinutes?: number;
        isRandomized?: boolean;
      };
      form.reset({
        sectionId: level.sectionId,
        title: level.title,
        description: level.description || '',
        order: level.order,
        difficulty: level.difficulty,
        prerequisiteIds: level.prerequisiteIds || [],
        estimatedMinutes:
          apiLevel.estimatedMinutes || level.config?.estimatedMinutes || 30,
        passingScore: apiLevel.passingScore || level.config?.passingScore || 70,
        totalQuestions:
          apiLevel.totalQuestions || level.config?.totalQuestions || 10,
        xpReward: apiLevel.xpReward || level.config?.xpReward || 100,
        isRandomized:
          apiLevel.isRandomized !== undefined
            ? apiLevel.isRandomized
            : level.config?.isRandomized || true,
      });
    } else {
      form.reset({
        sectionId,
        title: '',
        description: '',
        order: allLevels.length + 1,
        difficulty: Difficulty.Beginner,
        prerequisiteIds: [],
        estimatedMinutes: 30,
        passingScore: 70,
        totalQuestions: 10,
        xpReward: 100,
        isRandomized: true,
      });
    }
  }, [level, allLevels.length, sectionId, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {levelId ? 'Edit Level' : 'Create New Level'}
          </DialogTitle>
        </DialogHeader>

        {isFetchingLevel ? (
          <ContentLoader className="min-h-[200px]" />
        ) : (
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
                        placeholder="e.g., Greetings - Part 1"
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
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value || '')}
                        placeholder="Learn basic greetings and how to introduce yourself"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          <SelectItem value={String(Difficulty.Beginner)}>
                            Beginner
                          </SelectItem>
                          <SelectItem value={String(Difficulty.Intermediate)}>
                            Intermediate
                          </SelectItem>
                          <SelectItem value={String(Difficulty.Advanced)}>
                            Advanced
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Estimated Minutes */}
                <FormField
                  control={form.control}
                  name="estimatedMinutes"
                  rules={{
                    required: 'Estimated time is required',
                    min: { value: 1, message: 'Must be at least 1 minute' },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Est. Time (minutes)</FormLabel>
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

                {/* Total Questions */}
                <FormField
                  control={form.control}
                  name="totalQuestions"
                  rules={{
                    required: 'Total questions is required',
                    min: { value: 1, message: 'Must be at least 1 question' },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Total Questions</FormLabel>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
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

                {/* XP Reward */}
                <FormField
                  control={form.control}
                  name="xpReward"
                  rules={{
                    required: 'XP reward is required',
                    min: { value: 1, message: 'Must be at least 1 XP' },
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
              </div>

              {/* Randomize Questions */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isRandomized"
                  checked={form.watch('isRandomized')}
                  onCheckedChange={(checked) =>
                    form.setValue('isRandomized', checked as boolean)
                  }
                />
                <FormLabel htmlFor="isRandomized" className="cursor-pointer">
                  Randomize question order
                </FormLabel>
              </div>

              {/* Prerequisites */}
              <div className="space-y-2">
                <FormLabel>Prerequisites (Optional)</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Levels that must be completed first
                </p>
                <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
                  {allLevels
                    .filter((l) => !levelId || l.id !== levelId)
                    .map((l) => (
                      <div key={l.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`prereq-${l.id}`}
                          checked={form.watch('prerequisiteIds')?.includes(l.id)}
                          onCheckedChange={(checked) => {
                            const current = form.watch('prerequisiteIds') || [];
                            if (checked) {
                              form.setValue('prerequisiteIds', [...current, l.id]);
                            } else {
                              form.setValue(
                                'prerequisiteIds',
                                current.filter((id: string) => id !== l.id),
                              );
                            }
                          }}
                        />
                        <FormLabel
                          htmlFor={`prereq-${l.id}`}
                          className="cursor-pointer text-sm"
                        >
                          {l.order}. {l.title}
                        </FormLabel>
                      </div>
                    ))}
                  {allLevels.filter((l) => !levelId || l.id !== levelId)
                    .length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No other levels available
                      </p>
                    )}
                </div>
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
                    : levelId
                      ? 'Update Level'
                      : 'Create Level'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
