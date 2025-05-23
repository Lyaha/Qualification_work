import { useState } from 'react';
import { MenuItem } from '../api/menu';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { menuIcons } from '../utils/menuIcons';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';

const MenuItemComponent = ({ item }: { item: MenuItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (item.hidden) return null;

  return (
    <Box>
      <Flex
        align="center"
        justify="space-between"
        p={2}
        _hover={{ bg: 'gray.100' }}
        cursor="pointer"
        onClick={() => {
          if (item.children) {
            setIsOpen(!isOpen);
          } else {
            //console.log(item.path);
            navigate(item.path);
          }
        }}
      >
        <Flex
          align="center"
          onClick={() => {
            //console.log(item.path);
            navigate(item.path);
          }}
        >
          {item.icon && menuIcons[item.icon] && <Icon as={menuIcons[item.icon]} mr={2} />}
          <Text>{item.title}</Text>
        </Flex>

        {item.children && <Icon as={isOpen ? LuChevronUp : LuChevronDown} boxSize={4} />}
      </Flex>

      {item.children && isOpen && (
        <Box ml={4}>
          {item.children.map((child) => (
            <MenuItemComponent key={child.id} item={child} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default MenuItemComponent;
