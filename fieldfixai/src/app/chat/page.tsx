"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Search, Wrench, Cpu, AlertTriangle, Package } from "lucide-react";

export default function ChatPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fieldClass =
    "w-full rounded-xl border p-4 text-lg text-slate-900 placeholder:text-slate-400";

  const handleSearch = async () => {
    const cleanQuery = query.trim();

    if (!cleanQuery) return;

    setLoading(true);
    setSearched(true);

    const { data, error } = await supabase
      .from("field_fixes")
      .select("*")
      .or(
        `manufacturer.ilike.%${cleanQuery}%,model_number.ilike.%${cleanQuery}%,serial_number.ilike.%${cleanQuery}%,error_code.ilike.%${cleanQuery}%,symptom.ilike.%${cleanQuery}%,root_cause.ilike.%${cleanQuery}%,solution.ilike.%${cleanQuery}%,parts_used.ilike.%${cleanQuery}%,notes.ilike.%${cleanQuery}%`
      )
      .order("created_at", { ascending: false })
      .limit(10);

    setLoading(false);

    if (error) {
      console.error("Search error:", error);
      alert(error.message);
      return;
    }

    setResults(data || []);
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6">
      <section className="mx-auto max-w-md">
        <div className="mb-5 flex items-center gap-3">
          <a href="/dashboard">
            <ArrowLeft className="h-6 w-6 text-slate-700" />
          </a>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Troubleshooting Search
            </h1>
            <p className="text-sm text-slate-600">
              Search submitted fixes by equipment, error code, symptom, or part.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <label className="mb-2 block text-sm font-bold text-slate-700">
            What are you troubleshooting?
          </label>

          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Example: NCR, error 130, jam, dispenser..."
              className={fieldClass}
            />

            <button
              onClick={handleSearch}
              className="flex w-16 items-center justify-center rounded-xl bg-blue-700 text-white"
            >
              <Search className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {["NCR", "Diebold", "jam", "dispenser", "cassette"].map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          {loading && (
            <div className="rounded-xl bg-white p-4 text-slate-600 shadow-sm">
              Searching fixes...
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div className="rounded-xl bg-white p-4 text-slate-600 shadow-sm">
              No matching fixes found.
            </div>
          )}

          <div className="space-y-4">
            {results.map((fix) => (
              <div
                key={fix.id}
                className="rounded-2xl border bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex items-start gap-2">
                  <Cpu className="mt-1 h-5 w-5 text-blue-700" />
                  <div>
                    <p className="font-bold text-slate-900">
                      {fix.manufacturer || "Unknown Manufacturer"}{" "}
                      {fix.model_number || ""}
                    </p>
                    {fix.serial_number && (
                      <p className="text-sm text-slate-500">
                        Serial: {fix.serial_number}
                      </p>
                    )}
                  </div>
                </div>

                {fix.error_code && (
                  <div className="mb-3 flex gap-2">
                    <AlertTriangle className="mt-1 h-5 w-5 text-amber-500" />
                    <p>
                      <span className="font-semibold">Error Code:</span>{" "}
                      {fix.error_code}
                    </p>
                  </div>
                )}

                {fix.symptom && (
                  <p className="mb-3">
                    <span className="font-semibold">Symptom:</span>{" "}
                    {fix.symptom}
                  </p>
                )}

                {fix.root_cause && (
                  <p className="mb-3">
                    <span className="font-semibold">Root Cause:</span>{" "}
                    {fix.root_cause}
                  </p>
                )}

                {fix.solution && (
                  <div className="mb-3 rounded-xl bg-emerald-50 p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-emerald-700" />
                      <span className="font-bold text-emerald-800">
                        Field Fix
                      </span>
                    </div>
                    <p className="text-emerald-900">{fix.solution}</p>
                  </div>
                )}

                {fix.parts_used && (
                  <div className="mb-3 flex gap-2 text-blue-700">
                    <Package className="mt-1 h-5 w-5" />
                    <p>
                      <span className="font-semibold">Parts:</span>{" "}
                      {fix.parts_used}
                    </p>
                  </div>
                )}

                {fix.notes && (
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold">Notes:</span> {fix.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}