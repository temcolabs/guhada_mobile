import { Component } from 'react';
import css from './UserEditForm.module.scss';
import KeyValueTable from 'components/mypage/form/KeyValueTable';
import Select from 'components/mypage/form/Select';
import RadioGroup from 'components/mypage/form/RadioGroup';
import getRangeSelectOptions from 'lib/common/getRangeSelectOptions';
import MySizePanel from './MySizePanel';
import moment from 'moment';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import { UserEditFormContext } from 'template/mypage/UserInfomation';
import { Field } from 'react-final-form';
import { composeValidators } from 'lib/common/finalFormValidators';
import padZeroToSingleDigit from 'lib/string/padZeroToSingleDigit';

/**
 * component state 기반으로 만들었다가 final form 적용하는 과정에서 코드가 필요 이상으로 지저분해진 컴포넌트.
 */
@inject('mySize')
@observer
class AdditionalInfoForm extends Component {
  static defaultProps = {
    userInfoForm: {},
    onChangeUserInfo: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      yearOptions: [],
      monthOptions: [],
      dateOptions: [],
    };
  }

  componentDidMount() {
    this.initForm();
  }

  initForm = (userInfoForm = {}) => {
    const { birth, gender = 'male' } = userInfoForm;

    // 생일 UI 초기화
    const now = moment(_.isNil(birth) ? new Date() : birth);
    const year = now.year();
    const month = now.month() + 1; // month as 0~11
    const date = now.date();

    const yearOptions = getRangeSelectOptions({
      start: now.year() - 120,
      end: now.year(),
      sort: 'desc',
      template: '%VALUE%년',
    });

    const monthOptions = getRangeSelectOptions({
      start: 1,
      end: 12,
      template: '%VALUE%월',
    });

    const dateOptions = getRangeSelectOptions({
      start: 1,
      end: now
        .clone()
        .month(month - 1)
        .endOf('month')
        .date(),
      template: '%VALUE%일',
    });

    this.setState({
      // 셍일
      birth: {
        year,
        month,
        date,
      },
      yearOptions,
      monthOptions,
      dateOptions,

      // 성별
      gender,
    });
  };

  /**
   * 생일 변경
   */
  handleChangeBirth = (part = this.birthPartials.YEAR) => ({
    value = 1,
    prevBirth = '2000-01-01',
    formApi,
  }) => {
    let [year, month, day] = prevBirth.split('-');

    switch (part) {
      case this.birthPartials.YEAR:
        year = padZeroToSingleDigit(value);
        break;

      case this.birthPartials.MONTH:
        month = padZeroToSingleDigit(value);
        break;

      case this.birthPartials.DAY:
        day = padZeroToSingleDigit(value);
        break;

      default:
    }

    // 폼 필드 업데이트
    formApi.change('birth', [year, month, day].join('-'));

    // 월 선택을 변경했다는 일 선택 옵션을 초기화한다. 매달 선택 가능 범위가 다르므로
    if (part === this.birthPartials.MONTH) {
      const { birth } = this.state;
      const now = moment([birth.year, value - 1, 1]);

      this.setState({
        dateOptions: getRangeSelectOptions({
          start: 1,
          end: now.endOf('month').date(),
          template: '%VALUE%일',
        }),
      });
    }
  };

  birthPartials = {
    YEAR: 'year',
    MONTH: 'month',
    DAY: 'day',
  };

  getPartialBirth = (part) => (birth) => {
    const partials = birth.split('-');

    if (partials.length !== 3) {
      return null;
    }

    switch (part) {
      case this.birthPartials.YEAR:
        return parseInt(partials[0]);
      case this.birthPartials.MONTH:
        return parseInt(partials[1]);
      case this.birthPartials.DAY:
        return parseInt(partials[2]);
      default:
        return null;
    }
  };

  render() {
    const { yearOptions, monthOptions, dateOptions } = this.state;

    return (
      <>
        <UserEditFormContext.Consumer>
          {({ fields, values, formApi, initialValues }) => (
            <KeyValueTable>
              <tr>
                <th data-name="first">내 사이즈</th>
              </tr>
              <tr>
                <td>
                  {/* 내 사이즈 등록, 수정 */}
                  <MySizePanel />
                </td>
              </tr>

              <tr>
                <th>생년월일</th>
              </tr>
              <tr>
                <Field
                  name={fields.birth}
                  validate={composeValidators()}
                  initialValue={initialValues[fields.birth]}
                >
                  {({ input, meta }) => (
                    <td className={css.valueCell}>
                      <div className={css.formGroup}>
                        <div className={css.formInput} data-type="birthdayYear">
                          <Select
                            name="birthdayYear"
                            options={yearOptions}
                            placeholder="년도"
                            value={yearOptions.find(
                              (o) =>
                                o.value ===
                                this.getPartialBirth(this.birthPartials.YEAR)(
                                  input.value
                                )
                            )}
                            onChange={(option) => {
                              this.handleChangeBirth(this.birthPartials.YEAR)({
                                value: option.value,
                                prevBirth: input.value,
                                formApi,
                              });
                            }}
                          />
                        </div>
                        <div
                          className={css.formInput}
                          data-type="birthdayMonth"
                        >
                          <Select
                            name="birthdayMonth"
                            options={monthOptions}
                            placeholder="월"
                            value={monthOptions.find(
                              (o) =>
                                o.value ===
                                this.getPartialBirth(this.birthPartials.MONTH)(
                                  input.value
                                )
                            )}
                            onChange={(option) =>
                              this.handleChangeBirth(this.birthPartials.MONTH)({
                                value: option.value,
                                prevBirth: input.value,
                                formApi,
                              })
                            }
                          />
                        </div>
                        <div className={css.formInput} data-type="birthdayDay">
                          <Select
                            name="birthdayDay"
                            options={dateOptions}
                            placeholder="일"
                            value={dateOptions.find(
                              (o) =>
                                o.value ===
                                this.getPartialBirth(this.birthPartials.DAY)(
                                  input.value
                                )
                            )}
                            onChange={(option) =>
                              this.handleChangeBirth(this.birthPartials.DAY)({
                                value: option.value,
                                prevBirth: input.value,
                                formApi,
                              })
                            }
                          />
                        </div>
                      </div>
                    </td>
                  )}
                </Field>
              </tr>

              <tr>
                <th>성별</th>
              </tr>
              <tr>
                <Field name={fields.gender} validate={composeValidators()}>
                  {({ input, meta }) => (
                    <td className={css.valueCell}>
                      <RadioGroup
                        name="gender"
                        options={[
                          {
                            label: '남성',
                            value: 'MALE',
                          },
                          {
                            label: '여성',
                            value: 'FEMALE',
                          },
                        ]}
                        onChange={input.onChange}
                        initialValue={input.value}
                      />
                    </td>
                  )}
                </Field>
              </tr>
            </KeyValueTable>
          )}
        </UserEditFormContext.Consumer>
      </>
    );
  }
}

export default AdditionalInfoForm;
