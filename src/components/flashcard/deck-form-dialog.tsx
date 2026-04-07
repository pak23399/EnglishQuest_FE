import { useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Loader2, FolderPlus } from 'lucide-react';
import {
    FlashcardDeck,
    CreateDeckRequest,
    UpdateDeckRequest,
} from '@/models/flashcard.model';
import { useCreateDeck, useUpdateDeck } from '@/hooks/use-flashcard';
import { deckFormSchema, DeckFormValues } from '@/schemas/flashcard/flashcard.schema';

interface DeckFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    deck?: FlashcardDeck | null;
    onSuccess?: () => void;
}

export function DeckFormDialog({
    open,
    onOpenChange,
    deck,
    onSuccess,
}: DeckFormDialogProps) {
    const intl = useIntl();
    const isEditing = !!deck;
    const createDeck = useCreateDeck();
    const updateDeck = useUpdateDeck();

    const form = useForm<DeckFormValues>({
        resolver: zodResolver(deckFormSchema),
        defaultValues: {
            title: '',
            description: '',
            imageUrl: '',
            difficulty: 0,
            isPublic: false,
        },
    });

    // Reset form when deck changes
    useEffect(() => {
        if (deck) {
            form.reset({
                title: deck.title,
                description: deck.description || '',
                imageUrl: deck.imageUrl || '',
                difficulty: deck.difficulty,
                isPublic: deck.isPublic,
            });
        } else {
            form.reset({
                title: '',
                description: '',
                imageUrl: '',
                difficulty: 0,
                isPublic: false,
            });
        }
    }, [deck, form]);

    const onSubmit = async (values: DeckFormValues) => {
        try {
            if (isEditing && deck) {
                await updateDeck.mutateAsync({
                    id: deck.id,
                    ...values,
                    imageUrl: values.imageUrl || undefined,
                    description: values.description || undefined,
                } as UpdateDeckRequest);
            } else {
                await createDeck.mutateAsync({
                    ...values,
                    imageUrl: values.imageUrl || undefined,
                    description: values.description || undefined,
                } as CreateDeckRequest);
            }
            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            console.error('Failed to save deck:', error);
        }
    };

    const isLoading = createDeck.isPending || updateDeck.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FolderPlus className="h-5 w-5" />
                        {isEditing ? intl.formatMessage({ id: 'FLASHCARD.FORM.EDIT_DECK' }) : intl.formatMessage({ id: 'FLASHCARD.FORM.CREATE_DECK' })}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel required>{intl.formatMessage({ id: 'FLASHCARD.FORM.TITLE' })}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={intl.formatMessage({ id: 'FLASHCARD.FORM.TITLE_PLACEHOLDER' })}
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{intl.formatMessage({ id: 'FLASHCARD.FORM.DESCRIPTION' })}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={intl.formatMessage({ id: 'FLASHCARD.FORM.DESCRIPTION_PLACEHOLDER' })}
                                            rows={3}
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
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{intl.formatMessage({ id: 'FLASHCARD.FORM.COVER_IMAGE_URL' })}</FormLabel>
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
                                            <SelectItem value="0">{intl.formatMessage({ id: 'FLASHCARD.BEGINNER' })}</SelectItem>
                                            <SelectItem value="1">{intl.formatMessage({ id: 'FLASHCARD.INTERMEDIATE' })}</SelectItem>
                                            <SelectItem value="2">{intl.formatMessage({ id: 'FLASHCARD.ADVANCED' })}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isPublic"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <FormLabel>{intl.formatMessage({ id: 'FLASHCARD.FORM.MAKE_PUBLIC' })}</FormLabel>
                                        <p className="text-sm text-muted-foreground">
                                            {intl.formatMessage({ id: 'FLASHCARD.FORM.PUBLIC_DESC' })}
                                        </p>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
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
                                {isEditing ? intl.formatMessage({ id: 'FLASHCARD.FORM.SAVE_CHANGES' }) : intl.formatMessage({ id: 'FLASHCARD.CREATE_DECK' })}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
