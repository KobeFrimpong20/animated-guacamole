// AdminDashboard — shown to users with the 'admin' role.
// Placeholder — the admin role's capabilities will be defined in a later feature.

interface Props {
  username: string;
}

export default function AdminDashboard({ username }: Props) {
  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex flex-col items-start gap-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
          Hello, {username}!
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Admin dashboard — coming soon.
        </p>
      </div>
    </div>
  );
}
