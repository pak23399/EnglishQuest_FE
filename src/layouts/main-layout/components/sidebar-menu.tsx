// 'use client';

// import { JSX, useCallback, useMemo } from 'react';
// import { useAuth } from '@/auth/context/auth-context';
// import { ENGLISHQUEST_MENU_SIDEBAR, ADMIN_MENU_ITEMS } from '@/layouts/main-layout/menus/englishquest-menu.config';
// import { UserRole } from '@/models/user.model';
// import { Link, useLocation } from 'react-router-dom';
// import { MenuConfig, MenuItem } from '@/config/types';
// import {
//   AccordionMenu,
//   AccordionMenuClassNames,
//   AccordionMenuGroup,
//   AccordionMenuItem,
//   AccordionMenuLabel,
//   AccordionMenuSub,
//   AccordionMenuSubContent,
//   AccordionMenuSubTrigger,
// } from '@/components/ui/accordion-menu';
// import { useIntl } from 'react-intl';
// import { Badge } from 'lucide-react';
// export function SidebarMenu() {
//   const intl = useIntl();
//   const { pathname } = useLocation();
//   const { isAuthenticated, user } = useAuth();

//   // Combine base menu with admin menu items if user is admin
//   const menuConfig = useMemo(() => {
//     if (user?.role === UserRole.Admin) {
//       const combined = [...ENGLISHQUEST_MENU_SIDEBAR, ...ADMIN_MENU_ITEMS];
//       return combined;
//     }
//     return ENGLISHQUEST_MENU_SIDEBAR;
//   }, [user?.role]);

//   // Memoize matchPath to prevent unnecessary re-renders
//   const matchPath = useCallback(
//     (path: string): boolean =>
//       path === pathname || (path.length > 1 && pathname.startsWith(path)),
//     [pathname],
//   );

//   // Global classNames for consistent styling
//   const classNames: AccordionMenuClassNames = {
//     root: 'space-y-3',
//     group: 'gap-px',
//     label:
//       'uppercase text-xs font-medium text-muted-foreground/70 pt-2.25 pb-px',
//     separator: '',
//     item: 'h-8 hover:bg-transparent text-accent-foreground hover:text-primary data-[selected=true]:text-primary data-[selected=true]:bg-muted data-[selected=true]:font-medium',
//     sub: '',
//     subTrigger:
//       'h-8 hover:bg-transparent text-accent-foreground hover:text-primary data-[selected=true]:text-primary data-[selected=true]:bg-muted data-[selected=true]:font-medium',
//     subContent: 'py-0',
//     indicator: '',
//   };

//   const buildMenu = (items: MenuConfig): JSX.Element[] => {
//     return items.map((item: MenuItem, index: number) => {
//       if (item.heading) {
//         return buildMenuHeading(item, index);
//       } else if (item.disabled) {
//         return buildMenuItemRootDisabled(item, index);
//       } else {
//         return buildMenuItemRoot(item, index);
//       }
//     });
//   };

//   const buildMenuItemRoot = (item: MenuItem, index: number): JSX.Element => {
//     const title = item.title ? intl.formatMessage({ id: item.title }) : '';
//     if (item.children) {
//       return (
//         <AccordionMenuSub key={index} value={item.path || `root-${index}`}>
//           <AccordionMenuSubTrigger className="text-sm font-medium">
//             {item.icon && <item.icon data-slot="accordion-menu-icon" />}
//             <span data-slot="accordion-menu-title">{title}</span>
//           </AccordionMenuSubTrigger>
//           <AccordionMenuSubContent
//             type="single"
//             collapsible
//             parentValue={item.path || `root-${index}`}
//             className="ps-6"
//           >
//             <AccordionMenuGroup>
//               {buildMenuItemChildren(item.children, 1)}
//             </AccordionMenuGroup>
//           </AccordionMenuSubContent>
//         </AccordionMenuSub>
//       );
//     } else {
//       return (
//         <AccordionMenuItem
//           key={index}
//           value={item.path || ''}
//           className="text-sm font-medium"
//         >
//           <Link to={item.path || '#'} className="flex items-center grow gap-2">
//             {item.icon && <item.icon data-slot="accordion-menu-icon" />}
//             <span data-slot="accordion-menu-title">{title}</span>
//           </Link>
//         </AccordionMenuItem>
//       );
//     }
//   };

