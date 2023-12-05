import {
  useEffect,
  useState,
} from 'react';

import { useHashParamJson } from '@metapages/hash-query';

export type Theme = "light" | "vs-dark";

export type Options = {
  // defualt is false
  manualsave?: boolean;
  // default is light
  theme?: Theme | undefined;
};

export const defaultOptions: Options = {
  // theme: "light",
};


const HashKeyOptions = "options";

export const useOptions = (defaultOptions?:Options|undefined): [Options, (o: Options|undefined) => void] => {
  const [options, setOptionsInHash] = useHashParamJson<Options|undefined>(HashKeyOptions, defaultOptions);
  const [localOptions, setLocalOptions] = useState<Options|undefined>(options);
  useEffect(() => {
    // If options is empty, remove it from the hash
    if (!!localOptions && (Object.keys(localOptions).length === 0 || !Object.keys(localOptions).find((k:string) => (localOptions as Record<string,any>)[k]))) {
      setLocalOptions(undefined);
      return;
    }
    setOptionsInHash(localOptions);

  }, [localOptions, setOptionsInHash]);

  return [options || {}, setLocalOptions];
};
