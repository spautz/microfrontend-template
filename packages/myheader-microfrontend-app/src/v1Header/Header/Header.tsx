import { buildUrlString } from '@spautz/header-api-contracts/v1';
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
      baseUrl: import.meta.env.VITE_REACTROUTER_APP_BASEURL,
    },
    { label: linkLabels.tea, path: '/tea', baseUrl: import.meta.env.VITE_REACTROUTER_APP_BASEURL },
    { label: linkLabels.beer, path: '/beer', baseUrl: import.meta.env.VITE_TANSTACK_APP_BASEURL },
    { label: linkLabels.wine, path: '/wine', baseUrl: import.meta.env.VITE_TANSTACK_APP_BASEURL },
    { label: linkLabels.water, path: '/water', baseUrl: import.meta.env.VITE_NEXTJS_APP_BASEURL },
  ];

  return (
    <header className={classes.header}>
      <h1 className={classes.title}>{linkLabels.siteTitle}</h1>
      <nav className={classes.nav} aria-label="Primary">
        <ul className={classes.navList}>
          {navLinks.map((link) => (
            <li key={link.path} className={classes.navItem}>
              <a className={classes.navLink} href={buildUrlString(link.path, link.baseUrl)}>
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
