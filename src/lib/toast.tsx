import { RiCheckboxCircleFill, RiCloseCircleFill } from '@remixicon/react';
import { toast } from 'sonner';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';

export function showToast({
  mode = 'info',
  message,
}: {
  mode?: 'info' | 'success' | 'destructive';
  message: string;
}) {
  const icon = () => {
    switch (mode) {
      case 'info':
        return <></>;
      case 'success':
        return <RiCheckboxCircleFill />;
      case 'destructive':
        return <RiCloseCircleFill />;
    }
  };

  toast.custom(
    (t) => (
      <Alert variant="mono" icon={mode} onClose={() => toast.dismiss(t)}>
        <AlertIcon>{icon()}</AlertIcon>
        <AlertTitle>{message}</AlertTitle>
      </Alert>
    ),
    {
      duration: 5000,
    },
  );
}
