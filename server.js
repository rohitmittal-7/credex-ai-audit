import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


const app = express();
app.use(cors());
app.use(express.json());

app.post("/summary", async (req, res) => {
  try {
    const { results, totalMonthly } = req.body;

    const prompt = `
You are a financial analyst.

Given the following AI tool usage and audit results:
${JSON.stringify(results)}

Total monthly savings: $${totalMonthly}

Write a 100-word professional summary explaining:
- current spend efficiency
- optimization opportunities
- potential savings

Keep tone neutral and factual.
`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    const summary =
      data?.content?.[0]?.text ||
      "Your AI spend shows opportunities for optimization.";

    res.json({ summary });
  } catch (err) {
    console.log(err);

    // fallback
    res.json({
      summary:
        "Your AI spend shows optimization opportunities based on current usage."
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
app.get("/", (req, res) => {
  res.send("Backend working");
});
app.post("/send-email", async (req, res) => {
  try {
    const { email } = req.body;

    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Your Credex AI Audit",
      html: `
        <h1>Audit Received</h1>
        <p>Thanks for using Credex AI Spend Auditor.</p>
        <p>We’ll reach out if major savings opportunities are found.</p>
      `
    });

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Email failed"
    });
  }
});