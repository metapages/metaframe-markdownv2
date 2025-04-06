
# Markdown viewer [metaframe](https://docs.metapage.io/)


Metaframe (configurable website) for showing markdown.


The URL contains the entire markdown text:


🔗 [`https://markdownv2.mtfm.io#?md=`](https://markdownv2.mtfm.io/#?md=)`<encoded markdown>`


This makes the URL

- **editable**
- **sharable**
- **embeddable**
- **standalone**


## **How to create / edit**


To modify the options, edit them in the webpage, then copy the URL with the copy button. The URL contains all content and options. 


**Create/Edit Option 1: Pasting or write markdown in the embedded editor**


Manually write or paste in markdown into the embedded editor


When finished, copy the URL, or click on the copy button at the top.


**Create/Edit Option 3: Automatically generate URLs**


See below for a code example


## Dynamically add content


### Dynamic content via metapages


Data flow when the metaframe is embedded. This allows dynamic markdown rendering


```mermaid
graph LR
    classDef mtfm fill:#fff,stroke:#32AEE4,stroke-width:2px;
    linkStyle default stroke:#32AEE4,stroke-width:2px,color:black

    mfup["upstream metaframe"]:::mtfm
    subgraph metaframe ["markdownv2.mtfm.io"]
        M[Render markdown]:::mtfm
        inputs[metaframe inputs]:::mtfm --> M
    end
    url["encoded in URL hash parameters"]:::mtfm --> |"#?md=[encoded markdown]"| M
    mfup --> |"md"| inputs

    style metaframe fill:#fff,stroke:#32AEE4,stroke-width:2px;
```

- input pipes:
	- `md`
		- Raw markdown text

Any text coming in those input pipes will be immediately rendered. If there is markdown embedded in the URL, that will be rendered first, but replaced by any markdown from input pipes.

 - output pipes
   - `click`
     - From clickable mermaid flowcharts


## Embed markdown renderer in another application


It requires no installation, and is secure due to cross-origin isolation.


### E.g. React


The help menu on this website uses this page in a external iframed element. While this uses `@metapages/metapage-react` to make some things more convenient, you can also just embed a `<iframe src="<url>" />` element directly:


```typescript
import { useCallback } from 'react';

import { MetaframeStandaloneComponent } from '@metapages/metapage-react';

export const PanelMarkdownEditor: React.FC<{markdown:string}> = ({markdown) => {
  
  return (
    <div>
      <MetaframeStandaloneComponent
        url="https://markdownv2.mtfm.io/#?button=invisible&md=JTIzJTIwVGhpcyUyMGlzJTIweW91ciUyMG1hcmtkb3duJTBBJTBBVGhlJTIwVVJMJTIwY29udGFpbnMlMjBhbGwlMjB0aGUlMjBjb250ZW50&menuhidden=true&options=JTdCJTIyZGlzcGxheW1vZGUlMjIlM0ElMjJkZWZhdWx0JTIyJTdE"
        inputs={{ value: markdown}}
      />
    </div>
  );
};
```


## Developers: creating your own markdown links 


You can generate your own markdown pages to display in your own webpages easily as embedded iframes.


The markdown text is simply encoded as follows:


```typescript
export const encodeMarkdown = (md: string) => {
  var b64 = window.btoa(encodeURIComponent(md));
  return b64;
};

const yourRawMarkdown = "### Title\n\nSome content";
const encodedMarkdown = encodeMarkdown(yourRawMarkdown);
const url = `https://markdownv2.mtfm.io/#?button=invisible&md=${encodedMarkdown}&menuhidden=true&options=JTdCJTIyZGlzcGxheW1vZGUlMjIlM0ElMjJkZWZhdWx0JTIyJTdE`
```


Just take that `url` and embed as described above, or via embedded as an iframe:


`<iframe src={url} />`

