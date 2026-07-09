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
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
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
          flex: 1,
        }}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          color: showPassword ? '#FFCD11' : '#A0A0A0',
          flexShrink: 0,
          transition: 'color 0.2s',
        }}
        title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
      >
        {showPassword ? '👁️' : '👁️‍🗨️'}
      </button>
    </div>
  );
}
