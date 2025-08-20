import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './login.module.css';
import { useRouter, useSearchParams } from 'next/navigation';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [flashMessage, setFlashMessage] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setFlashMessage(message);
      const timer = setTimeout(() => setFlashMessage(''), 3000); // Hide flash message after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFlashMessage(''); // Clear flash message on new submission

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      router.push('/admin'); // Redirect all users to /admin as requested
    } catch (err) {
      setError(err.message || 'Invalid username or password. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.parallaxBg}></div>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Login to ACMS</h1>
        <p className={styles.subtitle}>Access the Autonomous Climate Mitigation System</p>
        {flashMessage && <p className={styles.success}>{flashMessage}</p>}
        {error && <p className={styles.error}>{error}</p>}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <input
              type="text"
              id="username"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="role" className={styles.label}>Role</label>
            <select
              id="role"
              className={styles.select}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            Login
          </button>
        </form>
        <p className={styles.signupLink}>
          New user? <Link href="/signup" className={styles.link}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;