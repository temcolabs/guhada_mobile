import { Component } from 'react';
import { bool, object, func } from 'prop-types';
import ModalWrapper from 'components/common/modal/ModalWrapper';
import css from './MySizeModal.module.scss';
import Select from 'components/mypage/form/Select';
import cn from 'classnames';
import Form from 'stores/form-store/_.extends';
import { observer, inject } from 'mobx-react';
import SubmitButton, {
  CancelButton,
  SubmitButtonWrapper,
} from 'components/mypage/form/SubmitButton';
import Checkbox from 'components/mypage/form/Checkbox';
import getRangeSelectOptions from 'lib/common/getRangeSelectOptions';
import memoize from 'memoize-one';
import SectionHeading from 'components/common/SectionHeading';
import { devLog } from 'lib/common/devLog';

/**
 * 내 사이즈 등록, 수정 모달
 */
@inject('mySize')
@observer
class MySizeModal extends Component {
  static propTypes = {
    isOpen: bool,
    mySize: object, // 서버에 저장되어 있는 내 사이즈
    onClose: func,
    showAlert: func,
    onSubmitMySize: func, // (mySize = {}) => {}
  };

  static defaultProps = {
    mySize: {
      height: null,
      weight: null,
      shoe: null,
      top: null,
      bottom: null,
    },
  };

  get heightOptions() {
    return getRangeSelectOptions({
      start: 120,
      end: 220,
      template: `%VALUE%cm`,
      gap: 5,
    });
  }

  get weightOptions() {
    return getRangeSelectOptions({
      start: 30,
      end: 130,
      template: `%VALUE%kg`,
      gap: 5,
    });
  }

  get shoeOptions() {
    return getRangeSelectOptions({
      start: 200,
      end: 320,
      template: `%VALUE%mm`,
      gap: 5,
    });
  }

  get topOptions() {
    const values = ['XS', 'S', 'M', 'L', 'XL'];
    return values.map((v) => ({
      label: v,
      value: v,
    }));
  }

  get bottomOptions() {
    const optionPart1 = getRangeSelectOptions({ start: 23, end: 36 });
    const optionPart2 = getRangeSelectOptions({ start: 38, end: 46, gap: 2 });
    const optionPart3 = getRangeSelectOptions({
      start: 48,
      end: 48,
      template: `%VALUE%이상`,
    });

    return optionPart1.concat(optionPart2).concat(optionPart3);
  }

  constructor(props) {
    super(props);
    this.state = {};

    this.setupMySizeForm();
  }

  componentDidUpdate(prevProps, prevState) {
    this.setMySizeToForm(this.props.mySize);
  }

  setupMySizeForm = () => {
    const self = this;
    const onSubmitMySize = this.props.onSubmitMySize;

    this.form = new Form(
      {
        fields: [
          {
            name: 'height',
            label: '키 (cm)',
            placeholder: '선택하세요',
            rules: 'required',
            extra: self.heightOptions,
            hooks: {
              onChange(field) {
                devLog(`field.value`, field.value);
              },
            },
          },
          {
            name: 'weight',
            label: '체중 (km)',
            placeholder: '선택하세요',
            rules: 'required',
            extra: self.weightOptions,
            hooks: {},
          },
          {
            name: 'shoe',
            label: '발 (mm)',
            placeholder: '선택하세요',
            rules: 'required',
            extra: self.shoeOptions,
            hooks: {},
          },
          {
            name: 'top',
            label: '상의 사이즈',
            placeholder: '선택하세요',
            rules: 'required',
            extra: self.topOptions,
            hooks: {},
          },
          {
            name: 'bottom',
            label: '하의 사이즈',
            placeholder: '선택하세요',
            rules: 'required',
            extra: self.bottomOptions,
            hooks: {},
          },
          {
            // 정보성 알림 수신방법 문자 수신동의
            name: 'agreement',
            type: 'checkbox',
            label:
              '[필수] 해당 정보는 리뷰 작성 시 자동으로 적용되어 보여질 수 있습니다.',
            rules: 'boolean|accepted',
            value: false,
            hooks: {
              onChange(field) {},
            },
          },
        ],
      },
      {
        name: 'MySizeForm',
        hooks: {
          onSuccess(form) {
            const { height, weight, shoe, top, bottom } = form.values();

            onSubmitMySize({
              height: height.value, // 옵션 객체
              weight: weight.value, // 옵션 객체
              shoe: shoe.value, // 옵션 객체
              top,
              bottom,
            });
          },
          onError(form) {
            if (form.errors().agreement) {
              self.props.showAlert('필수 항목 확인이 필요합니다.');
            } else {
              self.props.showAlert('선택하지 않은 항목이 있습니다.');
            }
          },
        },
      }
    );
  };

