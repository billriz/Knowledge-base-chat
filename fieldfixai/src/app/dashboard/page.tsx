import {
  Bell,
  CircleHelp,
  ClipboardPlus,
  Clock,
  FileText,
  Home,
  Layers,
  Menu,
  MonitorSmartphone,
  Plus,
  Search,
  Send,
  User,
  Waves,
  MessageCircle,
} from "lucide-react";

export default function Dashboard() {
  const quickActions = [
    {
      title: "Search by Error Code",
      subtitle: "Find info by code",
      icon: Layers,
      href: "/error-codes",
    },
    {
      title: "Search by Symptoms",
      subtitle: "Describe the issue",
      icon: Waves,
      href: "/chat",
    },
    {
      title: "Select Equipment",
      subtitle: "Browse by model",
      icon: MonitorSmartphone,
      href: "/equipment",
    },
    {
      title: "Submit a Fix",
      subtitle: "Share what worked",
      icon: ClipboardPlus,
      href: "/submit-fix",
    },
    {
      title: "Recent Conversations",
      subtitle: "View your history",
      icon: Clock,
      href: "/chat",
    },
  ];

  const recentConversations = [
    "NCR 6634 — Error 130, Cash Not Dispensing",
    "Diebold DN Series — Jammed Cash Cassette",
    "Hyosung 5600T — Error E0A",
  ];

  const knowledgeUpdates = [
    "NCR 6683 Service Bulletin — Dispense Issues",
    "Hyosung 5600T — New Firmware Release",
    "Common Causes — Cash Dispense Failures",
  ];

  return (
    <main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <header className="sticky top-0 z-10 border-b bg-white/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Menu className="h-7 w-7 text-slate-900" />

          <div className="flex items-center gap-5">
            <div className="relative">
              <Bell className="h-6 w-6 text-slate-900" />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-blue-600" />
            </div>
            <CircleHelp className="h-7 w-7 text-slate-900" />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6">
          <p className="text-lg text-slate-500">Hi, Technician</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950">
            Field Service
          </h1>
          <p className="mt-1 text-xl text-slate-500">
            Troubleshooting Assistant
          </p>
        </div>

        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-blue-700">
              How can I help?
            </h2>
            <p className="mt-2 text-slate-600">
              Ask a question using symptoms, error codes, or equipment details.
            </p>
          </div>

          <div className="mt-5 flex overflow-hidden rounded-xl border bg-white">
            <input
              className="min-w-0 flex-1 p-4 text-lg text-slate-900 outline-none placeholder:text-slate-400"
              placeholder="Example: NCR 6634 error code 130, cash not dispensing"
            />
            <a
              href="/chat"
              className="m-2 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-700 text-white"
            >
              <Send className="h-6 w-6" />
            </a>
          </div>

          <p className="mt-5 text-center text-slate-500">
            Not sure what to ask?{" "}
            <a href="/chat" className="font-medium text-blue-700">
              See example questions
            </a>
          </p>
        </section>

        <section className="mt-6 rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">Quick Actions</h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <a
                  key={action.title}
                  href={action.href}
                  className="rounded-xl border bg-white p-4 text-center shadow-sm transition hover:bg-slate-50"
                >
                  <Icon className="mx-auto mb-3 h-9 w-9 text-blue-700" />
                  <p className="font-extrabold leading-tight text-slate-950">
                    {action.title}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {action.subtitle}
                  </p>
                </a>
              );
            })}
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Recent Conversations</h2>
              <a href="/chat" className="font-medium text-blue-700">
                View all
              </a>
            </div>

            <div className="space-y-5">
              {recentConversations.map((item, index) => (
                <div key={item} className="flex gap-3">
                  <MessageCircle className="mt-1 h-6 w-6 text-blue-700" />
                  <div>
                    <p className="font-medium">{item}</p>
                    <p className="text-sm text-slate-500">
                      May {30 - index}, 2024 • {index === 0 ? "10:42 AM" : index === 1 ? "9:15 AM" : "4:22 PM"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Knowledge Updates</h2>
              <a href="/error-codes" className="font-medium text-blue-700">
                View all
              </a>
            </div>

            <div className="space-y-5">
              {knowledgeUpdates.map((item, index) => (
                <div key={item} className="flex gap-3">
                  <FileText className="mt-1 h-6 w-6 text-blue-700" />
                  <div>
                    <p className="font-medium">{item}</p>
                    <p className="text-sm text-slate-500">
                      Updated May {29 - index}, 2024
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 border-t bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-5 items-center px-2 py-2">
          <a href="/dashboard" className="text-center text-blue-700">
            <Home className="mx-auto h-6 w-6 fill-blue-700" />
            <p className="mt-1 text-xs font-medium">Home</p>
          </a>

          <a href="/chat" className="text-center text-slate-500">
            <Search className="mx-auto h-6 w-6" />
            <p className="mt-1 text-xs">Search</p>
          </a>

          <a
            href="/submit-fix"
            className="mx-auto -mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg"
          >
            <Plus className="h-9 w-9" />
          </a>

          <a href="/chat" className="text-center text-slate-500">
            <Clock className="mx-auto h-6 w-6" />
            <p className="mt-1 text-xs">History</p>
          </a>

          <a href="#" className="text-center text-slate-500">
            <User className="mx-auto h-6 w-6" />
            <p className="mt-1 text-xs">Profile</p>
          </a>
        </div>
      </nav>
    </main>
  );
}
