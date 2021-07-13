import { Component } from 'react';
import css from './LoginInputButton.module.scss';
import cn from 'classnames';
export class LoginInputButton extends Component {
  render() {
    const { field, style, countDown, button } = this.props;
    return (
      <div className={cn(css.default)} style={style}>
        <input {...field.bind()} maxLength={this.props.maxLength} />
        <button onClick={field.onSubmit}>{button.label}</button>
      </div>
    );
  }
}

export default LoginInputButton;
