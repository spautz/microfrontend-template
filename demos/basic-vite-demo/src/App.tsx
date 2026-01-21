import {
  type BeverageV1Payload,
  fetchBeverage,
  internal_setV1BeveragePayload,
} from '@spautz/myconfig-sdk';
import SEED_VALUE from '@spautz/myconfig-values/configs/v1/beverages.json' with { type: 'json' };
import type { JSX } from 'react/jsx-runtime';
import { useBeverageConfig } from './future-react-utils/useBeverageConfig.ts';

function App(): JSX.Element {
  const [beverageConfigState, beverageConfigPayload, fullCacheEntry] = useBeverageConfig(
    new URL('/proxy-to-config/', window.location.origin),
  );

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          // @FIXME: Hardcoded 2 === CACHED_PAYLOAD_SOURCE__SEED
          internal_setV1BeveragePayload({}, SEED_VALUE as BeverageV1Payload, 2);
        }}
      >
        Load Seed Payload
      </button>
      <button type="button" onClick={() => fetchBeverage()}>
        Load Payload from <code>/proxy-to-config</code>
      </button>

      <ul>
        <li>
          beverageConfigState: <pre>{JSON.stringify(beverageConfigState, null, 2)}</pre>
        </li>
        <li>
          beverageConfigPayload: <pre>{JSON.stringify(beverageConfigPayload, null, 2)}</pre>
        </li>
        <li>
          fullCacheEntry @ {Date.now()}: <pre>{JSON.stringify(fullCacheEntry, null, 2)}</pre>
        </li>
      </ul>
    </div>
  );
}

export { App };
