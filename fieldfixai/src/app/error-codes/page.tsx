"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Fix {
  id: string;
  manufacturer: string;
  model_number: string;
  error_code: string;
  symptom: string;
  solution: string;
  created_at: string;
}

export default function ErrorCodesPage() {
  const [manufacturers, setManufacturers] = useState<string[]>([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [results, setResults] = useState<Fix[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Fetch unique manufacturers on component mount
  useEffect(() => {
    fetchManufacturers();
  }, []);

  const fetchManufacturers = async () => {
    try {
      const { data, error } = await supabase
        .from("field_fixes")
        .select("manufacturer", { count: "exact" })
        .returns<{ manufacturer: string }[]>();

      if (error) {
        console.error("Error fetching manufacturers:", error);
        return;
      }

      // Get unique manufacturers
      const uniqueManufacturers = Array.from(
        new Set(data?.map((item) => item.manufacturer) || [])
      ).sort();

      setManufacturers(uniqueManufacturers as string[]);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      let query = supabase.from("field_fixes").select("*");

      if (selectedManufacturer) {
        query = query.eq("manufacturer", selectedManufacturer);
      }

      if (errorCode) {
        query = query.ilike("error_code", `%${errorCode}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error searching:", error);
        setResults([]);
        return;
      }

      setResults(data || []);
    } catch (err) {
      console.error("Error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 pb-24">
      <header className="sticky top-0 z-10 border-b bg-white/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-4">
          <Link href="/dashboard" className="text-slate-900">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            Search by Error Code
          </h1>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-6">
        {/* Search Form */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Manufacturer
              </label>
              <select
                value={selectedManufacturer}
                onChange={(e) => setSelectedManufacturer(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Select a manufacturer --</option>
                {manufacturers.map((mfg) => (
                  <option key={mfg} value={mfg}>
                    {mfg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Error Code
              </label>
              <input
                type="text"
                placeholder="e.g., E130, 404, ERROR_001"
                value={errorCode}
                onChange={(e) => setErrorCode(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading || (!selectedManufacturer && !errorCode)}
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
            >
              {loading ? "Searching..." : <span className="flex items-center justify-center gap-2"><Search className="h-4 w-4" /> Search</span>}
            </button>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {results.length === 0
                ? "No results found"
                : `Found ${results.length} result${results.length !== 1 ? "s" : ""}`}
            </h2>

            <div className="space-y-4">
              {results.map((fix) => (
                <div
                  key={fix.id}
                  className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-lg text-slate-900">
                        {fix.manufacturer} {fix.model_number}
                      </p>
                      <p className="text-sm text-blue-600 font-semibold">
                        Error Code: {fix.error_code}
                      </p>
                    </div>
                  </div>

                  <p className="mb-3">
                    <span className="font-semibold text-slate-700">
                      Symptom:
                    </span>{" "}
                    <span className="text-slate-600">{fix.symptom}</span>
                  </p>

                  <p className="mb-3">
                    <span className="font-semibold text-slate-700">Fix:</span>{" "}
                    <span className="text-slate-600">{fix.solution}</span>
                  </p>

                  <p className="text-xs text-slate-400">
                    {new Date(fix.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
