import React from 'react';

import { HelmetData } from './HelmetData';

const defaultValue = {};

const Context = React.createContext(defaultValue);

const canUseDOM = typeof document !== 'undefined';
class Provider extends React.Component {
  static canUseDOM = canUseDOM;

  static defaultProps = {
    context: {},
  };

  static displayName = 'HelmetProvider';

  constructor(props) {
    super(props);

    this.helmetData = new HelmetData(this.props.context, Provider.canUseDOM);
  }

  render() {
    return <Context.Provider value={this.helmetData.value}>{this.props.children}</Context.Provider>;
  }
}

export { Context, Provider };
