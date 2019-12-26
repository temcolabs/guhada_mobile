import React from 'react';
import { withRouter } from 'next/router';
import MypageLayout from 'components/mypage/MypageLayout';
import MypageLikeDashboard from 'components/mypage/like/MypageLikeDashboard';
import MypageLikeItem from 'components/mypage/like/MypageLikeItem';
import { inject, observer } from 'mobx-react';
import { isBrowser } from 'childs/lib/common/isServer';
import MypageDataEmpty from 'components/mypage/MypageDataEmpty';
import SectionItem from 'components/home/SectionItem';
import { LinkRoute } from 'childs/lib/router';
import css from './ProductLikeList.module.scss';

@withRouter
@inject('mypageLike')
@observer
class ProductLikeList extends React.Component {
  componentDidMount() {
    if (isBrowser) {
      this.props.mypageLike.getLikeList({
        pageNo: 1,
      });
    }
  }

  handleChangePage = pageNo => {
    this.props.mypageLike.getLikeList({ pageNo: pageNo });
  };

  render() {
    let { mypageLike } = this.props;
    return (
      <MypageLayout
        topLayout={'main'}
        // pageTitle={'마이페이지'}
        headerShape={'mypage'}
      >
        {/* 찜한상품 대시 보드 */}
        <MypageLikeDashboard />

        {mypageLike.totalItemsCount > 0 ? (
          <div className={css.wrap}>
            {mypageLike.likeProductList.map((data, index) => {
              return (
                <LinkRoute
                  href={`/productdetail?deals=${data.dealId}`}
                  key={data.dealId}
                >
                  <a>
                    <SectionItem
                      item={data}
                      likeItemDelete={mypageLike.likeItemDelete}
                    />
                  </a>
                </LinkRoute>
              );
            })}
          </div>
        ) : (
          <MypageDataEmpty text={`찜한 상품이 없습니다.`} />
        )}
      </MypageLayout>
    );
  }
}

export default ProductLikeList;
