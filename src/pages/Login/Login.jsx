import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
  Check,
  Landmark,
  IdCard,
  Lock,
  Mail,
  User,
  Building2,
  BadgeCheck,
  ClipboardList,
  BarChart3,
  Users2,
} from 'lucide-react';
import './login.css';

const DEPARTMENTS = [
  'Software Development',
  'Networking & Security',
  'AI & Machine Learning',
  'HPC & Systems',
  'Administration',
  'HR',
];

const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

const FEATURES = [
  {
    icon: ClipboardList,
    title: 'Weekly Reporting',
    desc: 'Submit structured work reports every week without paperwork.',
  },
  {
    icon: BarChart3,
    title: 'Live Workload View',
    desc: 'Track activity status and utilization across every centre.',
  },
  {
    icon: Users2,
    title: 'Role-based Access',
    desc: 'Employees, HODs, and Centre Heads each see what matters to them.',
  },
];

const slideVariants = {
  enter: (direction) => ({ x: direction === 'signup' ? 56 : -56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction === 'signup' ? -56 : 56, opacity: 0 }),
};

/* ---------------------------- Login Panel ---------------------------- */

const LoginPanel = ({ onSwitchToSignup }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { identifier: '', password: '', rememberMe: false },
  });

  const onSubmit = async (data) => {
    setAuthError('');
    setIsSubmitting(true);

    // Dummy auth — no backend yet
    await new Promise((resolve) => setTimeout(resolve, 900));

    if (data.password.length < 6) {
      setAuthError('Invalid Employee ID / Email or Password.');
      setIsSubmitting(false);
      return;
    }

    console.log('Login payload (dummy):', data);
    setIsSubmitting(false);
  };

  return (
    <div className="login-panel">
      <div className="auth-header">
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">
          Sign in with your official credentials to continue
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="auth-form">
        <div className="auth-field">
          <label htmlFor="identifier" className="auth-label">
            Employee ID / Official Email
          </label>
          <div className="auth-input-wrapper">
            <IdCard className="auth-input-icon" strokeWidth={1.75} />
            <input
              id="identifier"
              type="text"
              autoComplete="username"
              placeholder="e.g. CDAC1234 or name@cdac.in"
              className={`auth-input ${errors.identifier ? 'auth-input-error' : ''}`}
              {...register('identifier', {
                required: 'Employee ID or Email is required',
              })}
            />
          </div>
          {errors.identifier && (
            <p className="auth-error-text">{errors.identifier.message}</p>
          )}
        </div>

        <div className="auth-field">
          <div className="auth-label-row">
            <label htmlFor="password" className="auth-label">
              Password
            </label>
            <button type="button" className="auth-link">
              Forgot Password?
            </button>
          </div>
          <div className="auth-input-wrapper">
            <Lock className="auth-input-icon" strokeWidth={1.75} />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              className={`auth-input auth-input-has-toggle ${
                errors.password ? 'auth-input-error' : ''
              }`}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="auth-toggle-visibility"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="auth-toggle-icon" strokeWidth={1.75} />
              ) : (
                <Eye className="auth-toggle-icon" strokeWidth={1.75} />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="auth-error-text">{errors.password.message}</p>
          )}
        </div>

        <label className="auth-checkbox-row">
          <span className="auth-checkbox-box">
            <input
              type="checkbox"
              className="auth-checkbox-input"
              {...register('rememberMe')}
            />
            <Check className="auth-checkbox-tick" strokeWidth={3} />
          </span>
          Remember me
        </label>

        {authError && <div className="auth-error-banner">{authError}</div>}

        <button type="submit" disabled={isSubmitting} className="auth-button">
          {isSubmitting ? (
            <>
              <Loader2 className="auth-spinner" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <p className="auth-switch-text">
        Don&apos;t have an account?{' '}
        <button type="button" onClick={onSwitchToSignup} className="auth-link">
          Create Account
        </button>
      </p>
    </div>
  );
};

