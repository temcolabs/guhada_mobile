import React, { Component } from 'react';
import css from './TimeDealSingle.module.scss';
import { item } from 'components/event/timedeal/strTimeDealItem';

function TimeDealSingle() {
  // 할인율 을 계산해서 추가
  function calcDiscountRate() {
    item.forEach((data) => {
      data.discountRate = Math.round(
        ((data.sellPrice - data.discountPrice) / data.sellPrice) * 100
      );
    });
  }

  calcDiscountRate();

  function goRouter(link) {
    window.location.href = link;
  }
  return (
    <div className={css.wrap}>
      <div
        className={css.bg}
        style={{
          backgroundImage: `url(${process.env.API_CLOUD}/images/background/timedeal/time_deal_bg_mobile.png)`,
        }}
      >
        {item.length > 0
          ? item.map((deals, index) => {
              return (
                <div className={css.itemWrap}>
                  <div
                    className={css.item}
                    onClick={() => goRouter(deals.link)}
                  >
                    <div className={css.soldoutImgWrap}>
                      <div
                        className={css.image}
                        style={{
                          backgroundImage: `url(/public/icon/thumbnail/${index +
                            1}.png)`,
                        }}
                      />
                    </div>
                    <div className={css.detailWrap}>
                      <div className={css.brandWrap}>
                        <div className={css.brand}>{deals.brandName}</div>
                        <div className={css.season}>{deals.productSeason}</div>
                      </div>
                      <div className={css.title}>{deals.dealName}</div>
                      <div className={css.priceItemWrap}>
                        <div className={css.priceItem}>
                          <div className={css.discountPercent}>
                            {`${deals.discountRate}`}
                            <div>%</div>
                          </div>
                          <div className={css.priceWrap}>
                            <div className={css.originalPrice}>
                              {deals.sellPrice.toLocaleString()}
                            </div>
                            <div className={css.discountPrice}>
                              {`${deals.discountPrice.toLocaleString()}`}
                              <div>원</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}

export default TimeDealSingle;
