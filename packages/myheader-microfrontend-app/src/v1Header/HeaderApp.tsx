import React from 'react';
import { Header, type HeaderProps } from './Header/Header.js';
import { UrlPathProvider } from './UrlPathContext/UrlPathContext.js';

interface ValuesForV1Render {
  linkLabels: HeaderProps['linkLabels'];
}

interface HeaderAppProps {
  entryPointValues: ValuesForV1Render;
  initialUrlPath: string;
}

const HeaderApp = (props: HeaderAppProps) => {
  const { entryPointValues, initialUrlPath } = props;
  const { linkLabels } = entryPointValues;

  return (
    <React.StrictMode>
      <UrlPathProvider initialUrlPath={initialUrlPath}>
        <Header linkLabels={linkLabels} />
      </UrlPathProvider>
    </React.StrictMode>
  );
};

export type { HeaderAppProps };
export { HeaderApp };
