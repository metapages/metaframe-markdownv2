import { useCallback } from "react";

import { Options, DisplayMode, useOptions } from "/@/hooks/useOptions";
import { useFormik } from "formik";
import * as yup from "yup";

import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from "@chakra-ui/react";

export const defaultOptions: Options = {
  dm: "default",
};

const OptionDescription: Record<string, string> = {
  dm: "Display Mode",
};

const validationSchema = yup.object({
  dm: yup
    .string()
    .notRequired()
    .oneOf(["default", "slide"] as DisplayMode[])
    .optional(),
});

interface FormType extends yup.InferType<typeof validationSchema> {}

export const EditDisplayMode: React.FC = () => {
  const [options, setOptions] = useOptions();

  const onSubmit = useCallback(
    (values: FormType) => {
      let newOptions: Options | undefined = { ...(values as Options) };
      if (newOptions.dm === defaultOptions.dm) {
        delete newOptions.dm;
      }
      if (Object.keys(newOptions).length === 0) {
        setOptions(undefined);
      } else {
        setOptions(newOptions);
      }
    },
    [setOptions]
  );

  const formik = useFormik({
    initialValues: options || {},
    onSubmit,
    validationSchema,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormControl pb="1rem" p={6}>
        <Text fontWeight={700} pb={2}>
          {OptionDescription["dm"]}
        </Text>
        <RadioGroup
          id="dm"
          onChange={(e) => {
            // currently RadioGroup needs this to work
            formik.setFieldValue("dm", e);
            formik.handleSubmit();
          }}
          value={formik.values.dm || defaultOptions.dm}
        >
          <VStack spacing={3} alignItems={"flex-start"}>
            <Radio value="default" colorScheme={"blackAlpha"} defaultChecked>
              <Text>Default</Text>
            </Radio>
            <Radio value="slide" colorScheme={"blackAlpha"}>
              <Text>Slide</Text>
            </Radio>
          </VStack>
        </RadioGroup>
      </FormControl>

      {Object.keys(validationSchema.fields as any)
        .filter(
          (fieldName) =>
            (validationSchema.fields as any)[fieldName].type === "boolean"
        )
        .map((fieldName) => (
          <FormControl pb="1rem" key={fieldName}>
            <FormLabel fontWeight="bold" htmlFor={fieldName}>
              {OptionDescription[fieldName]}
            </FormLabel>
            <Checkbox
              name={fieldName}
              size="lg"
              bg="gray.100"
              spacing="1rem"
              onChange={(e) => {
                // currently checkbox needs this to work
                formik.setFieldValue(fieldName, e.target.checked);
                formik.handleSubmit();
              }}
              isChecked={(formik.values as any)[fieldName]}
            />
          </FormControl>
        ))}

      <Button type="submit" display="none">
        submit
      </Button>
    </form>
  );
};
