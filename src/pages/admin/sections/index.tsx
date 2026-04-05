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
import { Section } from '@/models/content.model';
import { FolderKanban, Plus, Search } from 'lucide-react';
import { getPlanDisplayName } from '@/lib/utils';
import {
  useAllSections,
  useCreateSection,
  useDeleteSection,
  useUpdateSection,
} from '@/hooks/admin/use-admin-sections';
import { CreateSectionRequest } from '@/services/admin/section.service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SectionFormDialog } from '@/components/admin/section-form-dialog';
import { ContentLoader } from '@/components/common/content-loader';

export function AdminSectionsPage() {
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);

  const { data: sections, isLoading } = useAllSections();
  const { mutate: createSection, isPending: isCreating } = useCreateSection();
  const { mutate: updateSection, isPending: isUpdating } = useUpdateSection();
  const { mutate: deleteSection, isPending: isDeleting } = useDeleteSection();

  const handleCreate = () => {
    setEditingSection(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (section: Section) => {
    setEditingSection(section);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: CreateSectionRequest) => {
    if (editingSection) {
      // Update existing section
      updateSection(
        { id: editingSection.id, ...data },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setEditingSection(null);
          },
        },
      );
    } else {
      // Create new section
      createSection(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setSectionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (sectionToDelete) {
      deleteSection(sectionToDelete, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSectionToDelete(null);
        },
      });
    }
  };

  // Filter sections based on search
  const filteredSections = sections?.filter(
    (section) =>
      section.title.toLowerCase().includes(search.toLowerCase()) ||
      section.description?.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return <ContentLoader className="min-h-[400px]" />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FolderKanban className="h-8 w-8" />
            Manage Sections
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage learning sections
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New Section
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sections..."
              value={search}
              onChange={(value) => setSearch(value || '')}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sections Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sections ({filteredSections?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSections && filteredSections.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Levels</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSections.map((section) => (
                  <TableRow key={section.id}>
                    <TableCell className="font-medium">
                      {section.order}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {section.title}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {section.description || 'No description'}
                    </TableCell>
                    <TableCell>
                      {section.levels?.length ?? 0}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={section.isFreeAccess ? 'secondary' : 'primary'}
                      >
                        {getPlanDisplayName(section.requiredPlan)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={section.isActive ? 'success' : 'secondary'}
                      >
                        {section.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(section)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(section.id)}
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
              <FolderKanban className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>
                {search
                  ? 'No sections found matching your search'
                  : 'No sections yet'}
              </p>
              {!search && (
                <Button className="mt-4" onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Section
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <SectionFormDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingSection(null);
        }}
        onSubmit={handleSubmit}
        section={editingSection}
        isLoading={isCreating || isUpdating}
        allSections={sections || []}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Section</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this section? This action cannot be undone.
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
