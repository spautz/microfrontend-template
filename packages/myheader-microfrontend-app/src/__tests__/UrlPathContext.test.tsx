import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import {
  setUrlPath,
  UrlPathProvider,
  useUrlPath,
} from '../v1Render/UrlPathContext/UrlPathContext.js';

const UrlPathViewer = () => {
  const urlPath = useUrlPath();
  return <div data-testid="url-path">{urlPath}</div>;
};

describe('UrlPathContext', () => {
  afterEach(() => {
    cleanup();
  });

  it('updates the url path when setUrlPath is called', () => {
    render(
      <UrlPathProvider initialUrlPath="/start">
        <UrlPathViewer />
      </UrlPathProvider>,
    );

    expect(screen.getByTestId('url-path')).toHaveTextContent('/start');

    act(() => {
      setUrlPath('/next');
    });

    expect(screen.getByTestId('url-path')).toHaveTextContent('/next');
  });
});
