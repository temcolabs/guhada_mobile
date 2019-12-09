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

@inject('eventmain')
@observer
class specialdetail extends Component {
  static async getInitialProps({ req }) {
    try {
      const eventId = isServer ? req.params?.id : Router.query.id;
      const { data } = await API.settle.get(`/event/list/detail?`, {
        params: {
          eventId,
        },
      });
      const eventDetail = data.data;

      const headData = {
        pageName: eventDetail.eventTitle,
        description: `구하다 기획전 "${eventDetail.eventTitle}". ${moment(
          eventDetail.eventStartDate
        ).format(`${dateFormat.YYYYMMDD_UI} 부터`)} ${
          !!eventDetail.eventEndDate
            ? moment(eventDetail.eventEndDate).format(
                `${dateFormat.YYYYMMDD_UI} 까지`
              )
            : ''
        }`,
        image: _.get(eventDetail, 'imgUrlM'),
      };

      return {
        headData,
        initialState: {
          eventmain: {
            eventDetail,
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
    this.props.eventmain.getEventDetail(id);
  }
  render() {
    const { eventmain, headData } = this.props;

    return (
      <>
        <HeadForSEO
          pageName={headData?.pageName || '기획전'}
          description={headData?.description}
          image={headData?.image}
        />
        <div>
          {eventmain.status.detailPage ? <SpecialDetail /> : <LoadingPortal />}
        </div>
      </>
    );
  }
}

export default specialdetail;
