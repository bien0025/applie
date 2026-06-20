// =============================================================
// parse-job — turn a job-listing webpage into a saved application
// =============================================================
// Body: { pageTitle, pageUrl, pageText }
// Returns: { application } — the newly inserted applications row.
//
// Auth: uses the caller's JWT so the insert goes under their user_id (RLS).

import { createClient } from 'jsr:@supabase/supabase-js@2';

const SILICONFLOW_API_KEY = Deno.env.get('SILICONFLOW_API_KEY')!;
const SILICONFLOW_URL = 'https://api.siliconflow.com/v1/chat/completions';
const MODEL = 'tencent/Hy3-preview';

const SYSTEM_PROMPT = `You parse job postings into structured JSON. The user gives you a webpage's title, URL, and main text. Extract the job details.

OUTPUT ONLY a valid JSON object — no markdown fences, no commentary:
{
  "company": "Company name",
  "role": "Job title",
  "location": "Remote / Hybrid / City, ST or empty string",
  "salary": "e.g. $120k or $120k-$150k or empty string",
  "platform": "LinkedIn / Indeed / Glassdoor / etc — inferred from URL",
  "description": "1-3 sentence summary of the role"
}

If the page is NOT a job posting (e.g. homepage, search results), return:
{ "company": "", "role": "", "_notJobPosting": true }`;

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

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return json({ error: 'Unauthorized' }, 401);

  const { pageTitle, pageUrl, pageText } = await req.json().catch(() => ({}));
  if (!pageText) return json({ error: 'No page text provided' }, 400);

  const userPrompt = `URL: ${pageUrl}
TITLE: ${pageTitle}

PAGE TEXT (truncated):
${pageText}

Return the JSON now.`;

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
        max_tokens: 1024,
      }),
      signal: AbortSignal.timeout(60_000),
    });
  } catch (e) {
    console.error('Network error reaching SiliconFlow:', e);
    return json({ error: 'AI service unreachable. Try again.' }, 502);
  }

  if (!aiRes.ok) {
    const errText = await aiRes.text().catch(() => '');
    console.error('SiliconFlow non-OK:', aiRes.status, errText);
    return json({ error: `AI service error (${aiRes.status})` }, 502);
  }

  const aiData = await aiRes.json();
  const raw = aiData.choices?.[0]?.message?.content?.trim() || '{}';

  let parsed: any;
  try {
    const cleaned = raw.replace(/^```(?:json)?\s*|\s*```$/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.error('Failed to parse AI response. Raw:', raw);
    return json({ error: 'AI returned invalid format' }, 500);
  }

  if (parsed._notJobPosting || !parsed.company || !parsed.role) {
    return json(
      { error: "This page doesn't look like a job posting." },
      400
    );
  }

  // Insert under the caller's user_id (RLS will enforce it).
  const { data: app, error: insertError } = await supabase
    .from('applications')
    .insert({
      user_id: user.id,
      company: parsed.company,
      role: parsed.role,
      location: parsed.location || null,
      salary: parsed.salary || null,
      platform: parsed.platform || null,
      description: parsed.description || null,
      url: pageUrl,
      status: 'Applied',
    })
    .select()
    .single();

  if (insertError) {
    console.error('Insert error:', insertError);
    return json({ error: 'Could not save to database.' }, 500);
  }

  return json({ application: app });
});
