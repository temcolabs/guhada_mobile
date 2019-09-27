import React from 'react';
import css from './SellerStoreHeader.module.scss';
import cn from 'classnames';
import { loginStatus } from 'constant';
import { useObserver } from 'mobx-react-lite';
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
    nickname: '압구정날라리',
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
  sellerId,
}) {
  return useObserver(() => (
    <div className={css.wrap}>
      <div className={css.backImage}>
        <div className={css.profileImage} />
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
              className={cn(css.colored)}
              onClick={() => seller.delFollowSellerStore(sellerId)}
            >
              팔로잉
            </button>
          ) : (
            <button
              className={cn()}
              onClick={() => seller.setFollowSellerStore(sellerId)}
            >
              팔로우
            </button>
          )
        ) : (
          <button
            className={cn()}
            onClick={() => seller.setFollowSellerStore(sellerId)}
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
                backgroundImage: `url(/static/icon/grade_good.png)`,
              }}
            >{`만족 ${sellerStore.goodSatisfactionCount.toLocaleString()}명`}</div>
            <div
              className={css.satisIcon}
              style={{
                backgroundImage: `url(/static/icon/grade_usual.png)`,
              }}
            >{`보통 ${sellerStore.normalSatisfactionCount.toLocaleString()}명`}</div>
            <div
              className={css.satisIcon}
              style={{
                backgroundImage: `url(/static/icon/grade_bad.png)`,
              }}
            >{`불만족 ${sellerStore.badSatisfactionCount.toLocaleString()}명`}</div>
          </div>
        </div>
        <div className={css.offlineStoreHeader}>오프라인 스토어</div>
        <div className={css.offlineStoreAddress}>
          {sellerStore.offlineStoreAddress}
        </div>
      </div>
    </div>
  ));
}
