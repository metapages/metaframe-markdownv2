import React from "react";

import { Divider, VStack } from "@chakra-ui/react";

import { EditBgColor } from "./EditBgColor";
import { EditButtonSettings } from "./EditButtonSettings";
import { EditColorScheme } from "./EditColorScheme";
import { EditEditorWidth } from "./EditEditorWidth";
import { EditDisplayMode } from "./EditDisplayMode";
import { EditMinimalHeader } from "./EditMinimalHeader";

export const SectionOptions: React.FC = () => {
  return (
    <VStack
      w={"100%"}
      // p={6}
      gap={5}
      justifyContent="flex-start"
      alignItems="stretch"
    >
      <EditButtonSettings />
      <Divider />
      <EditDisplayMode />
      <Divider />
      <EditColorScheme />
      <Divider />
      <EditBgColor />
      <Divider />
      <EditEditorWidth />
      <Divider />
      <EditMinimalHeader />
    </VStack>
  );
};