  /**
   * 전달받은 사이즈로 폼 데이터 초기화
   */
  setMySizeToForm = memoize((mySize = {}) => {
    if (mySize) {
      this.form.$('height').value = this.heightOptions.find(
        (o) => o.value === mySize.height
      );
      this.form.$('weight').value = this.weightOptions.find(
        (o) => o.value === mySize.weight
      );
      this.form.$('shoe').value = this.shoeOptions.find(
        (o) => o.value === mySize.shoe
      );
      this.form.$('top').value = mySize.top;
      this.form.$('bottom').value = mySize.bottom;
    }
  });

  handleClickTop = (v) => {
    this.form.$('top').value = v;
  };

  handleClickBottom = (v) => {
    this.form.$('bottom').value = v;
  };

  submitMySize = () => {
    const { height, weight, shoe, top, bottom } = this.form.values();

    this.props.onSubmitMySize({
      height,
      weight,
      shoe,
      top,
      bottom,
    });
  };

  render() {
    return (
      <ModalWrapper
        isOpen={this.props.isOpen}
        contentStyle={{ overflow: 'visible' }}
        onClose={this.props.onClose}
      >
        <form>
          <div className={css.wrap}>
            <SectionHeading title="내 사이즈 등록/수정" />

            <div className={cn('grid_10', css.sizeSection)}>
              <div className={cn('gridRow')}>
                <div className={cn('col_1_3', css.bodySize)}>
                  <div className={css.sizeSectionName}>
                    {this.form.$('height').label}
                  </div>
                  <Select
                    {...this.form.$('height').bind()}
                    options={this.form.$('height').extra}
                    value={this.form.$('height').value}
                  />
                </div>
                <div className={cn('col_1_3', css.bodySize)}>
                  <div className={css.sizeSectionName}>
                    {this.form.$('weight').label}
                  </div>
                  <Select
                    {...this.form.$('weight').bind()}
                    options={this.form.$('weight').extra}
                    value={this.form.$('weight').value}
                  />
                </div>
                <div className={cn('col_1_3', css.bodySize)}>
                  <div className={css.sizeSectionName}>
                    {this.form.$('shoe').label}
                  </div>
                  <Select
                    {...this.form.$('shoe').bind()}
                    options={this.form.$('shoe').extra}
                    value={this.form.$('shoe').value}
                  />
                </div>
              </div>
            </div>

            <div className={css.sizeSection}>
              <div className={css.sizeSectionName}>
                {this.form.$('top').label}
              </div>
              <div className={cn(css.buttonGrid)}>
                {this.form.$('top').extra.map((option) => {
                  return (
                    <button
                      key={option.label}
                      type="button"
                      className={cn({
                        [css.isSelected]:
                          option.value === this.form.$('top').value,
                      })}
                      onClick={() => {
                        this.handleClickTop(option.value);
                      }}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={css.sizeSection}>
              <div className={css.sizeSectionName}>
                {this.form.$('bottom').label}
              </div>
              <div className={cn(css.buttonGrid)}>
                {this.form.$('bottom').extra.map((option) => {
                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={cn({
                        [css.isSelected]:
                          option.value === this.form.$('bottom').value,
                      })}
                      onClick={() => {
                        this.handleClickBottom(option.value);
                      }}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={css.agreement}>
              <Checkbox {...this.form.$('agreement').bind()}>
                <b>[필수]</b> 해당 정보는 리뷰 작성 시 자동으로 적용되어 보여질
                수 있습니다.
              </Checkbox>
            </div>
            <SubmitButtonWrapper wrapperStyle={{ marginTop: '30px' }}>
              <CancelButton
                onClick={() => {
                  this.form.reset();
                  this.props.onClose();
                }}
                style={{ width: '265px' }}
              >
                취소
              </CancelButton>
              <SubmitButton
                onClick={this.form.onSubmit}
                style={{ width: '265px' }}
              >
                등록
              </SubmitButton>
            </SubmitButtonWrapper>
          </div>
        </form>
      </ModalWrapper>
    );
  }
}

export default MySizeModal;
