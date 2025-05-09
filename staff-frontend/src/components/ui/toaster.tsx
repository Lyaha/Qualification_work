'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Box, Text, Flex, Icon } from '@chakra-ui/react';
import { FaInfo, FaCheckCircle } from 'react-icons/fa';
import { RiErrorWarningLine } from 'react-icons/ri';
import { TiWarningOutline } from 'react-icons/ti';

import { v4 as uuidv4 } from 'uuid';
import { useColorModeValue } from './color-mode';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};

const getIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return FaCheckCircle;
    case 'error':
      return RiErrorWarningLine;
    case 'warning':
      return TiWarningOutline;
    case 'info':
      return FaInfo;
    default:
      return FaInfo;
  }
};

const getColor = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'green.500';
    case 'error':
      return 'red.500';
    case 'warning':
      return 'orange.400';
    case 'info':
      return 'blue.400';
    default:
      return 'gray.500';
  }
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const bg_toast = useColorModeValue('#ebebeb', '#454343');
  const color_description_toast = useColorModeValue('gray.600', 'gray.200');

  const showToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = uuidv4();
    setToasts((prev) => [...prev, { ...toast, id }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {typeof window !== 'undefined' &&
        createPortal(
          <Box position="fixed" bottom={4} right={4} zIndex={9999}>
            {toasts.map((toast) => {
              const IconComp = getIcon(toast.type);
              const color = getColor(toast.type);
              return (
                <Flex
                  key={toast.id}
                  p={4}
                  bg={bg_toast}
                  borderLeft="5px solid"
                  borderColor={color}
                  borderRadius="md"
                  boxShadow="md"
                  mb={2}
                  minW="300px"
                >
                  <Icon as={IconComp} color={color} mr={3} boxSize={5} mt={1} />
                  <Box>
                    <Text fontWeight="bold">{toast.title}</Text>
                    {toast.description && (
                      <Text fontSize="sm" color={color_description_toast}>
                        {toast.description}
                      </Text>
                    )}
                  </Box>
                </Flex>
              );
            })}
          </Box>,
          document.body,
        )}
    </ToastContext.Provider>
  );
};
