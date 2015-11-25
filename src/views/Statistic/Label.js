import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import getUnhandledProps from 'src/utils/getUnhandledProps';
import META from 'src/utils/Meta';

export default class Label extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
  };

  static _meta = {
    library: META.library.semanticUI,
    name: 'Label',
    type: META.type.view,
    parent: 'Statistic',
  };

  render() {
    const classes = classNames(
      'sd-statistic-label',
      this.props.className,
      'label',
    );

    const props = getUnhandledProps(this);

    return (
      <div {...props} className={classes}>
        {this.props.children}
      </div>
    );
  }
}
