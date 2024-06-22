import { ResizingTabPanel } from '/@/components/layout/ResizingTabPanel';
import { FormModulesAndCss } from '/@/components/modules/FormModulesAndCss';
import { NonMainPanelMargin } from '/@/constants';

import { Box } from '@chakra-ui/react';

export const PanelModules: React.FC = () => {
  return (
    <ResizingTabPanel>
      <Box
        w="100%"
        h="100%"
        m={NonMainPanelMargin}
        overflowY="scroll"
        pr="20px"
      >
        <FormModulesAndCss />
      </Box>
    </ResizingTabPanel>
  );
};
