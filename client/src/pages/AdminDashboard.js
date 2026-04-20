import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { Users, BookOpen, Shield, Plus, Edit, Trash2, X, UserCheck } from 'lucide-react';
import api from '../utils/api';

// ── Shared helpers ───────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div style={{
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
  }}>
    <div className="card" style={{ width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' }}>
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

const roleBadge = (role) => {
  const colors = { student: '#3b82f6', teacher: '#10b981', admin: '#8b5cf6' };
  return (
    <span style={{
      backgroundColor: `${colors[role]}20`, color: colors[role],
      padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600'
    }}>{role}</span>
  );
};

// ── User form modal ──────────────────────────────────────────────────────────
const UserModal = ({ user: editUser, onClose, onSave }) => {
  const [form, setForm] = useState(editUser
    ? { name: editUser.name, email: editUser.email, role: editUser.role, password: '' }
    : { name: '', email: '', role: 'student', password: '' }
  );

  return (
    <Modal title={editUser ? 'Edit User' : 'Create User'} onClose={onClose}>
      <label style={labelStyle}>Full Name</label>
      <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" />

      <label style={labelStyle}>Email</label>
      <input type="email" style={inputStyle} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email address" />

      <label style={labelStyle}>Role</label>
      <select style={inputStyle} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="admin">Admin</option>
      </select>

      <label style={labelStyle}>{editUser ? 'New Password (leave blank to keep)' : 'Password'}</label>
      <input type="password" style={inputStyle} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
        placeholder={editUser ? 'Leave blank to keep current' : 'Password (min 6 chars)'} />

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button className="btn btn-primary" style={{ flex: 1 }}
          onClick={() => onSave(form)}
          disabled={!form.name || !form.email || (!editUser && form.password.length < 6)}>
          {editUser ? 'Update User' : 'Create User'}
        </button>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
};

// ── Class form modal ─────────────────────────────────────────────────────────
const ClassModal = ({ cls, teachers, onClose, onSave }) => {
  const [form, setForm] = useState(cls
    ? { name: cls.name, level: cls.level, teacherId: cls.teacherId || '' }
    : { name: '', level: 'Beginner', teacherId: '' }
  );

  return (
    <Modal title={cls ? 'Edit Class' : 'Create Class'} onClose={onClose}>
      <label style={labelStyle}>Class Name</label>
      <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. English A1" />

      <label style={labelStyle}>Level</label>
      <select style={inputStyle} value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
        {['Beginner', 'Elementary', 'Intermediate', 'Upper-Intermediate', 'Advanced'].map(l => <option key={l}>{l}</option>)}
      </select>

      <label style={labelStyle}>Assign Teacher (optional)</label>
      <select style={inputStyle} value={form.teacherId} onChange={e => setForm({ ...form, teacherId: e.target.value })}>
        <option value="">— No teacher —</option>
        {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onSave(form)} disabled={!form.name}>
          {cls ? 'Update Class' : 'Create Class'}
        </button>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
};

// ── Assign students modal ────────────────────────────────────────────────────
const AssignModal = ({ cls, students, onClose, onAssign, onRemove }) => {
  const enrolled = cls.studentIds || [];
  const available = students.filter(s => !enrolled.includes(s.id));

  return (
    <Modal title={`Assign Students — ${cls.name}`} onClose={onClose}>
      <div style={{ marginBottom: '1rem' }}>
        <h4 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Enrolled ({enrolled.length})
        </h4>
        {enrolled.length === 0
          ? <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No students enrolled.</p>
          : enrolled.map(sid => {
              const s = students.find(st => st.id === sid);
              if (!s) return null;
              return (
                <div key={sid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>{s.name}</span>
                  <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#ef4444' }}
                    onClick={() => onRemove(cls.id, sid)}>
                    Remove
                  </button>
                </div>
              );
            })
        }
      </div>

      <div>
        <h4 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Available Students ({available.length})
        </h4>
        {available.length === 0
          ? <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>All students are enrolled.</p>
          : available.map(s => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>{s.name}</span>
                <button className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                  onClick={() => onAssign(cls.id, s.id)}>
                  Assign
                </button>
              </div>
            ))
        }
      </div>
    </Modal>
  );
};

// ── Main dashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalClasses: 0, totalUsers: 0 });
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [userModal, setUserModal] = useState(null);   // null | 'create' | user obj
  const [classModal, setClassModal] = useState(null); // null | 'create' | class obj
  const [assignModal, setAssignModal] = useState(null); // null | class obj
  const [roleFilter, setRoleFilter] = useState('all');
  const [toast, setToast] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchAll = async () => {
    try {
      const [dashRes, usersRes, classesRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users'),
        api.get('/admin/classes')
      ]);
      setStats(dashRes.data.stats);
      setUsers(usersRes.data);
      setClasses(classesRes.data);
    } catch (err) {
      console.error('Admin fetch error:', err);
    }
  };

  // ── User CRUD ───────────────────────────────────────────────────────────
  const handleCreateUser = async (form) => {
    try {
      await api.post('/admin/users', form);
      showToast('User created');
      setUserModal(null);
      fetchAll();
    } catch (err) { showToast(err.response?.data?.message || 'Failed to create user'); }
  };

  const handleUpdateUser = async (form) => {
    const payload = { ...form };
    if (!payload.password) delete payload.password;
    try {
      await api.put(`/admin/users/${userModal.id}`, payload);
      showToast('User updated');
      setUserModal(null);
      fetchAll();
    } catch { showToast('Failed to update user'); }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      showToast('User deleted');
      fetchAll();
    } catch (err) { showToast(err.response?.data?.message || 'Failed to delete user'); }
  };

  // ── Class CRUD ──────────────────────────────────────────────────────────
  const handleCreateClass = async (form) => {
    try {
      await api.post('/admin/classes', form);
      showToast('Class created');
      setClassModal(null);
      fetchAll();
    } catch { showToast('Failed to create class'); }
  };

  const handleUpdateClass = async (form) => {
    try {
      await api.put(`/admin/classes/${classModal.id}`, form);
      showToast('Class updated');
      setClassModal(null);
      fetchAll();
    } catch { showToast('Failed to update class'); }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Delete this class?')) return;
    try {
      await api.delete(`/admin/classes/${classId}`);
      showToast('Class deleted');
      fetchAll();
    } catch { showToast('Failed to delete class'); }
  };

  // ── Assignment ──────────────────────────────────────────────────────────
  const handleAssign = async (classId, studentId) => {
    try {
      const res = await api.post(`/admin/classes/${classId}/assign`, { studentId });
      setClasses(prev => prev.map(c => c.id === classId ? res.data.class : c));
      setAssignModal(res.data.class);
      showToast('Student assigned');
    } catch { showToast('Failed to assign student'); }
  };

  const handleRemove = async (classId, studentId) => {
    try {
      const res = await api.delete(`/admin/classes/${classId}/assign/${studentId}`);
      setClasses(prev => prev.map(c => c.id === classId ? res.data.class : c));
      setAssignModal(res.data.class);
      showToast('Student removed');
    } catch { showToast('Failed to remove student'); }
  };

  const teachers = users.filter(u => u.role === 'teacher');
  const students = users.filter(u => u.role === 'student');
  const filteredUsers = roleFilter === 'all' ? users : users.filter(u => u.role === roleFilter);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Shield size={16} /> },
    { id: 'users',    label: 'Users',    icon: <Users size={16} /> },
    { id: 'classes',  label: 'Classes',  icon: <BookOpen size={16} /> }
  ];

  const statCards = [
    { label: 'Total Users',    value: stats.totalUsers,    color: 'var(--primary)', bg: 'rgba(37,99,235,0.1)',   icon: <Users size={24} /> },
    { label: 'Students',       value: stats.totalStudents, color: '#10b981',        bg: 'rgba(16,185,129,0.1)',  icon: <UserCheck size={24} /> },
    { label: 'Teachers',       value: stats.totalTeachers, color: '#f59e0b',        bg: 'rgba(245,158,11,0.1)', icon: <Users size={24} /> },
    { label: 'Classes',        value: stats.totalClasses,  color: '#8b5cf6',        bg: 'rgba(139,92,246,0.1)', icon: <BookOpen size={24} /> }
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
            Admin Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome, {user?.name}. Full platform control.</p>
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
            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem' }}>
                <h4 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Recent Users</h4>
                {users.slice(0, 6).map(u => (
                  <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.375rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>{u.name}</span>
                    {roleBadge(u.role)}
                  </div>
                ))}
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem' }}>
                <h4 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Classes Overview</h4>
                {classes.length === 0
                  ? <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No classes created yet.</p>
                  : classes.map(c => (
                      <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.375rem 0', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>{c.name}</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                          {c.studentIds?.length || 0} students · {c.teacherName || 'No teacher'}
                        </span>
                      </div>
                    ))
                }
              </div>
            </div>
          )}

          {/* ── Users ── */}
          {activeTab === 'users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['all', 'student', 'teacher', 'admin'].map(r => (
                    <button key={r} onClick={() => setRoleFilter(r)}
                      className={roleFilter === r ? 'btn btn-primary' : 'btn btn-secondary'}
                      style={{ padding: '0.375rem 0.75rem', fontSize: '0.8rem', textTransform: 'capitalize' }}>
                      {r}
                    </button>
                  ))}
                </div>
                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  onClick={() => setUserModal('create')}>
                  <Plus size={16} /> Add User
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.875rem' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.75rem', color: 'var(--text-primary)', fontWeight: '500' }}>{u.name}</td>
                        <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{u.email}</td>
                        <td style={{ padding: '0.75rem' }}>{roleBadge(u.role)}</td>
                        <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-secondary" style={{ padding: '0.375rem 0.625rem', minWidth: 'auto' }}
                              onClick={() => setUserModal(u)}>
                              <Edit size={14} />
                            </button>
                            {u.role !== 'admin' && (
                              <button className="btn btn-secondary" style={{ padding: '0.375rem 0.625rem', minWidth: 'auto', color: '#ef4444' }}
                                onClick={() => handleDeleteUser(u.id)}>
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No users found.</p>
                )}
              </div>
            </div>
          )}

          {/* ── Classes ── */}
          {activeTab === 'classes' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Class Management ({classes.length})</h3>
                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  onClick={() => setClassModal('create')}>
                  <Plus size={16} /> Create Class
                </button>
              </div>

              {classes.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No classes yet. Create one!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {classes.map(cls => (
                    <div key={cls.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem',
                      flexWrap: 'wrap', gap: '0.5rem'
                    }}>
                      <div>
                        <h4 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{cls.name}</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                          {cls.level} · Teacher: {cls.teacherName || 'Unassigned'} · {cls.studentIds?.length || 0} students
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                          onClick={() => setAssignModal(cls)}>
                          <UserCheck size={14} /> Assign
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '0.375rem 0.625rem', minWidth: 'auto' }}
                          onClick={() => setClassModal(cls)}>
                          <Edit size={14} />
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '0.375rem 0.625rem', minWidth: 'auto', color: '#ef4444' }}
                          onClick={() => handleDeleteClass(cls.id)}>
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
      {userModal && (
        <UserModal
          user={userModal === 'create' ? null : userModal}
          onClose={() => setUserModal(null)}
          onSave={userModal === 'create' ? handleCreateUser : handleUpdateUser}
        />
      )}
      {classModal && (
        <ClassModal
          cls={classModal === 'create' ? null : classModal}
          teachers={teachers}
          onClose={() => setClassModal(null)}
          onSave={classModal === 'create' ? handleCreateClass : handleUpdateClass}
        />
      )}
      {assignModal && (
        <AssignModal
          cls={assignModal}
          students={students}
          onClose={() => setAssignModal(null)}
          onAssign={handleAssign}
          onRemove={handleRemove}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
