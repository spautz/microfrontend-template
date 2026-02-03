import { buildUrlOrPath } from '@spautz/mfeheader-api-contracts/v1';
// import { useUrlPath } from '../UrlPathContext/UrlPathContext.tsx';
import classes from './Header.module.css';

interface HeaderProps {
  linkLabels: {
    siteTitle: string;
    home: string;
    coffee: string;
    tea: string;
    beer: string;
    wine: string;
    water: string;
  };
}

const Header: React.FC<HeaderProps> = (props) => {
  const { linkLabels } = props;
  const navLinks = [
    { label: linkLabels.home, path: '/home', baseUrl: import.meta.env.VITE_NEXTJS_APP_BASEURL },
    {
      label: linkLabels.coffee,
      path: '/coffee',
      baseUrl: import.meta.env.VITE_REACT_ROUTER_APP_BASEURL,
    },
    { label: linkLabels.tea, path: '/tea', baseUrl: import.meta.env.VITE_REACT_ROUTER_APP_BASEURL },
    { label: linkLabels.beer, path: '/beer', baseUrl: import.meta.env.VITE_TANSTACK_APP_BASEURL },
    { label: linkLabels.wine, path: '/wine', baseUrl: import.meta.env.VITE_TANSTACK_APP_BASEURL },
    { label: linkLabels.water, path: '/water', baseUrl: import.meta.env.VITE_NEXTJS_APP_BASEURL },
  ];

  // const urlPath = useUrlPath();

  return (
    <header className={classes.header}>
      <h1 className={classes.title}>{linkLabels.siteTitle}</h1>
      <nav className={classes.nav} aria-label="Primary">
        <ul className={classes.navList}>
          {navLinks.map((link) => (
            <li key={link.path} className={classes.navItem}>
              <a
                className={[classes.navLink].join(' ')}
                href={buildUrlOrPath(link.baseUrl, link.path)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export type { HeaderProps };
export { Header };
