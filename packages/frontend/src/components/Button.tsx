import React from 'react';
import LoadingIcons from 'react-loading-icons';
import tailwindColors from 'tailwindcss/colors';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingText?: string;
};

export default function Button({
  className: classNameOverrides,
  disabled,
  loading,
  loadingText,
  children,
  ...restProps
}: ButtonProps) {
  const isInactive = React.useMemo(() => {
    return loading || disabled;
  }, [loading, disabled]);

  return (
    <button
      {...restProps}
      disabled={isInactive}
      className={[
        'pt-4',
        'pb-4',
        'pl-6',
        'pr-6',
        'border-2',
        'rounded-xl',
        'font-medium',
        'select-none',
        isInactive ? 'text-gray-400' : 'text-primary-500',
        isInactive ? 'border-gray-300' : 'border-primary-500',
        'bg-transparent',
        'disabled:text-gray-400',
        'disabled:border-gray-300',
        'disabled:bg-transparent',
        'hover:bg-primary-50',
        'active:bg-primary-100',
        'focus:ring',
        'focus:outline-none',
        'focus:ring-primary-300',
        classNameOverrides,
      ].join(' ')}>
      <div className="flex flex-row text-center justify-center items-center">
        {loading ? (
          <>
            <div className="mr-1">
              <LoadingIcons.Oval
                speed={1.5}
                height="1.5rem"
                strokeWidth={3}
                stroke={tailwindColors.gray[400]}
              />
            </div>
            <p>{loadingText || 'Loading…'}</p>
          </>
        ) : (
          children
        )}
      </div>
    </button>
  );
}
