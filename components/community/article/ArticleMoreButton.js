import css from './ArticleMoreButton.module.scss';
import cn from 'classnames';
import SlideUpOptions from '../form/SlideUpOptions';
import useStores from 'stores/useStores';

const optionValue = {
  MODIFY: 'MODIFY',
  DELETE: 'DELETE',
  REPORT: 'REPORT',
};

const authority = {
  ME: 'ME',
  OTHERS: 'OTHERS',
};

// availables
const buttonOptions = [
  { label: '글 수정', value: optionValue.MODIFY, authority: authority.ME },
  { label: '글 삭제', value: optionValue.DELETE, authority: authority.ME },
  { label: '신고하기', value: optionValue.REPORT, authority: authority.OTHERS },
];

/**
 * 게시글 하단 더 보기 (...) 버튼
 */
const ArticleMoreButton = ({
  isMyArticle = false, // 내가 쓴 글인지?
  isCreatedOnMobile = false, // 네이티브 앱에서 작성된 글인지
  onModify = () => {}, // 수정
  onDelete = () => {}, // 삭제
  onReport = () => {}, // 신고하기
}) => {
  const { alert: alertStore } = useStores();

  const handleClickOption = (value) => {
    switch (value) {
      case optionValue.MODIFY:
        if (isCreatedOnMobile) {
          alertStore.showAlert(
            '모바일 앱에서 작성한 글은\n웹에서 수정할 수 없습니다.'
          );
        } else {
          onModify();
        }
        break;

      case optionValue.DELETE:
        onDelete();
        break;

      case optionValue.REPORT:
        onReport();
        break;

      default:
        break;
    }
  };

  const filterButtonsByOwnership = (o) =>
    o.authority === (isMyArticle ? authority.ME : authority.OTHERS);

  // 옵션 버튼
  const options = buttonOptions.filter(filterButtonsByOwnership);

  return (
    <SlideUpOptions
      renderButton={() => {
        return <button className={cn(css.button)} />;
      }}
      onChangeOption={handleClickOption}
      options={options}
      wrapperStyle={{
        display: 'inline-block',
        width: '45px',
      }}
      slideWrapperStyle={{
        width: '140px',
      }}
      topPosOnEnter="55px"
      topPosOnExit="65px"
    />
  );
};

export default ArticleMoreButton;
