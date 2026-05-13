export function auditTools(tools, teamSize, useCase) {
  return tools.map((tool) => {
    let savings = 0;
    let recommendation = "No change needed";
    let reason = "Current setup looks appropriate";

    const seats = Number(tool.seats);
    const spend = Number(tool.monthlySpend);

    // RULE 1: Small team using expensive plan
    if (seats <= 2 && tool.plan === "Enterprise") {
      savings = spend * 0.5;
      recommendation = "Switch to Team plan";
      reason = "Enterprise plan oversized for small team";
    }

    // RULE 2: ChatGPT Team for small team
    if (tool.name === "ChatGPT" && tool.plan === "Team" && seats <= 2) {
      savings = 20;
      recommendation = "Switch to Plus plan";
      reason = "Team plan unnecessary for small usage";
    }

    // RULE 3: Cursor Business for small team
    if (tool.name === "Cursor" && tool.plan === "Business" && seats <= 3) {
      savings = 20;
      recommendation = "Switch to Pro plan";
      reason = "Business features underutilized";
    }

    // RULE 4: API users (Credex angle)
    if (tool.plan === "API") {
      savings = spend * 0.2;
      recommendation = "Use discounted credits";
      reason = "API usage often cheaper via credits";
    }

    return {
      ...tool,
      savings,
      recommendation,
      reason
    };
  });
}