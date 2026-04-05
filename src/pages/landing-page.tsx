import { Button } from '@/components/ui/button';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useAuth } from '@/auth/context/auth-context';
import { useLanguage } from '@/providers/i18n-context';
import { I18N_LANGUAGES } from '@/i18n/config';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const intl = useIntl();
  const { changeLanguage, currenLanguage } = useLanguage();


  return (
    <div className="min-h-screen bg-background flex flex-col w-full">
      <header className="w-full border-b backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img
              src={toAbsoluteUrl('/media/logos/english_quest_stuff.png')}
              alt="EnglishQuest"
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              EnglishQuest
            </span>
          </div>
          <div className="flex gap-2 items-center">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <img
                    src={currenLanguage.flag}
                    alt={currenLanguage.label}
                    className="h-4 w-4 rounded-full object-cover"
                  />
                  <Languages className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {I18N_LANGUAGES.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang)}
                    className="justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <img
                        src={lang.flag}
                        alt={lang.label}
                        className="h-4 w-4 rounded-full object-cover"
                      />
                      {lang.label}
                    </span>
                    {currenLanguage.code === lang.code && (
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated ? (
              <Button asChild className="shadow-lg shadow-primary/20">
                <Link to="/dashboard">{intl.formatMessage({ id: 'LANDING.GO_TO_DASHBOARD' })}</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/auth/signin">{intl.formatMessage({ id: 'LANDING.SIGN_IN' })}</Link>
                </Button>
                <Button asChild className="shadow-lg shadow-primary/20">
                  <Link to="/auth/signup">{intl.formatMessage({ id: 'LANDING.GET_STARTED' })}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {intl.formatMessage({ id: 'LANDING.TAGLINE' })}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            {intl.formatMessage({ id: 'LANDING.HERO_TITLE' })} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              {intl.formatMessage({ id: 'LANDING.HERO_HIGHLIGHT' })}
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
            {intl.formatMessage({ id: 'LANDING.HERO_DESCRIPTION' })}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Button size="lg" className="h-12 px-8 text-lg shadow-xl shadow-primary/20" asChild>
              <Link to="/auth/signup">{intl.formatMessage({ id: 'LANDING.START_JOURNEY' })}</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg bg-background/50 backdrop-blur-sm" asChild>
              <Link to="/auth/signin">{intl.formatMessage({ id: 'LANDING.CONTINUE_LEARNING' })}</Link>
            </Button>
          </div>

          {/* Landing Illustration */}
          <div className="mt-10 w-full flex justify-center">
            <img
              src={toAbsoluteUrl('/media/illustrations/landing-page/landing-page.svg')}
              alt={intl.formatMessage({ id: 'LANDING.ILLUSTRATION_ALT' })}
              className="-mt-40 max-w-2xl w-full max-h-[40vh] object-contain shrink-0 pointer-events-none"
            />
          </div>
        </div>
      </main>

      <footer className="border-t py-8 bg-muted/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>{intl.formatMessage({ id: 'LANDING.COPYRIGHT' }, { year: new Date().getFullYear() })}</p>
        </div>
      </footer>
    </div>
  );
}

