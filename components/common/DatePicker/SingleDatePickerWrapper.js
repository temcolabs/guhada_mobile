/**
 * https://github.com/airbnb/react-dates/blob/master/examples/SingleDatePickerWrapper.jsx
 */
import { Component } from 'react';
import { string, bool, any, func } from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import 'react-dates/initialize'; // react-dates
import SingleDatePicker from 'react-dates/lib/components/SingleDatePicker';
import { SingleDatePickerPhrases } from 'react-dates/lib/defaultPhrases';
import { HORIZONTAL_ORIENTATION, ANCHOR_LEFT } from './calendarConstants';
// import './DateRangePickerStyle.scss';
import memoize from 'memoize-one';

const defaultProps = {
  autoFocus: false,
  initialDate: moment(),

  // input related props
  id: 'date',
  placeholder: 'Date',
  disabled: false,
  required: false,
  screenReaderInputMessage: '',
  showClearDate: false,
  showDefaultInputIcon: false,
  customInputIcon: null,
  block: false,
  small: false,
  regular: false,
  verticalSpacing: undefined,
  keepFocusOnInput: false,

  // calendar presentation and interaction related props
  renderMonthText: null,
  orientation: HORIZONTAL_ORIENTATION,
  anchorDirection: ANCHOR_LEFT,
  horizontalMargin: 0,
  withPortal: false,
  withFullScreenPortal: false,
  initialVisibleMonth: null,
  numberOfMonths: 1,
  keepOpenOnDateSelect: false,
  reopenPickerOnClearDate: false,
  isRTL: false,

  // navigation related props
  navPrev: null,
  navNext: null,
  onPrevMonthClick() {},
  onNextMonthClick() {},
  onClose() {},

  // day presentation and interaction related props
  renderCalendarDay: undefined,
  renderDayContents: null,
  enableOutsideDays: false,
  isDayBlocked: () => false,
  // isOutsideRange: day => day.isBefore(moment(), 'day'), // 오늘 이전은 선택 불가
  isOutsideRange: () => false, // 선택 불가능 날짜 없음
  isDayHighlighted: () => {},

  // internationalization props
  displayFormat: 'YYYY.MM.DD',
  monthFormat: 'MMMM YYYY',
  phrases: SingleDatePickerPhrases,
};

export class SingleDatePickerWrapper extends Component {
  static propTypes = {
    id: string,
    autoFocus: bool,
    onSelect: func,
    initialDate: any,
  };
  static defaultProps = defaultProps;

  constructor(props) {
    super(props);
    this.state = {
      focused: props.autoFocus,
      date: props.initialDate,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    this.setInitialDate(this.props.initialDate);
  }

  setInitialDate = memoize((date) => {
    this.setState({ date });
  });

  onDateChange = (date) => {
    this.setState({ date }, () => {
      this.props.onSelect(date);
    });
  };

  onFocusChange = ({ focused }) => {
    this.setState({ focused });
  };

  render() {
    const { focused, date } = this.state;

    // wrapper의 props는 제거한다
    const props = _.omit(this.props, ['autoFocus', 'initialDate', 'onSelect']);

    return (
      <SingleDatePicker
        {...props}
        date={date} // moment object
        focused={focused}
        onDateChange={this.onDateChange}
        onFocusChange={this.onFocusChange}
        hideKeyboardShortcutsPanel // 단축키 패널 숨김
        enableOutsideDays
        // customArrowIcon={<span> -> </span>} // 날짜 사이의 커스텀 화살표
      />
    );
  }
}

export default SingleDatePickerWrapper;
