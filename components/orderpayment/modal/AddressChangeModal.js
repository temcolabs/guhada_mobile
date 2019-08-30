import React, { Component, Fragment } from 'react';
import css from './AddressChangeModal.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import { inject, observer } from 'mobx-react';
import Controller from './Controller';
import AddressSelf from './AddressSelf';
import AddressItem from './AddressItem';
import AddressEmpty from './AddressEmpty';
import BottomFixedButton from './BottomFixedButton';

@inject('orderpayment')
@observer
class AddressChangeModal extends Component {
  render() {
    let { orderpayment, isVisible } = this.props;
    return (
      <Fragment>
        <SlideIn direction={slideDirection.RIGHT} isVisible={isVisible}>
          <div className={css.wrap}>
            <Controller />

            {orderpayment.status.addressSelf ? (
              <AddressSelf />
            ) : orderpayment.orderShippingList.list.length > 0 ? (
              <AddressItem />
            ) : (
              <AddressEmpty />
            )}

            {/* 하단 버튼 */}
            <BottomFixedButton />
          </div>
        </SlideIn>
      </Fragment>
    );
  }
}

export default AddressChangeModal;
