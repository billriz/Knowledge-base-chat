export default function Dashboard() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6">
      <section className="mx-auto max-w-md">
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-500">Technician Assistant</p>
          <h1 className="text-3xl font-bold text-slate-900">FieldFix AI</h1>
          <p className="mt-2 text-slate-600">
            Troubleshoot equipment issues, search error codes, and capture real-world fixes.
          </p>
        </div>

        <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Quick Start</p>
          <h2 className="mt-1 text-lg font-bold text-slate-900">
            What are you working on?
          </h2>

          <div className="mt-4 grid gap-3">
            <a
              href="/chat"
              className="rounded-xl bg-blue-600 p-4 text-white shadow-sm"
            >
              <p className="font-bold">Ask by Error Code</p>
              <p className="text-sm text-blue-100">Enter a code and get likely causes</p>
            </a>

            <a
              href="/chat"
              className="rounded-xl bg-slate-900 p-4 text-white shadow-sm"
            >
              <p className="font-bold">Search by Symptoms</p>
              <p className="text-sm text-slate-300">Describe what the machine is doing</p>
            </a>

            <a
              href="/submit-fix"
              className="rounded-xl bg-emerald-600 p-4 text-white shadow-sm"
            >
              <p className="font-bold">Submit a Fix</p>
              <p className="text-sm text-emerald-100">Capture what solved the issue</p>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a
            href="/equipment"
            className="rounded-2xl bg-white p-4 shadow-sm"
          >
            <p className="text-sm text-slate-500">Lookup</p>
            <p className="font-bold text-slate-900">Equipment</p>
          </a>

          <a
            href="/error-codes"
            className="rounded-2xl bg-white p-4 shadow-sm"
          >
            <p className="text-sm text-slate-500">Search</p>
            <p className="font-bold text-slate-900">Error Codes</p>
          </a>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Recent Activity</p>
          <p className="mt-2 text-sm text-slate-600">
            No recent conversations yet.
          </p>
        </div>
      </section>
    </main>
  );
}