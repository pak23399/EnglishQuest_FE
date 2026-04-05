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
import { Difficulty, Level } from '@/models/content.model';
import { Layers, Plus, Search } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useCreateLevel,
  useDeleteLevel,
  useLevelsBySection,
  useUpdateLevel,
} from '@/hooks/admin/use-admin-levels';
import { useAllSections } from '@/hooks/admin/use-admin-sections';
import { CreateLevelRequest } from '@/services/admin/level.service';
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
import { LevelFormDialog } from '@/components/admin/level-form-dialog';
import { ContentLoader } from '@/components/common/content-loader';

// Type helper for API response that may have fields at root level
type LevelWithFlatFields = Level & {
  totalQuestions?: number;
  xpReward?: number;
  passingScore?: number;
  estimatedMinutes?: number;
};

const difficultyLabels = {
  [Difficulty.Beginner]: 'Beginner',
  [Difficulty.Intermediate]: 'Intermediate',
  [Difficulty.Advanced]: 'Advanced',
};

const difficultyColors = {
  [Difficulty.Beginner]: 'bg-green-500/10 text-green-700',
  [Difficulty.Intermediate]: 'bg-yellow-500/10 text-yellow-700',
  [Difficulty.Advanced]: 'bg-red-500/10 text-red-700',
};

export function AdminLevelsPage() {
  const { sectionId } = useParams<{ sectionId?: string }>();
  const [selectedSectionId, setSelectedSectionId] = useState(sectionId || '');
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [levelToDelete, setLevelToDelete] = useState<string | null>(null);

  const { data: sections } = useAllSections();
  const { data: levels, isLoading } = useLevelsBySection(selectedSectionId);
  const { mutate: createLevel, isPending: isCreating } = useCreateLevel();
  const { mutate: updateLevel, isPending: isUpdating } = useUpdateLevel();
  const { mutate: deleteLevel, isPending: isDeleting } = useDeleteLevel();

  const handleCreate = () => {
    setSelectedLevelId(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (level: Level) => {
    setSelectedLevelId(level.id);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setLevelToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (levelToDelete) {
      deleteLevel(levelToDelete, {
        onSuccess: () => {
          toast.success('Level deleted successfully');
          setDeleteDialogOpen(false);
          setLevelToDelete(null);
        },
        onError: () => {
          toast.error('Failed to delete level');
        },
      });
    }
  };

  const handleSubmit = (data: CreateLevelRequest) => {
    if (selectedLevelId) {
      // Update existing level
      updateLevel(
        { id: selectedLevelId, ...data },
        {
          onSuccess: () => {
            toast.success('Level updated successfully');
            setIsDialogOpen(false);
            setSelectedLevelId(null);
          },
          onError: () => {
            toast.error('Failed to update level');
          },
        },
      );
    } else {
      // Create new level
      createLevel(data, {
        onSuccess: () => {
          toast.success('Level created successfully');
          setIsDialogOpen(false);
        },
        onError: () => {
          toast.error('Failed to create level');
        },
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Layers className="h-8 w-8" />
            Manage Levels
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage levels within sections
          </p>
        </div>
        <Button disabled={!selectedSectionId} onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New Level
        </Button>
      </div>

      {/* Section Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Select Section
              </label>
              <Select
                value={selectedSectionId}
                onValueChange={(value) => setSelectedSectionId(value)}
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

            {selectedSectionId && (
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search levels..."
                  value={search}
                  onChange={(value) => setSearch(value || '')}
                  className="max-w-sm"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Levels Table */}
      {selectedSectionId && (
        <Card>
          <CardHeader>
            <CardTitle>Levels ({levels?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ContentLoader className="min-h-[200px]" />
            ) : levels && levels.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Questions</TableHead>
                    {/*<TableHead>XP</TableHead>*/}
                    <TableHead>Passing Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {levels.map((level) => (
                    <TableRow key={level.id}>
                      <TableCell className="font-medium">
                        {level.order}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {level.title}
                      </TableCell>
                      <TableCell>
                        <Badge className={difficultyColors[level.difficulty]}>
                          {difficultyLabels[level.difficulty]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {(level as LevelWithFlatFields).totalQuestions ||
                          level.config?.totalQuestions ||
                          0}
                      </TableCell>
                      {/*<TableCell>
                        {(level as LevelWithFlatFields).xpReward ||
                          level.config?.xpReward ||
                          0}{' '}
                        XP
                      </TableCell>*/}
                      <TableCell>
                        {(level as LevelWithFlatFields).passingScore ||
                          level.config?.passingScore ||
                          0}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={level.isActive ? 'primary' : 'secondary'}
                        >
                          {level.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(level)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(level.id)}
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
                <Layers className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No levels in this section yet</p>
                <Button className="mt-4" onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Level
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedSectionId && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center text-muted-foreground">
              <Layers className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Select a section to view and manage its levels</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Level Form Dialog */}
      <LevelFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        levelId={selectedLevelId}
        isLoading={isCreating || isUpdating}
        sectionId={selectedSectionId}
        allLevels={levels || []}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Level</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this level? This action cannot be undone.
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
