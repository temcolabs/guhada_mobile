import React from 'react';
import css from './TimeDealItem.module.scss';
import cn from 'classnames';
import moment from 'moment';
import timeDeal from 'constant/home/timeDeal';
import { dateFormat } from 'constant/';
export default function TimeDealItem({
  deal = {
    brandId: 13,
    brandName: 'Aquazzura',
    dealId: 128,
    dealName: '<타임딜> 템코 후드티',
    discountPrice: 100000,
    discountRate: 0,
    freeShipping: false,
    imageName: 'nike_air_max_97_black_white.jpeg',
    imageUrl:
      'https://dolh13ote4loq.cloudfront.net/images/products/thumb/32d8bbd243954442aaaeccb34bce2826',
    isBoldName: false,
    options: [],
    productId: 132,
    productImage: {
      height: 225,
      name: 'nike_air_max_97_black_white.jpeg',
      url:
        'https://dolh13ote4loq.cloudfront.net/images/products/thumb/32d8bbd243954442aaaeccb34bce2826',
      width: 225,
    },
    productName: '템코 후드티',
    productSeason: '19FW',
    sellPrice: 100000,
    sellerId: 251,
    shipExpenseType: 'PAID',
    timeDealInfo: {
      now: 1571898691,
      discountStartAt: 1572155528000,
      remainedTimeForEnd: 861636,
      statusCode: 'READY',
      statusText: '판매예정',
    },
    totalStock: 292,
  },
}) {
  moment.locale('en');
  let timeDealStatus;
  let deadlineRender;
  let now = moment();
  let deadline = now.clone().second(deal.timeDealInfo.remainedTimeForEnd);
  console.log(
    deal.timeDealInfo.remainedTimeForEnd,
    deadline.diff(now, 'days') +
      ' days, ' +
      deadline.diff(now, 'hours') +
      ' hrs, ' +
      (deadline.diff(now, 'minutes') % 60) +
      ' mins'
  );

  if (deadline.diff(now, 'hours') > 24) {
    timeDealStatus = timeDeal.DEADLINE;
    deadlineRender = deadline.diff(now, 'days');
  } else if (deadline.diff(now, 'hours') > 24) {
    timeDealStatus = timeDeal.DEADLINE_TODAY;
  }
  console.log(
    'deal.timeDealInfo.discountStartAt',
    deal.timeDealInfo.discountStartAt,
    moment(deal.timeDealInfo.discountStartAt).format(dateFormat.MMDDHA)
  );
  // var eventTime = 1366549200; // Timestamp - Sun, 21 Apr 2013 13:00:00 GMT
  // var currentTime = 1366547400; // Timestamp - Sun, 21 Apr 2013 12:30:00 GMT
  let diffTime = deal.timeDealInfo.remainedTimeForEnd;
  let duration = moment.duration(diffTime * 1000, 'milliseconds');
  let interval = 1000;

  // setInterval(function() {
  //   duration = moment.duration(duration - interval, 'milliseconds');
  //   console.log(
  //     'time',
  //     duration.format('hh:mm:ss'),
  //     duration.hours() + ':' + duration.minutes() + ':' + duration.seconds()
  //   );
  // }, interval);

  return (
    <div className={css.wrap}>
      <div className={css.item}>
        {deal.timeDealInfo.statusCode === 'READY' ? (
          <div className={css.statusWrap}>
            <div className={cn(css.deadLineBtn, css.readyBtn)}>판매예정</div>
            <div className={css.timeWrap}>
              {moment(deal.timeDealInfo.discountStartAt).format(
                dateFormat.MMDDHA
              )}
            </div>
          </div>
        ) : timeDealStatus === timeDeal.DEADLINE ? (
          <div className={cn(css.statusWrap, css.noBorder)}>
            <div
              className={cn(css.deadLineBtn, css.deadLineAloneBtn)}
            >{`${deadlineRender}일 남음`}</div>
          </div>
        ) : (
          timeDealStatus === timeDeal.DEADLINE_TODAY && (
            <div className={css.statusWrap}>
              <div className={cn(css.deadLineBtn)}>오늘마감</div>
              <div className={css.timeWrap}>{`11:22:33`}</div>
            </div>
          )
        )}
        {/* <div className={css.statusWrap}>
          <div className={cn(css.deadLineBtn, css.readyBtn)}>오늘마감</div>
          <div className={css.timeWrap}>10.17 10AM</div>
          </div> */}
        <div className={css.soldoutImgWrap}>
          <div
            className={cn({
              [css.soldoutBack]:
                deal.timeDealInfo.statusCode === 'OUT_OF_STOCK',
            })}
          />
          <div
            className={cn({
              [css.soldoutImg]: deal.timeDealInfo.statusCode === 'OUT_OF_STOCK',
            })}
          />
          <div
            className={css.image}
            style={{
              backgroundImage: `url(${deal.productImage.url})`,
            }}
          />
        </div>
        <div className={css.detailWrap}>
          <div className={css.brandWrap}>
            <div className={css.brand}>{deal.brandName}</div>
            <div className={css.season}>{deal.productSeason}</div>
          </div>
          <div className={css.title}>{deal.dealName}</div>
          <div className={css.priceItemWrap}>
            <div className={css.priceItem}>
              <div className={css.discountPercent}>
                {`${deal.discountRate}`}
                <div>%</div>
              </div>
              <div className={css.priceWrap}>
                <div className={css.originalPrice}>
                  {deal.sellPrice.toLocaleString()}
                </div>
                <div className={css.discountPrice}>
                  {`${deal.discountPrice.toLocaleString()}`}
                  <div>원</div>
                </div>
              </div>
            </div>
            {deal.timeDealInfo.statusCode === 'OUT_OF_STOCK_IMMINENT' && (
              <div className={css.soldout}>품절임박</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
