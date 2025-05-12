import { useState, useCallback } from 'react';
import { getMenu, MenuItem } from '../api/menu';
import useVisibilityPolling from './useVisibilityPolling';
import { useTranslation } from 'react-i18next';

export const useMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { i18n, t } = useTranslation();

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await getMenu();
      setMenuItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadingFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useVisibilityPolling(fetchMenu, 300000);

  const getLocalizedMenuItems = useCallback(() => {
    return menuItems.map((item) => ({
      ...item,
      title:
        item.translations[i18n.language as keyof typeof item.translations] || item.translations.en,
      children: item.children?.map((child) => ({
        ...child,
        title:
          child.translations[i18n.language as keyof typeof child.translations] ||
          child.translations.en,
      })),
    }));
  }, [menuItems, i18n.language]);

  return {
    menuItems: getLocalizedMenuItems(),
    loading,
    error,
    refetch: fetchMenu,
  };
};
