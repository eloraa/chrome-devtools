import React, { useState, useEffect, useRef, ReactElement, forwardRef } from 'react';
import { cls } from '@/lib/utils';
import { Input } from '../input/input';
import { Asterisk, ChevronsUpDown } from 'lucide-react';

interface OptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  children: React.ReactNode;
}

export const Option: React.FC<OptionProps> = ({ children, ...props }) => {
  return <option {...props}>{children}</option>;
};

interface DropdownProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  children: ReactElement<OptionProps> | ReactElement<OptionProps>[];
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(
  (
    {
      children,
      placeholder,
      className,
      onChange,
      onFocus,
      onBlur,
      disabled,
      required,
      name,
      id,
      value,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [selectedOption, setSelectedOption] = useState<string | null>((value as string) || null); // Update this line
    const [isSearching, setIsSearching] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
      setSelectedOption((value as string) || null);
    }, [value]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      const handleScroll = () => {
        if (isOpen) {
          updateDropdownPosition();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }, [isOpen]);

    useEffect(() => {
      if (ref && typeof ref === 'function') {
        ref(selectRef.current);
      } else if (ref && 'current' in ref) {
        ref.current = selectRef.current;
      }
    }, [ref]);

    const updateDropdownPosition = () => {
      if (inputRef.current && optionsRef.current) {
        const inputRect = inputRef.current.getBoundingClientRect();
        const optionsHeight = optionsRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;

        if (inputRect.bottom + optionsHeight > viewportHeight && inputRect.top - optionsHeight > 0) {
          setDropdownPosition('top');
        } else {
          setDropdownPosition('bottom');
        }
      }
    };

    const handleToggleDropdown = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
        if (!isOpen) {
          setIsSearching(false);
          setSearchValue('');
          setTimeout(updateDropdownPosition, 0);
        }
      }
    };
    const handleOptionClick = (value: string) => {
      setSelectedOption(value);
      setIsOpen(false);
      setIsSearching(false);
      setSearchValue('');
      if (onChange && selectRef.current) {
        selectRef.current.value = value;
        onChange({
          target: selectRef.current,
          type: 'change',
          bubbles: true,
        } as React.ChangeEvent<HTMLSelectElement>);
      }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
      setIsSearching(true);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (onFocus) {
        onFocus(e as unknown as React.FocusEvent<HTMLSelectElement>);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setSearchValue(selectedOptionText);
      if (onBlur) {
        onBlur(e as unknown as React.FocusEvent<HTMLSelectElement>);
      }
    };

    const options = React.Children.toArray(children) as ReactElement<OptionProps>[];
    const selectedOptionText = selectedOption ? (options.find(o => o.props.value === selectedOption)?.props.children as string) || '' : placeholder || '';

    const filteredOptions = isSearching ? options.filter(option => String(option.props.children).toLowerCase().includes(searchValue.toLowerCase())) : options;

    return (
      <div ref={dropdownRef} className={cls('relative w-full', isOpen && 'z-10', selectedOption && 'text-gray-900', disabled && 'opacity-50 cursor-not-allowed', className)}>
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={isSearching ? searchValue : selectedOptionText}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onClick={handleToggleDropdown}
            autoComplete="off"
            disabled={disabled}
            required={required}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            aria-haspopup="listbox"
            aria-controls={`${id || name}-listbox`}
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronsUpDown className="w-5 h-5 text-primary/60" />
          </span>
        </div>
        {isOpen && (
          <div
            ref={optionsRef}
            className={cls(
              'absolute w-full border border-primary/40 bg-white shadow-lg max-h-60 overflow-auto z-10',
              dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1',
              'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
            )}
            role="listbox"
            id={`${id || name}-listbox`}
            data-state="open"
            data-side={dropdownPosition}
          >
            <ul className="py-1">
              {filteredOptions.map((option, index) => (
                <li
                  key={index}
                  role="option"
                  aria-selected={selectedOption === option.props.value}
                  className={cls(
                    'cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-primary/20 text-sm',
                    selectedOption === option.props.value ? 'bg-primary/20 text-primary' : 'text-foreground'
                  )}
                  onClick={() => handleOptionClick(String(option.props.value))}
                >
                  <span className="block truncate">{option.props.children}</span>
                  {selectedOption === option.props.value && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary">
                      <Asterisk className="w-4 h-4" />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        <select
          {...props}
          ref={selectRef}
          className="sr-only"
          name={name}
          id={id}
          required={required}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden="true"
          value={selectedOption || ''}
          onChange={e => {
            setSelectedOption(e.target.value);
            if (onChange) onChange(e);
          }}
        >
          {children}
        </select>
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export { Dropdown };
