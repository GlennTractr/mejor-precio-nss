import { cn } from '@/lib/utils';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useCurrentUser } from '@/hooks/use-current-user';
import MainSidebar from './main-sidebar';

export default function LayoutSidebar({
  children,
  className,
  containerClassName,
  contentClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  contentClassName?: string;
}) {
  const currentUser = useCurrentUser();

  return (
    <SidebarProvider open={currentUser.data || currentUser.isLoading ? undefined : false}>
      <MainSidebar />
      <main className={cn('flex-1 flex flex-col', containerClassName)}>
        {currentUser.data || currentUser.isLoading ? (
          <SidebarTrigger className="mx-3 mt-2" />
        ) : null}
        <div className={cn('flex-1 px-4 py-2', className)}>
          <div className={cn('flex-1 container mx-auto', contentClassName)}>{children}</div>
        </div>
      </main>
    </SidebarProvider>
  );
}
