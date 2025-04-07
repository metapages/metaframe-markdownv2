import { useCallback } from "react";

import { Checkbox, Text, VStack } from "@chakra-ui/react";
import { useHashParamBoolean } from "@metapages/hash-query/react-hooks";

export const EditMinimalHeader: React.FC = () => {
  const [minimalHeader, setMinimalHeader] = useHashParamBoolean("minimalheader");

  const handleChange = useCallback(() => {
    setMinimalHeader(!minimalHeader);
  }, [minimalHeader, setMinimalHeader]);

  return (
    <VStack align="flex-start" w="100%" minW={"100%"} p={6}>
      <Text fontWeight={700}>Minimal Header</Text>
      <Checkbox id="minimalheader" name="minimalheader" isChecked={minimalHeader} onChange={handleChange}></Checkbox>
    </VStack>
  );
};
