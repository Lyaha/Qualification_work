import { Button, CloseButton, Dialog, Portal } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export type DetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  additionalButton?: React.ReactNode;
};

const DetailModal = ({ isOpen, onClose, title, children, additionalButton }: DetailModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) onClose();
      }}
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
            <Dialog.Body>{children}</Dialog.Body>
            <Dialog.Footer gap={3}>
              {additionalButton}
              <Button variant="ghost" onClick={onClose}>
                {t('common.close')}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default DetailModal;
