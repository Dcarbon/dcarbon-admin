import { createLazyFileRoute } from '@tanstack/react-router';

import viteLogo from '/vite.svg';

import '@styles/app.css';

import ConnectButton from '@/components/common/button/connect-button';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          {/* <img src={reactLogo} className="logo react" alt="React logo" /> */}
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <ConnectButton />
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}
