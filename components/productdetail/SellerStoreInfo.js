import React, { useEffect } from 'react';
import css from './SellerStoreInfo.module.scss';
import cn from 'classnames';
import _ from 'lodash';
import { useObserver } from 'mobx-react';
import { pushRoute, sendBackToLogin } from 'childs/lib/router';
import { loginStatus } from 'childs/lib/constant';
import isTruthy from 'childs/lib/common/isTruthy';
import internationalShipping from 'childs/lib/constant/filter/internationalShipping';
import brandNew from 'childs/lib/constant/filter/brandNew';
import { inject } from 'mobx-react';

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
      internationalShipping: false,
      brandNew: true,
    },
  ],
  followers = { isFollower: '팔로우' },
  sellerData,
  tabRefMap,
  sellerfollow,
  handleSellerFollows = () => {},
  alert,
  login,
  sellerStore,
  seller,
}) {
  return useObserver(() => (
    <div className={css.wrap} ref={tabRefMap.sellerstoreTab}>
      <div
        className={css.headerWrap}
        onClick={() => seller.toSearch({ nickname: sellerStore.nickname })}
        // onClick={() => pushRoute(`/store/${sellerStore.nickname}`)}
      >
        <div
          className={css.profileImage}
          style={
            _.isNil(sellerData) !== true &&
            sellerData.user.profileImageUrl !== '' &&
            sellerData.user.profileImageUrl !== null
              ? {
                  backgroundImage: `url(${sellerData.user.profileImageUrl})`,
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
            <div className={css.name}>{sellerStore?.nickname}</div>
          </div>
          {/* 서비스 만족도 제거 추후 추가 */}
          {/* <div className={css.satisfiedWrap}>
            <div className={css.satisfiedLabel}>서비스 만족도</div>
            <div className={css.line} />
            <div>*굿서비스</div>
          </div> */}
        </div>

        {login.loginStatus === loginStatus.LOGIN_DONE ? (
          <div
            className={cn(css.followBtn, {
              [css.following]: sellerfollow.follows === true,
            })}
            onClick={(e) => {
              handleSellerFollows();
              e.stopPropagation();
            }}
          >
            {sellerfollow.follows === false ? '팔로우' : '팔로잉'}
          </div>
        ) : (
          <button
            className={cn(css.followBtn)}
            onClick={(e) => {
              sendBackToLogin();
              e.stopPropagation();
            }}
          >
            {'팔로우'}
          </button>
        )}
      </div>
      <div className={css.sellerItemWrap}>
        {dealsOfSellerStore.map((deal) => {
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
                    backgroundImage: `url(${deal.productImage.url + '?w=375' ||
                      ''})`,
                  }}
                />
              </div>
              <div className={css.contentsWrap}>
                {/* AS-IS: 해외 배송 */}
                {/* {_.isEmpty(deal.brandNew) && (
                  <div className={css.conditionWrap}>
                    {deal.internationalShipping && (
                      <>
                        <div className={css.internationalShipping}>
                          {deal.internationalShipping &&
                            internationalShipping.INTERNATIONAL}
                        </div>
                        {!deal.brandNew && <div className={css.betweenLine} />}
                      </>
                    )}
                    <div
                      className={cn(css.brandNew, {
                        [css.new]: deal.brandNew,
                      })}
                    >
                      {deal.brandNew ? '' : brandNew.USED}
                    </div>
                  </div>
                )} */}
                <div className={css.brandWrap}>
                  <div className={css.brand}>{deal.brandName}</div>
                  {/* AS-IS: 시즌 */}
                  {/* <div className={css.season}>{deal.productSeason}</div> */}
                </div>
                <div className={css.title}>{deal.dealName}</div>
                <div className={css.price}>
                  {isTruthy(deal.discountPrice)
                    ? deal.discountPrice.toLocaleString()
                    : deal.sellPrice.toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ));
}
export default inject('seller')(SellerStoreInfo);
