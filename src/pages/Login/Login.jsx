import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
  Check,
  IdCard,
  Lock,
  Mail,
  User,
  Building2,
  BadgeCheck,
  ArrowLeft,
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

const STEP1_FIELDS = ['employeeId', 'fullName', 'email', 'department', 'designation'];

const slideVariants = {
  enter: (direction) => ({ x: direction === 'forward' ? 64 : -64, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction === 'forward' ? -64 : 64, opacity: 0 }),
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
            <span className="auth-input-icon">
              <IdCard size={18} strokeWidth={1.75} />
            </span>
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
            <span className="auth-input-icon">
              <Lock size={18} strokeWidth={1.75} />
            </span>
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
                <EyeOff size={19} strokeWidth={1.75} />
              ) : (
                <Eye size={19} strokeWidth={1.75} />
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
            <Check className="auth-checkbox-tick" size={12} strokeWidth={3} />
          </span>
          <span>Remember me</span>
        </label>

        {authError && <div className="auth-error-banner">{authError}</div>}

        <button type="submit" disabled={isSubmitting} className="auth-button">
          {isSubmitting ? (
            <>
              <Loader2 className="auth-spinner" size={19} />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <p className="auth-switch-text">
        Dont have an account?{' '}
        <button type="button" onClick={onSwitchToSignup} className="auth-link">
          Create Account
        </button>
      </p>
    </div>
  );
};

/* ------------------------- Signup Wizard (2 steps) ------------------------- */

const SignupPanel = ({ onSwitchToLogin }) => {
  const [step, setStep] = useState(1); // 1 | 2
  const [stepDirection, setStepDirection] = useState('forward');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
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

  const goNext = async () => {
    const valid = await trigger(STEP1_FIELDS);
    if (!valid) return;
    setStepDirection('forward');
    setStep(2);
  };

  const goBack = () => {
    setStepDirection('backward');
    setStep(1);
  };

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
          {step === 1
            ? 'Step 1 of 2 — Your employee details'
            : 'Step 2 of 2 — Secure your account'}
        </p>
        <div className="auth-progress">
          <span className={`auth-progress-dot ${step >= 1 ? 'auth-progress-dot-active' : ''}`} />
          <span className="auth-progress-line" />
          <span className={`auth-progress-dot ${step >= 2 ? 'auth-progress-dot-active' : ''}`} />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="auth-form">
        <div className="signup-step-container">
          <AnimatePresence mode="wait" custom={stepDirection} initial={false}>
            {step === 1 ? (
              <motion.div
                key="step1"
                custom={stepDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="signup-step"
              >
                <div className="auth-row">
                  <div className="auth-field">
                    <label htmlFor="employeeId" className="auth-label">
                      Employee ID
                    </label>
                    <div className="auth-input-wrapper">
                      <span className="auth-input-icon">
                        <IdCard size={18} strokeWidth={1.75} />
                      </span>
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
                      <span className="auth-input-icon">
                        <User size={18} strokeWidth={1.75} />
                      </span>
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
                    <span className="auth-input-icon">
                      <Mail size={18} strokeWidth={1.75} />
                    </span>
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
                      <span className="auth-input-icon">
                        <Building2 size={18} strokeWidth={1.75} />
                      </span>
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
                      <span className="auth-input-icon">
                        <BadgeCheck size={18} strokeWidth={1.75} />
                      </span>
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

                <button type="button" onClick={goNext} className="auth-button">
                  Next
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                custom={stepDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="signup-step"
              >
                <div className="auth-field">
                  <label htmlFor="password" className="auth-label">
                    Password
                  </label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <Lock size={18} strokeWidth={1.75} />
                    </span>
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
                        <EyeOff size={19} strokeWidth={1.75} />
                      ) : (
                        <Eye size={19} strokeWidth={1.75} />
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
                    <span className="auth-input-icon">
                      <Lock size={18} strokeWidth={1.75} />
                    </span>
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
                        <EyeOff size={19} strokeWidth={1.75} />
                      ) : (
                        <Eye size={19} strokeWidth={1.75} />
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
                      <Check className="auth-checkbox-tick" size={12} strokeWidth={3} />
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

                <div className="signup-step-actions">
                  <button
                    type="button"
                    onClick={goBack}
                    className="auth-button auth-button-secondary"
                  >
                    <ArrowLeft size={18} strokeWidth={1.75} />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="auth-button"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="auth-spinner" size={19} />
                        Creating...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
      <div className="auth-bg-circle auth-bg-circle-one" />
      <div className="auth-bg-circle auth-bg-circle-two" />
      <div className="auth-bg-circle auth-bg-circle-three" />

      <div className="auth-center">
        

        <motion.div
          className="auth-card"
          layout
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div className="form-container" layout>
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
          </motion.div>
        </motion.div>

        <p className="auth-footnote">
          Authorized personnel only · Protected under IT Act, 2000
        </p>
      </div>
    </div>
  );
};

export default Auth;