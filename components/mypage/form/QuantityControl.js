import React from 'react';
import css from './QuantityControl.module.scss';
import { devLog } from 'childs/lib/common/devLog';
class QuantityControl extends React.Component {
  static propTypes = {};

  static defaultProps = {
    min: 1,
    max: 1,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: 1,
    };
  }

  componentDidMount() {
    // 초기값 반영
    this.setState({ value: this.props.initialValue });
  }

  componentDidUpdate(prevProps, prevState) {
    devLog(`this.props.initialValue`, this.props.initialValue);

    // 초기값 반영
    if (this.props.initialValue !== prevProps.initialValue) {
      this.setState({ value: this.props.initialValue });
    }
  }

  withOnChange = (mark = 'plus') => v => {
    const { value } = this.state;
    const { min, max, onChange } = this.props;

    const updated =
      mark === 'minus' ? Math.max(value - 1, min) : Math.min(value + 1, max);

    this.setState({ value: updated });

    onChange(updated);
  };

  render() {
    return (
      <div className={css.wrap}>
        <button
          type="button"
          className={css.minus}
          onClick={this.withOnChange('minus')}
        />
        <span className={css.value}>{this.state.value}</span>
        <button
          type="button"
          className={css.plus}
          onClick={this.withOnChange('plus')}
        />
      </div>
    );
  }
}

export default QuantityControl;
