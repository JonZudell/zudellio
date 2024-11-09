import React, { useEffect, useRef } from 'react';
import './TextArea.css';
interface TextAreaProps {
  label?: string;
  rows: number;
  className?: string;
  inputClassName?: string;
  inputRef?: React.Ref<HTMLTextAreaElement>;
  inputId: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  className,
  inputClassName,
  inputRef,
  rows,
  inputId,
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.setSelectionRange(0, 0);
    }
  }, []);

  return (
    <div className={`${className}`}>
      <label htmlFor={inputId} className="block mb-2">
        {label}
      </label>
      <textarea
        id={inputId}
        ref={inputRef}
        className={`border p-2 border-2 textarea hover:textarea focus:textarea ${inputClassName}`}
        rows={rows}
      />
    </div>
  );
};

export default TextArea;
