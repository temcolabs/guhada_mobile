import React from 'react';
import css from './MyBBS.module.scss';
import cn from 'classnames';
import { inject, observer } from 'mobx-react';
import { pushRoute } from 'childs/lib/router';
import MyArticles from './MyArticles';
import MyBookmarks from './MyBookmarks';
import LoginNoti from './LoginNoti';
import { withRouter } from 'next/router';
import { devWarn } from 'childs/lib/common/devLog';

const tab = {
  WRITING: 'WRITING', // 나의 활동
  BOOKMARK: 'BOOKMARK', // 북마크
};

/**
 * 사이드바 내 글 정보
 */
@withRouter
@inject('user', 'login')
@observer
class MyBBS extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      tab: tab.WRITING,
    };
  }

  handleClickTab = tab => () => {
    this.setState({ tab });
  };

  handleClickWrite = () => {
    if (this.props.router.asPath.indexOf('/community/editor') < 0) {
      pushRoute(`/community/editor`, {
        query: {
          categoryId: this.props.router.query.categoryId,
        },
      });
    } else {
      devWarn('글쓰기 페이지에서는 동작하지 않음');
    }
  };

  renderMyBBS = () => {
    return (
      <div>
        <div className={css.myBbsProfileWrapper}>
          <div
            className={css.avatar}
            style={{
              backgroundImage: this.props.user.userInfo?.profileImageUrl
                ? `url(${this.props.user.userInfo?.profileImageUrl})`
                : null,
            }}
          />
          <div className={css.userInfo}>
            <div className={css.userInfo_nickname}>
              <b>{this.props.user.userInfo?.nickname}</b>
              <span>님</span>
            </div>

            {/* TODO: 멤버 등급 */}
            {/* <div className={css.userInfo_memberGrade}>
              <span className={css.memberGrade_no}>1</span>
              <span className={css.memberGrade_text}>GRADE</span>
            </div> */}
          </div>
        </div>

        <div className={css.tabContainer}>
          <button
            className={cn({
              [css.isSelected]: this.state.tab === tab.WRITING,
            })}
            onClick={this.handleClickTab(tab.WRITING)}
          >
            내가 쓴 글
          </button>
          <button
            className={cn({
              [css.isSelected]: this.state.tab === tab.BOOKMARK,
            })}
            onClick={this.handleClickTab(tab.BOOKMARK)}
          >
            북마크
          </button>
        </div>

        <div className={css.myContentContainer}>{this.renderMyContents()}</div>

        <button className={css.writeButton} onClick={this.handleClickWrite}>
          <span>글쓰기</span>
        </button>
      </div>
    );
  };

  /**
   * 내 글, 댓글, 북마크 중에 현재 탭에 맞는 내용을 렌더링한다
   * 데이터 가져오기는 탭 선택시 실행한다.
   */
  renderMyContents = () => {
    switch (this.state.tab) {
      case tab.WRITING:
        return <MyArticles />;

      case tab.BOOKMARK:
        return <MyBookmarks />;

      default:
        return null;
    }
  };

  render() {
    const { login } = this.props;
    return (
      <div className={css.wrap}>
        {login.isLoginProcessDone ? (
          login.isLoggedIn ? (
            this.renderMyBBS()
          ) : (
            <LoginNoti />
          )
        ) : null}
      </div>
    );
  }
}

export default MyBBS;
