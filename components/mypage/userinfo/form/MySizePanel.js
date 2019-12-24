import React, { Component } from 'react';
import _ from 'lodash';
import css from './MySizePanel.module.scss';
import cn from 'classnames';
import { inject, observer } from 'mobx-react';
import MySizeModal from './MySizeModal';
import FormButton, {
  formButtonColors,
} from 'components/mypage/form/FormButton';

import PointSavingModal, {
  pointSavingTypes,
} from 'components/mypage/point/PointSavingModal';

@inject('mySize', 'alert', 'mypagePoint')
@observer
class MySizePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMySizeModalOpen: false,
    };
  }

  componentDidMount() {
    this.props.mySize.getMySize();
  }

  componentWillMount() {
    this.props.mySize.resetMySize();
  }

  toggleMySizeModal = () => {
    this.setState({ isMySizeModalOpen: !this.state.isMySizeModalOpen });
  };

  renderMySize = () => {
    const { mySize } = this.props.mySize;
    return (
      <>
        <div className={css.mySizeBox}>
          <div className={css.mySizeRow}>
            <div className={css.mySizeItem}>
              <div className={css.mySizeLabel}>키</div>
              <div className={css.mySizeValue}>{mySize.height}cm</div>
            </div>
            <div className={css.mySizeItem}>
              <div className={css.mySizeLabel}>상의 사이즈</div>
              <div className={css.mySizeValue}>{mySize.top}</div>
            </div>
          </div>
          <div className={css.mySizeRow}>
            <div className={css.mySizeItem}>
              <div className={css.mySizeLabel}>몸무게</div>
              <div className={css.mySizeValue}>{mySize.weight}kg</div>
            </div>
            <div className={css.mySizeItem}>
              <div className={css.mySizeLabel}>하의 사이즈</div>
              <div className={css.mySizeValue}>{mySize.bottom}</div>
            </div>
          </div>
          <div className={css.mySizeRow}>
            <div className={css.mySizeLabel}>신발 사이즈</div>
            <div className={css.mySizeValue}>{mySize.shoe}mm</div>
          </div>
        </div>
        <div className={cn(css.description)}>
          <div>
            ・키, 몸무게, 허리, 체형을 모두 입력하시면 1회에 한해 500 포인트를
            드립니다.
          </div>
          <div>
            ・입력하신 사이즈는 통계 자료로 활용되며, 사이즈 추천받기 및
            상품리뷰에 사용됩니다.
          </div>
          <button
            type="button"
            className={css.modifyButton}
            onClick={this.toggleMySizeModal}
          >
            사이즈 수정
          </button>
        </div>
      </>
    );
  };

  renderRegisterMySize = () => {
    return (
      <div>
        <FormButton
          onClick={this.toggleMySizeModal}
          color={formButtonColors.PURPLE}
          style={{ width: '100%' }}
        >
          사이즈 등록
        </FormButton>
        <div className={cn(css.description)}>
          <div>
            ・키, 몸무게, 허리, 체형을 모두 입력하시면 1회에 한해 500 포인트를
            드립니다.
          </div>
          <div>
            ・입력하신 사이즈는 통계 자료로 활용되며, 사이즈 추천받기 및
            상품리뷰에 사용됩니다.
          </div>
        </div>
      </div>
    );
  };

  handleSubmitMySize = async (mySize = {}) => {
    await this.props.mySize.submitMySize({
      mySize,
    });

    this.toggleMySizeModal();
  };

  render() {
    const { mypagePoint: mypagePointStore } = this.props;

    return (
      <>
        <MySizeModal
          mySize={this.props.mySize.mySize}
          isOpen={this.state.isMySizeModalOpen}
          onClose={this.toggleMySizeModal}
          showAlert={this.props.alert.showAlert}
          onSubmitMySize={this.handleSubmitMySize}
        />

        {_.isNil(this.props.mySize.mySize)
          ? this.renderRegisterMySize()
          : this.renderMySize()}

        {/* 포인트 적립 안내 모달 */}
        <PointSavingModal
          pointSavingType={pointSavingTypes.REGISTER_MYSIZE}
          isOpen={mypagePointStore.isPointSavingModalOpen}
          onClose={mypagePointStore.closePointSavingModalOpen}
          savedPointResponse={mypagePointStore.savedPointResponse}
        />
      </>
    );
  }
}

export default MySizePanel;
