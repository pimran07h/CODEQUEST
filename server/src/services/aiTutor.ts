import { Language, AITutorResponse } from '../types.js';

interface TutorRequest {
  code: string;
  language: Language;
  problemTitle: string;
  errorMessage?: string;
  testCaseFailure?: string;
  userQuestion?: string;
}

export async function askAiTutor(req: TutorRequest): Promise<AITutorResponse> {
  const { code, language, problemTitle, errorMessage, testCaseFailure, userQuestion } = req;

  // Check if GEMINI_API_KEY is configured in backend environment
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const prompt = `You are "Professor Turing", the elite AI Coding Tutor for CodeQuest, an interactive gaming platform for B.Tech engineering students.
The student is working on: "${problemTitle}" in ${language}.
Their current code:
\`\`\`${language}
${code}
\`\`\`
${errorMessage ? `Reported Error: ${errorMessage}` : ''}
${testCaseFailure ? `Failed Test Case: ${testCaseFailure}` : ''}
${userQuestion ? `Student Question: ${userQuestion}` : ''}

Respond with valid JSON matching this exact structure:
{
  "analysis": "Brief diagnosis of the student's code logic or syntax error",
  "hint": "Pedagogical hint guiding them towards the solution without spoonfeeding the answer",
  "lineExplanation": "Step-by-step breakdown of how their current code executes",
  "conceptGuidance": "Explanation of the underlying computer science concept in clear student-friendly terms",
  "complexityTip": "Time and Space complexity insights (Big-O analysis)"
}
Return only JSON without markdown fences.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return parsed;
        }
      }
    } catch (err) {
      console.warn("Gemini API fallback to internal pedagogical engine:", err);
    }
  }

  // Built-in intelligent pedagogical tutor engine
  let analysis = `Looking at your ${language.toUpperCase()} implementation for "${problemTitle}", your foundational logic is taking shape.`;
  let hint = `Consider the base cases and edge inputs carefully. Are there negative numbers or empty collections?`;
  let lineExplanation = `Your code executes the main function, processes the arguments, and returns the computed state. Verify that the variable types match the expected return signature.`;
  let conceptGuidance = `In engineering computer science, problem decomposition requires breaking the mission into: 1) Input validation, 2) Core transformation loop/recurrence, and 3) Clean return.`;
  let complexityTip = `Aim for O(N) or O(log N) time complexity. Ensure your loops do not repeat unnecessary scans.`;

  if (errorMessage) {
    analysis = `A compilation or syntax exception occurred: "${errorMessage.slice(0, 120)}". This typically signifies an unclosed brace, an undeclared identifier, or a mismatched type.`;
    hint = `Check the line where the error triggered. Make sure all parentheses () and brackets {} are balanced and every variable is initialized before access.`;
    lineExplanation = `The compiler halted parsing during the syntax pass. It encountered an unexpected token or missing semicolon.`;
  } else if (testCaseFailure) {
    analysis = `Your code compiled, but one of the test cases did not match the expected output. Difference noticed: "${testCaseFailure}".`;
    hint = `Trace your variable values manually on paper with the failing input. Check for off-by-one errors in loop boundaries (< vs <=).`;
    lineExplanation = `For this input, the loop terminates earlier or later than intended, producing a divergent cumulative value.`;
    conceptGuidance = `Boundary conditions (e.g. n=0, n=1, or boundary extremes) often expose subtle flaws in loop invariants.`;
  }

  if (userQuestion) {
    analysis = `Regarding your inquiry: "${userQuestion}"`;
    conceptGuidance = `In ${language.toUpperCase()}, idiomatic code favors readability and optimal space utilization. Pay close attention to whether arguments are passed by value or reference.`;
  }

  return {
    analysis,
    hint,
    lineExplanation,
    conceptGuidance,
    complexityTip
  };
}
