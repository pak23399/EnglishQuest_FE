import { useEffect } from 'react';
import { ENGLISHQUEST_MENU_SIDEBAR } from '@/layouts/main-layout/menus/englishquest-menu.config';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router-dom';
import { useBodyClass } from '@/hooks/use-body-class';
import { useMenu } from '@/hooks/use-menu';
import { useSettings } from '@/providers/settings-provider';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { FloatingChatbot } from '@/components/chatbot/floating-chatbot';

export function MainLayout() {
  const { setOption } = useSettings();
  const { pathname } = useLocation();
  const { getCurrentItem } = useMenu(pathname);
  const item = getCurrentItem(ENGLISHQUEST_MENU_SIDEBAR);

  // Using the custom hook to set multiple CSS variables and class properties
  useBodyClass(`
    [--header-height-default:95px]
    data-[sticky-header=on]:[--header-height:60px]
    [--header-height:var(--header-height-default)]	
    [--header-height-mobile:70px]	
  `);

  useEffect(() => {
    setOption('layout', 'demo7');
  }, [setOption]);

  return (
    <>
      <Helmet>
        <title>{item?.title}</title>
      </Helmet>
      <div className="flex grow flex-col in-data-[sticky-header=on]:pt-(--header-height-default)">
        <Header />

        <div className="grow" role="content">
          <Outlet />
        </div>

        <Footer />
      </div>

      {/* Floating AI Chatbot - Available on all pages */}
      <FloatingChatbot />
    </>
  );
}
