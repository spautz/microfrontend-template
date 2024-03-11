import React, { ReactNode } from 'react';
import { helloWorld } from '../../microfrontend-utils';

export interface TodoComponentProps {
  children?: ReactNode;
}

const TodoComponent: React.FC<TodoComponentProps> = (props) => {
  const { children = helloWorld } = props;
  return <React.Fragment>TodoComponent: {children}</React.Fragment>;
};

export { TodoComponent };
