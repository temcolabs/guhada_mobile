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

@inject('special')
@observer
class specialdetail extends Component {
  static async getInitialProps({ req }) {
    try {
      const eventId = isServer ? req.params?.id : Router.query.id;
      const { data } = await API.settle.get(`/plan/list/detail?`, {
        params: {
          eventId,
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
    const url = document.location.href;
    const id = url.substr(url.lastIndexOf('/') + 1);

    this.props.special.getSpecialDetail({ id });
    window.addEventListener('scroll', this.props.special.listenToScroll);
  }

  componentWillUnmount() {
    window.addEventListener('scroll', this.props.special.listenToScroll);
  }
  render() {
    const { special, headData } = this.props;

    return (
      <>
        <HeadForSEO
          pageName={headData?.pageName || '기획전'}
          description={headData?.description}
          image={headData?.image}
        />
        <div>
          {special.status.detailPage ? <SpecialDetail /> : <LoadingPortal />}
        </div>
      </>
    );
  }
}

export default specialdetail;
