import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Building2,
  BadgeCheck,
  Loader2,
  Check,
  IdCard,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  ArrowLeft,
  RefreshCw,
  X,
} from 'lucide-react';
import './login.css';
import Loading from '../../components/Loading/Loading';
import Toast from '../../components/Toast/Toast';

const PASSWORD_CHECKS = [
  { key: 'firstCap', label: 'Starts with a capital letter', test: (p) => /^[A-Z]/.test(p) },
  { key: 'bothCase', label: 'Includes uppercase & lowercase', test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { key: 'number', label: 'Includes a number', test: (p) => /\d/.test(p) },
  { key: 'special', label: 'Includes a special character (!@#$%^&*)', test: (p) => /[!@#$%^&*]/.test(p) },
  { key: 'length', label: 'Between 8 and 12 characters', test: (p) => p.length >= 8 && p.length <= 12 },
];

const DEPARTMENTS = [
  'Software Development',
  'Networking & Security',
  'AI & Machine Learning',
  'HPC & Systems',
  'Administration',
  'HR',
];

const STEP1_FIELDS = [
  'employeeId',
  'fullName',
  'email',
  'phoneNumber',
  'address',
  'captcha',
];

const CAPTCHA_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

const makeCaptcha = () => {
  let text = '';
  for (let i = 0; i < 6; i++) {
    text += CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)];
  }
  return text;
};

const slideVariants = {
  enter: (direction) => ({ x: direction === 'forward' ? 64 : -64, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction === 'forward' ? -64 : 64, opacity: 0 }),
};

const flipVariants = {
  enter: { rotateY: 90, opacity: 0 },
  center: { rotateY: 0, opacity: 1 },
  exit: { rotateY: -90, opacity: 0 },
};

const popoverVariants = {
  enter: { opacity: 0, y: -8, scale: 0.96 },
  center: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.96 },
};

/* ------------------- Live Password Checklist (floating) ------------------- */

const PasswordChecklist = ({ password }) => (
  <motion.div
    key="pwd-popover"
    className="auth-pwd-popover"
    variants={popoverVariants}
    initial="enter"
    animate="center"
    exit="exit"
    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
    // Prevent the popover from stealing focus from the password input
    // (which would otherwise fire the input's onBlur and close this).
    onMouseDown={(e) => e.preventDefault()}
  >
    <ul className="auth-pwd-rules">
      {PASSWORD_CHECKS.map((rule) => {
        const passed = rule.test(password || '');
        return (
          <li
            key={rule.key}
            className={`auth-pwd-rule ${passed ? 'auth-pwd-rule-ok' : ''}`}
          >
            {passed ? (
              <Check size={14} strokeWidth={2.75} />
            ) : (
              <X size={14} strokeWidth={2.75} />
            )}
            <span>{rule.label}</span>
          </li>
        );
      })}
    </ul>
  </motion.div>
);

/* ---------------------------- Text CAPTCHA ---------------------------- */

/* --------------------------- Canvas CAPTCHA --------------------------- */

const CanvasCaptcha = ({ register, errors, captcha, onRefresh }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const cssW = 180;
    const cssH = 50;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background
    ctx.clearRect(0, 0, cssW, cssH);
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, cssW, cssH);

    // Distorted characters
    ctx.font = `${24 + Math.random() * 8}px 'Poppins', system-ui, sans-serif`;
    for (let i = 0; i < captcha.length; i++) {
      ctx.save();
      ctx.translate(25 + i * 25, 25 + Math.random() * 10);
      ctx.rotate((Math.random() - 0.5) * 0.8);
      ctx.fillStyle = `rgb(${Math.random() * 150}, ${Math.random() * 150}, ${
        Math.random() * 150
      })`;
      ctx.fillText(captcha[i], 0, 0);
      ctx.restore();
    }

    // Noise lines
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 180, Math.random() * 50);
      ctx.lineTo(Math.random() * 180, Math.random() * 50);
      ctx.strokeStyle = '#999';
      ctx.stroke();
    }

    // Strike-through line
    ctx.beginPath();
    ctx.moveTo(10, 25);
    ctx.lineTo(170, 30);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#444';
    ctx.stroke();
  }, [captcha]);

  return (
    <div className="auth-field">
      <label className="auth-label">Security Check</label>
      <div className="auth-captcha-row">
        <div className="auth-captcha-canvas-wrap">
          <canvas ref={canvasRef} className="auth-captcha-canvas" aria-hidden="true" />
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="auth-captcha-refresh"
          tabIndex={-1}
          aria-label="Get a new code"
        >
          <RefreshCw size={17} strokeWidth={1.75} />
        </button>
        <div className="auth-input-wrapper auth-captcha-input-wrap">
          <input
            type="text"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
            placeholder="Enter code"
            aria-label="Enter the characters shown in the image"
            className={`auth-input auth-captcha-input ${
              errors.captcha ? 'auth-input-error' : ''
            }`}
            {...register('captcha', {
              required: 'Please enter the CAPTCHA',
              validate: (value) =>
                value.toLowerCase() === captcha.toLowerCase() ||
                'Incorrect code, try again',
            })}
          />
        </div>
      </div>
      {errors.captcha && <p className="auth-error-text">{errors.captcha.message}</p>}
    </div>
  );
};

/* ---------------------------- Login Panel ---------------------------- */

