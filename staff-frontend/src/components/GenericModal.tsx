import { useTranslation } from 'react-i18next';
import { useToast } from './ui/toaster';
import { ReactNode, useEffect, useState } from 'react';
import { NumberInput } from './ui/number-input';
import {
  Button,
  Dialog,
  Input,
  Portal,
  Select,
  SelectItemProps,
  SelectRootProps,
  Stack,
  Text,
} from '@chakra-ui/react';
import FormControl from './ui/form-control';
import React from 'react';

export type FormField<T> = {
  name: keyof T;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  options?: Array<{ value: string | number; label: string }>;
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
};

interface GenericFormModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FormField<T>[];
  onSubmit: (data: T) => Promise<void>;
  initialValues?: Partial<T>;
  isLoading?: boolean;
  submitText?: string;
  cancelText?: string;
}

const CustomSelectItem = React.forwardRef<
  HTMLDivElement,
  SelectItemProps & { children?: React.ReactNode }
>((props, ref) => {
  console.log('CustomSelectItem props:', JSON.stringify(props, null, 2));
  return <Select.Item ref={ref} {...props} />;
});

export const GenericFormModal = <T extends Record<string, any>>({
  isOpen,
  onClose,
  title,
  fields,
  onSubmit,
  initialValues,
  isLoading = false,
  submitText = 'Save',
  cancelText = 'Cancel',
}: GenericFormModalProps<T>) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [formData, setFormData] = useState<Partial<T>>(initialValues || {});
  const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialValues || {});
      setErrors({} as Record<keyof T, string>);
    }
  }, [isOpen, initialValues]);

  const handleChange = (name: keyof T, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {} as Record<keyof T, string>;
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = t('errors.requiredField');
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await onSubmit(formData as T);
      onClose();
    } catch (error) {
      toast.showToast({
        title: t('common.error'),
        description: t('errors.submitFailed'),
        type: 'error',
      });
    }
  };

  const renderInput = (field: FormField<T>): ReactNode => {
    switch (field.type) {
      case 'number':
        return (
          <NumberInput
            value={formData[field.name] as number | undefined}
            onChange={(valueString: string) =>
              handleChange(field.name, valueString === '' ? undefined : Number(valueString))
            }
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
            width="full"
            isDisabled={isLoading}
          />
        );

      case 'select':
        return (
          <Select.Root
            value={formData[field.name]?.toString() || ''}
            onChange={(e: SelectRootProps) => handleChange(field.name, e.value)}
            collection={field.options || []}
            size="sm"
          >
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText />
              </Select.Trigger>
            </Select.Control>

            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {field.options?.map((option) => (
                    <CustomSelectItem>{option.label}</CustomSelectItem>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        );

      case 'textarea':
        return (
          <Input
            as="textarea"
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
          />
        );

      default:
        return (
          <Input
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <Dialog.Root isOpen={isOpen} onClose={onClose} size="xl">
      <Dialog.Content>
        <Dialog.Header>{title}</Dialog.Header>
        <Dialog.CloseTrigger />
        <Dialog.Body>
          <Stack spaceX={4} spaceY={4} p={4}>
            {fields.map((field) => (
              <FormControl
                key={field.name as string}
                label={field.label}
                isInvalid={!!errors[field.name]}
              >
                {renderInput(field)}
                {errors[field.name] && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors[field.name]}
                  </Text>
                )}
              </FormControl>
            ))}
          </Stack>
        </Dialog.Body>

        <Dialog.Footer>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            {t(cancelText)}
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            loading={isLoading}
            loadingText={t('common.saving')}
            ml={3}
          >
            {t(submitText)}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};
