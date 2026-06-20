// =============================================================
// tailor-resume — AI resume tailoring via SiliconFlow
// =============================================================
// Body: { resumeText: string, applicationId: uuid }
// Returns: { suggestions: Array<{ type, original?, suggestion, reason }> }
//
// Auth: uses the caller's JWT so the application lookup is RLS-protected
// (the user can only tailor against their own saved jobs).

import { createClient } from 'jsr:@supabase/supabase-js@2';

const SILICONFLOW_API_KEY = Deno.env.get('SILICONFLOW_API_KEY')!;
const SILICONFLOW_URL = 'https://api.siliconflow.com/v1/chat/completions';
const MODEL = 'tencent/Hy3-preview';

const SYSTEM_PROMPT = `You are a resume tailoring assistant. Given a user's resume and a job description, suggest specific text-level edits that would make the resume better match the job.

RULES:
- Only suggest changes HONEST to the user's existing experience. NEVER invent skills, companies, dates, titles, or accomplishments.
- Focus on rephrasing for keyword match and stronger impact verbs.
- Each suggestion should be small and specific — a phrase or single bullet, not a whole section.
- Output ONLY a valid JSON array. No markdown fences, no commentary, no explanation.

Format:
[
  { "type": "replace", "original": "exact text from resume", "suggestion": "the new text", "reason": "why this helps (1 short sentence)" },
  { "type": "add", "suggestion": "new bullet/phrase to add", "reason": "why this helps" }
]

Return 5-10 suggestions. If nothing meaningful to improve, return [].`;

const cors = {
  'Access-Control-Allow-Origin': '*',
  // Include `x-client-info` + `apikey` — the Supabase JS client adds them.
  'Access-Control-Allow-Headers':
    'authorization, content-type, x-client-info, apikey',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...cors },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json({ error: 'Unauthorized' }, 401);

  // Caller's auth context — RLS gates which applications we can read.
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { resumeText, applicationId } = await req.json().catch(() => ({}));
  if (!resumeText || !applicationId) {
    return json({ error: 'Missing resumeText or applicationId' }, 400);
  }

  // Pull the target job from the caller's pipeline.
  const { data: app, error: appError } = await supabase
    .from('applications')
    .select('company, role, description, location, salary')
    .eq('id', applicationId)
    .single();

  if (appError || !app) {
    return json({ error: 'Application not found or not yours.' }, 404);
  }

  const userPrompt = `JOB
Company: ${app.company}
Role: ${app.role}
${app.location ? `Location: ${app.location}\n` : ''}${app.salary ? `Salary: ${app.salary}\n` : ''}Description:
${app.description || '(no description provided — focus on matching the role title)'}

RESUME
${resumeText}

Return the JSON array of suggestions now.`;

  let aiRes: Response;
  try {
    aiRes = await fetch(SILICONFLOW_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SILICONFLOW_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        reasoning_effort: 'low',
        stream: false,
        max_tokens: 4096,
      }),
      signal: AbortSignal.timeout(90_000),
    });
  } catch (e) {
    console.error('Network error reaching SiliconFlow:', e);
    return json({ error: 'AI service unreachable. Try again in a moment.' }, 502);
  }

  if (!aiRes.ok) {
    const errText = await aiRes.text().catch(() => '');
    console.error('SiliconFlow non-OK:', aiRes.status, errText);
    return json({ error: `AI service error (${aiRes.status}).` }, 502);
  }

  const data = await aiRes.json();
  const raw = data.choices?.[0]?.message?.content?.trim() || '[]';

  // Strip markdown fences if the model added them despite instructions.
  let suggestions: unknown[] = [];
  try {
    const cleaned = raw.replace(/^```(?:json)?\s*|\s*```$/g, '').trim();
    suggestions = JSON.parse(cleaned);
    if (!Array.isArray(suggestions)) throw new Error('not an array');
  } catch (e) {
    console.error('Failed to parse AI response. Raw:', raw);
    return json({ error: 'AI returned invalid format. Try again.' }, 500);
  }

  return json({ suggestions });
});