const LoginPanel = ({ onSwitchToSignup }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: { identifier: '', password: '', rememberMe: false, captcha: '' },
  });

  const [captcha, setCaptcha] = useState(makeCaptcha);
  const refreshCaptcha = () => {
    setCaptcha(makeCaptcha());
    setValue('captcha', '');
    clearErrors('captcha');
  };

  const onSubmit = async (data) => {
    setAuthError('');
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 900));

    try {
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

      // Seed a default user if there are no registered accounts in localStorage
      if (existingUsers.length === 0) {
        existingUsers.push({
          employeeId: 'CDAC1234',
          fullName: 'Default User',
          email: 'user@cdac.in',
          department: 'Software Development',
          designation: 'Project Engineer',
          password: 'password123',
        });
        localStorage.setItem('users', JSON.stringify(existingUsers));
      }

      // Check if user credentials match
      const matchedUser = existingUsers.find(
        (u) =>
          (u.employeeId.toLowerCase() === data.identifier.toLowerCase() ||
            u.email.toLowerCase() === data.identifier.toLowerCase()) &&
          u.password === data.password
      );

      if (!matchedUser) {
        setAuthError('Invalid Employee ID / Email or Password.');
        // regenerate captcha on auth failure
        refreshCaptcha();
        setIsSubmitting(false);
        return;
      }

      // Store current user info in localStorage
      localStorage.setItem('currentUser', JSON.stringify(matchedUser));
      setIsSubmitting(false);
      // show toast + loading screen then navigate
      setToastMessage('Login Successful!');
      setShowToast(true);
      setShowLoading(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1400);
    } catch (e) {
      setAuthError('Failed to sign in. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Called when RHF validation fails — if captcha is wrong, refresh it
  const onError = (errors) => {
    if (errors && errors.captcha) {
      refreshCaptcha();
    }
  };

  return (
    <div className="login-panel">
      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
      {showLoading && <Loading />}
      <div className="auth-header">
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">
          Sign in with your official credentials to continue
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate className="auth-form">
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
              className={`auth-input auth-input-has-toggle ${errors.password ? 'auth-input-error' : ''
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

        <CanvasCaptcha
          register={register}
          errors={errors}
          captcha={captcha}
          onRefresh={refreshCaptcha}
        />

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
  const [showPwdRules, setShowPwdRules] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      employeeId: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      address: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
      captcha: '',
    },
  });

  const password = watch('password');

  const [captcha, setCaptcha] = useState(makeCaptcha);
  const refreshCaptcha = () => {
    setCaptcha(makeCaptcha());
    setValue('captcha', '');
    clearErrors('captcha');
  };

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

    await new Promise((resolve) => setTimeout(resolve, 900));

    try {
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

      // Check if user already exists
      const userExists = existingUsers.some(
        (u) =>
          u.employeeId.toLowerCase() === data.employeeId.toLowerCase() ||
          u.email.toLowerCase() === data.email.toLowerCase()
      );

      if (userExists) {
        setSubmitError('An account with this Employee ID or Email already exists.');
        setIsSubmitting(false);
        return;
      }

      // Add new user
      existingUsers.push({
        employeeId: data.employeeId,
        fullName: data.fullName,
        email: data.email,
        department: data.department,
        designation: data.designation,
        password: data.password,
      });

      localStorage.setItem('users', JSON.stringify(existingUsers));
      setIsSubmitting(false);
      onSwitchToLogin();
    } catch (e) {
      setSubmitError('Failed to create account. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Registered once so we can layer our own focus/blur handling on top of
  // react-hook-form's, without clobbering RHF's onBlur (used for touched
  // state tracking).
  const passwordField = register('password', {
    required: 'Password is required',
    validate: {
      firstCap: (v) =>
        /^[A-Z]/.test(v) || 'Must start with a capital letter',
      bothCase: (v) =>
        (/[a-z]/.test(v) && /[A-Z]/.test(v)) ||
        'Include upper & lower case',
      number: (v) => /\d/.test(v) || 'Include a number',
      special: (v) =>
        /[!@#$%^&*]/.test(v) || 'Include a special character',
      length: (v) =>
        (v.length >= 8 && v.length <= 12) ||
        'Must be 8 to 12 characters',
    },
  });

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
                        className={`auth-input auth-select ${errors.department ? 'auth-input-error' : ''
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

                <CanvasCaptcha
                  register={register}
                  errors={errors}
                  captcha={captcha}
                  onRefresh={refreshCaptcha}
                />

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
                <div className="auth-field auth-field--password">
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
                      className={`auth-input auth-input-has-toggle ${errors.password ? 'auth-input-error' : ''
                        }`}
                      {...passwordField}
                      onFocus={() => setShowPwdRules(true)}
                      onBlur={(e) => {
                        passwordField.onBlur(e);
                        setShowPwdRules(false);
                      }}
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

                  {/* Floating live-validation popover — appears on focus,
                      tracks each keystroke, disappears on blur. Does not
                      push the confirm-password field below it. */}
                  <AnimatePresence>
                    {showPwdRules && <PasswordChecklist password={password} />}
                  </AnimatePresence>
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
                      className={`auth-input auth-input-has-toggle ${errors.confirmPassword ? 'auth-input-error' : ''
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
                variants={flipVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
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
      </div>
    </div>
  );
};

export default Auth;