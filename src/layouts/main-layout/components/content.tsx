import Breadcrumbs from '@/layouts/main-layout/components/breadcrumb';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Container } from '@/components/common/container';

export function Content() {
  const mobile = useIsMobile();

  return (
    <div className="grow content pt-5" role="content">
      {mobile && (
        <Container>
          <Breadcrumbs />
        </Container>
      )}
      <Outlet />
    </div>
  );
}
