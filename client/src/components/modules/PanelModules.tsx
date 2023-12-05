import { ResizingTabPanel } from '/@/components/layout/ResizingTabPanel';
import { FormModulesAndCss } from '/@/components/modules/FormModulesAndCss';
import { NonCodingPanelMargin } from '/@/constants';

import {
  Box,
  HStack,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';

export const PanelModules: React.FC = () => {

return (<ResizingTabPanel>
      <Box w="100%" h="100%" m={NonCodingPanelMargin} overflowY="scroll" pr="20px">
      {/* <SimpleGrid columns={1} width="100%"> */}
          <FormModulesAndCss  />

          {/* <FormDefinition /> */}
        {/* </SimpleGrid> */}
      </Box>
    </ResizingTabPanel>);


  return (
    <HStack w="100%" h="100%" spacing="0px">
      <VStack w="100%" h="100%" alignItems="flex-start" bg="white">
        <SimpleGrid columns={1}  width="100%" p={10}>
          <FormModulesAndCss  />

          {/* <FormDefinition /> */}
        </SimpleGrid>
      </VStack>
      <Box w="100%"></Box>
    </HStack>
  );
};
