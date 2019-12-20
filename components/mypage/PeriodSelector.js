import React, { useState, useEffect, useCallback, useMemo } from 'react';
import _ from 'lodash';
import css from './PeriodSelector.module.scss';
import cn from 'classnames';
import moment from 'moment';
import { SingleDatePickerWrapper } from 'components/common/DatePicker';
import { dateUnit, dateFormat } from 'childs/lib/constant/date';
import isTruthy, { isFalsey } from 'childs/lib/common/isTruthy';

// 날짜 선택 탭 종류. 기본 탭, 월 선택 탭, 기간 선택 탭

export const periodTab = {
  TAB_DEFAULT: 'TAB_DEFAULT',
  TAB_MONTH: 'TAB_MONTH',
  TAB_DATEPICKER: 'TAB_DATEPICKER',
};

export const TAB_DEFAULT = 'TAB_DEFAULT';
export const TAB_MONTH = 'TAB_MONTH';
export const TAB_DATEPICKER = 'TAB_DATEPICKER';

const calendarField = {
  START_DATE: 'START_DATE',
  END_DATE: 'END_DATE',
};
const nowMoment = moment();

// 기본 기간은 오늘부터 7일 전까지. 데이터는 momentInstance
export const DEFAULT_PERIOD = {
  startDate: moment()
    .subtract(7, 'days')
    .startOf('day'),
  endDate: moment().endOf('day'),
};

export const DEFAULT_TAB_IN_USE = periodTab.TAB_DEFAULT;

// 기본 탭의 사용할 기간
const DEFAULT_TAB_ITEMS = [
  { value: 1, unit: dateUnit.WEEK },
  { value: 15, unit: dateUnit.DAY },
  { value: 1, unit: dateUnit.MONTH },
];

// state 초기값
// ! 상수로 선언해두지 않으면 새로운 객체라서 자식 컴포넌트가 업데이트 계속함
const DEFAULT_INITIAL_DATA = {
  period: DEFAULT_PERIOD,
  tabInUse: DEFAULT_TAB_IN_USE,
  defaultTabIndex: 0,
};

/**
 * 기간 선택 컴포넌트
 * 커스텀 기간, 월 단위, 달력으로 직접 지정 가능하다.
 * * 날짜에는 moment 객체를 사용한다
 */
