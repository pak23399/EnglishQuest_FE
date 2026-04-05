import { useEffect } from 'react';
import { Section } from '@/models/content.model';
import { useForm } from 'react-hook-form';
import { CreateSectionRequest } from '@/services/admin/section.service';
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

interface SectionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateSectionRequest) => void;
  section?: Section | null;
  isLoading?: boolean;
  allSections?: Section[];
}

export function SectionFormDialog({
  open,
  onOpenChange,
  onSubmit,
  section,
  isLoading = false,
  allSections = [],
}: SectionFormDialogProps) {
  const form = useForm<CreateSectionRequest>({
    defaultValues: {
      title: '',
      description: '',
      order: allSections.length + 1,
      imageUrl: null,
      iconUrl: null,
      requiredPlan: 0,
      isFreeAccess: true,
      prerequisiteIds: [],
      estimatedMinutes: 60,
    },
  });

  // Auto-update fields when section changes
  useEffect(() => {
    if (section) {
      form.reset({
        title: section.title,
        description: section.description || '',
        order: section.order,
        imageUrl: section.imageUrl,
        iconUrl: section.iconUrl,
        requiredPlan: section.requiredPlan,
        isFreeAccess: section.isFreeAccess,
        prerequisiteIds: section.prerequisiteIds || [],
        estimatedMinutes: section.estimatedMinutes || 60,
      });
    } else {
      form.reset({
        title: '',
        description: '',
        order: allSections.length + 1,
        imageUrl: null,
        iconUrl: null,
        requiredPlan: 0,
        isFreeAccess: true,
        prerequisiteIds: [],
        estimatedMinutes: 60,
      });
    }
  }, [section, allSections.length, form]);

  const isFreeAccess = form.watch('isFreeAccess');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {section ? 'Edit Section' : 'Create New Section'}
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
                      placeholder="e.g., Basics, Greetings & Introductions"
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
              rules={{ required: 'Description is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="Learn simple everyday words and phrases to get started with English"
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

              {/* Estimated Time */}
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
            </div>

            {/* Free Access */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFreeAccess"
                checked={isFreeAccess}
                onCheckedChange={(checked) => {
                  form.setValue('isFreeAccess', checked as boolean);
                  if (checked) {
                    form.setValue('requiredPlan', 0);
                  }
                }}
              />
              <FormLabel htmlFor="isFreeAccess" className="cursor-pointer">
                Free Access (All users can access)
              </FormLabel>
            </div>

            {/* Required Plan (only if not free) */}
            {!isFreeAccess && (
              <FormField
                control={form.control}
                name="requiredPlan"
                rules={{
                  validate: (value: number) =>
                    isFreeAccess ||
                    value > 0 ||
                    'Required plan must be set for paid content',
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Required Plan</FormLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Free</SelectItem>
                        <SelectItem value="1">Support Plan</SelectItem>
                        <SelectItem value="2">Premium Plan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Prerequisites */}
            <div className="space-y-2">
              <FormLabel>Prerequisites (Optional)</FormLabel>
              <p className="text-sm text-muted-foreground">
                Sections that must be completed first
              </p>
              <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
                {allSections
                  .filter((s) => !section || s.id !== section.id)
                  .map((s) => (
                    <div key={s.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`prereq-${s.id}`}
                        checked={form.watch('prerequisiteIds')?.includes(s.id)}
                        onCheckedChange={(checked) => {
                          const current = form.watch('prerequisiteIds') || [];
                          if (checked) {
                            form.setValue('prerequisiteIds', [...current, s.id]);
                          } else {
                            form.setValue(
                              'prerequisiteIds',
                              current.filter((id: string) => id !== s.id),
                            );
                          }
                        }}
                      />
                      <FormLabel
                        htmlFor={`prereq-${s.id}`}
                        className="cursor-pointer text-sm"
                      >
                        {s.order}. {s.title}
                      </FormLabel>
                    </div>
                  ))}
                {allSections.filter((s) => !section || s.id !== section.id)
                  .length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No other sections available
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
                  : section
                    ? 'Update Section'
                    : 'Create Section'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
