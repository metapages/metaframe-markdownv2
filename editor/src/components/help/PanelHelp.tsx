import { ResizingTabPanel } from '/@/components/layout/ResizingTabPanel';
import { NonMainPanelMargin } from '/@/constants';

import { Box } from '@chakra-ui/react';

export const PanelHelp: React.FC = () => {
  return (
    <ResizingTabPanel>
      <Box w="100%" h="100%" m={NonMainPanelMargin} overflowY="scroll">
        <Box className="iframe-container" >
          <iframe
            className="iframe"
            src={`https://markdown.mtfm.io/#?hm=disabled&url=${
              window.location.origin
            }${
              window.location.pathname.endsWith("/")
                ? window.location.pathname.substring(
                    0,
                    window.location.pathname.length - 1
                  )
                : window.location.pathname
            }/README.md`}
          />
        </Box>
      </Box>
    </ResizingTabPanel>
  );

};
