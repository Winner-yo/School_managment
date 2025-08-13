'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import api from '../../utils/api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    fetchProfile();
  }, [router]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/me');
      setUser(res.data);
      setEditForm({
        name: res.data.name || '',
        username: res.data.username || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError('Failed to fetch profile: ' + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setMessage('');
  };

  const handleCancel = () => {
    setEditing(false);
    setEditForm({
      name: user.name || '',
      username: user.username || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validate passwords if changing
    if (editForm.newPassword || editForm.confirmPassword) {
      if (!editForm.currentPassword) {
        setMessage('Current password is required to change password');
        return;
      }
      if (editForm.newPassword !== editForm.confirmPassword) {
        setMessage('New passwords do not match');
        return;
      }
      if (editForm.newPassword.length < 6) {
        setMessage('New password must be at least 6 characters');
        return;
      }
    }

    try {
      setSubmitting(true);
      
      const updateData = {
        name: editForm.name
      };

      if (editForm.newPassword) {
        updateData.currentPassword = editForm.currentPassword;
        updateData.newPassword = editForm.newPassword;
      }

      await api.put('/users/profile', updateData);
      
      setMessage('Profile updated successfully!');
      setEditing(false);
      fetchProfile();
      
      // Clear password fields
      setEditForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      setMessage('Failed to update profile: ' + (err.response?.data?.msg || err.message));
    } finally {
      setSubmitting(false);
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
        Loading profile...
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
          onClick={() => router.push('/dashboard')}
          style={{
            padding: '10px 20px',
            background: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px' 
      }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>My Profile</h1>
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            padding: '8px 16px',
            background: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Dashboard
        </button>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        padding: '30px'
      }}>
        {!editing ? (
          // Display Profile
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Profile Information</h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '6px', 
                    color: '#7f8c8d', 
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Full Name
                  </label>
                  <div style={{ 
                    padding: '12px', 
                    background: '#f8f9fa', 
                    borderRadius: '6px',
                    border: '1px solid #e9ecef',
                    color: '#2c3e50'
                  }}>
                    {user.name}
                  </div>
                </div>
                
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '6px', 
                    color: '#7f8c8d', 
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Username
                  </label>
                  <div style={{ 
                    padding: '12px', 
                    background: '#f8f9fa', 
                    borderRadius: '6px',
                    border: '1px solid #e9ecef',
                    color: '#2c3e50'
                  }}>
                    {user.username}
                  </div>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '6px', 
                    color: '#7f8c8d', 
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Role
                  </label>
                  <div style={{ 
                    padding: '12px', 
                    background: '#f8f9fa', 
                    borderRadius: '6px',
                    border: '1px solid #e9ecef',
                    color: '#2c3e50',
                    textTransform: 'capitalize'
                  }}>
                    {user.role}
                  </div>
                </div>

                {user.subject && (
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '6px', 
                      color: '#7f8c8d', 
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      Assigned Subject
                    </label>
                    <div style={{ 
                      padding: '12px', 
                      background: '#f8f9fa', 
                      borderRadius: '6px',
                      border: '1px solid #e9ecef',
                      color: '#2c3e50'
                    }}>
                      {user.subject}
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '6px', 
                    color: '#7f8c8d', 
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Member Since
                  </label>
                  <div style={{ 
                    padding: '12px', 
                    background: '#f8f9fa', 
                    borderRadius: '6px',
                    border: '1px solid #e9ecef',
                    color: '#2c3e50'
                  }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleEdit}
              style={{
                padding: '12px 24px',
                background: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          // Edit Profile Form
          <form onSubmit={handleSubmit}>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Edit Profile</h2>
            
            <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  color: '#2c3e50', 
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  color: '#2c3e50', 
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Username *
                </label>
                <input
                  type="text"
                  value={editForm.username}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    background: '#f8f9fa',
                    color: '#6c757d',
                    cursor: 'not-allowed'
                  }}
                />
                <small style={{ color: '#6c757d', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  Username cannot be changed for security reasons
                </small>
              </div>

              <div style={{ 
                padding: '16px', 
                background: '#f8f9fa', 
                borderRadius: '6px',
                border: '1px solid #e9ecef'
              }}>
                <h3 style={{ color: '#2c3e50', marginBottom: '12px', fontSize: '16px' }}>Change Password (Optional)</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '4px', 
                      color: '#7f8c8d', 
                      fontSize: '13px'
                    }}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={editForm.currentPassword}
                      onChange={(e) => setEditForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '4px', 
                      color: '#7f8c8d', 
                      fontSize: '13px'
                    }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      value={editForm.newPassword}
                      onChange={(e) => setEditForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '4px', 
                      color: '#7f8c8d', 
                      fontSize: '13px'
                    }}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={editForm.confirmPassword}
                      onChange={(e) => setEditForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {message && (
              <div style={{ 
                marginBottom: '16px', 
                padding: '12px', 
                borderRadius: '6px',
                background: message.startsWith('Failed') ? '#fdf2f2' : '#f0f9ff',
                color: message.startsWith('Failed') ? '#dc2626' : '#0369a1',
                border: `1px solid ${message.startsWith('Failed') ? '#fecaca' : '#bae6fd'}`
              }}>
                {message}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '12px 24px',
                  background: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  opacity: submitting ? 0.7 : 1
                }}
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: '12px 24px',
                  background: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
