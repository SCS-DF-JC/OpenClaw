import { currentUser } from "@clerk/nextjs/server";

export default async function WhoAmIPage() {
  const user = await currentUser();

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <h1 className="text-2xl font-bold text-red-600">SIGNED OUT</h1>
      </main>
    );
  }

  const email = user.primaryEmailAddress?.emailAddress ?? "no email";
  const metadata = user.publicMetadata;

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold">Who Am I?</h1>

      <div className="mt-6 space-y-4">
        <div>
          <p className="text-sm text-gray-500">User ID</p>
          <code className="text-sm">{user.id}</code>
        </div>

        <div>
          <p className="text-sm text-gray-500">Primary Email</p>
          <code className="text-sm">{email}</code>
        </div>

        <div>
          <p className="text-sm text-gray-500">publicMetadata (raw JSON)</p>
          <pre className="mt-1 rounded-lg bg-gray-100 p-4 text-sm overflow-auto">
            {JSON.stringify(metadata, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}
