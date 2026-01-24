interface HeaderProps {
  linkLabels: {
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

  return (
    <header>
      <h1>I'm a header!</h1>
      <nav>
        <ul>
          <li>{linkLabels.home}</li>
          <li>{linkLabels.coffee}</li>
          <li>{linkLabels.tea}</li>
          <li>{linkLabels.beer}</li>
          <li>{linkLabels.wine}</li>
          <li>{linkLabels.water}</li>
        </ul>
      </nav>
    </header>
  );
};

export type { HeaderProps };
export { Header };
