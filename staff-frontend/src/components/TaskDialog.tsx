import {
  Dialog,
  Select,
  Input,
  Button,
  VStack,
  Portal,
  createListCollection,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormControl from './ui/form-control';
import { Batch, Task, User } from '../api';
import { ItemTaskCard } from './TaskCard';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: ItemTaskCard | null;
  batches: Batch[];
  workers: User[];
  onSubmit: (data: { batchId: string; quantity: number; workerId?: string }) => void;
  userRole?: User['role'];
}

export default function TaskDialog({
  isOpen,
  onClose,
  task,
  batches,
  workers,
  onSubmit,
  userRole,
}: TaskDialogProps) {
  const [selectedBatch, setSelectedBatch] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedWorker, setSelectedWorker] = useState('');
  const { t } = useTranslation();

  const handleSubmit = () => {
    onSubmit({
      batchId: selectedBatch,
      quantity: Number(quantity),
      workerId: userRole !== 'warehouse_worker' ? selectedWorker : undefined,
    });
  };
  const collectionWorker = createListCollection({
    items: workers.map((worker) => ({
      value: worker.id.toString(),
      label: `${worker.first_name} ${worker.last_name}`,
    })),
  });

  const collectionBatch = createListCollection({
    items: batches.map((batch) => ({
      value: batch.id.toString(),
      label: `${batch.product?.name} (Exp: ${batch.expiration_date})`,
    })),
  });

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
            <Dialog.Header>{t('tasks.completeTask')}</Dialog.Header>
            <Dialog.Body>
              <VStack padding={4}>
                {userRole !== 'warehouse_worker' && (
                  <FormControl label={t('tasks.assignWorker')}>
                    <Select.Root
                      collection={collectionWorker}
                      onValueChange={(value) => setSelectedWorker(value.value[0])}
                      size="sm"
                      zIndex={1402}
                    >
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText placeholder={t('tasks.selectWorker')} />
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
                            {collectionWorker.items.map((item) => (
                              <Select.Item key={item.value} item={item}>
                                {item.label}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Portal>
                    </Select.Root>
                  </FormControl>
                )}

                <FormControl label={t('tasks.selectBatch')}>
                  <Select.Root
                    collection={collectionBatch}
                    onValueChange={(value) => setSelectedBatch(value.value[0])}
                    size="sm"
                    zIndex={1402}
                  >
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder={t('tasks.selectBatch')} />
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
                          {collectionBatch.items.map((item) => (
                            <Select.Item key={item.value} item={item}>
                              {item.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </FormControl>

                <FormControl label={t('tasks.quantity')}>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    max={task?.quantity}
                  />
                </FormControl>

                <Button colorScheme="blue" onClick={handleSubmit}>
                  {t('tasks.completeAction')}
                </Button>
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
