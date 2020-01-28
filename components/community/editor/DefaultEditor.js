import React from 'react';
import _ from 'lodash';
import memoize from 'memoize-one';
import css from './DefaultEditor.module.scss';
import { isBrowser } from 'childs/lib/common/isServer';
import { uploadImageFile } from 'childs/lib/API/gateway/fileUploadService';

/**
 * 커뮤니티(BBS에서 사용할 기본 에디터)
 *
 * TODO: 생성, 수정 모드 여부는 query.mode 를 통해 구분 가능. 수정모드라면 query.id로 데이터 가져오기
 *
 * summernote doc(https://summernote.org/deep-dive/)
 */
export default class CommunityDefaultEditor extends React.Component {
  static defaultProps = {
    id: 'summernote-community-default',
    initialContents: '<p></p>',
    onChange: contents => {}, // 에디터 컨텐츠 내용 변경
    onImageUpload: () => {}, // 이미지 업로드
    wrapperStyle: {},
  };

  get summernote() {
    return typeof window.$ === 'function' ? $(`#${this.props.id}`) : {};
  }

  componentDidUpdate(nextProps) {
    // 비동기로 전달받은 초기값도 적용
    this.initEditorContents(this.props.initialContents);
  }

  componentWillUnmount() {
    this.summernote.summernote('destroy');
  }

  /**
   * summernote 초기화
   */
  initSummernote = el => {
    if (isBrowser && !!el) {
      this.summernote.summernote({
        lang: 'ko-KR', // default: 'en-US'
        height: 500, // set editor height
        minHeight: null, // set minimum height of editor
        maxHeight: null, // set maximum height of editor
        focus: true, // set focus to editable area after initializing summernote
        callbacks: {
          onImageUpload: files => {
            // cdn에 이미지 업로드 후 url 받아옴
            uploadImageFile({
              file: files[0],
              uploadPath: ['COMMUNITY', 'BBS'],
            }).then(({ url }) => {
              this.summernote.summernote('insertImage', url, function($image) {
                $image.attr('src', url);
              });
            });
          },
          onChange: _.debounce((contents, $editable) => {
            this.props.onChange(contents);
          }, 400),
        },
      });

      this.initEditorContents(this.props.initialContents);
    }
  };

  /**
   * 에디터 컨텐츠 초기화
   */
  initEditorContents = memoize(initialContents => {
    // 마크업 형태로 넣어야 하기 때문에 'code' 명령어를 사용한다
    this.summernote.summernote('code', initialContents);
  });

  /**
   * 툴바에서 이미지 업로드 콜백
   */
  handleImageUpload = (files, editor, welEditable) => {
    this.summernote.summernote('insertImage', null, files[0]);
  };

  render() {
    return (
      <div className={css.defaultEditor} style={this.props.wrapperStyle}>
        <div id={this.props.id} ref={this.initSummernote} />
      </div>
    );
  }
}
