import React, { useState, useEffect, useMemo, useCallback } from 'react';
import _ from 'lodash';
import CommunityLayout from 'components/community/CommunityLayout';
import css from './BBSEditor.module.scss';
import cn from 'classnames';
import DefaultEditor from 'components/community/editor/DefaultEditor';
import AdBanner from 'components/community/AdBanner';
import CommunityContentWrap from 'components/community/CommunityContentWrap';
import BoardSelector from 'components/community/editor/BoardSelector';
import BrandSearch from 'components/community/editor/BrandSearch';
import DealSearch from 'components/community/editor/DealSearch';
import TempArticleButton from 'components/community/editor/TempArticleButton';
import TextInput from 'components/community/form/TextInput';
import CategoryFilterSelector from 'components/community/editor/CategoryFilterSelector';
import { useBBSStore } from 'stores/bbs';
import { compose } from 'lodash/fp';
import { withRouter } from 'next/router';
import { observer, useObserver } from 'mobx-react';
import ArticlePreviewModal from 'components/community/article/ArticlePreviewModal';
import useStores from 'stores/useStores';
import { Form, Field } from 'react-final-form';
import {
  composeValidators,
  required,
  notEmptyString,
  mustBeNumber,
} from 'childs/lib/common/finalFormValidators';
import { devLog, devGroup, devGroupEnd } from 'childs/lib/common/devLog';
import isTruthy from 'childs/lib/common/isTruthy';
import { pushRoute } from 'childs/lib/router';
import striptags from 'striptags';
import categoryViewType from 'childs/lib/constant/community/categoryViewType';
import Router from 'next/router';

const enhancer = compose(withRouter, observer);

/**
 * 게시글 작성
 */