//   const buildMenuItemRootDisabled = (
//     item: MenuItem,
//     index: number,
//   ): JSX.Element => {
//     const title = item.title ? intl.formatMessage({ id: item.title }) : '';
//     return (
//       <AccordionMenuItem
//         key={index}
//         value={`disabled-${index}`}
//         className="text-sm font-medium"
//       >
//         {item.icon && <item.icon data-slot="accordion-menu-icon" />}
//         <span data-slot="accordion-menu-title">{title}</span>
//         {item.disabled && (
//           <Badge variant="secondary" size="sm" className="ms-auto me-[-10px]">
//             Soon
//           </Badge>
//         )}
//       </AccordionMenuItem>
//     );
//   };

//   const buildMenuItemChildren = (
//     items: MenuConfig,
//     level: number = 0,
//   ): JSX.Element[] => {
//     return items.map((item: MenuItem, index: number) => {
//       if (item.disabled) {
//         return buildMenuItemChildDisabled(item, index, level);
//       } else {
//         return buildMenuItemChild(item, index, level);
//       }
//     });
//   };

//   const buildMenuItemChild = (
//     item: MenuItem,
//     index: number,
//     level: number = 0,
//   ): JSX.Element => {
//     const title = item.title ? intl.formatMessage({ id: item.title }) : '';
//     if (item.children) {
//       return (
//         <AccordionMenuSub
//           key={index}
//           value={item.path || `child-${level}-${index}`}
//         >
//           <AccordionMenuSubTrigger className="text-[13px]">
//             {title}
//           </AccordionMenuSubTrigger>
//           <AccordionMenuSubContent
//             type="single"
//             collapsible
//             parentValue={item.path || `child-${level}-${index}`}
//             className="ps-4"
//           >
//             <AccordionMenuGroup>
//               {buildMenuItemChildren(item.children, level + 1)}
//             </AccordionMenuGroup>
//           </AccordionMenuSubContent>
//         </AccordionMenuSub>
//       );
//     } else {
//       return (
//         <AccordionMenuItem
//           key={index}
//           value={item.path || ''}
//           className="text-[13px] truncate"
//         >
//           <Link to={item.path || '#'}>{title}</Link>
//         </AccordionMenuItem>
//       );
//     }
//   };

//   const buildMenuItemChildDisabled = (
//     item: MenuItem,
//     index: number,
//     level: number = 0,
//   ): JSX.Element => {
//     const title = item.title ? intl.formatMessage({ id: item.title }) : '';
//     return (
//       <AccordionMenuItem
//         key={index}
//         value={`disabled-child-${level}-${index}`}
//         className="text-[13px]"
//       >
//         <span data-slot="accordion-menu-title">{title}</span>
//         {item.disabled && (
//           <Badge variant="secondary" size="sm" className="ms-auto me-[-10px]">
//             Soon
//           </Badge>
//         )}
//       </AccordionMenuItem>
//     );
//   };

//   const buildMenuHeading = (item: MenuItem, index: number): JSX.Element => {
//     const heading = item.heading ? intl.formatMessage({ id: item.heading }) : '';
//     return <AccordionMenuLabel key={index}>{heading}</AccordionMenuLabel>;
//   };

//   // Wait for user to be loaded before rendering menu
//   if (!isAuthenticated || !user) {
//     console.log('SidebarMenu - Waiting for user to load...');
//     return null;
//   }

//   console.log('SidebarMenu - Rendering with menu config:', menuConfig.length, 'items');

//   return (
//     <div className="kt-scrollable-y-hover flex grow shrink-0 lg:max-h-[calc(100vh-10.5rem)]">
//       <AccordionMenu
//         selectedValue={pathname}
//         matchPath={matchPath}
//         type="single"
//         collapsible
//         classNames={classNames}
//       >
//         {buildMenu(menuConfig)}
//       </AccordionMenu>
//     </div>
//   );
// }
