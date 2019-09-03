import React from 'react';
import css from './SellerStoreInfo.module.scss';
import cn from 'classnames';
import _ from 'lodash';

export default function SellerStoreInfo({
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
}) {
  return (
    <div className={css.wrap} ref={tabRefMap.sellerstoreTab}>
      <div className={css.headerWrap}>
        <div
          className={css.profileImage}
          style={
            _.isNil(seller) !== true && seller.user.profileImageUrl !== ''
              ? {
                  backgroundImage: `url(${seller.user.profileImageUrl})`,
                }
              : null
          }
        />
        <div className={css.profileWrap}>
          <div className={css.levelAndName}>
            <div className={css.level}>
              <div className={css.levelText}>4</div>
            </div>
            <div className={css.name}>{deals.sellerName}</div>
          </div>
          <div className={css.satisfiedWrap}>
            <div className={css.satisfiedLabel}>서비스 만족도</div>
            <div className={css.line} />
            <div>*굿서비스</div>
          </div>
        </div>
        <div
          className={cn(css.followBtn, {
            [css.following]: followers.isFollower === '팔로잉',
          })}
        >
          {followers
            ? followers.isFollower === '팔로잉'
              ? '팔로잉'
              : '팔로우'
            : '팔로잉'}
        </div>
      </div>
      <div className={css.sellerItemWrap}>
        {dealsOfSellerStore.map(deal => {
          return (
            <div className={css.sellerItem} key={deal.dealId}>
              <div className={css.imageWrap}>
                <img
                  className={css.image}
                  src={deal.productImage.url}
                  alt={deal.productImage.name}
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
  );
}
