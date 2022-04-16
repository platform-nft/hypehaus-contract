import React from 'react';

export const NumberInputContext = React.createContext<{
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}>(null as any);

type NumberInputProps = {
  min: number;
  max: number;
  disabled?: boolean;
};

export default function NumberInput({ min, max, disabled }: NumberInputProps) {
  const { value, setValue } = React.useContext(NumberInputContext);

  const handleChange = (input: string) => {
    try {
      const number = Number.parseInt(input);
      setValue(Math.max(min, Math.min(number, max)));
    } catch (error) {
      console.error('Failed to parse integer:', error);
    }
  };

  const handleClickDecrement = () => {
    setValue((prev) => Math.max(min, prev - 1));
  };

  const handleClickIncrement = () => {
    setValue((prev) => Math.min(max, prev + 1));
  };

  return (
    <div className="flex justify-center">
      <NumberInputButton
        disabled={disabled || value === min}
        onClick={handleClickDecrement}>
        -
      </NumberInputButton>
      <input
        className="w-12 text-center border-y-2"
        disabled={disabled}
        type="number"
        step={1}
        min={min}
        max={max}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      />
      <NumberInputButton
        disabled={disabled || value === max}
        onClick={handleClickIncrement}>
        +
      </NumberInputButton>
    </div>
  );
}

type NumberInputButtonProps = React.PropsWithChildren<{
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}>;

function NumberInputButton(props: NumberInputButtonProps) {
  return (
    <button
      {...props}
      className={[
        'w-12',
        'h-12',
        'font-bold',
        'border-2',
        'text-center',
        'select-none',
        'first:rounded-l-md',
        'last:rounded-r-md',
        'border-primary-200',
        'bg-primary-100',
        'disabled:text-gray-400',
        'disabled:border-gray-200',
        'disabled:bg-gray-100',
        'active:bg-primary-200',
        'focus:ring',
        'focus:outline-none',
        'focus:ring-primary-300',
      ].join(' ')}>
      {props.children}
    </button>
  );
}
