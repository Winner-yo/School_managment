'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import api from '../../utils/api';

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminTab, setAdminTab] = useState('students');
  const [classInfoOpen, setClassInfoOpen] = useState(false);

  // Teacher assigned subject
  const [teacherSubject, setTeacherSubject] = useState('');
  const subjects = ['English', 'Biology', 'Chemistry', 'Physics'];
  const [usernameFilter, setUsernameFilter] = useState('');

  // Teacher grade form state
  const [editingStudent, setEditingStudent] = useState(null);
  const [editSubject, setEditSubject] = useState('');
  const [editScore, setEditScore] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editNotice, setEditNotice] = useState('');

  const [deletingUser, setDeletingUser] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editTeacherSubject, setEditTeacherSubject] = useState('');
  const [editTeacherName, setEditTeacherName] = useState('');
  const [editTeacherUsername, setEditTeacherUsername] = useState('');
  const [editTeacherSubmitting, setEditTeacherSubmitting] = useState(false);
  const [editTeacherNotice, setEditTeacherNotice] = useState('');

  const [editingAdminStudent, setEditingAdminStudent] = useState(null);
  const [editStudentName, setEditStudentName] = useState('');
  const [editStudentUsername, setEditStudentUsername] = useState('');
  const [editStudentSubmitting, setEditStudentSubmitting] = useState(false);
  const [editStudentNotice, setEditStudentNotice] = useState('');

  const letterGrade = (avg) => {
    if (avg >= 90 && avg <= 100) return 'A+';
    if (avg >= 85 && avg <= 89) return 'A';
    if (avg >= 80 && avg <= 84) return 'A-';
    if (avg >= 75 && avg <= 79) return 'B+';
    if (avg >= 70 && avg <= 74) return 'B';
    if (avg >= 65 && avg <= 69) return 'B-';
    if (avg >= 60 && avg <= 64) return 'C+';
    if (avg >= 50 && avg <= 59) return 'C';
    return 'D';
  };

  const getFilteredData = (data) => {
    if (!usernameFilter.trim()) return data;
    if (!Array.isArray(data)) return data;
    
    return data.filter(item => {
      const username = item.userId?.username || item.username || '';
      return username.toLowerCase().includes(usernameFilter.toLowerCase());
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        fetchData(decoded.role, adminTab);
        if (decoded.role === 'teacher') {
          api.get('/users/me').then((res) => {
            setTeacherSubject(res.data?.subject || '');
          }).catch(() => {
            setTeacherSubject('');
          });
        }
      } catch (err) {
        setError('Invalid token');
        setLoading(false);
      }
    } else {
      setError('No token found');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (role === 'admin') {
      fetchData('admin', adminTab);
    }
  }, [adminTab, role]);

  const fetchData = async (userRole, tab) => {
    try {
      setLoading(true);
      let res;
      if (userRole === 'student') {
        res = await api.get('/students/profile');
      } else if (userRole === 'teacher') {
        res = await api.get('/students');
      } else if (userRole === 'admin') {
        const listRole = tab === 'teachers' ? 'teacher' : 'student';
        res = await api.get(`/users?role=${listRole}`);
      }
      setData(res.data);
    } catch (err) {
      setError('Error fetching data: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const renderAdminTeachersTable = (items) => {
    return (
      <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f6fa', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>#</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>Teacher Name</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>Username</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>Subject</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>Update</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u, idx) => (
                <tr key={u._id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                  <td style={{ padding: '12px 16px' }}>{idx + 1}</td>
                  <td style={{ padding: '12px 16px' }}>{u.name}</td>
                  <td style={{ padding: '12px 16px' }}>{u.username}</td>
                  <td style={{ padding: '12px 16px' }}>{u.subject || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => {
                        setEditingTeacher(u);
                        setEditTeacherSubject(u.subject || '');
                        setEditTeacherName(u.name || '');
                        setEditTeacherUsername(u.username || '');
                      }}
                      style={{
                        padding: '6px 12px',
                        background: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderAdminStudentsTable = (items) => {
    return (
      <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f6fa', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>#</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>Student Name</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>Username</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>Update</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u, idx) => (
                <tr key={u._id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                  <td style={{ padding: '12px 16px' }}>{idx + 1}</td>
                  <td style={{ padding: '12px 16px' }}>{u.name}</td>
                  <td style={{ padding: '12px 16px' }}>{u.username}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => {
                        setEditingAdminStudent(u);
                        setEditStudentName(u.name || '');
                        setEditStudentUsername(u.username || '');
                      }}
                      style={{
                        padding: '6px 12px',
                        background: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderUsersTable = (items) => {
    if (adminTab === 'students') {
      return (
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f6fa', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>#</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>Student Name</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>Username</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>Update</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {items.map((u, idx) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                    <td style={{ padding: '12px 16px' }}>{idx + 1}</td>
                    <td style={{ padding: '12px 16px' }}>{u.name}</td>
                    <td style={{ padding: '12px 16px' }}>{u.username}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => {
                          setEditingAdminStudent(u);
                          setEditStudentName(u.name || '');
                          setEditStudentUsername(u.username || '');
                        }}
                        style={{
                          padding: '6px 12px',
                          background: '#3498db',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Edit
                      </button>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        disabled={deleteSubmitting}
                        style={{
                          padding: '6px 12px',
                          background: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: deleteSubmitting ? 'not-allowed' : 'pointer',
                          fontSize: '12px',
                          opacity: deleteSubmitting ? 0.7 : 1
                        }}
                      >
                        {deleteSubmitting ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else {
      return (
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f6fa', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>#</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>Teacher Name</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>Username</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>Subject</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>Update</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {items.map((u, idx) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                    <td style={{ padding: '12px 16px' }}>{idx + 1}</td>
                    <td style={{ padding: '12px 16px' }}>{u.name}</td>
                    <td style={{ padding: '12px 16px' }}>{u.username}</td>
                    <td style={{ padding: '12px 16px' }}>{u.subject || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => {
                          setEditingTeacher(u);
                          setEditTeacherSubject(u.subject || '');
                          setEditTeacherName(u.name || '');
                          setEditTeacherUsername(u.username || '');
                        }}
                        style={{
                          padding: '6px 12px',
                          background: '#3498db',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Edit
                      </button>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        disabled={deleteSubmitting}
                        style={{
                          padding: '6px 12px',
                          background: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: deleteSubmitting ? 'not-allowed' : 'pointer',
                          fontSize: '12px',
                          opacity: deleteSubmitting ? 0.7 : 1
                        }}
                      >
                        {deleteSubmitting ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  };

  const handleUpdateGrade = async (e) => {
    e.preventDefault();
    setEditNotice('');
    if (!teacherSubject) {
      setEditNotice('No subject assigned. Please contact admin.');
      return;
    }
    if (editScore === '') {
      setEditNotice('Please enter a score.');
      return;
    }
    const numericScore = Number(editScore);
    if (Number.isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
      setEditNotice('Score must be a number between 0 and 100.');
      return;
    }
    try {
      setEditSubmitting(true);
      await api.post('/students/grade', {
        studentId: editingStudent._id,
        subject: teacherSubject,
        score: numericScore,
      });
      setEditNotice('Grade updated successfully.');
      setEditingStudent(null);
      setEditSubject('');
      setEditScore('');
      await fetchData('teacher');
      setTimeout(() => setEditNotice(''), 3000);
    } catch (err) {
      setEditNotice('Failed to update grade: ' + (err.response?.data?.msg || err.message));
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      setDeleteSubmitting(true);
      await api.delete(`/users/${userId}`);
      await fetchData('admin', adminTab);
      setDeletingUser(null);
    } catch (err) {
      alert('Failed to delete user: ' + (err.response?.data?.msg || err.message));
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const handleUpdateTeacherSubject = async (e) => {
    e.preventDefault();
    setEditTeacherNotice('');
    if (!editTeacherSubject || !editTeacherName || !editTeacherUsername) {
      setEditTeacherNotice('Please fill in all fields.');
      return;
    }
    
    try {
      setEditTeacherSubmitting(true);
      
      await api.put(`/users/${editingTeacher._id}`, {
        name: editTeacherName,
        username: editTeacherUsername,
      });
      
      await api.put(`/users/${editingTeacher._id}/subject`, {
        subject: editTeacherSubject,
      });
      
      setEditTeacherNotice('Teacher updated successfully.');
      await fetchData('admin', adminTab);
      setEditingTeacher(null);
      setEditTeacherSubject('');
      setEditTeacherName('');
      setEditTeacherUsername('');
    } catch (err) {
      setEditTeacherNotice('Failed to update teacher: ' + (err.response?.data?.msg || err.message));
    } finally {
      setEditTeacherSubmitting(false);
    }
  };

  const handleUpdateAdminStudent = async (e) => {
    e.preventDefault();
    setEditStudentNotice('');
    if (!editStudentName || !editStudentUsername) {
      setEditStudentNotice('Please enter both name and username.');
      return;
    }
    
    try {
      setEditStudentSubmitting(true);
      await api.put(`/users/${editingAdminStudent._id}`, {
        name: editStudentName,
        username: editStudentUsername,
      });
      setEditStudentNotice('Student updated successfully.');
      await fetchData('admin', adminTab);
      setEditingAdminStudent(null);
      setEditStudentName('');
      setEditStudentUsername('');
    } catch (err) {
      setEditStudentNotice('Failed to update student: ' + (err.response?.data?.msg || err.message));
    } finally {
      setEditStudentSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        fontSize: '18px',
        color: '#7f8c8d'
      }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column'
      }}>
        <div style={{ 
          color: '#e74c3c', 
          fontSize: '18px', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {error}
        </div>
        <button 
          onClick={() => window.location.href = '/login'}
          style={{
            padding: '10px 20px',
            background: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!role) return null;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ 
        color: '#2c3e50', 
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
      </h1>

      {role === 'student' && data && (
        <div style={{
          display: 'grid',
          gap: '20px'
        }}>
          {/* Student Profile Summary */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '24px',
            borderRadius: '8px',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>Student Profile</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Name</div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{data.name || '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Total Grades</div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{data.grades?.length || 0}</div>
              </div>
            </div>
          </div>

          {/* Class info card */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
          }}>
            <div 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: classInfoOpen ? '12px' : '0'
              }}
              onClick={() => setClassInfoOpen(!classInfoOpen)}
            >
              <h2 style={{ color: '#2c3e50', margin: 0 }}>Class Information</h2>
              <div style={{
                transform: classInfoOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
                fontSize: '20px',
                color: '#7f8c8d'
              }}>
                ▼
              </div>
            </div>
            
            {classInfoOpen && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f5f6fa', textAlign: 'left' }}>
                      <th style={{ padding: '10px 12px', borderBottom: '1px solid #e9ecef' }}>Subject</th>
                      <th style={{ padding: '10px 12px', borderBottom: '1px solid #e9ecef' }}>Teacher Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.teachers && data.teachers.length > 0 ? (
                      data.teachers.map((teacher, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f3f5' }}>
                          <td style={{ padding: '10px 12px' }}>{teacher.subject}</td>
                          <td style={{ padding: '10px 12px' }}>{teacher.name || teacher.username || '—'}</td>
                        </tr>
                      ))
                    ) : (
                      <>
                        <tr style={{ borderBottom: '1px solid #f1f3f5' }}>
                          <td style={{ padding: '10px 12px' }}>English</td>
                          <td style={{ padding: '10px 12px' }}>{data.classId?.teacherId?.username || '—'}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f3f5' }}>
                          <td style={{ padding: '10px 12px' }}>Biology</td>
                          <td style={{ padding: '10px 12px' }}>{data.classId?.teacherId?.username || '—'}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f3f5' }}>
                          <td style={{ padding: '10px 12px' }}>Chemistry</td>
                          <td style={{ padding: '10px 12px' }}>{data.classId?.teacherId?.username || '—'}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f3f5' }}>
                          <td style={{ padding: '10px 12px' }}>Physics</td>
                          <td style={{ padding: '10px 12px' }}>{data.classId?.teacherId?.username || '—'}</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Grades table */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '12px' }}>Your Grades</h2>
            {data.grades && data.grades.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f5f6fa', textAlign: 'left' }}>
                      <th style={{ padding: '10px 12px', borderBottom: '1px solid #e9ecef' }}>#</th>
                      <th style={{ padding: '10px 12px', borderBottom: '1px solid #e9ecef' }}>Subject</th>
                      <th style={{ padding: '10px 12px', borderBottom: '1px solid #e9ecef' }}>Score</th>
                      <th style={{ padding: '10px 12px', borderBottom: '1px solid #e9ecef' }}>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.grades.map((g, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f3f5' }}>
                        <td style={{ padding: '10px 12px' }}>{idx + 1}</td>
                        <td style={{ padding: '10px 12px' }}>{g.subject}</td>
                        <td style={{ padding: '10px 12px' }}>{g.score}</td>
                        <td style={{ padding: '10px 12px' }}>{letterGrade(g.score)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: '#7f8c8d', fontStyle: 'italic', margin: 0 }}>No grades available yet.</p>
            )}
          </div>
        </div>
      )}

      {role === 'teacher' && data && (
        <div style={{
          display: 'grid',
          gap: '20px'
        }}>
          {/* Teacher Profile Summary */}
          <div style={{
            background: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)',
            padding: '24px',
            borderRadius: '8px',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>Teacher Profile</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Assigned Subject</div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{teacherSubject || 'Not Assigned'}</div>
              </div>
              <div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Total Students</div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{Array.isArray(data) ? data.length : 0}</div>
              </div>
              <div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Status</div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                  {teacherSubject ? 'Active' : 'Pending Subject Assignment'}
                </div>
              </div>
            </div>
          </div>

          {/* Students list with update functionality */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '12px' }}>Students</h2>
            
            {/* Username Filter */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Filter by username..."
                  value={usernameFilter}
                  onChange={(e) => setUsernameFilter(e.target.value)}
                  style={{
                    flex: 1,
                    maxWidth: '300px',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
                {usernameFilter && (
                  <button
                    onClick={() => setUsernameFilter('')}
                    style={{
                      padding: '8px 12px',
                      background: '#95a5a6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
              {usernameFilter && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#7f8c8d' }}>
                  Showing {getFilteredData(data).length} of {data.length} students
                </div>
              )}
            </div>

            {Array.isArray(data) && data.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f5f6fa', textAlign: 'left' }}>
                      <th style={{ padding: '10px 12px', borderBottom: '1px solid #e9ecef' }}>#</th>
                      <th style={{ padding: '10px 12px', borderBottom: '1px solid #e9ecef' }}>Student Name</th>
                      <th style={{ padding: '10px 12px', borderBottom: '1px solid #e9ecef' }}>Username</th>
                      <th style={{ padding: '10px 12px', borderBottom: '1px solid #e9ecef' }}>Subject</th>
                      <th style={{ padding: '10px 12px', borderBottom: '1px solid #e9ecef' }}>Score</th>
                      <th style={{ padding: '10px 12px', borderBottom: '1px solid #e9ecef' }}>Grade</th>
                      <th style={{ padding: '10px 12px', borderBottom: '1px solid #e9ecef' }}>Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredData(data).map((s, idx) => {
                      const hasGrades = Array.isArray(s.grades) && s.grades.length > 0;
                      const subjectGrade = hasGrades ? s.grades.find(g => g.subject === teacherSubject) : null;
                      const score = subjectGrade ? subjectGrade.score : null;
                      const avg = hasGrades ? Math.round(s.grades.reduce((sum, g) => sum + (Number(g.score) || 0), 0) / s.grades.length) : null;
                      return (
                        <tr key={s._id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                          <td style={{ padding: '10px 12px' }}>{idx + 1}</td>
                          <td style={{ padding: '10px 12px' }}>{s.userId?.name || s.name}</td>
                          <td style={{ padding: '10px 12px' }}>{s.userId?.username || '—'}</td>
                          <td style={{ padding: '10px 12px' }}>{teacherSubject || '—'}</td>
                          <td style={{ padding: '10px 12px' }}>{score !== null ? score : '—'}</td>
                          <td style={{ padding: '10px 12px' }}>{score !== null ? letterGrade(score) : '—'}</td>
                          <td style={{ padding: '10px 12px' }}>
                            <button
                              onClick={() => {
                                setEditingStudent(s);
                                setEditSubject(teacherSubject || '');
                                setEditScore(subjectGrade ? subjectGrade.score.toString() : '');
                              }}
                              style={{
                                padding: '6px 12px',
                                background: '#3498db',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              Update
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: '#7f8c8d', fontStyle: 'italic', margin: 0 }}>No students found.</p>
            )}
          </div>

          {/* Edit Grade Modal */}
          {editingStudent && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '8px',
                width: '90%',
                maxWidth: '500px'
              }}>
                <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>
                  Update Grade for {editingStudent.userId?.name || editingStudent.name}
                </h3>
                <form onSubmit={handleUpdateGrade}>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#2c3e50' }}>Score (0-100):</label>
                    <input
                      type="number"
                      value={editScore}
                      onChange={(e) => setEditScore(e.target.value)}
                      required
                      min={0}
                      max={100}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '6px'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="submit"
                      disabled={editSubmitting}
                      style={{
                        padding: '10px 20px',
                        background: '#27ae60',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: editSubmitting ? 'not-allowed' : 'pointer',
                        flex: 1
                      }}
                    >
                      {editSubmitting ? 'Updating...' : 'Update Grade'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingStudent(null);
                        setEditSubject('');
                        setEditScore('');
                        setEditNotice('');
                      }}
                      style={{
                        padding: '10px 20px',
                        background: '#95a5a6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                  {editNotice && (
                    <p style={{ 
                      marginTop: '16px', 
                      color: editNotice.startsWith('Failed') ? '#e74c3c' : '#27ae60',
                      textAlign: 'center'
                    }}>
                      {editNotice}
                    </p>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {role === 'admin' && (
        <div>
          {/* Admin Profile Summary */}
          <div style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            padding: '24px',
            borderRadius: '8px',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>Admin Dashboard</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Current View</div>
                <div style={{ fontSize: '16px', fontWeight: '600', textTransform: 'capitalize' }}>{adminTab}</div>
              </div>
              <div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Total {adminTab === 'students' ? 'Students' : 'Teachers'}</div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{Array.isArray(data) ? data.length : 0}</div>
              </div>
              <div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>System Status</div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>Active</div>
              </div>
            </div>
          </div>

          {/* Username Filter */}
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Filter by username..."
                value={usernameFilter}
                onChange={(e) => setUsernameFilter(e.target.value)}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  padding: '10px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              {usernameFilter && (
                <button
                  onClick={() => setUsernameFilter('')}
                  style={{
                    padding: '10px 16px',
                    background: '#95a5a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Clear
                </button>
              )}
            </div>
            {usernameFilter && (
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#7f8c8d' }}>
                Showing {getFilteredData(data).length} of {data.length} {adminTab}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', justifyContent: 'center' }}>
            <button
              onClick={() => setAdminTab('students')}
              style={{
                padding: '8px 16px',
                background: adminTab === 'students' ? '#3498db' : '#ecf0f1',
                color: adminTab === 'students' ? 'white' : '#2c3e50',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Students
            </button>
            <button
              onClick={() => setAdminTab('teachers')}
              style={{
                padding: '8px 16px',
                background: adminTab === 'teachers' ? '#3498db' : '#ecf0f1',
                color: adminTab === 'teachers' ? 'white' : '#2c3e50',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Teachers
            </button>
          </div>

          {Array.isArray(data) && data.length > 0 ? (
            adminTab === 'students' ? renderUsersTable(getFilteredData(data)) : renderAdminTeachersTable(getFilteredData(data))
          ) : (
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              color: '#7f8c8d'
            }}>
              No {adminTab} found.
            </div>
          )}
        </div>
      )}

      {/* Admin: Assign Subject Modal */}
      {editingTeacher && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '90%', maxWidth: '480px' }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>
              Edit Teacher: {editingTeacher.name}
            </h3>
            <form onSubmit={handleUpdateTeacherSubject}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#2c3e50' }}>Name:</label>
                <input
                  type="text"
                  value={editTeacherName}
                  onChange={(e) => setEditTeacherName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#2c3e50' }}>Username:</label>
                <input
                  type="text"
                  value={editTeacherUsername}
                  onChange={(e) => setEditTeacherUsername(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#2c3e50' }}>Subject:</label>
                <select
                  value={editTeacherSubject}
                  onChange={(e) => setEditTeacherSubject(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                >
                  <option value="">Select subject</option>
                  {subjects.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  disabled={editTeacherSubmitting}
                  style={{ padding: '10px 20px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: editTeacherSubmitting ? 'not-allowed' : 'pointer', flex: 1 }}
                >
                  {editTeacherSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditingTeacher(null); setEditTeacherSubject(''); setEditTeacherName(''); setEditTeacherUsername(''); setEditTeacherNotice(''); }}
                  style={{ padding: '10px 20px', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', flex: 1 }}
                >
                  Cancel
                </button>
              </div>
              {editTeacherNotice && (
                <p style={{ marginTop: '16px', color: editTeacherNotice.startsWith('Failed') ? '#e74c3c' : '#27ae60', textAlign: 'center' }}>
                  {editTeacherNotice}
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Admin: Edit Student Modal */}
      {editingAdminStudent && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '90%', maxWidth: '480px' }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>
              Edit Student: {editingAdminStudent.name}
            </h3>
            <form onSubmit={handleUpdateAdminStudent}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#2c3e50' }}>Name:</label>
                <input
                  type="text"
                  value={editStudentName}
                  onChange={(e) => setEditStudentName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#2c3e50' }}>Username:</label>
                <input
                  type="text"
                  value={editStudentUsername}
                  onChange={(e) => setEditStudentUsername(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  disabled={editStudentSubmitting}
                  style={{ padding: '10px 20px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: editStudentSubmitting ? 'not-allowed' : 'pointer', flex: 1 }}
                >
                  {editStudentSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditingAdminStudent(null); setEditStudentName(''); setEditStudentUsername(''); setEditStudentNotice(''); }}
                  style={{ padding: '10px 20px', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', flex: 1 }}
                >
                  Cancel
                </button>
              </div>
              {editStudentNotice && (
                <p style={{ marginTop: '16px', color: editStudentNotice.startsWith('Failed') ? '#e74c3c' : '#27ae60', textAlign: 'center' }}>
                  {editStudentNotice}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}