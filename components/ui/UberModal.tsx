'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { colors, spacing, borderRadius, shadows, typography, transitions } from '@/lib/design-system';

interface UberModalProps {
  /** Modal is open */
  isOpen: boolean;
  /** On close callback */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal children/content */
  children: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  /** Modal size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Close button visible */
  showCloseButton?: boolean;
  /** Custom styling */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

/**
 * UberModal - Modal dialog following Uber design style
 *
 * @example
 * <UberModal
 *   isOpen={open}
 *   onClose={() => setOpen(false)}
 *   title="Confirm Action"
 * >
 *   Are you sure?
 * </UberModal>
 */
export const UberModal: React.FC<UberModalProps> = (
  {
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    showCloseButton = true,
    className = '',
    style,
  }
) => {
  // Size map
  const sizeMap = {
    sm: { width: '320px' },
    md: { width: '480px' },
    lg: { width: '640px' },
    xl: { width: '800px' },
  };

  const currentSize = sizeMap[size];

  // Close on escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const overlayStyle: React.CSSProperties = {
    // Positioning
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 200,

    // Overlay
    backgroundColor: colors.bg.overlay,
    backdropFilter: 'blur(4px)',

    // Content
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    // Animation
    animation: 'fadeIn 200ms ease-out',
  };

  const modalStyle: React.CSSProperties = {
    // Size
    width: '90vw',
    maxWidth: currentSize.width,
    maxHeight: '90vh',
    overflow: 'auto',

    // Style
    backgroundColor: colors.bg.white,
    borderRadius: borderRadius['2xl'],
    boxShadow: shadows['2xl'],

    // Animation
    animation: 'slideUp 300ms ease-out',

    // Responsive
    '@media (max-width: 640px)': {
      width: '95vw',
      maxWidth: '100%',
      borderRadius: borderRadius.xl,
    },

    ...style,
  };

  const headerStyle: React.CSSProperties = {
    // Layout
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    // Spacing
    padding: spacing.lg,

    // Style
    borderBottom: `1px solid ${colors.gray[100]}`,

    // Typography
    fontFamily: typography.families.primary,
  };

  const contentStyle: React.CSSProperties = {
    padding: spacing.lg,
    color: colors.text.primary,
    fontFamily: typography.families.primary,
    lineHeight: 1.6,
  };

  const footerStyle: React.CSSProperties = {
    // Layout
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.md,

    // Spacing
    padding: spacing.lg,

    // Style
    borderTop: `1px solid ${colors.gray[100]}`,
  };

  const closeButtonStyle: React.CSSProperties = {
    // Reset
    background: 'none',
    border: 'none',
    padding: spacing.sm,

    // Style
    color: colors.text.tertiary,
    cursor: 'pointer',
    fontSize: '24px',

    // Transitions
    transition: transitions.base,

    // Hover
    ':hover': {
      color: colors.text.primary,
    },
  };

  const content = (
    <div style={overlayStyle} onClick={onClose}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

      <div
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
        className={className}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div style={headerStyle}>
            {title && (
              <h2
                id="modal-title"
                style={{
                  fontSize: typography.sizes.lg,
                  fontWeight: typography.weights.bold,
                  color: colors.text.primary,
                  margin: 0,
                }}
              >
                {title}
              </h2>
            )}

            {showCloseButton && (
              <button
                onClick={onClose}
                style={closeButtonStyle}
                aria-label="Close modal"
                title="Close"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div style={contentStyle}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={footerStyle}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Use portal to render at document root
  return typeof document !== 'undefined'
    ? createPortal(content, document.body)
    : null;
};

UberModal.displayName = 'UberModal';

export default UberModal;