/* ---------------------------- Signup Panel ---------------------------- */

const SignupPanel = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employeeId: '',
      fullName: '',
      email: '',
      department: '',
      designation: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    setSubmitError('');
    setIsSubmitting(true);

    // Dummy submit — no backend yet
    await new Promise((resolve) => setTimeout(resolve, 900));

    console.log('Signup payload (dummy):', data);
    setIsSubmitting(false);
    onSwitchToLogin();
  };

  return (
    <div className="signup-panel">
      <div className="auth-header">
        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">
          Register with your official employee details
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="auth-form">
        <div className="auth-row">
          <div className="auth-field">
            <label htmlFor="employeeId" className="auth-label">
              Employee ID
            </label>
            <div className="auth-input-wrapper">
              <IdCard className="auth-input-icon" strokeWidth={1.75} />
              <input
                id="employeeId"
                type="text"
                placeholder="CDAC1234"
                className={`auth-input ${errors.employeeId ? 'auth-input-error' : ''}`}
                {...register('employeeId', {
                  required: 'Employee ID is required',
                })}
              />
            </div>
            {errors.employeeId && (
              <p className="auth-error-text">{errors.employeeId.message}</p>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="fullName" className="auth-label">
              Full Name
            </label>
            <div className="auth-input-wrapper">
              <User className="auth-input-icon" strokeWidth={1.75} />
              <input
                id="fullName"
                type="text"
                placeholder="Full name"
                className={`auth-input ${errors.fullName ? 'auth-input-error' : ''}`}
                {...register('fullName', {
                  required: 'Full name is required',
                })}
              />
            </div>
            {errors.fullName && (
              <p className="auth-error-text">{errors.fullName.message}</p>
            )}
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="email" className="auth-label">
            Official Email
          </label>
          <div className="auth-input-wrapper">
            <Mail className="auth-input-icon" strokeWidth={1.75} />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@cdac.in"
              className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
              {...register('email', {
                required: 'Official email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              })}
            />
          </div>
          {errors.email && (
            <p className="auth-error-text">{errors.email.message}</p>
          )}
        </div>

        <div className="auth-row">
          <div className="auth-field">
            <label htmlFor="department" className="auth-label">
              Department
            </label>
            <div className="auth-input-wrapper">
              <Building2 className="auth-input-icon" strokeWidth={1.75} />
              <select
                id="department"
                defaultValue=""
                className={`auth-input auth-select ${
                  errors.department ? 'auth-input-error' : ''
                }`}
                {...register('department', {
                  required: 'Department is required',
                })}
              >
                <option value="" disabled>
                  Select department
                </option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            {errors.department && (
              <p className="auth-error-text">{errors.department.message}</p>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="designation" className="auth-label">
              Designation
            </label>
            <div className="auth-input-wrapper">
              <BadgeCheck className="auth-input-icon" strokeWidth={1.75} />
              <input
                id="designation"
                type="text"
                placeholder="e.g. Project Engineer"
                className={`auth-input ${errors.designation ? 'auth-input-error' : ''}`}
                {...register('designation', {
                  required: 'Designation is required',
                })}
              />
            </div>
            {errors.designation && (
              <p className="auth-error-text">{errors.designation.message}</p>
            )}
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="password" className="auth-label">
            Password
          </label>
          <div className="auth-input-wrapper">
            <Lock className="auth-input-icon" strokeWidth={1.75} />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Create a strong password"
              className={`auth-input auth-input-has-toggle ${
                errors.password ? 'auth-input-error' : ''
              }`}
              {...register('password', {
                required: 'Password is required',
                pattern: {
                  value: PASSWORD_RULE,
                  message:
                    'Min 8 characters, with upper, lower, number & symbol',
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="auth-toggle-visibility"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="auth-toggle-icon" strokeWidth={1.75} />
              ) : (
                <Eye className="auth-toggle-icon" strokeWidth={1.75} />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="auth-error-text">{errors.password.message}</p>
          )}
        </div>

        <div className="auth-field">
          <label htmlFor="confirmPassword" className="auth-label">
            Confirm Password
          </label>
          <div className="auth-input-wrapper">
            <Lock className="auth-input-icon" strokeWidth={1.75} />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              className={`auth-input auth-input-has-toggle ${
                errors.confirmPassword ? 'auth-input-error' : ''
              }`}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="auth-toggle-visibility"
              tabIndex={-1}
              aria-label={
                showConfirmPassword ? 'Hide password' : 'Show password'
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="auth-toggle-icon" strokeWidth={1.75} />
              ) : (
                <Eye className="auth-toggle-icon" strokeWidth={1.75} />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="auth-error-text">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="auth-field">
          <label className="auth-checkbox-row auth-checkbox-row-terms">
            <span className="auth-checkbox-box">
              <input
                type="checkbox"
                className="auth-checkbox-input"
                {...register('agreeToTerms', {
                  required: 'You must accept the terms to continue',
                })}
              />
              <Check className="auth-checkbox-tick" strokeWidth={3} />
            </span>
            <span className="auth-checkbox-label">
              I agree to the <strong>Terms and Conditions</strong> and{' '}
              <strong>Data Usage Policy</strong>.
            </span>
          </label>
          {errors.agreeToTerms && (
            <p className="auth-error-text">{errors.agreeToTerms.message}</p>
          )}
        </div>

        {submitError && (
          <div className="auth-error-banner">{submitError}</div>
        )}

        <button type="submit" disabled={isSubmitting} className="auth-button">
          {isSubmitting ? (
            <>
              <Loader2 className="auth-spinner" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <p className="auth-switch-text">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} className="auth-link">
          Sign In
        </button>
      </p>
    </div>
  );
};

/* ------------------------------ Auth Page ------------------------------ */

const Auth = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'

  const switchToSignup = () => setMode('signup');
  const switchToLogin = () => setMode('login');

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-overlay" />

        <div className="auth-left-content">
          <div className="auth-brand">
            <div className="auth-logo-placeholder">
              <Landmark className="auth-logo-icon" strokeWidth={2} />
            </div>
            <div>
              <p className="auth-brand-org">
                Centre for Development of Advanced Computing
              </p>
              <p className="auth-brand-name">C-DAC</p>
            </div>
          </div>

          <div className="auth-left-main">
            <h1 className="auth-left-title">
              Weekly Work Reporting &amp; Activity Monitoring System
            </h1>
            <p className="auth-left-desc">
              A unified portal for every centre to log work, monitor
              workload, and stay accountable — from submission to review,
              end to end.
            </p>

            <div className="auth-illustration">
              <ShieldCheck className="auth-illustration-icon" strokeWidth={1.25} />
              <span>Illustration placeholder</span>
            </div>
          </div>

          <div className="auth-features">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div className="feature-card" key={title}>
                <div className="feature-card-icon">
                  <Icon className="feature-icon" strokeWidth={1.75} />
                </div>
                <p className="feature-card-title">{title}</p>
                <p className="feature-card-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-right-inner">
          <div className="auth-brand auth-brand-mobile">
            <div className="auth-logo-placeholder">
              <Landmark className="auth-logo-icon" strokeWidth={2} />
            </div>
            <div>
              <p className="auth-brand-org">C-DAC</p>
              <p className="auth-brand-name">WWRAMS</p>
            </div>
          </div>

          <div className="auth-card">
            <div className="form-container">
              <AnimatePresence mode="wait" custom={mode} initial={false}>
                <motion.div
                  key={mode}
                  custom={mode}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {mode === 'login' ? (
                    <LoginPanel onSwitchToSignup={switchToSignup} />
                  ) : (
                    <SignupPanel onSwitchToLogin={switchToLogin} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <p className="auth-footnote">
            Authorized personnel only · Protected under IT Act, 2000
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;