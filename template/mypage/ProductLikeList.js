import { Component } from 'react';
import { withRouter } from 'next/router';
import MypageLayout from 'components/mypage/MypageLayout';
import MypageLikeDashboard from 'components/mypage/like/MypageLikeDashboard';
import { inject, observer } from 'mobx-react';
import { isBrowser } from 'lib/common/isServer';
import MypageDataEmpty from 'components/mypage/MypageDataEmpty';
import SectionItem from 'components/home/SectionItem';
import { LinkRoute } from 'lib/router';
import css from './ProductLikeList.module.scss';

@withRouter
@inject('mypageLike')
@observer
class ProductLikeList extends Component {
  componentDidMount() {
    if (isBrowser) {
      this.props.mypageLike.getLikeList({
        pageNo: 1,
      });
    }
  }

  handleChangePage = (pageNo) => {
    this.props.mypageLike.getLikeList({ pageNo: pageNo });
  };

  render() {
    let { mypageLike } = this.props;
    return (
      <MypageLayout
        topLayout={'main'}
        pageTitle={'찜한상품'}
        headerShape={'mypageDetail'}
      >
        {/* 찜한상품 대시 보드 */}
        <MypageLikeDashboard />

        {mypageLike.likeProductList.length > 0 ? (
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
