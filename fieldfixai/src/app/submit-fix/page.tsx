"use client";

import { supabase } from "@/lib/supabaseClient";

import { useState } from "react";
import {
  Wrench,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ArrowLeft,
} from "lucide-react";

export default function SubmitFix() {
  const fieldClass =
    "w-full rounded-lg border p-3 text-lg text-slate-900 placeholder:text-slate-400";

  const [form, setForm] = useState({
    manufacturer: "",
    modelNumber: "",
    serialNumber: "",
    errorCode: "",
    symptom: "",
    rootCause: "",
    solution: "",
    partsUsed: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const { error } = await supabase.from("field_fixes").insert([
    {
      manufacturer: form.manufacturer,
      model_number: form.modelNumber,
      serial_number: form.serialNumber,
      error_code: form.errorCode,
      symptom: form.symptom,
      root_cause: form.rootCause,
      solution: form.solution,
      parts_used: form.partsUsed,
      notes: form.notes,
    },
  ]);

  if (error) {
    console.error(error);
    alert("There was an error saving the fix.");
    return;
  }

  alert("Fix saved successfully.");
};

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6">
      <section className="mx-auto max-w-md">

        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <a href="/dashboard">
            <ArrowLeft className="h-6 w-6 text-slate-700" />
          </a>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Submit a Fix
            </h1>
            <p className="text-sm text-slate-600">
              Capture what solved the issue
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl bg-white p-4 shadow-sm"
        >

          {/* Equipment */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Cpu className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Equipment
              </h2>
            </div>

            <input
              name="manufacturer"
              placeholder="Manufacturer (e.g. NCR, Diebold)"
              value={form.manufacturer}
              className={`${fieldClass} mb-3`}
              onChange={handleChange}
            />

            <input
              name="modelNumber"
              placeholder="Model Number"
              value={form.modelNumber}
              className={`${fieldClass} mb-3`}
              onChange={handleChange}
            />

            <input
              name="serialNumber"
              placeholder="Serial Number"
              value={form.serialNumber}
              className={fieldClass}
              onChange={handleChange}
            />
          </div>

          {/* Issue */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900">
                Issue
              </h2>
            </div>

            <input
              name="errorCode"
              placeholder="Error Code"
              value={form.errorCode}
              className={`${fieldClass} mb-3`}
              onChange={handleChange}
            />

            <textarea
              name="symptom"
              placeholder="What was happening?"
              value={form.symptom}
              className={`${fieldClass} min-h-24`}
              onChange={handleChange}
            />
          </div>

          {/* Resolution */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Resolution
              </h2>
            </div>

            <textarea
              name="rootCause"
              placeholder="Root cause"
              value={form.rootCause}
              className={`${fieldClass} mb-3 min-h-24`}
              onChange={handleChange}
            />

            <textarea
              name="solution"
              placeholder="What fixed it?"
              value={form.solution}
              className={`${fieldClass} mb-3 min-h-24`}
              onChange={handleChange}
            />

            <input
              name="partsUsed"
              placeholder="Parts used"
              value={form.partsUsed}
              className={fieldClass}
              onChange={handleChange}
            />
          </div>

          {/* Notes */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Notes
              </h2>
            </div>

            <textarea
              name="notes"
              placeholder="Additional notes"
              value={form.notes}
              className={`${fieldClass} min-h-24`}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 p-3 text-lg font-bold text-white"
          >
            <Wrench className="h-5 w-5" />
            Submit Fix
          </button>
        </form>
      </section>
    </main>
  );
}