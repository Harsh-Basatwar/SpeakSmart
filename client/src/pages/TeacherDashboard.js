import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { Users, BookOpen, BarChart3, Plus, Eye, Edit, Trash2, X, RotateCcw, CheckCircle } from 'lucide-react';
import api from '../utils/api';

// ── Reusable modal shell ─────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div style={{
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
  }}>
    <div className="card" style={{ width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <X size={20} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const inputStyle = {
  width: '100%', padding: '0.625rem 0.75rem', border: '1px solid var(--border)',
  borderRadius: '0.375rem', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)',
  fontSize: '0.875rem', boxSizing: 'border-box', marginBottom: '1rem'
};

const labelStyle = { display: 'block', marginBottom: '0.375rem', fontWeight: '500', color: 'var(--text-primary)', fontSize: '0.875rem' };

// ── Student detail modal ─────────────────────────────────────────────────────
const StudentDetailModal = ({ student, onClose, onProgressUpdate, onProgressReset }) => {
  const [editProgress, setEditProgress] = useState(false);
  const [progressForm, setProgressForm] = useState({
    totalProgress: student.progress?.totalProgress || 0,
    completedModules: student.progress?.completedModules || 0,
    flashcardsLearned: student.progress?.flashcardsLearned || 0,
    streakDays: student.progress?.streakDays || 0
  });

  const handleSave = () => {
    onProgressUpdate(student.id, progressForm);
    setEditProgress(false);
  };

  return (
    <Modal title={`Student: ${student.name}`} onClose={onClose}>
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{student.email}</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Joined: {new Date(student.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h4 style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Progress</h4>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
              onClick={() => setEditProgress(!editProgress)}>
              <Edit size={14} />
            </button>
            <button className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', color: '#ef4444' }}
              onClick={() => { onProgressReset(student.id); onClose(); }}>
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {editProgress ? (
          <div>
            {[['totalProgress', 'Total Progress (%)'], ['completedModules', 'Completed Modules'],
              ['flashcardsLearned', 'Flashcards Learned'], ['streakDays', 'Streak Days']].map(([key, label]) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input type="number" style={inputStyle} value={progressForm[key]}
                  onChange={e => setProgressForm({ ...progressForm, [key]: Number(e.target.value) })} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Save</button>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setEditProgress(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {[
              ['Overall', `${student.progress?.totalProgress || 0}%`],
              ['Modules', student.progress?.completedModules || 0],
              ['Flashcards', student.progress?.flashcardsLearned || 0],
              ['Streak', `${student.progress?.streakDays || 0} days`],
              ['Quizzes Taken', (student.progress?.quizScores || []).length]
            ].map(([label, val]) => (
              <div key={label} style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '0.375rem', padding: '0.5rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{label}</p>
                <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{val}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {(student.progress?.quizScores || []).length > 0 && (
        <div>
          <h4 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Quiz History</h4>
          {student.progress.quizScores.slice(-5).reverse().map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Quiz #{s.quizId}</span>
              <span style={{ fontWeight: '600', color: s.score >= 70 ? '#10b981' : '#ef4444' }}>{s.score}%</span>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

// ── Quiz form modal ──────────────────────────────────────────────────────────
const QuizModal = ({ quiz, onClose, onSave }) => {
  const [form, setForm] = useState(quiz || {
    title: '', description: '', difficulty: 'Beginner', timeLimit: 300,
    questions: [{ question: '', type: 'multiple-choice', options: ['', '', '', ''], correctAnswer: 0 }]
  });

  const addQuestion = () => setForm({
    ...form,
    questions: [...form.questions, { question: '', type: 'multiple-choice', options: ['', '', '', ''], correctAnswer: 0 }]
  });

  const removeQuestion = (idx) => setForm({ ...form, questions: form.questions.filter((_, i) => i !== idx) });

  const updateQuestion = (idx, field, value) => {
    const qs = [...form.questions];
    qs[idx] = { ...qs[idx], [field]: value };
    setForm({ ...form, questions: qs });
  };

  const updateOption = (qIdx, oIdx, value) => {
    const qs = [...form.questions];
    const opts = [...qs[qIdx].options];
    opts[oIdx] = value;
    qs[qIdx] = { ...qs[qIdx], options: opts };
    setForm({ ...form, questions: qs });
  };

  return (
    <Modal title={quiz ? 'Edit Quiz' : 'Create Quiz'} onClose={onClose}>
      <label style={labelStyle}>Title</label>
      <input style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Quiz title" />

      <label style={labelStyle}>Description</label>
      <input style={inputStyle} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div>
          <label style={labelStyle}>Difficulty</label>
          <select style={inputStyle} value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
            {['Beginner', 'Intermediate', 'Advanced'].map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Time Limit (sec)</label>
          <input type="number" style={inputStyle} value={form.timeLimit} onChange={e => setForm({ ...form, timeLimit: Number(e.target.value) })} />
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h4 style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Questions ({form.questions.length})</h4>
          <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }} onClick={addQuestion}>
            <Plus size={14} /> Add
          </button>
        </div>
        {form.questions.map((q, qi) => (
          <div key={qi} style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '500', color: 'var(--text-primary)', fontSize: '0.875rem' }}>Q{qi + 1}</span>
              {form.questions.length > 1 && (
                <button onClick={() => removeQuestion(qi)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                  <X size={14} />
                </button>
              )}
            </div>
            <input style={inputStyle} value={q.question} placeholder="Question text"
              onChange={e => updateQuestion(qi, 'question', e.target.value)} />
            {q.options.map((opt, oi) => (
              <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                <input type="radio" name={`correct-${qi}`} checked={q.correctAnswer === oi}
                  onChange={() => updateQuestion(qi, 'correctAnswer', oi)} />
                <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={opt} placeholder={`Option ${oi + 1}`}
                  onChange={e => updateOption(qi, oi, e.target.value)} />
              </div>
            ))}
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              ● = correct answer
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button className="btn btn-primary" style={{ flex: 1 }}
          onClick={() => onSave(form)} disabled={!form.title || form.questions.some(q => !q.question)}>
          {quiz ? 'Update Quiz' : 'Create Quiz'}
        </button>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
};

// ── Main dashboard ───────────────────────────────────────────────────────────
const TeacherDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, totalQuizzes: 0, avgProgress: 0, activeToday: 0 });
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [quizModal, setQuizModal] = useState(null); // null | 'create' | quiz object
  const [toast, setToast] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchAll = async () => {
    try {
      const [dashRes, quizRes] = await Promise.all([
        api.get('/teacher/dashboard'),
        api.get('/teacher/quizzes').catch(() => ({ data: [] }))
      ]);
      setStudents(dashRes.data.students);
      setStats(dashRes.data.stats);
      // quizzes come from dashboard stats; fetch separately if endpoint exists
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const fetchStudents = async () => {
    const res = await api.get('/teacher/dashboard');
    setStudents(res.data.students);
    setStats(res.data.stats);
  };

  // ── Student CRUD ────────────────────────────────────────────────────────
  const handleProgressUpdate = async (studentId, progressData) => {
    try {
      await api.put(`/teacher/students/${studentId}/progress`, progressData);
      showToast('Progress updated');
      fetchStudents();
    } catch { showToast('Failed to update progress'); }
  };

  const handleProgressReset = async (studentId) => {
    if (!window.confirm('Reset this student\'s progress?')) return;
    try {
      await api.delete(`/teacher/students/${studentId}/progress`);
      showToast('Progress reset');
      fetchStudents();
    } catch { showToast('Failed to reset progress'); }
  };

  // ── Quiz CRUD ───────────────────────────────────────────────────────────
  const fetchQuizzes = async () => {
    try {
      const res = await api.get('/quizzes');
      setQuizzes(res.data);
    } catch { setQuizzes([]); }
  };

  useEffect(() => { fetchQuizzes(); }, []);

  const handleCreateQuiz = async (form) => {
    try {
      await api.post('/teacher/quizzes', form);
      showToast('Quiz created');
      setQuizModal(null);
      fetchQuizzes();
    } catch { showToast('Failed to create quiz'); }
  };

  const handleUpdateQuiz = async (form) => {
    try {
      await api.put(`/teacher/quizzes/${form.id}`, form);
      showToast('Quiz updated');
      setQuizModal(null);
      fetchQuizzes();
    } catch { showToast('Failed to update quiz'); }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Delete this quiz?')) return;
    try {
      await api.delete(`/teacher/quizzes/${quizId}`);
      showToast('Quiz deleted');
      fetchQuizzes();
    } catch { showToast('Failed to delete quiz'); }
  };

  const tabs = [
    { id: 'overview',  label: 'Overview',  icon: <BarChart3 size={16} /> },
    { id: 'students',  label: 'Students',  icon: <Users size={16} /> },
    { id: 'quizzes',   label: 'Quizzes',   icon: <BookOpen size={16} /> }
  ];

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, color: 'var(--primary)', bg: 'rgba(37,99,235,0.1)', icon: <Users size={24} /> },
    { label: 'Quizzes',        value: quizzes.length,      color: '#10b981',        bg: 'rgba(16,185,129,0.1)', icon: <BookOpen size={24} /> },
    { label: 'Avg Progress',   value: `${stats.avgProgress}%`, color: '#f59e0b',   bg: 'rgba(245,158,11,0.1)', icon: <BarChart3 size={24} /> },
    { label: 'Active Today',   value: stats.activeToday,   color: '#8b5cf6',        bg: 'rgba(139,92,246,0.1)', icon: <CheckCircle size={24} /> }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)', padding: '2rem 0' }}>
      <div className="container">
        {/* Toast */}
        {toast && (
          <div style={{
            position: 'fixed', top: '1rem', right: '1rem', backgroundColor: '#10b981',
            color: '#fff', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', zIndex: 2000, fontWeight: '500'
          }}>{toast}</div>
        )}

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Teacher Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.name}!</p>
        </div>

        {/* Stats */}
        <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
          {statCards.map(s => (
            <div key={s.label} className="card" style={{ textAlign: 'center' }}>
              <div style={{ backgroundColor: s.bg, color: s.color, width: '3rem', height: '3rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                {s.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>{s.value}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="card">
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: '0.875rem 1.25rem', border: 'none', background: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                fontWeight: activeTab === tab.id ? '600' : '500'
              }}>
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>

          {/* ── Overview ── */}
          {activeTab === 'overview' && (
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)' }}>Class Summary</h3>
              <div className="grid grid-2" style={{ gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem' }}>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Progress Distribution</h4>
                  {[
                    { label: 'Beginner (0–29%)',      count: students.filter(s => s.progress < 30).length,  color: '#ef4444' },
                    { label: 'Intermediate (30–69%)', count: students.filter(s => s.progress >= 30 && s.progress < 70).length, color: '#f59e0b' },
                    { label: 'Advanced (70–100%)',    count: students.filter(s => s.progress >= 70).length, color: '#10b981' }
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{row.label}</span>
                      <span style={{ fontWeight: '600', color: row.color }}>{row.count}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem' }}>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Top Students</h4>
                  {[...students].sort((a, b) => b.progress - a.progress).slice(0, 5).map((s, i) => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>#{i + 1} {s.name}</span>
                      <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{s.progress}%</span>
                    </div>
                  ))}
                  {students.length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No students yet.</p>}
                </div>
              </div>
            </div>
          )}

          {/* ── Students ── */}
          {activeTab === 'students' && (
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Student Management ({students.length})
              </h3>
              {students.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No students enrolled yet.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        {['Name', 'Email', 'Progress', 'Modules', 'Last Active', 'Actions'].map(h => (
                          <th key={h} style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.875rem' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(student => (
                        <tr key={student.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '0.75rem', color: 'var(--text-primary)', fontWeight: '500' }}>{student.name}</td>
                          <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{student.email}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ width: '80px', height: '6px', backgroundColor: 'var(--border)', borderRadius: '3px' }}>
                                <div style={{ width: `${student.progress}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '3px' }} />
                              </div>
                              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{student.progress}%</span>
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{student.completedModules}</td>
                          <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{student.lastActive}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <button className="btn btn-secondary" style={{ padding: '0.375rem 0.625rem', minWidth: 'auto' }}
                              onClick={() => setSelectedStudent(student)}>
                              <Eye size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Quizzes ── */}
          {activeTab === 'quizzes' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Quiz Management ({quizzes.length})</h3>
                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  onClick={() => setQuizModal('create')}>
                  <Plus size={16} /> Create Quiz
                </button>
              </div>
              {quizzes.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No quizzes yet. Create one!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {quizzes.map(quiz => (
                    <div key={quiz.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem'
                    }}>
                      <div>
                        <h4 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{quiz.title}</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                          {quiz.questions?.length || 0} questions · {quiz.difficulty} · {Math.round((quiz.timeLimit || 300) / 60)} min
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.375rem 0.625rem', minWidth: 'auto' }}
                          onClick={() => setQuizModal(quiz)}>
                          <Edit size={14} />
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '0.375rem 0.625rem', minWidth: 'auto', color: '#ef4444' }}
                          onClick={() => handleDeleteQuiz(quiz.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onProgressUpdate={handleProgressUpdate}
          onProgressReset={handleProgressReset}
        />
      )}
      {quizModal && (
        <QuizModal
          quiz={quizModal === 'create' ? null : quizModal}
          onClose={() => setQuizModal(null)}
          onSave={quizModal === 'create' ? handleCreateQuiz : handleUpdateQuiz}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;