export default function PeriodSelector({
  initialData = DEFAULT_INITIAL_DATA,
  onChangePeriod = ({ startDate, endDate, tabInUse, defaultTabIndex }) => {}, // 기간 변경 콜백
  defaultTabItems = DEFAULT_TAB_ITEMS, // 기본 탭. shape는 DEFAULT_TAB_ITEMS 참조
  isMonthlyTabVisible = true, // 월 선택 탭 표시여부
  monthlyTabRange = 5, // 월 선택 탭의 개수. 현재 월부터 n-1 월 이전까지
} = {}) {
  // 기본 검색 기간
  const [period, setPeriod] = useState(initialData.period || DEFAULT_PERIOD);

  // 현재 선택된 탭 종류.
  const [tabInUse, setTabInUse] = useState(
    initialData.tabInUse || DEFAULT_TAB_IN_USE
  );

  // 기본 탭 인덱스
  const [defaultTabIndex, selectDefaultTabIndex] = useState(
    initialData.defaultTabIndex || 0
  );

  const onChangePeriodThrottled = useCallback(
    _.throttle(onChangePeriod, 400),
    []
  );

  // 초기값 반영
  useEffect(() => {
    const { period = {}, tabInUse, defaultTabIndex } = initialData;
    const { startDate, endDate } = period;
    const isValidPeriod = isTruthy(startDate) && isTruthy(endDate);

    if (isTruthy(defaultTabIndex)) {
      selectDefaultTabIndex(defaultTabIndex);
    }

    if (isValidPeriod) {
      setPeriod({
        startDate: moment(startDate),
        endDate: moment(endDate),
      });
    }

    if (isTruthy(tabInUse)) {
      setTabInUse(tabInUse);
    }

    return () => {};
  }, [initialData]);

  /**
   * 날짜 단위를 텍스트로 변환
   */
  const convertDateUnitToText = (unit = 'day') => {
    switch (unit) {
      case dateUnit.DAY:
        return '일';
      case dateUnit.WEEK:
        return '주';
      case dateUnit.MONTH:
        return '개월';
      case dateUnit.YEAR:
        return '년';
      default:
        return unit;
    }
  };

  /**
   * 기본 탭 버튼 클릭
   */
  const handleClickDefaultTab = useCallback(
    selectedIndex => {
      const tabItem = defaultTabItems[selectedIndex];

      const periodToUpdate = {
        startDate: moment().subtract(tabItem.value, tabItem.unit),
        endDate: moment(),
      };

      setTabInUse(periodTab.TAB_DEFAULT);
      selectDefaultTabIndex(selectedIndex);
      setPeriod(periodToUpdate); // ! 상수로 선언해두지 않으면 새로운 객체라서 자식 컴포넌트가 업데이트 계속함

      onChangePeriodThrottled({
        startDate: periodToUpdate.startDate.format(dateFormat.YYYYMMDD),
        endDate: periodToUpdate.endDate.format(dateFormat.YYYYMMDD),
        tabInUse: periodTab.TAB_DEFAULT,
        defaultTabIndex: selectedIndex,
      });
    },
    [defaultTabItems, onChangePeriodThrottled]
  );

  /**
   * 월 탭 버튼 클릭
   * @param {*} monthDistance 현재 월과 선택한 월이 몇달 차이인지
   */
  const handleClickMonthTab = useCallback(
    (monthDistance = 0) => {
      const periodToUpdate = {
        startDate: nowMoment
          .clone()
          .subtract(monthDistance, 'month')
          .startOf('month'),
        endDate: nowMoment
          .clone()
          .subtract(monthDistance, 'month')
          .endOf('month'),
      };

      setTabInUse(TAB_MONTH);
      setPeriod(periodToUpdate); // ! 상수로 선언해두지않으면 새로운 객체라서 자식 컴포넌트가 업데이트 계속함

      onChangePeriodThrottled({
        startDate: periodToUpdate.startDate.format(dateFormat.YYYYMMDD),
        endDate: periodToUpdate.endDate.format(dateFormat.YYYYMMDD),
        tabInUse: TAB_MONTH,
        defaultTabIndex,
      });
    },
    [defaultTabIndex, onChangePeriodThrottled]
  );

  /**
   * 달력 선택으로 기간 조정
   */
  const handleSelectCalendar = (field = calendarField.START_DATE) => (
    selected = moment()
  ) => {
    // 선택된 값이
    if (isFalsey(selected)) {
      return;
    } else {
      let isInvalidCalendarPeriod = false;
      let periodToUpdate = {};

      /**
       * 선택한 기간이 유효한 기간인지 먼저 검사한다
       */
      if (field === calendarField.START_DATE) {
        const isValidStart = selected.isSameOrBefore(period.endDate);

        if (isValidStart) {
          periodToUpdate = _.merge({}, period, {
            startDate: selected.startOf('day'), // 그 날의 00:00:00부터 검색하도록
          });
        } else {
          isInvalidCalendarPeriod = true;
        }
      }
      // 종료일 선택
      else if (field === calendarField.END_DATE) {
        const isValidEnd = selected.isSameOrAfter(period.startDate);

        if (isValidEnd) {
          periodToUpdate = _.merge({}, period, {
            endDate: selected.endOf('day'), // 그 날의 23:59:59 까지 검색하도록
          });
        } else {
          isInvalidCalendarPeriod = true;
        }
      }

      // 유효하지 않은 날짜
      if (isInvalidCalendarPeriod) {
        console.error('[handleSelectCalendar], invalid date selected');
        periodToUpdate = {
          startDate: moment(DEFAULT_PERIOD.startDate),
          endDate: moment(DEFAULT_PERIOD.endDate),
        };
      }

      setPeriod(periodToUpdate);
      setTabInUse(periodTab.TAB_DATEPICKER); // ! 상수로 선언해두지않으면 새로운 객체라서 자식 컴포넌트가 업데이트 계속함

      onChangePeriodThrottled({
        startDate: periodToUpdate.startDate.format(dateFormat.YYYYMMDD),
        endDate: periodToUpdate.endDate.format(dateFormat.YYYYMMDD),
        tabInUse: periodTab.TAB_DATEPICKER,
        defaultTabIndex,
      });
    }
  };

  // 일 탭 버튼 컴포넌트
  const renderDefaultTabs = useCallback(() => {
    const defaultTabSelected = defaultTabItems[defaultTabIndex];

    return defaultTabItems.map((tabItem, index) => {
      const isButtonSelected =
        tabInUse === periodTab.TAB_DEFAULT &&
        tabItem.value === defaultTabSelected?.value &&
        tabItem.unit === defaultTabSelected?.unit;

      return (
        <button
          key={index}
          className={cn(css.daysButton, {
            [css.isSelected]: isButtonSelected,
          })}
          onClick={() => handleClickDefaultTab(index)}
        >
          {`${tabItem.value}${convertDateUnitToText(tabItem.unit)}`}
        </button>
      );
    });
  }, [defaultTabIndex, defaultTabItems, handleClickDefaultTab, tabInUse]);

  // 월 탭 버튼 컴포넌트 렌더링
  const renderMonthTabs = useCallback(() => {
    const monthTabs = [];

    for (
      let distance = monthlyTabRange - 1, tabMonth;
      distance >= 0;
      distance--
    ) {
      tabMonth = nowMoment.clone().subtract(distance, dateUnit.MONTH);

      const isButtonSelected =
        tabInUse === periodTab.TAB_MONTH &&
        tabMonth.month() === period.startDate.month();

      monthTabs.push(
        <button
          className={cn(css.monthButton, {
            [css.isSelected]: isButtonSelected,
          })}
          onClick={() => handleClickMonthTab(distance)}
          key={distance}
        >
          {`${tabMonth.month() + 1}월`}
        </button>
      );
    }

    return monthTabs;
  }, [handleClickMonthTab, monthlyTabRange, period.startDate, tabInUse]);

  return (
    <div className={css.wrap}>
      {/* <span className={css.label}>기간 별 조회</span> */}
      <div
        className={cn(css.daysTab, {
          [css.isFocused]: tabInUse === periodTab.TAB_DEFAULT,
        })}
      >
        {renderDefaultTabs()}
      </div>

      {isMonthlyTabVisible && (
        <div
          className={cn(css.monthTab, {
            [css.isFocused]: tabInUse === periodTab.TAB_MONTH,
          })}
        >
          {renderMonthTabs()}
        </div>
      )}
      <div className={css.applyArea}>
        <div
          className={css.datePickerTab}
          onClick={() => setTabInUse(TAB_DATEPICKER)}
        >
          <SingleDatePickerWrapper
            readOnly
            id="PeriodSelector_start"
            initialDate={period.startDate}
            onSelect={handleSelectCalendar(calendarField.START_DATE)}
          />

          <span className={css.applyArea__tilde}>~</span>

          <SingleDatePickerWrapper
            readOnly
            id="PeriodSelector_end"
            initialDate={period.endDate}
            onSelect={handleSelectCalendar(calendarField.END_DATE)}
          />
        </div>

        <button
          className={css.applyButton}
          onClick={() =>
            // 현재 state 다시 전달
            onChangePeriodThrottled({
              startDate: period.startDate.format(dateFormat.YYYYMMDD),
              endDate: period.endDate.format(dateFormat.YYYYMMDD),
              tabInUse,
              defaultTabIndex,
            })
          }
        >
          조회
        </button>
      </div>
    </div>
  );
}
