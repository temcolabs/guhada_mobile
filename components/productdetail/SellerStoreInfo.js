import React, { useEffect } from 'react';
import css from './SellerStoreInfo.module.scss';
import cn from 'classnames';
import _ from 'lodash';
import { useObserver } from 'mobx-react-lite';
import { pushRoute } from 'lib/router';
import { loginStatus } from 'constant/';

function SellerStoreInfo({
  deals,
  dealsOfSellerStore = [
    {
      brandId: '',
      brandName: '',
      dealId: '',
      dealName: '',
      discountPrice: '',
      discountRate: '',
      imageName: '',
      imageUrl: '',
      options: '',
      productId: '',
      productImage: [
        {
          height: '',
          name: '',
          url: '',
          width: '',
        },
      ],
      productName: '',
      productSeason: '',
      sellPrice: '',
      sellerId: '',
      sellerName: '',
      shipExpenseType: '',
      totalStock: '',
    },
  ],
  followers = { isFollower: '팔로우' },
  seller,
  tabRefMap,
  sellerfollow,
  handleSellerFollows = () => {},
  alert,
  login,
}) {
  return useObserver(() => (
    <div className={css.wrap} ref={tabRefMap.sellerstoreTab}>
      <div
        className={css.headerWrap}
        onClick={() => pushRoute(`/sellerstore/${deals.sellerId}`)}
      >
        <div
          className={css.profileImage}
          style={
            _.isNil(seller) !== true &&
            seller.user.profileImageUrl !== '' &&
            seller.user.profileImageUrl !== null
              ? {
                  backgroundImage: `url(${seller.user.profileImageUrl})`,
                }
              : null
          }
        />
        <div className={css.profileWrap}>
          <div className={css.levelAndName}>
            {/* 레벨 제거 추후 추가 */}
            {/* <div className={css.level}>
              <div className={css.levelText}>4</div>
            </div> */}
            <div className={css.name}>{deals.sellerName}</div>
          </div>
          <div className={css.satisfiedWrap}>
            {/* 서비스 만족도 제거 추후 추가 */}
            {/* <div className={css.satisfiedLabel}>서비스 만족도</div>
            <div className={css.line} />
            <div>*굿서비스</div> */}
          </div>
        </div>
        {login.loginStatus === loginStatus.LOGIN_DONE ? (
          <div
            className={cn(css.followBtn, {
              [css.following]: sellerfollow.follows === true,
            })}
            onClick={e => {
              handleSellerFollows();
              e.stopPropagation();
            }}
          >
            {sellerfollow.follows === false ? '팔로우' : '팔로잉'}
          </div>
        ) : (
          <button
            className={cn(css.followBtn)}
            onClick={e => {
              alert.showAlert('로그인이 필요한 서비스입니다.');
              e.stopPropagation();
            }}
          >
            {'팔로우'}
          </button>
        )}
      </div>
      <div className={css.sellerItemWrap}>
        {dealsOfSellerStore.map(deal => {
          return (
            <div
              className={css.sellerItem}
              key={deal.dealId}
              onClick={() => pushRoute(`/productdetail?deals=${deal.dealId}`)}
            >
              <div className={css.imageWrap}>
                <div
                  className={css.image}
                  style={{
                    backgroundImage: `url(${deal.productImage.url})`,
                  }}
                />
              </div>
              <div className={css.contentsWrap}>
                <div className={css.brandWrap}>
                  <div className={css.brand}>{deal.brandName}</div>
                  <div className={css.season}>{deal.productSeason}</div>
                </div>
                <div className={css.title}>{deal.dealName}</div>
                <div className={css.price}>
                  {deal.sellPrice.toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ));
}
export default SellerStoreInfo;
