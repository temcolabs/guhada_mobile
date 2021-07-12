import React, { Fragment } from 'react';
import css from './SellerStoreHeader.module.scss';
import cn from 'classnames';
import { loginStatus } from 'lib/constant';
import { useObserver } from 'mobx-react';
import checkNullAndEmpty from 'lib/common/checkNullAndEmpty';
import _ from 'lodash';

export default function SellerStoreHeader({
  sellerStore = {
    badSatisfactionCount: 0,
    businessHours: null,
    claimTelephone: '',
    companyRegistrationNumber: '',
    followed: false,
    followerCount: 0,
    goodSatisfactionCount: 0,
    mailorderRegistrationNumber: '',
    nickname: '',
    normalSatisfactionCount: 0,
    offlineStoreAddress: '',
    representativeName: '',
    sellingCount: 0,
    storeIntroduction: '',
    storeIntroductionDetail: null,
    zip: '',
  },
  seller,
  login,
  setTab,
}) {
  return useObserver(() => (
    <div className={css.wrap}>
      <div
        className={css.backImage}
        style={
          checkNullAndEmpty(sellerStore.offlineStoreImageUrl) === false
            ? {
                backgroundImage: `url(${sellerStore.offlineStoreImageUrl})`,
                boxShadow: `inset 0 0 0 180px rgba(17,17,17,0.3)`,
              }
            : null
        }
      >
        <div
          className={css.profileImage}
          style={
            checkNullAndEmpty(sellerStore.profileImageUrl) === false
              ? { backgroundImage: `url(${sellerStore.profileImageUrl})` }
              : null
          }
        />
      </div>
      <div className={css.contentsWrap}>
        <div className={css.nickname}>{sellerStore.nickname}</div>
        <div>
          <div className={css.countGrid}>
            <div className={css.followerWrap}>
              <div className={css.countLabel}>팔로워</div>
              <div className={css.countValue}>
                {sellerStore.followerCount}
                <span>명</span>
              </div>
            </div>
          </div>
          <div className={css.countLine} />
          <div className={css.countGrid}>
            <div className={css.sellingWrap}>
              <div className={css.countLabel}>판매된 상품</div>
              <div className={css.countValue}>
                {sellerStore.sellingCount}
                <span>개</span>
              </div>
            </div>
          </div>
        </div>
        <div className={css.storeIntroduction}>
          {sellerStore.storeIntroduction}
        </div>
        {login.loginStatus === loginStatus.LOGIN_DONE ? (
          seller.storeFollowBool === true ? (
            <button
              className={cn()}
              onClick={() => seller.delFollowSellerStore(seller.sellerId)}
            >
              팔로잉
            </button>
          ) : (
            <button
              className={cn(css.colored)}
              onClick={() => seller.setFollowSellerStore(seller.sellerId)}
            >
              팔로우
            </button>
          )
        ) : (
          <button
            className={cn(css.colored)}
            onClick={() => seller.setFollowSellerStore(seller.sellerId)}
          >
            팔로우
          </button>
        )}
        <div className={css.satisfactionWrap}>
          <div className={css.satisfactionHeader}>구매자 만족도</div>
          <div>
            <div
              className={css.satisIcon}
              style={{
                backgroundImage: `url(/public/icon/grade_good.png)`,
              }}
            >{`만족 ${sellerStore.goodSatisfactionCount.toLocaleString()}명`}</div>
            <div
              className={css.satisIcon}
              style={{
                backgroundImage: `url(/public/icon/grade_usual.png)`,
              }}
            >{`보통 ${sellerStore.normalSatisfactionCount.toLocaleString()}명`}</div>
            <div
              className={css.satisIcon}
              style={{
                backgroundImage: `url(/public/icon/grade_bad.png)`,
              }}
            >{`불만족 ${sellerStore.badSatisfactionCount.toLocaleString()}명`}</div>
          </div>
        </div>
        {_.isNil(sellerStore.offlineStoreAddress.trim()) ||
        sellerStore.offlineStoreAddress.trim() === 'null' ? null : (
          <Fragment>
            <div className={css.offlineStoreHeader}>오프라인 스토어</div>
            <div
              className={css.offlineStoreAddress}
              onClick={() => {
                setTab('info');
                setTimeout(() => {
                  window.scrollTo(0, document.body.scrollHeight);
                }, 100);
              }}
            >
              {sellerStore.offlineStoreAddress}
              <div className={css.offlineStoreAddressIcon} />
            </div>
          </Fragment>
        )}
      </div>
    </div>
  ));
}
