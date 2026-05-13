import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  // Load from localStorage
  const [data, setData] = useState(() => {
    return JSON.parse(localStorage.getItem("audit")) || {
      tools: [],
      teamSize: "",
      useCase: ""
    };
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("audit", JSON.stringify(data));
  }, [data]);

  // Tool plans
  const toolPlans = {
    ChatGPT: ["Plus", "Team", "Enterprise", "API"],
    Claude: ["Free", "Pro", "Max", "Team", "Enterprise", "API"],
    Cursor: ["Hobby", "Pro", "Business", "Enterprise"],
    "GitHub Copilot": ["Individual", "Business", "Enterprise"],
    Gemini: ["Pro", "Ultra", "API"],
    Windsurf: ["Free", "Pro", "Team"]
  };

  // Add tool
  const addTool = () => {
    setData({
      ...data,
      tools: [
        ...data.tools,
        {
          name: "",
          plan: "",
          monthlySpend: "",
          seats: ""
        }
      ]
    });
  };

  // Update tool
  const updateTool = (index, field, value) => {
    const updated = [...data.tools];

    updated[index][field] = value;

    // Reset plan when tool changes
    if (field === "name") {
      updated[index].plan = "";
    }

    setData({
      ...data,
      tools: updated
    });
  };

  // Remove tool
  const removeTool = (index) => {
    const updated = data.tools.filter((_, i) => i !== index);

    setData({
      ...data,
      tools: updated
    });
  };

  // Submit
  const handleSubmit = () => {
    if (data.tools.length === 0) {
      alert("Please add at least one tool");
      return;
    }

    navigate("/results", { state: data });
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      {/* Heading */}
      <h1 className="text-4xl font-bold mb-3">
        AI Spend Auditor
      </h1>

      <p className="text-gray-400 mb-8">
        Analyze your AI tooling spend and discover savings opportunities.
      </p>

      {/* Add tool button */}
      <button
        onClick={addTool}
        className="bg-white text-black px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition"
      >
        + Add Tool
      </button>

      {/* Tool cards */}
      {data.tools.map((tool, i) => (
        <div
          key={i}
          className="border border-gray-700 p-5 rounded-2xl mt-5 bg-zinc-900"
        >
          <h2 className="text-xl font-semibold mb-4">
            Tool #{i + 1}
          </h2>

          {/* Tool Select */}
          <select
            value={tool.name}
            onChange={(e) =>
              updateTool(i, "name", e.target.value)
            }
            className="bg-black border border-gray-700 p-3 rounded-xl mr-2 mt-2 w-full md:w-auto"
          >
            <option value="">Select Tool</option>

            {Object.keys(toolPlans).map((toolName) => (
              <option key={toolName} value={toolName}>
                {toolName}
              </option>
            ))}
          </select>

          {/* Plan Select */}
          <select
            value={tool.plan}
            onChange={(e) =>
              updateTool(i, "plan", e.target.value)
            }
            className="bg-black border border-gray-700 p-3 rounded-xl mr-2 mt-2 w-full md:w-auto"
          >
            <option value="">Select Plan</option>

            {toolPlans[tool.name]?.map((plan) => (
              <option key={plan} value={plan}>
                {plan}
              </option>
            ))}
          </select>

          {/* Monthly Spend */}
          <input
            type="number"
            placeholder="Monthly Spend ($)"
            value={tool.monthlySpend}
            onChange={(e) =>
              updateTool(i, "monthlySpend", e.target.value)
            }
            className="bg-black border border-gray-700 p-3 rounded-xl mr-2 mt-2 w-full md:w-auto"
          />

          {/* Seats */}
          <input
            type="number"
            placeholder="Seats"
            value={tool.seats}
            onChange={(e) =>
              updateTool(i, "seats", e.target.value)
            }
            className="bg-black border border-gray-700 p-3 rounded-xl mr-2 mt-2 w-full md:w-auto"
          />

          <br />

          {/* Remove button */}
          <button
            onClick={() => removeTool(i)}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl mt-4 transition"
          >
            Remove
          </button>
        </div>
      ))}

      {/* Team section */}
      <div className="mt-10 border border-gray-700 p-6 rounded-2xl bg-zinc-900">
        <h2 className="text-2xl font-semibold mb-4">
          Team Details
        </h2>

        {/* Team size */}
        <input
          type="number"
          placeholder="Team Size"
          value={data.teamSize}
          onChange={(e) =>
            setData({
              ...data,
              teamSize: e.target.value
            })
          }
          className="bg-black border border-gray-700 p-3 rounded-xl mr-2 mt-2 w-full md:w-auto"
        />

        {/* Use case */}
        <select
          value={data.useCase}
          onChange={(e) =>
            setData({
              ...data,
              useCase: e.target.value
            })
          }
          className="bg-black border border-gray-700 p-3 rounded-xl mr-2 mt-2 w-full md:w-auto"
        >
          <option value="">Select Use Case</option>
          <option value="coding">Coding</option>
          <option value="writing">Writing</option>
          <option value="data">Data</option>
          <option value="research">Research</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>

      {/* Analyze button */}
      <button
        onClick={handleSubmit}
        className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-2xl mt-8 text-lg font-semibold transition"
      >
        Analyze Spend
      </button>
    </div>
  );
}

export default Home;