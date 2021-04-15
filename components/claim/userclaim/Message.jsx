import css from './Message.module.scss';

const Message = () => {
  return (
    <div className={css.message}>
      <div className={css.message__title}>
        <div className={css.message__title__icon}>!</div>상품 관련
        배송·반품·교환·취소·환불 관련 문의는 <span>판매자 문의</span>를
        이용해주세요.
      </div>
      <ul className={css.message__text}>
        <li>
          상품 관련 문의는 판매자에게 직접 문의하시면 빠르고 정확한 답변이
          가능합니다.
        </li>
        <li>
          문의하신 내역은 마이페이지 &gt; 나의 글 &gt; 문의에서 확인하실 수
          있습니다.
        </li>
      </ul>
    </div>
  );
};

export default Message;
