import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Search, Eye, ToggleLeft, ToggleRight, Users } from 'lucide-react';
import { CreateExamRequest, ExamListItem } from '@/models/exam.model';
import {
    useAdminExams,
    useCreateExam,
    useDeleteExam,
    useUpdateExam,
    useToggleExamActive,
} from '@/hooks/admin/use-admin-exams';
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
import { ExamFormDialog } from '@/components/admin/exam-form-dialog';
import { ContentLoader } from '@/components/common/content-loader';

const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
        case 1:
            return 'Beginner';
        case 2:
            return 'Intermediate';
        case 3:
            return 'Advanced';
        case 4:
            return 'Expert';
        case 5:
            return 'Master';
        default:
            return 'Unknown';
    }
};

const getDifficultyVariant = (difficulty: number) => {
    switch (difficulty) {
        case 1:
            return 'success';
        case 2:
            return 'secondary';
        case 3:
            return 'warning';
        case 4:
        case 5:
            return 'destructive';
        default:
            return 'secondary';
    }
};

export function AdminExamsPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingExam, setEditingExam] = useState<ExamListItem | null>(null);

    const { data: examsData, isLoading } = useAdminExams({
        page: 1,
        limit: 50,
        searchText: search || undefined,
    });

    const { mutate: createExam, isPending: isCreating } = useCreateExam();
    const { mutate: updateExam, isPending: isUpdating } = useUpdateExam();
    const { mutate: deleteExam, isPending: isDeleting } = useDeleteExam();
    const { mutate: toggleActive } = useToggleExamActive();

    const handleCreate = () => {
        setEditingExam(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (exam: ExamListItem) => {
        setEditingExam(exam);
        setIsDialogOpen(true);
    };

    const handleSubmit = (data: CreateExamRequest) => {
        if (editingExam) {
            updateExam(
                { id: editingExam.id, ...data },
                {
                    onSuccess: () => {
                        setIsDialogOpen(false);
                        setEditingExam(null);
                    },
                },
            );
        } else {
            createExam(data, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                },
            });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this exam?')) {
            deleteExam(id);
        }
    };

    const handleToggleActive = (examId: string) => {
        toggleActive(examId);
    };

    const handleViewQuestions = (examId: string) => {
        navigate(`/admin/exams/${examId}/questions`);
    };

    const formatDateTime = (dateStr?: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleString();
    };

    if (isLoading) {
        return <ContentLoader className="min-h-[400px]" />;
    }

    const exams = examsData?.items || [];

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <FileText className="h-8 w-8" />
                        Manage Exams
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Create and manage timed exams
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Exam
                </Button>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search exams..."
                            value={search}
                            onChange={(value) => setSearch(value || '')}
                            className="max-w-sm"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Exams Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Exams ({examsData?.meta?.totalItems || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    {exams.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Questions</TableHead>
                                    <TableHead>Difficulty</TableHead>
                                    <TableHead>XP</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {exams.map((exam) => (
                                    <TableRow key={exam.id}>
                                        <TableCell className="font-semibold">
                                            <div>
                                                {exam.title}
                                                {exam.scheduleStart && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {formatDateTime(exam.scheduleStart)} - {formatDateTime(exam.scheduleEnd)}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>{exam.durationMinutes} min</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {exam.totalQuestions} Questions
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getDifficultyVariant(exam.difficulty) as any}>
                                                {getDifficultyLabel(exam.difficulty)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{exam.xpReward} XP</TableCell>
                                        <TableCell>
                                            <Badge variant={exam.isActive ? 'success' : 'secondary'}>
                                                {exam.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewQuestions(exam.id)}
                                                    title="View Questions"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(`/admin/exams/${exam.id}/participants`)}
                                                    title="View Participants"
                                                >
                                                    <Users className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleToggleActive(exam.id)}
                                                    title={exam.isActive ? 'Deactivate' : 'Activate'}
                                                >
                                                    {exam.isActive ? (
                                                        <ToggleRight className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <ToggleLeft className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(exam)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(exam.id)}
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
                            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>
                                {search
                                    ? 'No exams found matching your search'
                                    : 'No exams yet'}
                            </p>
                            {!search && (
                                <Button className="mt-4" onClick={handleCreate}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create First Exam
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Form Dialog */}
            <ExamFormDialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) setEditingExam(null);
                }}
                onSubmit={handleSubmit}
                exam={editingExam}
                isLoading={isCreating || isUpdating}
            />
        </div>
    );
}
