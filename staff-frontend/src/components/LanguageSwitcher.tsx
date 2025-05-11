import { Flex, Menu, Portal, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Menu.Root>
      <Menu.Trigger>
        <Flex alignItems="center" justifyContent="center" my={2} gap={2}>
          <FaGlobe size={20} />
          {i18n.language === 'uk' ? 'UA' : 'EN'}
        </Flex>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item>
              <Text onClick={() => changeLanguage('uk')}>Українська</Text>
            </Menu.Item>
            <Menu.Item>
              <Text onClick={() => changeLanguage('en')}>English</Text>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default LanguageSwitcher;
