import { useState } from 'react';

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  dir?: string;
  className?: string;
  style?: React.CSSProperties;
  minLength?: number;
  autoComplete?: string;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder = 'كلمة المرور',
  required = false,
  dir = 'rtl',
  className = '',
  style = {},
  minLength,
  autoComplete = 'current-password',
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type={showPassword ? 'text' : 'password'}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        dir={dir}
        minLength={minLength}
        autoComplete={autoComplete}
        className={className}
        style={{
          ...style,
          paddingInlineEnd: '40px',
        }}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        style={{
          position: 'absolute',
          insetInlineEnd: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          color: 'var(--cat-yellow, #FFCD11)',
          zIndex: 10,
        }}
        title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
      >
        {showPassword ? '👁️' : '👁️‍🗨️'}
      </button>
    </div>
  );
}
