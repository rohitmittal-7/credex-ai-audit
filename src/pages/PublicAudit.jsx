import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase";

function PublicAudit() {
  const { id } = useParams();

  const [audit, setAudit] = useState(null);

  useEffect(() => {
    async function fetchAudit() {
      const { data } = await supabase
        .from("audits")
        .select("*")
        .eq("id", id)
        .single();

      setAudit(data);
    }

    fetchAudit();
  }, []);

  if (!audit) {
    return (
      <div className="min-h-screen bg-black text-white p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold mb-8">
        Public Audit
      </h1>

      <div className="bg-zinc-900 p-8 rounded-3xl">
        <h2 className="text-5xl font-bold">
          ${audit.total_monthly}/mo
        </h2>

        <p className="text-gray-400 mt-2">
          Potential savings
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {audit.results.map((tool, i) => (
          <div
            key={i}
            className="bg-zinc-900 p-6 rounded-2xl"
          >
            <h2 className="text-2xl font-bold">
              {tool.name}
            </h2>

            <p className="mt-2">
              {tool.recommendation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PublicAudit;