"use client";

import { useState } from "react";

export default function SubmitFix() {
  const [form, setForm] = useState({
    equipment: "",
    errorCode: "",
    symptom: "",
    rootCause: "",
    solution: "",
    partsUsed: "",
    notes: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Submitted Fix:", form);
    alert("Fix submitted (we’ll connect this to database next)");
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6">
      <section className="mx-auto max-w-md">
        <h1 className="text-2xl font-bold mb-4">Submit a Fix</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-4 rounded-2xl shadow-sm"
        >
          <input
            name="equipment"
            placeholder="Equipment (e.g. NCR 6634)"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
          />

          <input
            name="errorCode"
            placeholder="Error Code"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
          />

          <textarea
            name="symptom"
            placeholder="What was happening?"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
          />

          <textarea
            name="rootCause"
            placeholder="Root cause"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
          />

          <textarea
            name="solution"
            placeholder="What fixed it?"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
          />

          <input
            name="partsUsed"
            placeholder="Parts used"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
          />

          <textarea
            name="notes"
            placeholder="Additional notes"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white p-3 rounded-xl font-bold"
          >
            Submit Fix
          </button>
        </form>
      </section>
    </main>
  );
}