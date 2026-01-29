import type { JSX } from 'react/jsx-runtime';
import { Welcome } from '../welcome/welcome';
import type { Route } from './+types/home';

export function meta(_args: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ] as const;
}

export default function Home(): JSX.Element {
  return <Welcome />;
}
