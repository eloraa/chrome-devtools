import React, { useState, useEffect, useRef, ReactElement, forwardRef } from 'react';

interface OptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  children: React.ReactNode;
}

export const Option: React.FC<OptionProps> = ({ children, ...props }) => {
  return <option {...props}>{children}</option>;
};

interface DropdownProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  children: ReactElement<OptionProps> | ReactElement<OptionProps>[];
  noPlaceholder?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(
  (
    {
      children,
      noPlaceholder,
      className,
      onChange,
      onFocus,
      onBlur,
      disabled,
      required,
      name,
      id,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const handleToggleDropdown = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
      }
    };

    const handleOptionClick = (value: string, label: string) => {
      setSelectedOption(value);
      setSearchValue(label);
      setIsOpen(false);
      if (onChange && selectRef.current) {
        selectRef.current.value = value;
        const event = new Event('change', { bubbles: true });
        selectRef.current.dispatchEvent(event);
        onChange(event as unknown as React.ChangeEvent<HTMLSelectElement>);
      }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (onFocus) {
        onFocus(e as unknown as React.FocusEvent<HTMLSelectElement>);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (onBlur) {
        onBlur(e as unknown as React.FocusEvent<HTMLSelectElement>);
      }
    };

    const options = React.Children.toArray(children) as ReactElement<OptionProps>[];
    const placeholder = options.find(option => option.props.value === '')?.props.children as string;

    const filteredOptions = options.filter(option => String(option.props.children).toLowerCase().includes(searchValue.toLowerCase()));

    return (
      <div ref={dropdownRef} className={`__select ${className || ''} ${isOpen ? 'active' : ''} ${selectedOption || searchValue ? 'filled' : ''} ${disabled ? 'disabled' : ''}`}>
        <div className="__search_input">
          <input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onClick={handleToggleDropdown}
            autoComplete="off"
            className="search_"
            disabled={disabled}
            required={required}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            aria-haspopup="listbox"
            aria-controls={`${id || name}-listbox`}
          />
          {!noPlaceholder && !selectedOption && !searchValue && placeholder && <span className="placeholder">{placeholder}</span>}
        </div>
        {isOpen && (
          <div className="option_wrapper" role="listbox" id={`${id || name}-listbox`}>
            {filteredOptions.map((option, index) => (
              <div
                key={index}
                role="option"
                aria-selected={selectedOption === option.props.value}
                className={`_option ${selectedOption === option.props.value ? 'active' : ''}`}
                data-value={option.props.value}
                onClick={() => handleOptionClick(String(option.props.value), String(option.props.children))}
              >
                {option.props.children}
              </div>
            ))}
          </div>
        )}
        <select {...props} ref={ref} style={{ display: 'none' }} name={name} id={id} required={required} disabled={disabled} tabIndex={-1} aria-hidden="true">
          {children}
        </select>
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export { Dropdown };
