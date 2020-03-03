import React, { Component } from 'react';
import BBSArticleView from 'template/community/BBSArticleView';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import API from 'childs/lib/API';
import Router from 'next/router';
import isServer from 'childs/lib/common/isServer';
import getIpAddrress from 'childs/lib/common/getIpAddrress';
import striptags from 'striptags';
import { observer, inject } from 'mobx-react';

@inject('bbs')
@observer
class BBSArticleViewPage extends Component {
  static async getInitialProps({ req }) {
    try {
      const articleId = isServer ? req.params?.id : Router?.query.id;

      const { data } = await API.bbs.get(`/bbses/${articleId}`, {
        params: {
          userIp: getIpAddrress(req),
        },
      });

      const articleData = data.data;

      return {
        initialHeadData: BBSArticleViewPage.makeMetaFromArticle(articleData),
        initialState: {
          bbs: {
            article: {
              data: articleData,
            },
          },
        },
      };
    } catch (e) {
      return {};
    }
  }

  static makeMetaFromArticle = articleData => {
    return {
      pageName: articleData.title,
      description: striptags(articleData.contents)
        .replace(/&nbsp;/g, ' ')
        .trim()
        .slice(0, 100)
        .concat('...'),
      image: articleData.imageUrl,
    };
  };

  render() {
    let { initialHeadData, bbs } = this.props;

    // 쿼리스트링만 변경되면서 동적으로 라우트가 변경될 때 getinitialprops가 아닌 store 데이터 사용
    const headData = !!bbs.article?.data
      ? BBSArticleViewPage.makeMetaFromArticle(bbs.article.data)
      : initialHeadData;

    return (
      <div>
        <HeadForSEO
          pageName={headData?.pageName}
          description={headData?.description}
          image={headData?.image}
        />

        <BBSArticleView />
      </div>
    );
  }
}

export default BBSArticleViewPage;
