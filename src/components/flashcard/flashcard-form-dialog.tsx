import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, X, Plus } from 'lucide-react';
import {
    Flashcard,
    CreateFlashcardRequest,
    UpdateFlashcardRequest,
} from '@/models/flashcard.model';
import { useCreateFlashcard, useUpdateFlashcard } from '@/hooks/use-flashcard';
import {
    flashcardFormSchema,
    FlashcardFormValues,
    partsOfSpeech,
} from '@/schemas/flashcard/flashcard.schema';

interface FlashcardFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    deckId: string;
    flashcard?: Flashcard | null;
    onSuccess?: () => void;
}

export function FlashcardFormDialog({
    open,
    onOpenChange,
    deckId,
    flashcard,
    onSuccess,
}: FlashcardFormDialogProps) {
    const intl = useIntl();
    const isEditing = !!flashcard;
    const createFlashcard = useCreateFlashcard();
    const updateFlashcard = useUpdateFlashcard();
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');

    const form = useForm<FlashcardFormValues>({
        resolver: zodResolver(flashcardFormSchema),
        defaultValues: {
            englishTerm: '',
            vietnameseTerm: '',
            englishExample: '',
            vietnameseExample: '',
            pronunciation: '',
            audioUrl: '',
            imageUrl: '',
            difficulty: 1,
            partOfSpeech: '',
            notes: '',
        },
    });

    // Reset form when flashcard changes
    useEffect(() => {
        if (flashcard) {
            form.reset({
                englishTerm: flashcard.englishTerm,
                vietnameseTerm: flashcard.vietnameseTerm,
                englishExample: flashcard.englishExample || '',
                vietnameseExample: flashcard.vietnameseExample || '',
                pronunciation: flashcard.pronunciation || '',
                audioUrl: flashcard.audioUrl || '',
                imageUrl: flashcard.imageUrl || '',
                difficulty: flashcard.difficulty,
                partOfSpeech: flashcard.partOfSpeech || '',
                notes: flashcard.notes || '',
            });
            setTags(flashcard.tags || []);
        } else {
            form.reset({
                englishTerm: '',
                vietnameseTerm: '',
                englishExample: '',
                vietnameseExample: '',
                pronunciation: '',
                audioUrl: '',
                imageUrl: '',
                difficulty: 1,
                partOfSpeech: '',
                notes: '',
            });
            setTags([]);
        }
    }, [flashcard, form]);

    const handleAddTag = () => {
        const trimmed = tagInput.trim().toLowerCase();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const onSubmit = async (values: FlashcardFormValues) => {
        try {
            const data = {
                ...values,
                tags: tags.length > 0 ? tags : undefined,
                englishExample: values.englishExample || undefined,
                vietnameseExample: values.vietnameseExample || undefined,
                pronunciation: values.pronunciation || undefined,
                audioUrl: values.audioUrl || undefined,
                imageUrl: values.imageUrl || undefined,
                partOfSpeech: values.partOfSpeech || undefined,
                notes: values.notes || undefined,
            };

            if (isEditing && flashcard) {
                await updateFlashcard.mutateAsync({
                    id: flashcard.id,
                    ...data,
                } as UpdateFlashcardRequest);
            } else {
                await createFlashcard.mutateAsync({
                    deckId,
                    ...data,
                } as CreateFlashcardRequest);
            }
            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            console.error('Failed to save flashcard:', error);
        }
    };

    const isLoading = createFlashcard.isPending || updateFlashcard.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        {isEditing ? intl.formatMessage({ id: 'FLASHCARD.FORM.EDIT_FLASHCARD' }) : intl.formatMessage({ id: 'FLASHCARD.FORM.CREATE_FLASHCARD' })}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* English Term */}
                        <FormField
                            control={form.control}
                            name="englishTerm"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel required>{intl.formatMessage({ id: 'FLASHCARD.FORM.ENGLISH_TERM' })}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={intl.formatMessage({ id: 'FLASHCARD.FORM.ENGLISH_TERM_PLACEHOLDER' })}
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Vietnamese Term */}
                        <FormField
                            control={form.control}
                            name="vietnameseTerm"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel required>{intl.formatMessage({ id: 'FLASHCARD.FORM.VIETNAMESE_TERM' })}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={intl.formatMessage({ id: 'FLASHCARD.FORM.VIETNAMESE_TERM_PLACEHOLDER' })}
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Pronunciation */}
                        <FormField
                            control={form.control}
                            name="pronunciation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{intl.formatMessage({ id: 'FLASHCARD.FORM.PRONUNCIATION' })}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={intl.formatMessage({ id: 'FLASHCARD.FORM.PRONUNCIATION_PLACEHOLDER' })}
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Examples */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="englishExample"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{intl.formatMessage({ id: 'FLASHCARD.FORM.ENGLISH_EXAMPLE' })}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Hello, how are you?"
                                                rows={2}
                                                value={field.value || ''}
                                                onChange={(e) => field.onChange(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="vietnameseExample"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{intl.formatMessage({ id: 'FLASHCARD.FORM.VIETNAMESE_EXAMPLE' })}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Xin chào, bạn khỏe không?"
                                                rows={2}
                                                value={field.value || ''}
                                                onChange={(e) => field.onChange(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Part of Speech & Difficulty */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="partOfSpeech"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{intl.formatMessage({ id: 'FLASHCARD.FORM.PART_OF_SPEECH' })}</FormLabel>
                                        <Select
                                            value={field.value || 'none'}
                                            onValueChange={(val) =>
                                                field.onChange(val === 'none' ? '' : val)
                                            }
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={intl.formatMessage({ id: 'FLASHCARD.FORM.SELECT' })} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">{intl.formatMessage({ id: 'FLASHCARD.FORM.NONE' })}</SelectItem>
                                                {partsOfSpeech.map((pos) => (
                                                    <SelectItem key={pos} value={pos}>
                                                        {pos.charAt(0).toUpperCase() + pos.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="difficulty"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{intl.formatMessage({ id: 'FLASHCARD.FORM.DIFFICULTY' })}</FormLabel>
                                        <Select
                                            value={String(field.value)}
                                            onValueChange={(val) => field.onChange(Number(val))}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="0">{intl.formatMessage({ id: 'FLASHCARD.FORM.EASY' })}</SelectItem>
                                                <SelectItem value="1">{intl.formatMessage({ id: 'FLASHCARD.FORM.MEDIUM' })}</SelectItem>
                                                <SelectItem value="2">{intl.formatMessage({ id: 'FLASHCARD.FORM.HARD' })}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <FormLabel>{intl.formatMessage({ id: 'FLASHCARD.FORM.TAGS' })}</FormLabel>
                            <div className="flex gap-2">
                                <Input
                                    placeholder={intl.formatMessage({ id: 'FLASHCARD.FORM.ADD_TAG' })}
                                    value={tagInput}
                                    onChange={(value) => setTagInput(value ?? '')}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddTag();
                                        }
                                    }}
                                />
                                <Button type="button" variant="outline" onClick={handleAddTag}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {tags.map((tag) => (
                                        <Badge key={tag} variant="secondary" className="gap-1">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="ml-1 hover:text-destructive"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Media URLs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="audioUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{intl.formatMessage({ id: 'FLASHCARD.FORM.AUDIO_URL' })}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="https://example.com/audio.mp3"
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
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{intl.formatMessage({ id: 'FLASHCARD.FORM.IMAGE_URL' })}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="https://example.com/image.jpg"
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Notes */}
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{intl.formatMessage({ id: 'FLASHCARD.FORM.NOTES' })}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={intl.formatMessage({ id: 'FLASHCARD.FORM.NOTES_PLACEHOLDER' })}
                                            rows={2}
                                            value={field.value || ''}
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                {intl.formatMessage({ id: 'COMMON.CANCEL' })}
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                {isEditing ? intl.formatMessage({ id: 'FLASHCARD.FORM.SAVE_CHANGES' }) : intl.formatMessage({ id: 'FLASHCARD.FORM.CREATE_FLASHCARD' })}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
