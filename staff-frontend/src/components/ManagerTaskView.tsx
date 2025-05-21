import { Box, Heading, Button, VStack, Grid, Collapsible } from '@chakra-ui/react';
import { useState } from 'react';
import TaskCard, { ItemTaskCard } from './TaskCard';
import { useTranslation } from 'react-i18next';
import { User } from '../api';

interface ManagerTaskViewProps {
  unassignedTasks: ItemTaskCard[];
  inProgressTasks: ItemTaskCard[];
  archivedTasks: ItemTaskCard[];
  workers: User[];
  onTaskClick: (task: ItemTaskCard) => void;
}
type SectionKey = 'unassigned' | 'inProgress' | 'archived';

export default function ManagerTaskView({
  unassignedTasks,
  inProgressTasks,
  archivedTasks,
  workers,
  onTaskClick,
}: ManagerTaskViewProps) {
  const [openSections, setOpenSections] = useState({
    unassigned: true,
    inProgress: true,
    archived: false,
  });
  const { t } = useTranslation();

  const toggleSection = (section: SectionKey) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <VStack padding={6} align="stretch">
      <Section
        title={t('tasks.unassigned')}
        tasks={unassignedTasks}
        isOpen={openSections.unassigned}
        onToggle={() => toggleSection('unassigned')}
        onTaskClick={onTaskClick}
      />

      <Section
        title={t('tasks.inProgress')}
        tasks={inProgressTasks}
        isOpen={openSections.inProgress}
        onToggle={() => toggleSection('inProgress')}
        onTaskClick={onTaskClick}
      />

      <Section
        title={t('tasks.archive')}
        tasks={archivedTasks}
        isOpen={openSections.archived}
        onToggle={() => toggleSection('archived')}
      />
    </VStack>
  );
}

interface SectionProps {
  title: string;
  tasks: ItemTaskCard[];
  isOpen: boolean;
  onToggle: () => void;
  onTaskClick?: (task: ItemTaskCard) => void;
}

const Section = ({ title, tasks, isOpen, onToggle, onTaskClick }: SectionProps) => (
  <Box>
    <Button onClick={onToggle} w="full" justifyContent="space-between">
      <Heading size="md">
        {title} ({tasks.length})
      </Heading>
    </Button>
    <Collapsible.Root open={isOpen}>
      <Collapsible.Content>
        <Grid mt={4} gap={6}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick?.(task)} />
          ))}
        </Grid>
      </Collapsible.Content>
    </Collapsible.Root>
  </Box>
);
