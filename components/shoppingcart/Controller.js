import { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './Controller.module.scss';

@inject('shoppingcart')
@observer
class ShoppingCartController extends Component {
  render() {
    let { shoppingcart } = this.props;
    return (
      <div className={css.wrap}>
        <div className={css.check__priority}>
          <label>
            <input
              type="checkbox"
              checked={shoppingcart.status.priorityCheck}
              onChange={() => {
                shoppingcart.changeTotalItemCheckboxPriority();
              }}
            />
            <div />
          </label>
          <div
            className={css.total__select}
          >{`${shoppingcart.selectedCheckNumber.length}개 선택`}</div>
        </div>
        <div
          className={css.selected__delete}
          onClick={() => {
            shoppingcart.selectedDelete();
          }}
        >
          선택 삭제
        </div>
      </div>
    );
  }
}

export default ShoppingCartController;
