import { useLocation } from "react-router-dom";
import { auditTools } from "../utils/auditEngine";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

function Results() {
  const { state } = useLocation();

  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  // Lead form states
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  if (!state) {
    return (
      <div className="min-h-screen bg-black text-white p-10">
        <h1>No audit data found.</h1>
      </div>
    );
  }

  // Run audit engine
  const results = auditTools(
    state.tools,
    state.teamSize,
    state.useCase
  );

  // Calculate savings
  const totalMonthly = results.reduce(
    (sum, tool) => sum + tool.savings,
    0
  );

  const totalYearly = totalMonthly * 12;

  // AI Summary
  useEffect(() => {
    async function fetchSummary() {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:5000/summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            results,
            totalMonthly
          })
        });

        const data = await res.json();

        setSummary(data.summary);
      } catch (err) {
        console.log(err);

        setSummary(
          "Your AI stack appears reasonably optimized with some potential savings opportunities."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, []);

  // Save lead to Supabase
  const handleLeadSubmit = async () => {
    if (!email) {
      alert("Please enter email");
      return;
    }

    const { error } = await supabase
      .from("leads")
      .insert([
        {
          email,
          company,
          role,
          team_size: state.teamSize
        }
      ]);
    
    if (error) {
      console.log("SUPABASE ERROR:",error);
      alert("Error saving lead");
    } else {
      await fetch("http://localhost:5000/send-email", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    email
  })
});
alert("Lead saved successfully!");
    }
  };
const saveAudit = async () => {
  const { data, error } = await supabase
    .from("audits")
    .insert([
      {
        results,
        total_monthly: totalMonthly,
        total_yearly: totalYearly
      }
    ])
    .select();

  if (error) {
    console.log(error);
    return;
  }

  const auditId = data[0].id;

  alert(`Share URL created!`);

  console.log(
    `http://localhost:5173/audit/${auditId}`
  );
};
  return (
    <div className="min-h-screen bg-black text-white p-10">
      {/* Heading */}
      <h1 className="text-5xl font-bold mb-4">
        Audit Results
      </h1>

      <p className="text-gray-400 mb-10">
        Personalized analysis of your AI tooling spend.
      </p>

      {/* HERO CARD */}
      <div className="bg-zinc-900 border border-gray-800 p-8 rounded-3xl mb-8">
        <h2 className="text-6xl font-bold">
          ${totalMonthly}
          <span className="text-2xl text-gray-400">
            /month
          </span>
        </h2>

        <p className="text-gray-400 mt-3 text-lg">
          Potential monthly savings
        </p>

        <div className="mt-6">
          <h3 className="text-3xl font-semibold">
            ${totalYearly}/year
          </h3>

          <p className="text-gray-500 mt-1">
            Estimated annual savings opportunity
          </p>
        </div>
      </div>

      {/* TOOL BREAKDOWN */}
      <div className="space-y-5">
        {results.map((tool, i) => (
          <div
            key={i}
            className="border border-gray-800 bg-zinc-900 p-6 rounded-2xl"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold">
                  {tool.name}
                </h2>

                <p className="text-gray-400 mt-1">
                  Current Plan: {tool.plan}
                </p>
              </div>

              <div className="text-right">
                <h2 className="text-3xl font-bold text-green-400">
                  ${tool.savings}
                </h2>

                <p className="text-gray-500">
                  monthly savings
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-gray-800 pt-4">
              <p className="text-lg">
                👉 {tool.recommendation}
              </p>

              <p className="text-gray-400 mt-2">
                {tool.reason}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* AI SUMMARY */}
      <div className="bg-zinc-900 border border-gray-800 p-6 rounded-2xl mt-10">
        <h2 className="text-3xl font-bold mb-4">
          🤖 AI Summary
        </h2>

        {loading ? (
          <p className="text-gray-400">
            Generating personalized insights...
          </p>
        ) : (
          <p className="text-lg text-gray-300 leading-8">
            {summary}
          </p>
        )}
      </div>

      {/* CTA */}
      {totalMonthly > 500 ? (
        <div className="bg-green-500 text-black p-8 rounded-3xl mt-10">
          <h2 className="text-4xl font-bold">
            Save even more with Credex
          </h2>

          <p className="mt-3 text-lg">
            Your audit shows significant savings potential
            through discounted AI infrastructure credits.
          </p>

          <button className="bg-black text-white px-6 py-3 rounded-2xl mt-5">
            Contact Credex
          </button>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-gray-800 p-8 rounded-3xl mt-10">
          <h2 className="text-3xl font-bold">
            ✅ You're spending efficiently
          </h2>

          <p className="text-gray-400 mt-3">
            We’ll notify you if future optimizations become
            available for your stack.
          </p>
        </div>
      )}

      {/* LEAD FORM */}
      <div className="bg-zinc-900 border border-gray-800 p-8 rounded-3xl mt-10">
        <h2 className="text-3xl font-bold mb-5">
          Get your full optimization report
        </h2>
      <button
  onClick={saveAudit}
  className="bg-blue-500 px-6 py-3 rounded-2xl mt-5"
>
  Generate Share Link
</button>
        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-black border border-gray-700 p-3 rounded-xl w-full mb-3"
        />

        {/* Company */}
        <input
          type="text"
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="bg-black border border-gray-700 p-3 rounded-xl w-full mb-3"
        />

        {/* Role */}
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="bg-black border border-gray-700 p-3 rounded-xl w-full mb-5"
        />

        {/* Submit */}
        <button
          onClick={handleLeadSubmit}
          className="bg-white text-black px-6 py-3 rounded-2xl font-semibold hover:bg-gray-200 transition"
        >
          Save Report
        </button>
      </div>
    </div>
  );
}

export default Results;