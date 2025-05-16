import { useTranslation } from 'react-i18next';
import { useToast } from './ui/toaster';
import { ReactNode, useEffect, useState } from 'react';
import { NumberInputRoot, NumberInputField } from './ui/number-input';
import {
  Button,
  CloseButton,
  createListCollection,
  Dialog,
  Input,
  Portal,
  Select,
  Stack,
} from '@chakra-ui/react';
import FormControl from './ui/form-control';

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
    setFormData(initialValues || {});
    setErrors({} as Record<keyof T, string>);
  }, [isOpen]);

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

  const renderInput = (field: FormField<T>): Promise<ReactNode> => {
    switch (field.type) {
      case 'number':
        return (
          <NumberInputRoot
            min={field.min}
            max={field.max}
            step={field.step}
            width="full"
            disabled={isLoading}
            value={formData[field.name]?.toString() || ''}
            onValueChange={({ valueAsNumber }) => {
              handleChange(field.name, valueAsNumber);
            }}
          >
            <NumberInputField placeholder={field.placeholder} />
          </NumberInputRoot>
        );

      case 'select': {
        const collection = createListCollection({
          items: (field.options || []).map((option) => ({
            value: option.value.toString(),
            label: option.label,
          })),
        });

        const rawValue = formData[field.name];
        const currentValue =
          typeof rawValue === 'object' ? rawValue?.id?.toString() : rawValue?.toString() || '';
        const isValidValue = collection.items.some((item) => item.value === currentValue);
        const placeholder = isValidValue
          ? collection.items.find((item) => item.value === currentValue)?.label
          : ' ';

        return (
          <Select.Root
            collection={collection}
            onValueChange={(value) => handleChange(field.name, value)}
            size="sm"
            zIndex={1402}
          >
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder={isValidValue ? placeholder : field.placeholder} />
              </Select.Trigger>
            </Select.Control>

            <Portal>
              <Select.Positioner
                style={{
                  position: 'fixed',
                  zIndex: 1500,
                  minWidth: 'var(--width)',
                }}
              >
                <Select.Content>
                  {collection.items.map((item) => (
                    <Select.Item key={item.value} item={item}>
                      {item.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        );
      }

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
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) onClose();
      }}
      size="xl"
      trapFocus={true}
      closeOnEscape={true}
      closeOnInteractOutside={true}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body>
              <Stack gap={4} p={4}>
                {fields.map((field) => (
                  <FormControl
                    key={field.name as string}
                    label={field.label}
                    isInvalid={!!errors[field.name]}
                  >
                    {renderInput(field)}
                    {/* ... ошибки ... */}
                  </FormControl>
                ))}
              </Stack>
            </Dialog.Body>

            <Dialog.Footer gap={3}>
              <Dialog.ActionTrigger asChild>
                <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                  {t(cancelText)}
                </Button>
              </Dialog.ActionTrigger>

              <Button colorScheme="blue" onClick={handleSubmit} loading={isLoading}>
                {t(submitText)}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
