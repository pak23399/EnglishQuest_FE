import { MenuConfig } from '@/config/types';
import { Home, BookOpen, Trophy, TrendingUp, FolderKanban, Layers, HelpCircle, FileText, Shield } from 'lucide-react';

export const ENGLISHQUEST_MENU_SIDEBAR: MenuConfig = [
    {
        title: 'MENU.HOME',
        path: '/dashboard',
        icon: Home,
    },
    {
        heading: 'MENU.LEARNING',
    },
    {
        title: 'MENU.LEARNING',
        icon: BookOpen,
        children: [
            {
                title: 'MENU.FLASHCARDS',
                path: '/flashcards',
                icon: BookOpen,
            },
            {
                title: 'MENU.EXAM_MODE',
                path: '/exam',
                icon: FileText,
            },
            {
                title: 'MENU.MY_PROGRESS',
                path: '/progress',
                icon: TrendingUp,
            },
        ],
    },
    {
        heading: 'MENU.COMMUNITY',
    },
    {
        title: 'MENU.LEADERBOARD',
        path: '/leaderboard',
        icon: Trophy,
    }
];

// Admin menu items (conditionally shown)
export const ADMIN_MENU_ITEMS: MenuConfig = [
    {
        heading: 'MENU.ADMIN',
    },
    {
        title: 'MENU.ADMIN',
        path: '/admin',
        icon: Shield,
        children: [
            {
                title: 'MENU.MANAGE_SECTIONS',
                path: '/admin/sections',
                icon: FolderKanban,
            },
            {
                title: 'MENU.MANAGE_LEVELS',
                path: '/admin/levels',
                icon: Layers,
            },
            {
                title: 'MENU.MANAGE_QUESTIONS',
                path: '/admin/questions',
                icon: HelpCircle,
            },
            {
                title: 'MENU.MANAGE_EXAMS',
                path: '/admin/exams',
                icon: FileText,
            },
        ],
    },
];