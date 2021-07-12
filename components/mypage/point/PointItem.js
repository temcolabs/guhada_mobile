import React from 'react';
import css from './PointItem.module.scss';
import moment from 'moment';
import { dateFormat } from 'lib/constant/date';
import { withRouter } from 'next/router';

@withRouter
class PointItem extends React.Component {
  render() {
    const {
      data = {
        id: '',
        imgUrl: '', // 대표 이미지 URL ,
        createdDate: [], // 주문일 ,
        title: '', // 상품명 ,
        point: '', // 포인트
        status: '', // 상태
        desc: '', // 포인트 종류
        sign: '', // + , -
        displayStatusMessage: '', // 포인트 내용
      },
    } = this.props;

    return (
      <div className={css.wrap}>
        <div className={css.pointInfoWrapper}>
          {/* 상품 이미지 */}
          {/* <div
            className={css.pointImageBox}
            style={{
              backgroundImage: data.imgUrl
                ? `url(${data.imgUrl})`
                : `url('/public/icon/mypage/guhada_point@3x.png')`,
              backgroundColor: data.imgUrl ? `#fff` : `#eee`,
            }}
          /> */}
          {/* 포인트 정보 */}
          {/* 포인트 사용 / 적립 여부 */}
          <div
            className={`${css.pointAmount} ${
              data.status === 'CONSUMPTION' ||
              data.status === 'SAVED_CANCEL' ||
              data.status === 'RESTORE_CANCEL' ||
              data.status === 'EXPIRED'
                ? css.CONSUMPTION
                : data.status === 'DUE_SAVE_CANCEL' ||
                  data.status === 'DUE_CONSUMPTION' ||
                  data.status === 'DUE_SAVE' ||
                  data.status === 'DUE_CONSUMPTION_CANCEL'
                ? css.DUE
                : data.status === 'EXPIRED_CANCEL' ||
                  data.status === 'CONSUMPTION_CANCEL' ||
                  data.status === 'RESTORE' ||
                  data.status === 'SAVED'
                ? css.SAVED
                : null
            }`}
          >
            <div className={css.pointAmountInner}>
              <div>{`${data?.displayStatusMessage} `}</div>
              <div>{`${data?.sign}${data?.point.toLocaleString()}`}</div>
            </div>
          </div>
          <div className={css.pointInfo}>
            <div className={css.pointDate}>
              {moment(
                // 날짜가 8자리면 20191008 형태. invalid date가 되므로 파싱으로 방지한다
                data.createdDate?.length === 8
                  ? data.createdDate.replace(
                      /(\d{4})(\d{2})(\d{2})/,
                      '$1-$2-$3'
                    )
                  : data.createdDate
              ).format(dateFormat.YYYYMMDD_UI)}
            </div>
            <div className={css.pointInfo__prodName}>
              {/* <div className={css.brandName}>{data.season}</div> */}
              <div className={css.prodName}>{data.title}</div>
            </div>
            <div
              className={`${css.pointStatus} ${
                data.status === 'CONSUMPTION' ||
                data.status === 'SAVED_CANCEL' ||
                data.status === 'RESTORE_CANCEL' ||
                data.status === 'EXPIRED'
                  ? css.CONSUMPTION
                  : data.status === 'DUE_SAVE_CANCEL' ||
                    data.status === 'DUE_CONSUMPTION' ||
                    data.status === 'DUE_SAVE' ||
                    data.status === 'DUE_CONSUMPTION_CANCEL'
                  ? css.DUE
                  : data.status === 'EXPIRED_CANCEL' ||
                    data.status === 'CONSUMPTION_CANCEL' ||
                    data.status === 'RESTORE' ||
                    data.status === 'SAVED'
                  ? css.SAVED
                  : null
              }`}
            >
              {data.desc}
            </div>
          </div>

          {/* 포인트 삭제 */}
          <div className={css.pointDeleteButtonBox}>
            <div
              className={css.pointDeleteButton}
              onClick={() => {
                this.props.delete();
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default PointItem;
