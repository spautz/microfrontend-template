import type { V1FetchParams, V1Render } from '@spautz/header-api-contracts';

import { resolveRemoteEntry } from './resolveRemoteEntry.js';

// This should be `baseUrl` + `fetchParams` + the options for v1Render()
// The keys are duplicated here (instead of inherited from those places) so that we'll get
// an error if something changes unexpectedly.
type RenderHeaderOptions = {
  baseUrl: URL;
  locale: V1FetchParams['locale'];
  rootElement: HTMLElement;
  initialUrlPath?: string;
  onNavLinkClick?: Parameters<V1Render>[0]['onNavLinkClick'];
};

const renderHeader = async (options: RenderHeaderOptions): Promise<ReturnType<V1Render>> => {
  // Pull out baseUrl + fetchParams
  const {
    baseUrl,
    locale,
    initialUrlPath = '',
    onNavLinkClick,
    ...anyUnrecognizedOptions
  } = options;
  const fetchParams = { locale };

  const browserEntry = await resolveRemoteEntry(baseUrl, fetchParams);

  // Once resolved, pass along the remaining options to render
  return browserEntry.v1Render({
    initialUrlPath,
    onNavLinkClick,
    ...anyUnrecognizedOptions,
  });
};

export { renderHeader };