function BBSEditor({ router }) {
  const {
    article: articleStore,
    category: categoryStore,
    categoryFilter: categoryFilterStore,
    tempArticle: tempArticleStore,
  } = useBBSStore();

  const { user: userStore, alert: alertStore } = useStores();

  const { allCategoryOptions } = categoryStore;
  const { categoryFilterOptions } = categoryFilterStore;

  // 작성중인 게시글 미리보기 컨트롤
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // 게시글에 적용한 임시글 아이디
  const [tempArticleIdInUse, setTempArticleIdInUse] = useState(null);

  const articleId = parseInt(router.query.articleId, 10) || null;
  const isUpdate = isTruthy(articleId);

  const toggleIsPreviewModalOpen = () => {
    setIsPreviewModalOpen((isOpen) => !isOpen);
  };

  const defaultInitialValues = useMemo(
    () => ({
      categoryId: null, // 게시판
      categoryFilterId: null, // 게사판별 필터
      title: '', // 제목
      contents: '', // 본문 마크업
      brandId: null, // 상품 정보
      brandName: '',
      dealId: null,
      dealName: '',
      imageUrl: '', // * 대표 이미지. 데스크탑에서는 현재 직접 지정하지 않는다
      // delete: false, // 삭제됨 여부. 등록시에는 수정 불필요
      // use: true, // 노출 여부
    }),
    []
  );

  // 폼 필드
  const fields = {
    categoryId: 'categoryId', // 게시판
    categoryFilterId: 'categoryFilterId', // 게사판별 필터
    title: 'title', // 제목
    contents: 'contents', // 본문 마크업
    brandId: 'brandId', // 상품 정보
    brandName: 'brandName',
    dealId: 'dealId',
    dealName: 'dealName',
    imageUrl: 'imageUrl', // 대표 이미지
    // delete: false, // 삭제됨 여부. 등록시에는 수정 불필요
    // use: true, // 노출 여부
  };

  // 필드 유효성 검사
  const validators = useMemo(() => {
    return {
      // 게시판
      categoryId: composeValidators(required),

      // 카테고리 필터 옵션. 필터 옵션이 없다면 필수값이 아니다
      get categoryFilterId() {
        return categoryFilterStore.categoryFilterOptions.length > 0
          ? composeValidators(required, mustBeNumber)
          : undefined;
      },

      // 제목
      title: composeValidators(notEmptyString),

      // 본문
      contents: ({ category }) => {
        return composeValidators((c) => notEmptyString(striptags(c, ['img'])));
      },

      brandName: ({ isRequired }) => {
        return isRequired ? required : undefined;
      },
      dealName: ({ isRequired }) => {
        return isRequired ? required : undefined;
      },

      // ! brandId, dealId는 실제 상품 검색이 들어갔을 때 추가
      // brandId: composeValidators(),
      // dealId: composeValidators(),

      // imageUrl: composeValidators(),
      // delete: composeValidators(mustBeBoolean),
      // use: composeValidators(mustBeBoolean),
    };
  }, [categoryFilterStore.categoryFilterOptions.length]);

  // 폼 초기값
  const [initialValues, setInitialValues] = useState(defaultInitialValues);

  /**
   * 페이지 로딩시 카테고리 목록을 가져왔는지 확인하고, 첫번째 항목을 기본값으로 설정한다.
   * 게시글 수정모드라면 저장된 게시글로 에디터를 초기화한다.
   */
  categoryStore.getCommunities();

  useEffect(() => {
    const initEditorState = async () => {
      try {
        const categoryId =
          parseInt(router.query.categoryId, 10) || // 쿼리스트링에 있는 값을 우선한다
          categoryStore.allCategories[0].id;

        await categoryFilterStore.getCategoryFilters(categoryId);

        const categoryFilterId =
          categoryFilterStore.categoryFilters.length > 0
            ? categoryFilterStore.categoryFilters[0].id
            : null;

        // 에디터 초기값 기본 카테고리와 필터
        let initialValuesOnMount = {
          categoryId,
          categoryFilterId,
        };

        // 게시글 수정이라면 저장된 데이터를 가져온다
        if (isUpdate && articleId !== articleStore.data.id) {
          const articleData = await articleStore.getArticle({ id: articleId });

          await categoryFilterStore.getCategoryFilters(articleData.categoryId);

          userStore.pushJobForUserInfo(() => {
            // 내가 작성한 글인지 확인
            if (userStore.userId !== articleData.userId) {
              alertStore.showAlert({
                content: '내가 작성한 글만 수정할 수 있습니다.',
                onConfirm: () => {
                  pushRoute(`/community/board/${articleData.categoryId}`);
                },
              });
            } else {
              devLog('set initialValues');

              initialValuesOnMount = Object.assign({
                ...initialValuesOnMount,
                categoryId: articleData.categoryId,
                categoryFilterId: articleData.categoryFilterId,
                title: articleData.title,
                contents: articleData.contents,
                brandId: articleData.brandId,
                brandName: articleData.brandName,
                dealId: articleData.dealId,
                dealName: articleData.dealName,
              });
            }
          });
        }

        setInitialValues((prevInit) => ({
          ...prevInit,
          ...initialValuesOnMount,
        }));
      } catch (e) {
        console.error(e);
      }
    };

    categoryStore.pushJobForCategory(initEditorState);
  }, [
    alertStore,
    articleId,
    articleStore,
    categoryFilterStore,
    categoryStore,
    isUpdate,
    router.query.categoryId,
    userStore,
  ]);

  /**
   * 게시판(categoryId) 선택
   * 게시판에 맞는 필터를 가져온다. 필터가 있으면 첫번째 항목으로 에디터의 상태를 변경한다
   */
  const handleChangeCategory = useCallback(
    ({ categoryId, formApi }) => {
      formApi.change(fields.categoryId, categoryId);

      // 선택한 게시판의 카테고리
      categoryFilterStore.getCategoryFilters(categoryId).then(() => {
        const categoryFilterId =
          categoryFilterStore.categoryFilterOptions[0]?.value || null;

        formApi.change(fields.categoryFilterId, categoryFilterId);

        // 초기값 업데이트
        setInitialValues({
          ...formApi.getState().values, // defaultInitialValues를 사용하면 작성중인 컨텐츠가 날아가 버린다
          categoryId,
          categoryFilterId,
        });
      });
    },
    [categoryFilterStore, fields.categoryFilterId, fields.categoryId]
  );

  /**
   * 임시저장한 글 선택. initialValues 업데이트.
   * 임시저장 글에는 카테고리, 필터 데이터가 없다.
   *
   */
  const handleClickTempArticle = ({ data }) => {
    devLog('handleClickTempArticle', data);

    // 저장된 값으로 초기화
    setInitialValues((prevInitial) => ({
      ...prevInitial,
      title: data.title,
      contents: data.contents,
      brandId: data.brandId,
      brandName: data.brandName,
      dealId: data.dealId,
      dealName: data.dealName,
    }));

    // 현재 작성중인 데이터가 임시 저장된 글임을 명시
    setTempArticleIdInUse(data.id);
  };

  /**
   * 작성중인 글 임시저장
   */
  const handleSaveTempArticle = ({ values } = {}) => {
    alertStore.showConfirm({
      content: '임시 저장하시겠습니까?',
      onConfirm: async () => {
        tempArticleStore.saveTempArticle({
          data: {
            title: values.title,
            contents: values.contents,
            brandId: values.brandId,
            brandName: values.brandName,
            dealId: values.dealId,
            dealName: values.dealName,
          },
          tempArticleId: tempArticleIdInUse,
          onSuccess: async () => {
            try {
              await tempArticleStore.getTempArticles();

              // 새로고침한 목록 첫번째가 새로 추가한 임시저장 글.
              const savedArticle = tempArticleStore.list[0];

              setTempArticleIdInUse(savedArticle.id);
            } catch (e) {
              console.error(e);
            }
          },
        });
      },
    });
  };

  /**
   * 임시글 목록에서 삭제
   */
  const handleShowDeleteTempArticleConfirm = (id) => {
    alertStore.showConfirm({
      content: '임시 저장된 글을 삭제하시겠습니까?',
      onConfirm: () => {
        tempArticleStore.deleteTempArticle({
          id,
        });
      },
    });
  };

  /**
   * 작성 과정에서 사용한 임시글 삭제
   */
  const deleteTempArticleUsed = useCallback(
    (id) => {
      if (id) {
        tempArticleStore.deleteTempArticle({
          id,
          onSuccess: () => {
            setTempArticleIdInUse(null);
          },
        });
      }
    },
    [tempArticleStore]
  );

  /**
   * 게시판이 이미지를 필수로 요구하는지 확인
   */
  const validateContentsRequiresImage = useCallback(
    (values = {}) => {
      const { contents, categoryId } = values;

      if (contents && categoryId) {
        // 이미지 필수 게시판 확인. 모달로 알림을 표시하기 위해 form validator에서 확인한다
        const categorySelected = categoryStore.getCategoryById(categoryId);

        if (categorySelected.type === categoryViewType.IMAGE) {
          // 본문에 이미지 태그와 src 속성에 이미지 URL이 할당되어 있는지
          if (
            /img[\w\d\s="':;%-]*src="(https?:)([/\w\d\s.]+)"/.test(contents) ===
            false
          ) {
            alertStore.showAlert({
              content: () => (
                <div>
                  {categorySelected.name} 게시판은 <br /> 1개 이상의 이미지를
                  첨부해야 합니다.
                </div>
              ),
            });

            return true;
          } else {
            return undefined;
          }
        } else {
          return undefined;
        }
      }

      return undefined;
    },
    [alertStore, categoryStore]
  );

  // 폼 submit
  const handleSubmit = useCallback(
    (values) => {
      // 에러 모달을 표시할 밸리데이터를 실행한다.
      const hasNoWarningModal = !validateContentsRequiresImage(values);

      if (hasNoWarningModal) {
        if (isUpdate) {
          // 수정
          articleStore.updateArticle({
            articleId,
            body: values,
            onSuccess: () => {
              deleteTempArticleUsed(tempArticleIdInUse);

              alertStore.showAlert({
                content: '게시글이 수정되었습니다.',
                onConfirm: () => {
                  pushRoute(`/community/article/${articleId}`);
                },
              });
            },
          });
        } else {
          articleStore.createArticle({
            body: values,
            isModify: true,
            onSuccess: () => {
              deleteTempArticleUsed(tempArticleIdInUse);

              alertStore.showAlert({
                content: '게시글이 등록되었습니다.',
                onConfirm: () => {
                  pushRoute(`/community/board/${values.categoryId}`);
                },
              });
            },
          });
        }
      }
    },
    [
      alertStore,
      articleId,
      articleStore,
      deleteTempArticleUsed,
      isUpdate,
      tempArticleIdInUse,
      validateContentsRequiresImage,
    ]
  );

  const printFormLog = _.debounce((formApi) => {
    const { values, initialValues, errors } = formApi.getState();

    devGroup('BBSEditor');
    devLog('form values', values);
    devLog('initial values', initialValues);
    devLog('errors', errors);
    devGroupEnd('BBSEditor');
  }, 400);

  return useObserver(() => (
    <div>
      {/* 광고 */}
      {/* <AdBanner /> */}

      <Form
        initialValues={initialValues}
        onSubmit={handleSubmit}
        render={({ handleSubmit, form: formApi }) => {
          printFormLog(formApi);

          const { values } = formApi.getState();
          let categorySelected = categoryStore.getCategoryById(
            values[fields.categoryId]
          );

          return (
            <form onSubmit={handleSubmit}>
              <CommunityContentWrap>
                {/* 게시판(카테고리) 선택 */}
                <div className={css.editorHeader}>
                  <button
                    className={css.cancelButton}
                    onClick={() =>
                      pushRoute(
                        `/community/board/${categorySelected.communityId}`
                      )
                    }
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    className={css.tempSave}
                    onClick={() => handleSaveTempArticle({ values })}
                  >
                    임시
                  </button>
                  <Field
                    name={fields.categoryId}
                    validate={validators.categoryId}
                  >
                    {({ input, meta }) => (
                      <BoardSelector
                        initialValue={meta.initial}
                        options={allCategoryOptions}
                        onChange={(value) => {
                          handleChangeCategory({ categoryId: value, formApi });
                        }}
                      />
                    )}
                  </Field>
                  <button type="submit" className={css.submitButton}>
                    {isUpdate ? '수정' : '등록'}
                  </button>
                </div>

                <div className={css.articleTitle}>
                  <div className={css.articleTitle_category}>
                    {/* 카테고리 필터 */}
                    <Field
                      name={fields.categoryFilterId}
                      validate={validators.categoryFilterId}
                    >
                      {({ input, meta }) => (
                        <div>
                          <CategoryFilterSelector
                            initialValue={meta.initial}
                            onChange={input.onChange}
                            options={categoryFilterOptions}
                            placeholder="카테고리 필터"
                          />
                          {meta.submitFailed && (
                            <span className={css.errorMessage}>
                              {meta.error}
                            </span>
                          )}
                        </div>
                      )}
                    </Field>
                  </div>
                  <div className={css.articleTitle_title}>
                    {/* 제목 */}
                    <Field name={fields.title} validate={validators.title}>
                      {({ input, meta }) => (
                        <div>
                          <TextInput
                            initialValue={meta.initial}
                            onChange={input.onChange}
                            placeholder="제목을 입력해주세요"
                          />
                          {meta.submitFailed && (
                            <span className={css.errorMessage}>
                              {meta.error}
                            </span>
                          )}
                        </div>
                      )}
                    </Field>
                  </div>
                </div>

                {/* 에디터 */}
                <Field
                  name={fields.contents}
                  validate={validators.contents({ category: categorySelected })}
                >
                  {({ input, meta }) => (
                    <div>
                      <DefaultEditor
                        initialContents={meta.initial}
                        onChange={input.onChange}
                        wrapperStyle={{ marginTop: '0' }}
                      />
                      {meta.submitFailed && (
                        <span className={css.errorMessage}>{meta.error}</span>
                      )}
                    </div>
                  )}
                </Field>

                {/* 브랜드, 상품 검색 */}
                {/* 현재 검색이 아니라 단순 텍스트 입력으로 구현되어 있다 */}

                {/* TODO: editorState.isDealSearchVisible */}
                {/* HIDE : TECH-7209 
                <div className={css.brandAndProduct}>
                  <div className={css.brandAndProduct_row}>
                    {categorySelected.visibleProductSearch && (
                      <div className={css.brandAndProduct_searchItem}>                        
                        <div className={css.brandAndProduct_searchComponent}>
                          <Field
                            name={fields.brandName}
                            validate={validators.brandName({
                              isRequired:
                                categorySelected.requiredProductSearch,
                            })}>
                            {({ input, meta }) => (
                              <BrandSearch
                                initialBrandName={meta.initial}
                                onChangeBrandName={input.onChange}
                              />
                            )}
                          </Field>
                        </div>
                      </div>
                    )}
                    {categorySelected.visibleProductSearch && (
                      <div className={css.brandAndProduct_searchItem}>                        
                        <div className={css.brandAndProduct_searchComponent}>
                          <Field
                            name={fields.dealName}
                            validate={validators.dealName({
                              isRequired:
                                categorySelected.requiredProductSearch,
                            })}>
                            {({ input, meta }) => (
                              <DealSearch
                                initialDealName={meta.initial}
                                onChangeDealName={input.onChange}
                              />
                            )}
                          </Field>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                */}

                {/* 임시저장  */}
                <TempArticleButton
                  onClickTempArticle={handleClickTempArticle}
                  onDeleteTempArticle={handleShowDeleteTempArticleConfirm}
                  wrapperStyle={{ marginTop: '0px' }}
                />
                {/* <div className={css.submitButtonWrap}>
                  <button
                    type="button"
                    className={css.submitButton}
                    onClick={() => handleSaveTempArticle({ values })}
                  >
                    임시저장
                  </button>
                  <button
                    type="button"
                    className={css.submitButton}
                    onClick={toggleIsPreviewModalOpen}
                  >
                    미리보기
                  </button>
                  <button
                    type="submit"
                    className={cn(css.submitButton, css.purple)}
                  >
                    {isUpdate ? '수정하기' : '등록하기'}
                  </button>
                </div> */}
              </CommunityContentWrap>

              {/* 게시글 미리보기  */}
              {isPreviewModalOpen && (
                <ArticlePreviewModal
                  isOpen={isPreviewModalOpen}
                  onClose={toggleIsPreviewModalOpen}
                  title={values.title}
                  categoryName={
                    categoryStore.getCategoryById(values.categoryId)?.name
                  }
                  categoryFilterName={
                    categoryFilterStore.getCategoryFilterById(
                      values.categoryFilterId
                    )?.name
                  }
                  commentCount={0}
                  hitCount={0}
                  likeCount={0}
                  userName={userStore.userInfo?.nickname}
                  contents={formApi.getState().values?.contents}
                />
              )}
            </form>
          );
        }}
      />
    </div>
  ));
}

export default enhancer(BBSEditor);
