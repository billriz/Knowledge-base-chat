"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function FixesPage() {
  const [fixes, setFixes] = useState<any[]>([]);

  useEffect(() => {
    fetchFixes();
  }, []);

  const fetchFixes = async () => {
    const { data, error } = await supabase
      .from("field_fixes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setFixes(data || []);
  };

  return (
    <main className="min-h-screen bg-slate-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Submitted Fixes</h1>

      <div className="space-y-4">
        {fixes.map((fix) => (
          <div
            key={fix.id}
            className="bg-white p-4 rounded-xl shadow-sm border"
          >
            <p className="font-bold">
              {fix.manufacturer} {fix.model_number}
            </p>

            <p className="text-sm text-slate-500 mb-2">
              Error: {fix.error_code}
            </p>

            <p className="mb-2">
              <span className="font-semibold">Symptom:</span> {fix.symptom}
            </p>

            <p className="mb-2">
              <span className="font-semibold">Fix:</span> {fix.solution}
            </p>

            <p className="text-xs text-slate-400">
              {new Date(fix.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}