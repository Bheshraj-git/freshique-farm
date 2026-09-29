import { NextRequest, NextResponse } from "next/server";

const MODELS = [
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash-lite",
    "gemini-3.8-flash",
    "gemini-flash-latest",
];

const PROMPT = `Analyze this plant image (leaf/crop) for diseases or health issues. 
Be comprehensive: Detect the plant type if possible, identify any disease/pest, assess severity.
Respond ONLY with valid JSON (no extra text). Structure:
{
  "plantType": "e.g., Tomato",
  "disease": "Disease name or 'Healthy'",
  "confidence": number (0-100),
  "summary": "Detailed 2-3 sentence overview of findings, symptoms, and impacts.",
  "symptoms": ["Bullet-point list of visible symptoms"],
  "causes": ["Bullet-point list of likely causes (e.g., fungal, environmental)"],
  "severity": "low|medium|high|critical",
  "suggestions": ["4-6 detailed, actionable treatment steps (include organic options, dosages if relevant)"],
  "prevention": ["4-6 proactive tips to avoid recurrence"]
}
If healthy, set disease to 'Healthy', suggestions to general care tips, and severity to 'low'.`;

export async function POST(req: NextRequest) {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
        return NextResponse.json(
            { error: "GEMINI_API_KEY is not configured in .env.local on the server." },
            { status: 500 }
        );
    }

    try {
        const body = await req.json();
        const { imageBase64, mimeType } = body;

        if (!imageBase64 || !mimeType) {
            return NextResponse.json(
                { error: "Missing imageBase64 or mimeType in request body." },
                { status: 400 }
            );
        }

        const payload = {
            contents: [
                {
                    parts: [
                        { text: PROMPT },
                        { inline_data: { mime_type: mimeType, data: imageBase64 } },
                    ],
                },
            ],
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 2048,
            },
        };

        let lastError = "";
        let geminiData: any = null;

        // Try candidate models in order to ensure high availability
        for (const model of MODELS) {
            try {
                const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                const geminiRes = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (geminiRes.ok) {
                    geminiData = await geminiRes.json();
                    break;
                } else {
                    const errText = await geminiRes.text();
                    console.warn(`Model ${model} failed (${geminiRes.status}):`, errText);
                    try {
                        const errJson = JSON.parse(errText);
                        lastError = errJson?.error?.message || geminiRes.statusText;
                    } catch {
                        lastError = errText || geminiRes.statusText;
                    }
                }
            } catch (fetchErr: any) {
                lastError = fetchErr.message;
            }
        }

        if (!geminiData) {
            return NextResponse.json(
                { error: `Gemini API error: ${lastError || "Failed to reach Gemini services"}` },
                { status: 502 }
            );
        }

        const rawText =
            geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) {
            return NextResponse.json(
                { error: "No analysis generated. Try a clearer image." },
                { status: 422 }
            );
        }

        // Extract JSON from the response
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return NextResponse.json(
                { error: "Invalid response format from AI." },
                { status: 422 }
            );
        }

        const result = JSON.parse(jsonMatch[0]);
        return NextResponse.json({
            ...result,
            healthy: result.disease === "Healthy",
        });
    } catch (err) {
        console.error("analyze-plant route error:", err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}
