import { useState, useEffect } from "react";
import { supabase } from "./supabase.js";

const ADMIN_EMAIL = "steven.sparacino@bol-agency.com";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --black:   #020001;
    --burg:    #400B2F;
    --purple:  #342568;
    --violet:  #6644BE;
    --gold:    #DBBC6C;
    --gold-dim:#b89a4a;
    --surface: #0e0818;
    --card:    #1a1030;
    --border:  rgba(102,68,190,0.25);
    --border-bright: rgba(219,188,108,0.4);
    --mid:     #9b8ec4;
    --green:   #2ECC71;
    --shadow:  0 4px 24px rgba(2,0,1,0.5);
  }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', sans-serif; background: var(--black); color: white; min-height: 100vh; -webkit-font-smoothing: antialiased; }

  /* ── LANDING ── */
  .landing {
    min-height: 100vh; display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 40px 20px; position: relative; overflow: hidden;
    background: linear-gradient(160deg, var(--black) 0%, var(--burg) 50%, var(--purple) 100%);
  }
  .landing::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 30%, rgba(219,188,108,0.12) 0%, transparent 65%),
                radial-gradient(ellipse at 80% 80%, rgba(102,68,190,0.2) 0%, transparent 50%);
  }
  .landing-stars {
    position: absolute; inset: 0; overflow: hidden; pointer-events: none;
  }
  .landing-inner { position: relative; z-index: 1; text-align: center; max-width: 520px; width: 100%; }
  .landing-eyebrow {
    font-size: 11px; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 24px; opacity: 0.9;
  }
  .landing-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(56px, 14vw, 96px);
    line-height: 0.9; color: white; margin-bottom: 4px;
    text-shadow: 0 0 80px rgba(219,188,108,0.3);
  }
  .landing-title span { color: var(--gold); font-style: italic; }
  .landing-year {
    font-family: 'Playfair Display', serif; font-size: clamp(16px, 3vw, 22px);
    color: rgba(255,255,255,0.4); margin-bottom: 28px; letter-spacing: 0.3em;
  }
  .landing-divider {
    width: 60px; height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent);
    margin: 0 auto 28px;
  }
  .landing-sub { font-size: 15px; color: rgba(255,255,255,0.6); margin-bottom: 44px; line-height: 1.7; max-width: 360px; margin-left: auto; margin-right: auto; }
  .google-btn {
    display: inline-flex; align-items: center; gap: 12px;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dim) 100%);
    color: var(--black); border: none; padding: 16px 36px;
    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700;
    border-radius: 50px; cursor: pointer; transition: all 0.2s;
    box-shadow: 0 4px 20px rgba(219,188,108,0.3);
    margin-bottom: 44px;
  }
  .google-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(219,188,108,0.5); }
  .google-icon {
    width: 22px; height: 22px; background: var(--black); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: var(--gold); flex-shrink: 0;
  }

  /* ── APP SHELL ── */
  .app { min-height: 100vh; display: flex; flex-direction: column; background: var(--black); }
  .topbar {
    background: rgba(2,0,1,0.95); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    color: white; display: flex; align-items: center; justify-content: space-between;
    padding: 0 20px; height: 56px; position: sticky; top: 0; z-index: 100;
  }
  .topbar-brand { font-family: 'Playfair Display', serif; font-size: 17px; color: var(--gold); letter-spacing: 0.03em; font-style: italic; }
  .topbar-nav { display: flex; gap: 2px; }
  .nav-btn {
    background: transparent; border: none; color: rgba(255,255,255,0.45);
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
    padding: 6px 12px; border-radius: 20px; cursor: pointer; transition: all 0.15s;
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .nav-btn:hover { background: rgba(102,68,190,0.2); color: white; }
  .nav-btn.active { background: rgba(102,68,190,0.3); color: var(--gold); }
  .nav-btn.admin-btn { color: rgba(219,188,108,0.5); }
  .nav-btn.admin-btn.active { color: var(--gold); background: rgba(64,11,47,0.5); }
  .topbar-user { display: flex; align-items: center; gap: 8px; }
  .topbar-user .name { font-size: 12px; color: rgba(255,255,255,0.5); display: none; }
  @media (min-width: 640px) { .topbar-user .name { display: block; } }
  .avatar {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, var(--burg), var(--violet));
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: white; flex-shrink: 0;
    border: 1.5px solid var(--border-bright);
  }
  .signout-btn {
    background: transparent; border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.4); font-size: 11px; padding: 4px 10px;
    border-radius: 20px; cursor: pointer; font-family: 'DM Sans', sans-serif;
  }
  .signout-btn:hover { border-color: var(--gold); color: var(--gold); }

  /* ── PREDICTIONS PAGE ── */
  .predictions-page { max-width: 680px; margin: 0 auto; padding: 28px 16px 100px; }
  .page-hero {
    background: linear-gradient(135deg, var(--burg) 0%, var(--purple) 100%);
    border-radius: 16px; padding: 28px 24px; margin-bottom: 28px;
    border: 1px solid var(--border-bright); position: relative; overflow: hidden;
  }
  .page-hero::before {
    content: ''; position: absolute; top: -40px; right: -40px;
    width: 160px; height: 160px; border-radius: 50%;
    background: radial-gradient(circle, rgba(219,188,108,0.15) 0%, transparent 70%);
  }
  .page-title { font-family: 'Playfair Display', serif; font-size: 28px; color: white; margin-bottom: 4px; font-style: italic; }
  .page-meta { font-size: 13px; color: rgba(255,255,255,0.6); }
  .page-progress { margin-top: 16px; }
  .progress-bar { height: 4px; background: rgba(255,255,255,0.15); border-radius: 2px; overflow: hidden; margin-top: 8px; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, var(--gold), var(--violet)); border-radius: 2px; transition: width 0.4s ease; }
  .progress-label { font-size: 12px; color: rgba(255,255,255,0.5); }

  .locked-banner {
    background: linear-gradient(135deg, rgba(64,11,47,0.8), rgba(52,37,104,0.8));
    border: 1px solid var(--border-bright); color: var(--gold);
    border-radius: 10px; padding: 12px 16px; font-size: 13px; font-weight: 600;
    margin-bottom: 20px; display: flex; align-items: center; gap: 8px;
  }

  .question-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 14px; padding: 20px; margin-bottom: 14px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .question-card.answered {
    border-color: rgba(219,188,108,0.4);
    box-shadow: 0 0 0 1px rgba(219,188,108,0.1);
  }
  .question-number {
    font-size: 10px; font-weight: 700; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--violet); margin-bottom: 8px;
  }
  .question-text {
    font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700;
    color: white; margin-bottom: 14px; line-height: 1.4;
  }
  .options-grid { display: flex; flex-direction: column; gap: 8px; }
  .option-btn {
    display: flex; align-items: center; gap: 10px; padding: 11px 14px;
    border: 1px solid rgba(102,68,190,0.2); border-radius: 10px;
    background: rgba(52,37,104,0.2); cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    color: rgba(255,255,255,0.8); transition: all 0.15s; text-align: left; width: 100%;
  }
  .option-btn:hover:not(.locked-opt) { border-color: var(--violet); background: rgba(102,68,190,0.25); color: white; }
  .option-btn.selected {
    background: linear-gradient(135deg, rgba(64,11,47,0.8), rgba(52,37,104,0.8));
    border-color: var(--gold); color: var(--gold); font-weight: 600;
  }
  .option-btn.correct { background: rgba(46,204,113,0.12); border-color: var(--green); color: var(--green); }
  .option-btn.correct.selected { background: rgba(46,204,113,0.2); }
  .option-btn.incorrect.selected { background: rgba(231,76,60,0.12); border-color: #e74c3c; color: #e74c3c; }
  .option-btn.locked-opt { cursor: default; }
  .option-radio {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(102,68,190,0.4); flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; transition: all 0.15s;
  }
  .option-btn.selected .option-radio { border-color: var(--gold); background: rgba(219,188,108,0.2); }
  .option-radio-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); }
  .result-tag { font-size: 11px; font-weight: 700; margin-left: auto; flex-shrink: 0; }
  .result-tag.correct { color: var(--green); }
  .result-tag.incorrect { color: #e74c3c; }

  /* ── SAVE BAR ── */
  .save-bar {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: rgba(2,0,1,0.96); backdrop-filter: blur(12px);
    padding: 12px 20px; display: flex; align-items: center; justify-content: space-between;
    z-index: 200; border-top: 1px solid var(--border-bright); gap: 12px;
  }
  .save-bar-text { color: rgba(255,255,255,0.6); font-size: 13px; }
  .save-bar-text strong { color: white; }
  .save-btn {
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dim) 100%);
    color: var(--black); border: none; padding: 10px 28px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
    border-radius: 50px; cursor: pointer; transition: all 0.15s;
    white-space: nowrap;
  }
  .save-btn:hover { box-shadow: 0 4px 16px rgba(219,188,108,0.4); transform: translateY(-1px); }
  .save-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .saved-badge {
    background: rgba(46,204,113,0.15); color: var(--green);
    border: 1px solid rgba(46,204,113,0.3);
    padding: 10px 20px; border-radius: 50px; font-size: 13px; font-weight: 600;
  }

  /* ── LEADERBOARD ── */
  .leaderboard-page { max-width: 680px; margin: 0 auto; padding: 28px 16px 80px; }
  .lb-hero {
    background: linear-gradient(135deg, var(--purple) 0%, var(--burg) 100%);
    border-radius: 16px; padding: 28px 24px; margin-bottom: 24px;
    border: 1px solid var(--border-bright);
  }
  .lb-title { font-family: 'Playfair Display', serif; font-size: 28px; color: white; margin-bottom: 4px; font-style: italic; }
  .lb-meta { font-size: 13px; color: rgba(255,255,255,0.6); display: flex; align-items: center; gap: 8px; }
  .live-dot { width: 7px; height: 7px; background: var(--green); border-radius: 50%; animation: pulse 2s infinite; flex-shrink: 0; }
  @keyframes pulse { 0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(46,204,113,0.4); } 50% { opacity: 0.7; box-shadow: 0 0 0 4px rgba(46,204,113,0); } }
  .lb-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 14px; overflow: hidden; margin-bottom: 10px; transition: all 0.15s;
  }
  .lb-card:hover { border-color: rgba(102,68,190,0.5); }
  .lb-card.me { border-color: var(--gold); background: rgba(219,188,108,0.05); }
  .lb-card.first { border-color: var(--gold); background: linear-gradient(135deg, rgba(64,11,47,0.5), rgba(52,37,104,0.5)); }
  .lb-row { display: flex; align-items: center; padding: 14px 18px; gap: 14px; }
  .lb-rank { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--mid); min-width: 28px; text-align: center; }
  .lb-rank.top { color: var(--gold); }
  .lb-avatar {
    width: 40px; height: 40px;
    background: linear-gradient(135deg, var(--purple), var(--violet));
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: white; flex-shrink: 0;
  }
  .lb-avatar.me-av { background: linear-gradient(135deg, var(--burg), var(--gold-dim)); }
  .lb-info { flex: 1; min-width: 0; }
  .lb-name { font-weight: 600; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: white; }
  .lb-detail { font-size: 12px; color: var(--mid); margin-top: 2px; }
  .lb-score { text-align: right; flex-shrink: 0; }
  .lb-pts { font-family: 'Playfair Display', serif; font-size: 26px; line-height: 1; color: var(--gold); }
  .lb-pts-label { font-size: 10px; color: var(--mid); text-transform: uppercase; letter-spacing: 0.08em; }
  .lb-bar-wrap { padding: 0 18px 14px; }
  .lb-bar { height: 3px; background: rgba(102,68,190,0.15); border-radius: 2px; overflow: hidden; }
  .lb-bar-fill { height: 100%; background: linear-gradient(90deg, var(--burg), var(--gold)); border-radius: 2px; transition: width 0.6s ease; }
  .lb-empty { text-align: center; padding: 60px 20px; color: var(--mid); }
  .lb-empty-icon { font-size: 48px; margin-bottom: 16px; }
  .lb-empty-title { font-family: 'Playfair Display', serif; font-size: 22px; color: white; margin-bottom: 8px; }

  /* ── ADMIN ── */
  .admin-page { max-width: 720px; margin: 0 auto; padding: 28px 16px 80px; }
  .admin-hero { background: linear-gradient(135deg, var(--burg), var(--purple)); border-radius: 16px; padding: 24px; margin-bottom: 28px; border: 1px solid var(--border-bright); }
  .admin-title { font-family: 'Playfair Display', serif; font-size: 28px; color: white; margin-bottom: 4px; font-style: italic; }
  .admin-meta { font-size: 13px; color: rgba(255,255,255,0.6); }
  .admin-section { margin-bottom: 32px; }
  .admin-section-title { font-family: 'Playfair Display', serif; font-size: 20px; color: white; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }
  .admin-form { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 20px; margin-bottom: 16px; }
  .form-group { margin-bottom: 14px; }
  .form-label { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--mid); margin-bottom: 6px; }
  .form-input {
    width: 100%; padding: 10px 12px; border: 1px solid var(--border);
    border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 14px;
    color: white; background: rgba(2,0,1,0.5); transition: border-color 0.12s;
  }
  .form-input:focus { outline: none; border-color: var(--violet); }
  .form-input::placeholder { color: rgba(255,255,255,0.25); }
  .option-row { display: flex; gap: 8px; margin-bottom: 8px; }
  .option-row .form-input { flex: 1; }
  .add-option-btn {
    background: transparent; border: 1px dashed rgba(102,68,190,0.4);
    border-radius: 8px; padding: 8px; font-size: 12px; color: var(--mid);
    cursor: pointer; width: 100%; transition: all 0.12s; font-family: 'DM Sans', sans-serif;
  }
  .add-option-btn:hover { border-color: var(--violet); color: var(--violet); }
  .admin-submit-btn {
    background: linear-gradient(135deg, var(--violet), var(--purple));
    color: white; border: none; padding: 10px 24px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
    border-radius: 50px; cursor: pointer; transition: all 0.12s;
  }
  .admin-submit-btn:hover { box-shadow: 0 4px 16px rgba(102,68,190,0.4); }
  .admin-submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .question-admin-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin-bottom: 10px; }
  .question-admin-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
  .question-admin-text { font-weight: 600; font-size: 14px; flex: 1; color: white; line-height: 1.4; }
  .question-admin-actions { display: flex; gap: 6px; flex-shrink: 0; }
  .answer-select {
    padding: 6px 10px; border: 1px solid var(--border); border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 13px;
    background: rgba(2,0,1,0.5); color: white; cursor: pointer;
  }
  .answer-select:focus { outline: none; border-color: var(--violet); }
  .mark-btn { padding: 6px 14px; background: var(--green); color: var(--black); border: none; border-radius: 20px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; }
  .mark-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .delete-btn { padding: 6px 10px; background: transparent; color: #e74c3c; border: 1px solid rgba(231,76,60,0.3); border-radius: 20px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; }
  .delete-btn:hover { background: rgba(231,76,60,0.1); }
  .options-list { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
  .option-tag { padding: 4px 10px; background: rgba(52,37,104,0.3); border: 1px solid var(--border); border-radius: 20px; font-size: 11px; color: var(--mid); }
  .option-tag.correct-answer { background: rgba(46,204,113,0.1); border-color: rgba(46,204,113,0.4); color: var(--green); font-weight: 600; }
  .admin-toggle { display: flex; align-items: center; gap: 12px; padding: 16px; background: var(--card); border: 1px solid var(--border); border-radius: 12px; }
  .toggle-label { font-size: 14px; font-weight: 500; color: white; }
  .toggle-btn { position: relative; width: 48px; height: 26px; background: rgba(102,68,190,0.2); border: 1px solid var(--border); border-radius: 13px; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
  .toggle-btn.on { background: linear-gradient(135deg, var(--burg), var(--violet)); border-color: var(--gold); }
  .toggle-knob { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; background: white; border-radius: 50%; transition: transform 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.4); }
  .toggle-btn.on .toggle-knob { transform: translateX(22px); }

  /* ── MISC ── */
  .toast {
    position: fixed; top: 66px; right: 16px;
    background: rgba(14,8,24,0.95); backdrop-filter: blur(12px);
    color: white; padding: 12px 18px; border-radius: 10px; font-size: 13px; font-weight: 500;
    border: 1px solid var(--border-bright); border-left: 3px solid var(--gold);
    z-index: 999; animation: slideIn 0.2s ease; max-width: calc(100vw - 32px);
  }
  @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
  .loading {
    display: flex; align-items: center; justify-content: center; height: 100vh;
    font-family: 'Playfair Display', serif; font-size: 24px; color: var(--gold);
    letter-spacing: 0.1em; font-style: italic;
    background: linear-gradient(160deg, var(--black), var(--burg), var(--purple));
  }
  .empty-state { text-align: center; padding: 60px 20px; color: var(--mid); }
  .empty-state-icon { font-size: 48px; margin-bottom: 16px; }
  .empty-state-title { font-family: 'Playfair Display', serif; font-size: 22px; color: white; margin-bottom: 8px; }
  .empty-state-text { font-size: 14px; line-height: 1.6; }

  /* ── MOBILE ── */
  @media (max-width: 480px) {
    .topbar { padding: 0 12px; }
    .topbar-brand { font-size: 15px; }
    .nav-btn { padding: 5px 8px; font-size: 11px; }
    .predictions-page, .leaderboard-page, .admin-page { padding-left: 12px; padding-right: 12px; }
    .page-hero, .lb-hero, .admin-hero { padding: 20px 16px; }
    .question-card { padding: 16px; }
    .option-btn { font-size: 12px; padding: 10px 12px; }
    .lb-row { padding: 12px 14px; gap: 10px; }
  }
`;

const getInitials = (name) => name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";

// ── Leaderboard ──
const Leaderboard = ({ currentUserId }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("picks").select("user_id, user_name, score");
      const map = {};
      (data || []).forEach((r) => {
        if (!map[r.user_id]) map[r.user_id] = { user_id: r.user_id, user_name: r.user_name, score: 0 };
        map[r.user_id].score += (r.score || 0);
      });
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
      <div className="lb-hero">
        <div className="lb-title">Leaderboard</div>
        <div className="lb-meta"><span className="live-dot" /><span>Live · Las Culturitas 2026</span></div>
      </div>
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
          <div key={entry.user_id} className={`lb-card${isMe ? " me" : ""}${i === 0 ? " first" : ""}`}>
            <div className="lb-row">
              <div className={`lb-rank${i < 3 ? " top" : ""}`}>{i === 0 ? "🏆" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}</div>
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
    if (!newQ.text.trim() || newQ.options.filter(o => o.trim()).length < 2) { onToast("Add a question and at least 2 options"); return; }
    setSaving(true);
    const { error } = await supabase.from("questions").insert({ text: newQ.text.trim(), options: newQ.options.filter(o => o.trim()), correct_answer: null });
    if (error) { onToast("Error saving question"); } else { setNewQ({ text: "", options: ["", ""] }); loadQuestions(); onToast("Question added! ✓"); }
    setSaving(false);
  };
  const markAnswer = async (qId) => {
    const answer = answerSelections[qId];
    if (!answer) { onToast("Select the correct answer first"); return; }
    await supabase.from("questions").update({ correct_answer: answer }).eq("id", qId);
    const { data: allPicks } = await supabase.from("picks").select("*").eq("question_id", qId);
    for (const pick of allPicks || []) {
      const correct = pick.answer === answer;
      await supabase.from("picks").update({ correct, score: correct ? 1 : 0 }).eq("id", pick.id);
    }
    loadQuestions();
    onToast(`✓ Answer marked — ${(allPicks || []).filter(p => p.answer === answer).length} correct picks`);
  };
  const deleteQuestion = async (qId) => {
    await supabase.from("picks").delete().eq("question_id", qId);
    await supabase.from("questions").delete().eq("id", qId);
    loadQuestions();
    onToast("Question deleted");
  };

  const groups = questions.reduce((acc, q, i) => {
    const chunk = Math.floor(i / 10);
    if (!acc[chunk]) acc[chunk] = [];
    acc[chunk].push(q);
    return acc;
  }, {});

  return (
    <div className="admin-page">
      <div className="admin-hero">
        <div className="admin-title">Admin</div>
        <div className="admin-meta">Only visible to you · {questions.length} questions loaded</div>
      </div>
      <div className="admin-section">
        <div className="admin-section-title">Game Settings</div>
        <div className="admin-toggle">
          <button className={`toggle-btn${locked ? " on" : ""}`} onClick={toggleLock}><div className="toggle-knob" /></button>
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
        {questions.length === 0 && <div style={{ color: 'var(--mid)', fontSize: 14 }}>No questions yet.</div>}
        {questions.map((q, i) => (
          <div key={q.id} className="question-admin-card">
            <div className="question-admin-header">
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--violet)', marginBottom: 4 }}>Q{i + 1}</div>
                <div className="question-admin-text">{q.text}</div>
              </div>
              <button className="delete-btn" onClick={() => deleteQuestion(q.id)}>Delete</button>
            </div>
            <div className="options-list">
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
              <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>✓ {q.correct_answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Predictions View ──
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
      user_id: session.user.id, user_name: userName, user_email: session.user.email,
      question_id, answer, correct: null, score: 0,
    }));
    const { error } = await supabase.from("picks").upsert(rows, { onConflict: "user_id,question_id" });
    setSaving(false);
    if (error) { onToast("Error saving — try again"); return; }
    setSaved(true); onToast("Predictions saved! 🏆");
  };

  const answeredCount = Object.keys(picks).length;
  const pct = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  if (loading) return <div className="loading">Las Culturitas</div>;

  return (
    <>
      <div className="predictions-page">
        <div className="page-hero">
          <div className="page-title">Your Predictions</div>
          <div className="page-meta">Las Culturitas Culture Awards 2026</div>
          <div className="page-progress">
            <div className="progress-label">{answeredCount} of {questions.length} answered · {pct}%</div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
          </div>
        </div>
        {locked && <div className="locked-banner">🔒 Predictions are locked — results coming soon</div>}
        {questions.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">✨</div>
            <div className="empty-state-title">Questions coming soon</div>
            <div className="empty-state-text">Check back shortly!</div>
          </div>
        )}
        {questions.map((q, i) => {
          const selected = picks[q.id];
          const hasAnswer = !!q.correct_answer;
          return (
            <div key={q.id} className={`question-card${selected ? " answered" : ""}`}>
              <div className="question-number">Question {i + 1} of {questions.length}</div>
              <div className="question-text">{q.text}</div>
              <div className="options-grid">
                {(q.options || []).map((opt) => {
                  const isSelected = selected === opt;
                  const isCorrect = hasAnswer && q.correct_answer === opt;
                  const isIncorrect = hasAnswer && isSelected && !isCorrect;
                  let cls = "option-btn";
                  if (locked || hasAnswer) cls += " locked-opt";
                  if (isSelected) cls += " selected";
                  if (isCorrect) cls += " correct";
                  if (isIncorrect) cls += " incorrect";
                  return (
                    <button key={opt} className={cls} onClick={() => handlePick(q.id, opt)}>
                      <div className="option-radio">{isSelected && <div className="option-radio-dot" />}</div>
                      {opt}
                      {hasAnswer && isCorrect && <span className="result-tag correct">✓</span>}
                      {hasAnswer && isIncorrect && <span className="result-tag incorrect">✗</span>}
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
          <div className="landing-eyebrow">Bravo · Culture Awards · 2026</div>
          <div className="landing-title">Las<br /><span>Culturitas</span></div>
          <div className="landing-year">✦ ✦ ✦</div>
          <div className="landing-divider" />
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
          <button className={`nav-btn${tab === "predictions" ? " active" : ""}`} onClick={() => setTab("predictions")}>Picks</button>
          <button className={`nav-btn${tab === "leaderboard" ? " active" : ""}`} onClick={() => setTab("leaderboard")}>Scores</button>
          {isAdmin && <button className={`nav-btn admin-btn${tab === "admin" ? " active" : ""}`} onClick={() => setTab("admin")}>⚙</button>}
        </div>
        <div className="topbar-user">
          <span className="name">{userName}</span>
          <div className="avatar">{getInitials(userName)}</div>
          <button className="signout-btn" onClick={handleSignOut}>Out</button>
        </div>
      </div>
      {tab === "predictions" && <PredictionsView session={session} onToast={showToast} />}
      {tab === "leaderboard" && <Leaderboard currentUserId={session.user.id} />}
      {tab === "admin" && isAdmin && <AdminPanel onToast={showToast} />}
    </div>
  );
}
