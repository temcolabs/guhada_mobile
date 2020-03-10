import React, { Component } from 'react';
import SpecialDetail from 'template/event/SpecialDetail';
import LoadingPortal from 'components/common/loading/Loading';
import { observer, inject } from 'mobx-react';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import API from 'childs/lib/API';
import isServer from 'childs/lib/common/isServer';
import Router from 'next/router';
import _ from 'lodash';
import moment from 'moment';
import { dateFormat } from 'childs/lib/constant';
import { isBrowser } from 'childs/lib/common/isServer';
@inject('special', 'searchitem')
@observer
class specialdetail extends Component {
  static async getInitialProps({ req }) {
    try {
      const eventId = isServer ? req.params?.id : Router.query.id;
      const { data } = await API.settle.get(`/plan/list/detail?`, {
        params: {
          eventId,
          page: 1,
          searchProgress: 'DATE',
        },
      });
      const specialDetail = data.data;

      const headData = {
        pageName: specialDetail.eventTitle,
        description: `구하다 기획전 "${specialDetail.eventTitle}". ${moment(
          specialDetail.eventStartDate
        ).format(`${dateFormat.YYYYMMDD_UI} 부터`)} ${
          !!specialDetail.eventEndDate
            ? moment(specialDetail.eventEndDate).format(
                `${dateFormat.YYYYMMDD_UI} 까지`
              )
            : ''
        }`,
        image: _.get(specialDetail, 'imgUrlM'),
      };

      return {
        headData,
        initialState: {
          special: {
            specialDetail,
          },
        },
      };
    } catch (error) {
      return {};
    }
  }

  componentDidMount() {
    const { special } = this.props;
    const query = Router.router.query;
    if (query.category === undefined) {
      special.toSearch({ eventIds: query.id });
    }

    if (isBrowser) {
      special.eventId = query.id;
      special.getSpecialDetail({ id: query.id });
      special.getSpecialDeal();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const query = Router.router;
    if (!_.isEqual(prevProps.searchitem.preUrl, query.asPath)) {
      const { special } = this.props;
      const category = Router.router.query.category;
      if (category === undefined) {
        special.toSearch({ eventIds: query.router.id });
      }
      if (isBrowser) {
        special.getSpecialDeal();
      }
    }
  }

  componentWillUnmount() {
    const { special } = this.props;
    special.eventId = '';
  }
  render() {
    const { searchitem, headData } = this.props;

    return (
      <>
        <HeadForSEO
          pageName={headData?.pageName || '기획전'}
          description={headData?.description}
          image={headData?.image}
        />
        <div>
          {searchitem.itemStatus ? (
            <SpecialDetail
              searchitem={searchitem}
              items={searchitem.deals}
              countOfDeals={searchitem.countOfDeals}
            />
          ) : (
            <LoadingPortal />
          )}
        </div>
      </>
    );
  }
}

export default specialdetail;
