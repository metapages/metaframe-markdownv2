import { useState } from 'react';

import { PanelCode } from '/@/components/code/PanelCode';
import {
  ButtonCopyExternalLink,
} from '/@/components/header/components/ButtonCopyExternalLink';
import {
  ButtonGotoExternalLink,
} from '/@/components/header/components/ButtonGotoExternalLink';
import { PanelHelp } from '/@/components/help/PanelHelp';
import { PanelModules } from '/@/components/modules/PanelModules';
import { PanelOptions } from '/@/components/options/PanelOptions';
import { HeaderHeight } from '/@/constants';
import { isSearchParamTruthy } from '/@/utils/url';
import { FiSettings } from 'react-icons/fi';

import {
  EditIcon,
  InfoIcon,
  PlusSquareIcon,
} from '@chakra-ui/icons';
import {
  HStack,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { useHashParam } from '@metapages/hash-query';

export const HeaderFull: React.FC = () => {

  const [menuhidden, setMenuHidden] = useState<boolean>(!isSearchParamTruthy(new URLSearchParams(window.location.search).get("edit")));
  const [mode] = useHashParam("hm", undefined);
  
  return (
    <HStack spacing="0px" h="100vh" w="100%" className="borderDashedPurple">
      <Tabs w="100%" h="100%" isLazy={true}>
        <TabList bg="white" h={HeaderHeight}>
          <Tab>
            <EditIcon /> &nbsp; Javascript
          </Tab>
          <Tab>
            <PlusSquareIcon /> &nbsp; Modules
          </Tab>
          <Tab>
            <FiSettings /> &nbsp; Options
          </Tab>
          <Tab>
            <InfoIcon /> &nbsp; Docs
          </Tab>

          <Spacer />
          <HStack p={1} spacing={4} align="center" pr={16}>
            <ButtonGotoExternalLink />
            <ButtonCopyExternalLink /> 
          </HStack>
        </TabList>

        <TabPanels h={`calc(100% - ${HeaderHeight})`}>
          <TabPanel p="0px" h="100%">
            <PanelCode />
          </TabPanel>
          <TabPanel p="0px" h="100%">
            <PanelModules />
          </TabPanel>
          <TabPanel p="0px" m="0px" h="100%">
            <PanelOptions />
          </TabPanel>
          <TabPanel p="0px" h="100%">
            <PanelHelp />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </HStack>
  );
};
