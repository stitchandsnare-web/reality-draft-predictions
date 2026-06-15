import { useState, useEffect } from "react";
import { supabase } from "./supabase.js";

const ADMIN_EMAIL = "steven.sparacino@bol-agency.com";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --gold: #C9A84C; --gold-dim: #a8873a; --cream: #FAF7F2; --ink: #1A1208;
    --mid: #8a7060; --surface: #ffffff; --border: #e8ddd0; --green: #2ECC71;
    --shadow: 0 2px 16px rgba(26,18,8,0.10);
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--ink); min-height: 100vh; }

  /* ── LANDING ── */
  .landing { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; background: var(--ink); position: relative; overflow: hidden; }
  .landing::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.15) 0%, transparent 70%); }
  .landing-inner { position: relative; z-index: 1; text-align: center; max-width: 500px; }
  .landing-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold); margin-bottom: 20px; }
  .landing-title { font-family: 'Playfair Display', serif; font-size: clamp(48px, 10vw, 80px); line-height: 1; color: white; margin-bottom: 8px; }
  .landing-title span { color: var(--gold); }
  .landing-year { font-family: 'Playfair Display', serif; font-size: clamp(20px, 4vw, 28px); color: rgba(255,255,255,0.5); margin-bottom: 24px; letter-spacing: 0.1em; }
  .landing-sub { font-size: 15px; color: rgba(255,255,255,0.55); margin-bottom: 40px; line-height: 1.7; }
  .google-btn { display: inline-flex; align-items: center; gap: 12px; background: var(--gold); color: var(--ink); border: none; padding: 16px 32px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600; border-radius: 4px; cursor: pointer; transition: all 0.15s; }
  .google-btn:hover { background: var(--gold-dim); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(201,168,76,0.4); }
  .google-icon { width: 20px; height: 20px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: var(--gold); flex-shrink: 0; }

  /* ── APP SHELL ── */
  .app { min-height: 100vh; display: flex; flex-direction: column; }
  .topbar { background: var(--ink); color: white; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; height: 56px; position: sticky; top: 0; z-index: 100; }
  .topbar-brand { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--gold); letter-spacing: 0.05em; }
  .topbar-nav { display: flex; gap: 4px; }
  .nav-btn { background: transparent; border: none; color: rgba(255,255,255,0.55); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; padding: 6px 14px; border-radius: 3px; cursor: pointer; transition: all 0.15s; text-transform: uppercase; letter-spacing: 0.05em; }
  .nav-btn:hover, .nav-btn.active { background: rgba(255,255,255,0.1); color: white; }
  .nav-btn.active { color: var(--gold); }
  .nav-btn.admin-btn { color: rgba(201,168,76,0.6); }
  .nav-btn.admin-btn.active { color: var(--gold); }
  .topbar-user { display: flex; align-items: center; gap: 10px; }
  .topbar-user .name { font-size: 13px; color: rgba(255,255,255,0.6); display: none; }
  @media (min-width: 640px) { .topbar-user .name { display: block; } }
  .avatar { width: 32px; height: 32px; background: var(--gold); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: var(--ink); flex-shrink: 0; }
  .signout-btn { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.5); font-size: 11px; padding: 4px 10px; border-radius: 3px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .signout-btn:hover { border-color: rgba(255,255,255,0.5); color: white; }

  /* ── PREDICTIONS PAGE ── */
  .predictions-page { max-width: 680px; margin: 0 auto; padding: 32px 16px 80px; }
  .page-title { font-family: 'Playfair Display', serif; font-size: 36px; color: var(--ink); margin-bottom: 4px; }
  .page-meta { font-size: 13px; color: var(--mid); margin-bottom: 32px; }
  .locked-banner { background: var(--ink); color: var(--gold); border-radius: 4px; padding: 10px 16px; font-size: 13px; font-weight: 600; margin-bottom: 24px; display: flex; align-items: center; gap: 8px; }
  .question-card { background: white; border: 1.5px solid var(--border); border-radius: 8px; padding: 20px; margin-bottom: 16px; transition: all 0.12s; }
  .question-card.answered { border-color: var(--gold); }
  .question-number { font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--mid); margin-bottom: 8px; }
  .question-text { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: var(--ink); margin-bottom: 16px; line-height: 1.4; }
  .options-grid { display: flex; flex-direction: column; gap: 8px; }
  .option-btn { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border: 1.5px solid var(--border); border-radius: 6px; background: white; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; color: var(--ink); transition: all 0.12s; text-align: left; }
  .option-btn:hover:not(.locked) { border-color: var(--gold); background: #fdf9f0; }
  .option-btn.selected { background: var(--gold); border-color: var(--gold); color: var(--ink); font-weight: 600; }
  .option-btn.correct { background: #e8f8ef; border-color: var(--green); color: var(--ink); }
  .option-btn.correct.selected { background: var(--green); border-color: var(--green); color: white; }
  .option-btn.incorrect.selected { background: #fdf0f0; border-color: #e74c3c; color: #e74c3c; }
  .option-btn.locked { cursor: default; }
  .option-radio { width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--border); flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .option-btn.selected .option-radio { border-color: var(--ink); background: var(--ink); }
  .option-radio-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); }
  .result-tag { font-size: 11px; font-weight: 700; margin-left: auto; flex-shrink: 0; }
  .result-tag.correct { color: var(--green); }
  .result-tag.incorrect { color: #e74c3c; }

  /* ── SAVE BAR ── */
  .save-bar { position: fixed; bottom: 0; left: 0; right: 0; background: var(--ink); padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; z-index: 200; border-top: 2px solid var(--gold); gap: 12px; }
  .save-bar-text { color: rgba(255,255,255,0.7); font-size: 13px; }
  .save-bar-text strong { color: white; }
  .save-btn { background: var(--gold); color: var(--ink); border: none; padding: 10px 28px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; border-radius: 3px; cursor: pointer; transition: all 0.15s; }
  .save-btn:hover { background: var(--gold-dim); }
  .save-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .saved-badge { background: var(--green); color: white; padding: 10px 20px; border-radius: 3px; font-size: 13px; font-weight: 600; }

  /* ── LEADERBOARD ── */
  .leaderboard-page { max-width: 680px; margin: 0 auto; padding: 32px 16px 80px; }
  .lb-title { font-family: 'Playfair Display', serif; font-size: 36px; color: var(--ink); margin-bottom: 4px; }
  .lb-meta { font-size: 13px; color: var(--mid); margin-bottom: 28px; display: flex; align-items: center; gap: 8px; }
  .live-dot { width: 8px; height: 8px; background: var(--green); border-radius: 50%; animation: pulse 2s infinite; flex-shrink: 0; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
  .lb-card { background: white; border: 1.5px solid var(--border); border-radius: 8px; overflow: hidden; margin-bottom: 8px; transition: all 0.12s; }
  .lb-card:hover { border-color: var(--gold); box-shadow: var(--shadow); }
  .lb-card.me { border-color: var(--gold); background: #fdf9f0; }
  .lb-row { display: flex; align-items: center; padding: 14px 18px; gap: 14px; }
  .lb-rank { font-family: 'Playfair Display', serif; font-size: 24px; color: var(--mid); min-width: 32px; text-align: center; }
  .lb-rank.top { color: var(--gold); }
  .lb-avatar { width: 40px; height: 40px; background: var(--ink); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: white; flex-shrink: 0; }
  .lb-avatar.me-av { background: var(--gold); color: var(--ink); }
  .lb-info { flex: 1; min-width: 0; }
  .lb-name { font-weight: 600; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .lb-detail { font-size: 12px; color: var(--mid); margin-top: 2px; }
  .lb-score { text-align: right; flex-shrink: 0; }
  .lb-pts { font-family: 'Playfair Display', serif; font-size: 28px; line-height: 1; color: var(--gold); }
  .lb-pts-label { font-size: 10px; color: var(--mid); text-transform: uppercase; letter-spacing: 0.08em; }
  .lb-bar-wrap { padding: 0 18px 14px; }
  .lb-bar { height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; }
  .lb-bar-fill { height: 100%; background: var(--gold); border-radius: 2px; transition: width 0.6s ease; }
  .lb-empty { text-align: center; padding: 60px 20px; color: var(--mid); font-size: 14px; }

  /* ── ADMIN ── */
  .admin-page { max-width: 720px; margin: 0 auto; padding: 32px 16px 80px; }
  .admin-title { font-family: 'Playfair Display', serif; font-size: 36px; color: var(--ink); margin-bottom: 4px; }
  .admin-meta { font-size: 13px; color: var(--mid); margin-bottom: 28px; }
  .admin-section { margin-bottom: 32px; }
  .admin-section-title { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--ink); margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1.5px solid var(--border); }
  .admin-form { background: white; border: 1.5px solid var(--border); border-radius: 8px; padding: 20px; margin-bottom: 16px; }
  .form-group { margin-bottom: 14px; }
  .form-label { display: block; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--mid); margin-bottom: 6px; }
  .form-input { width: 100%; padding: 9px 12px; border: 1.5px solid var(--border); border-radius: 4px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--ink); background: white; transition: border-color 0.12s; }
  .form-input:focus { outline: none; border-color: var(--gold); }
  .option-row { display: flex; gap: 8px; margin-bottom: 8px; }
  .option-row .form-input { flex: 1; }
  .add-option-btn { background: transparent; border: 1.5px dashed var(--border); border-radius: 4px; padding: 8px; font-size: 12px; color: var(--mid); cursor: pointer; width: 100%; transition: all 0.12s; font-family: 'DM Sans', sans-serif; }
  .add-option-btn:hover { border-color: var(--gold); color: var(--gold); }
  .admin-submit-btn { background: var(--gold); color: var(--ink); border: none; padding: 10px 24px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; border-radius: 4px; cursor: pointer; transition: all 0.12s; }
  .admin-submit-btn:hover { background: var(--gold-dim); }
  .admin-submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .question-admin-card { background: white; border: 1.5px solid var(--border); border-radius: 8px; padding: 16px; margin-bottom: 12px; }
  .question-admin-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
  .question-admin-text { font-weight: 600; font-size: 15px; flex: 1; }
  .question-admin-actions { display: flex; gap: 6px; flex-shrink: 0; }
  .answer-select { padding: 6px 10px; border: 1.5px solid var(--border); border-radius: 4px; font-family: 'DM Sans', sans-serif; font-size: 13px; background: white; color: var(--ink); cursor: pointer; }
  .answer-select:focus { outline: none; border-color: var(--gold); }
  .mark-btn { padding: 6px 14px; background: var(--green); color: white; border: none; border-radius: 4px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; }
  .mark-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .delete-btn { padding: 6px 10px; background: transparent; color: #e74c3c; border: 1.5px solid #e74c3c; border-radius: 4px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; }
  .delete-btn:hover { background: #fdf0f0; }
  .options-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .option-tag { padding: 4px 10px; background: var(--cream); border: 1px solid var(--border); border-radius: 12px; font-size: 12px; color: var(--mid); }
  .option-tag.correct-answer { background: #e8f8ef; border-color: var(--green); color: #1a7a40; font-weight: 600; }
  .admin-toggle { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .toggle-label { font-size: 14px; font-weight: 500; }
  .toggle-btn { position: relative; width: 44px; height: 24px; background: var(--border); border: none; border-radius: 12px; cursor: pointer; transition: background 0.2s; }
  .toggle-btn.on { background: var(--gold); }
  .toggle-knob { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; background: white; border-radius: 50%; transition: transform 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
  .toggle-btn.on .toggle-knob { transform: translateX(20px); }

  /* ── MISC ── */
  .toast { position: fixed; top: 72px; right: 20px; background: var(--ink); color: white; padding: 12px 20px; border-radius: 4px; font-size: 13px; font-weight: 500; border-left: 3px solid var(--gold); z-index: 999; animation: slideIn 0.2s ease; max-width: calc(100vw - 40px); }
  @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
  .loading { display: flex; align-items: center; justify-content: center; height: 100vh; font-family: 'Playfair Display', serif; font-size: 24px; color: var(--gold); letter-spacing: 0.1em; background: var(--ink); }
  .empty-state { text-align: center; padding: 60px 20px; color: var(--mid); }
  .empty-state-icon { font-size: 48px; margin-bottom: 16px; }
  .empty-state-title { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--ink); margin-bottom: 8px; }
  .empty-state-text { font-size: 14px; line-height: 1.6; }
`;

const getInitials = (name) => name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";

// ── Leaderboard ──
const Leaderboard = ({ currentUserId }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("picks").select("user_id, user_name, score").order("score", { ascending: false });
      // Deduplicate by user_id keeping highest score
      const map = {};
      (data || []).forEach((r) => { if (!map[r.user_id] || r.score > map[r.user_id].score) map[r.user_id] = r; });
      setEntries(Object.values(map).sort((a, b) => b.score - a.score));
      setLoading(false);
    };
    fetchData();
    const ch = supabase.channel("lb").on("postgres_changes", { event: "*", schema: "public", table: "picks" }, fetchData).subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  const max = entries[0]?.score || 1;
  if (loading) return <div className="loading">Las Culturitas</div>;
  return (
    <div className="leaderboard-page">
      <div className="lb-title">Leaderboard</div>
      <div className="lb-meta"><span className="live-dot" /><span>Live · Las Culturitas 2026</span></div>
      {entries.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🏆</div>
          <div className="empty-state-title">No scores yet</div>
          <div className="empty-state-text">Leaderboard updates as answers are revealed.</div>
        </div>
      )}
      {entries.map((entry, i) => {
        const isMe = entry.user_id === currentUserId;
        return (
          <div key={entry.user_id} className={`lb-card${isMe ? " me" : ""}`}>
            <div className="lb-row">
              <div className={`lb-rank${i < 3 ? " top" : ""}`}>{i + 1}</div>
              <div className={`lb-avatar${isMe ? " me-av" : ""}`}>{getInitials(entry.user_name)}</div>
              <div className="lb-info">
                <div className="lb-name">{entry.user_name}{isMe ? " (you)" : ""}</div>
                <div className="lb-detail">{entry.score} pts</div>
              </div>
              <div className="lb-score"><div className="lb-pts">{entry.score}</div><div className="lb-pts-label">pts</div></div>
            </div>
            <div className="lb-bar-wrap"><div className="lb-bar"><div className="lb-bar-fill" style={{ width: `${(entry.score / max) * 100}%` }} /></div></div>
          </div>
        );
      })}
    </div>
  );
};

// ── Admin Panel ──
const AdminPanel = ({ onToast }) => {
  const [questions, setQuestions] = useState([]);
  const [locked, setLocked] = useState(false);
  const [newQ, setNewQ] = useState({ text: "", options: ["", ""] });
  const [answerSelections, setAnswerSelections] = useState({});
  const [saving, setSaving] = useState(false);

  const loadQuestions = async () => {
    const { data } = await supabase.from("questions").select("*").order("created_at", { ascending: true });
    setQuestions(data || []);
  };

  const loadSettings = async () => {
    const { data } = await supabase.from("settings").select("value").eq("key", "locked").single();
    setLocked(data?.value === "true");
  };

  useEffect(() => { loadQuestions(); loadSettings(); }, []);

  const toggleLock = async () => {
    const newVal = !locked;
    setLocked(newVal);
    await supabase.from("settings").upsert({ key: "locked", value: String(newVal) }, { onConflict: "key" });
    onToast(newVal ? "🔒 Predictions locked" : "🔓 Predictions unlocked");
  };

  const addOption = () => setNewQ((q) => ({ ...q, options: [...q.options, ""] }));
  const updateOption = (i, val) => setNewQ((q) => { const o = [...q.options]; o[i] = val; return { ...q, options: o }; });

  const submitQuestion = async () => {
    if (!newQ.text.trim() || newQ.options.filter(o => o.trim()).length < 2) {
      onToast("Add a question and at least 2 options"); return;
    }
    setSaving(true);
    const { error } = await supabase.from("questions").insert({
      text: newQ.text.trim(),
      options: newQ.options.filter(o => o.trim()),
      correct_answer: null,
    });
    if (error) { onToast("Error saving question"); }
    else { setNewQ({ text: "", options: ["", ""] }); loadQuestions(); onToast("Question added! ✓"); }
    setSaving(false);
  };

  const markAnswer = async (qId) => {
    const answer = answerSelections[qId];
    if (!answer) { onToast("Select the correct answer first"); return; }
    await supabase.from("questions").update({ correct_answer: answer }).eq("id", qId);
    // Rescore all picks for this question
    const { data: allPicks } = await supabase.from("picks").select("*").eq("question_id", qId);
    for (const pick of allPicks || []) {
      const correct = pick.answer === answer;
      await supabase.from("picks").update({ correct, score: correct ? 1 : 0 }).eq("id", pick.id);
    }
    // Update user totals
    const { data: allUserPicks } = await supabase.from("picks").select("user_id, user_name, score");
    const userTotals = {};
    (allUserPicks || []).forEach((p) => {
      if (!userTotals[p.user_id]) userTotals[p.user_id] = { user_id: p.user_id, user_name: p.user_name, score: 0 };
      userTotals[p.user_id].score += (p.score || 0);
    });
    loadQuestions();
    onToast(`✓ Answer marked — ${(allPicks || []).filter(p => p.answer === answer).length} correct picks`);
  };

  const deleteQuestion = async (qId) => {
    await supabase.from("picks").delete().eq("question_id", qId);
    await supabase.from("questions").delete().eq("id", qId);
    loadQuestions();
    onToast("Question deleted");
  };

  return (
    <div className="admin-page">
      <div className="admin-title">Admin</div>
      <div className="admin-meta">Only visible to you</div>

      <div className="admin-section">
        <div className="admin-section-title">Game Settings</div>
        <div className="admin-toggle">
          <button className={`toggle-btn${locked ? " on" : ""}`} onClick={toggleLock}>
            <div className="toggle-knob" />
          </button>
          <span className="toggle-label">{locked ? "🔒 Predictions locked" : "🔓 Predictions open"}</span>
        </div>
      </div>

      <div className="admin-section">
        <div className="admin-section-title">Add Question</div>
        <div className="admin-form">
          <div className="form-group">
            <label className="form-label">Question</label>
            <input className="form-input" placeholder="Who will win Best Dressed?" value={newQ.text} onChange={(e) => setNewQ(q => ({ ...q, text: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Answer Options</label>
            {newQ.options.map((opt, i) => (
              <div key={i} className="option-row">
                <input className="form-input" placeholder={`Option ${i + 1}`} value={opt} onChange={(e) => updateOption(i, e.target.value)} />
              </div>
            ))}
            <button className="add-option-btn" onClick={addOption}>+ Add option</button>
          </div>
          <button className="admin-submit-btn" onClick={submitQuestion} disabled={saving}>{saving ? "Saving..." : "Add Question"}</button>
        </div>
      </div>

      <div className="admin-section">
        <div className="admin-section-title">Questions ({questions.length})</div>
        {questions.length === 0 && <div style={{ color: 'var(--mid)', fontSize: 14 }}>No questions yet — add one above.</div>}
        {questions.map((q, i) => (
          <div key={q.id} className="question-admin-card">
            <div className="question-admin-header">
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: 4 }}>Q{i + 1}</div>
                <div className="question-admin-text">{q.text}</div>
              </div>
              <div className="question-admin-actions">
                <button className="delete-btn" onClick={() => deleteQuestion(q.id)}>Delete</button>
              </div>
            </div>
            <div className="options-list" style={{ marginBottom: 12 }}>
              {(q.options || []).map((opt) => (
                <span key={opt} className={`option-tag${q.correct_answer === opt ? " correct-answer" : ""}`}>{opt}{q.correct_answer === opt ? " ✓" : ""}</span>
              ))}
            </div>
            {!q.correct_answer ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <select className="answer-select" value={answerSelections[q.id] || ""} onChange={(e) => setAnswerSelections(s => ({ ...s, [q.id]: e.target.value }))}>
                  <option value="">Select correct answer...</option>
                  {(q.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <button className="mark-btn" onClick={() => markAnswer(q.id)} disabled={!answerSelections[q.id]}>Mark Correct</button>
              </div>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>✓ Answer revealed: {q.correct_answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Predictions (player view) ──
const PredictionsView = ({ session, onToast }) => {
  const [questions, setQuestions] = useState([]);
  const [picks, setPicks] = useState({});
  const [locked, setLocked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: qs }, { data: ps }, { data: settings }] = await Promise.all([
        supabase.from("questions").select("*").order("created_at", { ascending: true }),
        supabase.from("picks").select("*").eq("user_id", session.user.id),
        supabase.from("settings").select("value").eq("key", "locked").single(),
      ]);
      setQuestions(qs || []);
      const pickMap = {};
      (ps || []).forEach((p) => { pickMap[p.question_id] = p.answer; });
      setPicks(pickMap);
      setLocked(settings?.value === "true");
      setLoading(false);
    };
    load();
    const ch = supabase.channel("q-watch").on("postgres_changes", { event: "*", schema: "public", table: "questions" }, load).subscribe();
    return () => supabase.removeChannel(ch);
  }, [session.user.id]);

  const handlePick = (questionId, answer) => {
    if (locked) return;
    setPicks((p) => ({ ...p, [questionId]: answer }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const userName = session.user.user_metadata?.full_name || session.user.email;
    const rows = Object.entries(picks).map(([question_id, answer]) => ({
      user_id: session.user.id,
      user_name: userName,
      user_email: session.user.email,
      question_id,
      answer,
      correct: null,
      score: 0,
    }));
    const { error } = await supabase.from("picks").upsert(rows, { onConflict: "user_id,question_id" });
    setSaving(false);
    if (error) { onToast("Error saving — try again"); return; }
    setSaved(true);
    onToast("Predictions saved! 🏆");
  };

  const answeredCount = Object.keys(picks).length;

  if (loading) return <div className="loading">Las Culturitas</div>;

  return (
    <>
      <div className="predictions-page">
        <div className="page-title">Your Predictions</div>
        <div className="page-meta">Las Culturitas Culture Awards 2026 · {answeredCount} of {questions.length} answered</div>
        {locked && <div className="locked-banner">🔒 Predictions are locked — results coming soon</div>}
        {questions.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">✨</div>
            <div className="empty-state-title">Questions coming soon</div>
            <div className="empty-state-text">The admin is setting up the prediction questions. Check back shortly!</div>
          </div>
        )}
        {questions.map((q, i) => {
          const selected = picks[q.question_id] || picks[q.id];
          const hasAnswer = !!q.correct_answer;
          return (
            <div key={q.id} className={`question-card${selected ? " answered" : ""}`}>
              <div className="question-number">Question {i + 1}</div>
              <div className="question-text">{q.text}</div>
              <div className="options-grid">
                {(q.options || []).map((opt) => {
                  const isSelected = selected === opt;
                  const isCorrect = hasAnswer && q.correct_answer === opt;
                  const isIncorrect = hasAnswer && isSelected && !isCorrect;
                  let cls = "option-btn";
                  if (locked || hasAnswer) cls += " locked";
                  if (isSelected) cls += " selected";
                  if (isCorrect) cls += " correct";
                  if (isIncorrect) cls += " incorrect";
                  return (
                    <button key={opt} className={cls} onClick={() => handlePick(q.id, opt)}>
                      <div className="option-radio">{isSelected && <div className="option-radio-dot" />}</div>
                      {opt}
                      {hasAnswer && isCorrect && <span className="result-tag correct">✓ Correct</span>}
                      {hasAnswer && isIncorrect && <span className="result-tag incorrect">✗ Wrong</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {!locked && questions.length > 0 && (
        <div className="save-bar">
          <div className="save-bar-text"><strong>{answeredCount}</strong> of {questions.length} answered</div>
          {saved ? <div className="saved-badge">✓ Saved</div> : (
            <button className="save-btn" onClick={handleSave} disabled={answeredCount === 0 || saving}>
              {saving ? "Saving..." : "Save Predictions"}
            </button>
          )}
        </div>
      )}
    </>
  );
};

// ── Main App ──
export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tab, setTab] = useState("predictions");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const style = document.createElement("style"); style.textContent = css; document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setAuthLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const handleLogin = async () => { await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.href } }); };
  const handleSignOut = async () => { await supabase.auth.signOut(); setSession(null); };

  const isAdmin = session?.user?.email === ADMIN_EMAIL;
  const userName = session?.user?.user_metadata?.full_name || session?.user?.email || "";

  if (authLoading) return <div className="loading">Las Culturitas</div>;

  if (!session) {
    return (
      <div className="landing">
        <div className="landing-inner">
          <div className="landing-eyebrow">Bravo · Culture Awards</div>
          <div className="landing-title">Las<br /><span>Culturitas</span></div>
          <div className="landing-year">2026</div>
          <div className="landing-sub">Make your predictions for the most dramatic night in reality TV. Sign in with Google to play.</div>
          <button className="google-btn" onClick={handleLogin}><span className="google-icon">G</span>Sign in with Google</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {toast && <div className="toast">{toast}</div>}
      <div className="topbar">
        <div className="topbar-brand">Las Culturitas</div>
        <div className="topbar-nav">
          <button className={`nav-btn${tab === "predictions" ? " active" : ""}`} onClick={() => setTab("predictions")}>Predictions</button>
          <button className={`nav-btn${tab === "leaderboard" ? " active" : ""}`} onClick={() => setTab("leaderboard")}>Leaderboard</button>
          {isAdmin && <button className={`nav-btn admin-btn${tab === "admin" ? " active" : ""}`} onClick={() => setTab("admin")}>⚙ Admin</button>}
        </div>
        <div className="topbar-user">
          <span className="name">{userName}</span>
          <div className="avatar">{getInitials(userName)}</div>
          <button className="signout-btn" onClick={handleSignOut}>Sign out</button>
        </div>
      </div>
      {tab === "predictions" && <PredictionsView session={session} onToast={showToast} />}
      {tab === "leaderboard" && <Leaderboard currentUserId={session.user.id} />}
      {tab === "admin" && isAdmin && <AdminPanel onToast={showToast} />}
    </div>
  );
}
