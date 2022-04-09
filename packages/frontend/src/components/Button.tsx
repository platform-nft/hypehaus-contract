import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: ButtonProps) {
  const { className: _, children, ...restProps } = props;
  return (
    <button
      {...restProps}
      className={[
        'pt-4',
        'pb-4',
        'pl-6',
        'pr-6',
        'border-2',
        'rounded-xl',
        'font-medium',
        'select-none',
        'text-primary-500',
        'border-primary-500',
        'bg-transparent',
        'disabled:text-gray-300',
        'disabled:border-gray-300',
        'disabled:bg-transparent',
        'hover:bg-primary-50',
      ].join(' ')}>
      {children}
    </button>
  );
}
