import React, { useCallback, useRef } from "react";

import { useMetaframeUrl } from "/@/hooks/useMetaframeUrl";
import { useOptions } from "/@/hooks/useOptions";
import stringify from "safe-stable-stringify";
import debounce from "debounce";

import { useHashParamBase64 } from "@metapages/hash-query/react-hooks";
import { MetaframeInputMap } from "@metapages/metapage";
import { MetaframeStandaloneComponent } from "@metapages/metapage-react";

export const encodeOptions = (options: any): string => {
  const text: string = stringify(options) || "";
  const b64 = btoa(encodeURIComponent(text));
  return b64;
};

export const PanelCode: React.FC = () => {
  const [code, setCode] = useHashParamBase64("md");
  const { url } = useMetaframeUrl();
  return url ? <LocalEditor code={code} setCode={setCode} /> : <></>;
};

const LocalEditor: React.FC<{
  code: string;
  setCode: (code: string) => void;
}> = ({ code, setCode }) => {
  const [themeOptions] = useOptions();
  // only use the code prop initially, but then ignore so we don't get clobbering
  const codeInternal = useRef<string>(code);
  const inputs = useRef<{ text: string }>({ text: codeInternal.current });

  const urlWithOptions = () => {
    const options = encodeOptions({
      autosend: true,
      hidemenuififrame: true,
      mode: "markdown",
      theme: themeOptions?.theme || "vs-light",
      hideLineNumbers: true,
    });
    return `https://editor.mtfm.io/#?hm=disabled&options=${options}`;
  };

  const onCodeOutputsUpdate = useCallback(
    debounce((outputs: MetaframeInputMap) => {
      setCode(outputs.text);
    }, 500),
    [setCode],
  );

  return (
    //  <Box id={"BORK"} overflow={'hidden'} h={`calc(100vh - 3rem)`} minH={`calc(100vh - 3rem)`} width={"100%"} bg={'white'}>
    <MetaframeStandaloneComponent
      url={urlWithOptions()}
      inputs={inputs.current}
      onOutputs={onCodeOutputsUpdate}
      style={{
        backgroundColor: "white",
        // border: '1px solid red',
        height: `calc(100vh - 3rem)`,
        width: "100%",
        // left: 0,
        // position: 'absolute',
        // top: 0,
      }}
    />
    // {/* <Box id={"BORK2"} h={`100%`}  minHeight={`100%`} width={"100%"} bg={'green'}></Box> */}
    // </Box>
  );
};
// overflow={'hidden'}
