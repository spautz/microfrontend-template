import React from 'react';
import type { JSX } from 'react/jsx-runtime';

function App(): JSX.Element {
  const [count, setCount] = React.useState(0);

  return (
    <>
      <h1>This is Vite's "Hello World"</h1>
      <p>
        This app handles <code>/home</code> and nothing else
      </p>
      <div className="card">
        <button type="button" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  );
}

export { App };
