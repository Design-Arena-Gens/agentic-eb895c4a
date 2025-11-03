"use client";
import { useMemo, useState } from 'react';

export default function Page() {
  const [resume, setResume] = useState<string>("");
  const [jd, setJd] = useState<string>("");
  const [revised, setRevised] = useState<string>("");
  const [score, setScore] = useState<number | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [missing, setMissing] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const disabled = useMemo(() => !resume.trim() || !jd.trim() || loading, [resume, jd, loading]);

  async function handleRevise() {
    setLoading(true);
    try {
      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: resume, jobDescription: jd })
      });
      const data = await res.json();
      setRevised(data.revisedText);
      setScore(data.atsScore);
      setKeywords(data.keywords || []);
      setMissing(data.missingKeywords || []);
    } finally {
      setLoading(false);
    }
  }

  function downloadTxt() {
    const blob = new Blob([revised], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume_revised.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="container">
      <div className="card" style={{ marginBottom: 16 }}>
        <h1 className="heading">ATS Resume Rewriter</h1>
        <div className="sub">Paste your current resume (plain text) and the job description. The tool rephrases wording to align with keywords while preserving layout and line order. No new content is added.</div>
        <div className="row">
          <span className="badge">100% client-side preview; rewriting runs on server</span>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <div className="label">Current Resume (paste as plain text to preserve formatting)</div>
          <textarea className="textarea" value={resume} onChange={(e) => setResume(e.target.value)} placeholder={"Paste your resume text here. Keep spacing as-is to preserve layout."} />
        </div>
        <div className="card">
          <div className="label">Job Description</div>
          <textarea className="textarea" value={jd} onChange={(e) => setJd(e.target.value)} placeholder={"Paste the job description here."} />
        </div>
      </div>

      <div className="row" style={{ marginTop: 16 }}>
        <button className="button" onClick={handleRevise} disabled={disabled}>{loading ? 'Revising?' : 'Revise Resume'}</button>
        {revised && (
          <>
            <span className="badge">ATS Match: {Math.round((score ?? 0) * 100)}%</span>
            <button className="button" onClick={downloadTxt}>Download .txt</button>
          </>
        )}
      </div>

      {revised && (
        <div className="grid" style={{ marginTop: 16 }}>
          <div className="card">
            <div className="label">Revised Resume (layout, order, spacing preserved)</div>
            <pre className="textarea output" style={{ minHeight: 420 }}>{revised}</pre>
            <div className="small" style={{ marginTop: 8 }}>Tip: Copy/paste back into your original doc to keep fonts and exact styling.</div>
          </div>
          <div className="card">
            <div className="label">Keywords Detected</div>
            <div className="klist">
              {keywords.map((k) => (<span key={k} className="kitem">{k}</span>))}
            </div>
            <div className="label" style={{ marginTop: 12 }}>Still Missing</div>
            {missing.length ? (
              <div className="klist">
                {missing.map((k) => (<span key={k} className="kitem" style={{ background: '#fff1f2', borderColor: '#fecaca' }}>{k}</span>))}
              </div>
            ) : (
              <div className="small">No significant missing keywords detected.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
