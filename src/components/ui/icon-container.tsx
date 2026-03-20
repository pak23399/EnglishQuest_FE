// import React from 'react';
// import { cva, VariantProps } from 'class-variance-authority';
// import { cn } from '@/lib/utils';

// const iconContainerVariants = cva('', {
//   variants: {
//     size: {
//       sm: 'w-[80px]',
//       xl: 'text-muted-foreground text-sm',
//     },
//   },
//   defaultVariants: {
//     size: 'xl',
//   },
// });

// export function IconContainer({
//   className,
//   size,
//   ...props
// }: React.ComponentProps<'div'> & VariantProps<typeof iconContainerVariants>) {
//   return (
//     <div
//       className={cn(iconContainerVariants({ size }), className)}
//       {...props}
//     />
//   );
// }

// export function Icon({
//   icon,
//   className,
//   children,
//   ...props
// }: React.ComponentProps<'div'>) {
//   return (
//     <div {...props} className={cn('flex items-center gap-x-2', className)}>
//       {icon &&
//         React.cloneElement(icon, {
//           className: cn(
//             'size-4 shrink-0 text-muted-foreground',
//             icon.props.className,
//           ),
//         })}
//       {children}
//     </div>
//   );
// }
