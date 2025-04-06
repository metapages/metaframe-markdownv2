import { useHashParamJson } from "@metapages/hash-query/react-hooks";

export type Theme = "light" | "vs-dark" | "system";
export type DisplayMode = "default" | "slide";

export type Options = {
  theme?: Theme | undefined;
  dm?: DisplayMode | undefined;
  /**
   * Header classnames
   */
  h?: string;
};

const HashKeyOptions = "options";

export const useOptions = (
  defaultOptions?: Options | undefined
): [Options, (o: Options) => void] => {
  const [options, setOptions] = useHashParamJson<Options>(
    HashKeyOptions,
    defaultOptions
  );
  return [options, setOptions];
};
