import OrganizationsHeader from '../components/OrganizationsHeader';

export default function OrganizationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <OrganizationsHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
