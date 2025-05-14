import React, { forwardRef, useEffect, useState } from 'react';
import { Box, Input, IconButton, Flex, NumberInputRootProps } from '@chakra-ui/react';
import { LuChevronUp, LuChevronDown } from 'react-icons/lu';

interface NumberInputProps extends NumberInputRootProps {
  onChange?: (value: string) => void;
  value?: number;
  padding?: string | number;
  width?: string | number;
  placeholder?: string;
  isDisabled?: boolean;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      onChange,
      value = 0,
      padding = 2,
      width = 'full',
      placeholder = '0',
      isDisabled = false,
      min,
      max,
      step = 1,
      ...props
    },
    ref,
  ) => {
    const [localValue, setLocalValue] = useState<string>(value.toString());

    useEffect(() => {
      setLocalValue(value !== undefined ? value.toString() : '');
    }, [value]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setLocalValue(newValue);

      if (onChange) {
        onChange(newValue);
      }
    };

    const increment = () => {
      if (isDisabled) return;

      const currentValue = parseFloat(localValue) || 0;
      let newValue = currentValue + (step || 1);

      if (max !== undefined) {
        newValue = Math.min(newValue, max);
      }

      setLocalValue(newValue.toString());
      if (onChange) {
        onChange(newValue.toString());
      }
    };

    const decrement = () => {
      if (isDisabled) return;

      const currentValue = parseFloat(localValue) || 0;
      let newValue = currentValue - (step || 1);

      if (min !== undefined) {
        newValue = Math.max(newValue, min);
      }

      setLocalValue(newValue.toString());
      if (onChange) {
        onChange(newValue.toString());
      }
    };

    return (
      <Flex width={width} position="relative">
        <Input
          ref={ref}
          type="number"
          value={localValue}
          onChange={handleChange}
          padding={padding}
          placeholder={placeholder}
          disabled={isDisabled}
          min={min}
          max={max}
          step={step}
          {...props}
        />
        <Box
          position="absolute"
          right="0"
          top="50%"
          transform="translateY(-50%)"
          display="flex"
          flexDirection="column"
          height="100%"
          justifyContent="center"
          paddingRight="2px"
        >
          <IconButton
            aria-label="increment"
            size="xs"
            variant="ghost"
            height="50%"
            minWidth="20px"
            onClick={increment}
            disabled={isDisabled || (max !== undefined && parseFloat(localValue) >= max)}
            _hover={{ bg: 'transparent' }}
            _active={{ bg: 'transparent' }}
          >
            <LuChevronUp />
          </IconButton>
          <IconButton
            aria-label="decrement"
            size="xs"
            variant="ghost"
            height="50%"
            minWidth="20px"
            onClick={decrement}
            disabled={isDisabled || (min !== undefined && parseFloat(localValue) <= min)}
            _hover={{ bg: 'transparent' }}
            _active={{ bg: 'transparent' }}
          >
            <LuChevronDown />
          </IconButton>
        </Box>
      </Flex>
    );
  },
);

NumberInput.displayName = 'NumberInput';
