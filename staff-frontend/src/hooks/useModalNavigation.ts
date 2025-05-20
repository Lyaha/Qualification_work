import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateFunction } from 'react-router-dom';

export interface Entity {
  id: string;
}

const useModalNavigation = <T extends Entity>(
  navigate: NavigateFunction,
  onOpenDetail: () => void,
  onOpenEdit?: () => void,
) => {
  const [selectedEntity, setSelectedEntity] = useState<T | undefined>();
  const { t } = useTranslation();
  const handleAdd = () => {
    if (!onOpenEdit) {
      throw new Error(t('error.requiredFunctionMissing'));
    }
    setSelectedEntity(undefined);
    onOpenEdit();
  };

  const handleEdit = (entity: T) => {
    if (!onOpenEdit) {
      throw new Error(t('error.requiredFunctionMissing'));
    }
    setSelectedEntity(entity);
    onOpenEdit();
  };

  const handleDetail = (entity: T) => {
    setSelectedEntity(entity);
    onOpenDetail();
  };

  const handleNavigate = (entity: T, path: string) => {
    navigate(`${path}/${entity.id}`);
  };

  return { handleAdd, handleEdit, handleDetail, handleNavigate, selectedEntity, setSelectedEntity };
};

export default useModalNavigation;
