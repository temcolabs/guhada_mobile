import React from 'react';
import css from './OrderActionButtonConductor.module.scss';
import cn from 'classnames';
import { default as purchaseStatusType } from 'childs/lib/constant/order/purchaseStatus';
import isTruthy from 'childs/lib/common/isTruthy';
import { ORDER_COMPLETE_SAMPLE } from 'childs/lib/constant/order/orderModel';
import useStores from 'stores/useStores';
import { useObserver } from 'mobx-react-lite';

/**
 * 마이페이지에서 사용하는 액션 버튼
 */
export const OrderActionButton = ({
  children,
  className,
  style,
  onClick = () => {},
}) => {
  return (
    <button
      className={cn(css.orderActionButton, className)}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
};

/**
 * 액션 버튼 타입
 */
export const actionType = {
  SHOW_ORDER: 'SHOW_ORDER', // 주문내역 보기
  FIX_ADDRESS: 'FIX_ADDRESS', // 배송지 수정
  CANCEL_ORDER: 'CANCEL_ORDER', // 취소
  SHOW_DELIVERY: 'SHOW_DELIVERY', // 배송 조회
  CONFIRM: 'CONFIRM', // 구매확정
  EXCHANGE: 'EXCHANGE', // 교환
  TRUNING_BACK: 'TRUNING_BACK', // 반품
  WRITE_REVIEW: 'WRITE_REVIEW', // 리뷰 작성
  EDIT_REVIEW: 'EDIT_REVIEW', // 리뷰 수정
};

const actionButtonText = {
  ORDER_INFO: '주문내역',
  CANCEL_INFO: '취소정보',
  EXCHANGE_INFO: '교환정보',
  RETURN_INFO: '반품정보',
  CHECK_RESEND: '재배송 조회',
};

/**
 * 주문 상태에 기반한 액션 버튼
 * TODO: status에 맞게 버튼이 변경되어야 함
 *
 * buttonTypes 배열에 직접 지정해서 렌더링할 수도 있음.
 */
function OrderActionButtonConductor({
  order = ORDER_COMPLETE_SAMPLE,
  isClaim = false, // 취소교환반품 목록에 있는 버튼인지
  isPurchaseStatusVisible = false, // 주문 상태 텍스트를 보여줄 것인지
  buttonTypes = [], // 버튼 타입 배열에 문자열을 담아 전달하면 order 데이터를 무시한다
  wrapperStyle = {
    width: '80px',
  },
  isTest = false, // 무조건 모든 버튼 표시. 테스트용
}) {
  const { orderCompleteList, orderClaimList, myDelivery } = useStores();
  const { purchaseConfirm, reviewId } = order;
  const purchaseStatus = !isClaim ? order?.purchaseStatus : order?.claimStatus;
  const isReviewUploaded = isTruthy(reviewId);

  const ShowOrderButton = (text = actionButtonText.ORDER_INFO) => ({
    order,
  }) => {
    // text = 주문내역, 취소정보, 교환정보, 반품정보
    let action = () => {};

    switch (text) {
      case actionButtonText.ORDER_INFO:
        action = () => orderCompleteList.handleClickShowOrderButton(order);
        break;

      case actionButtonText.CANCEL_INFO:
      case actionButtonText.EXCHANGE_INFO:
      case actionButtonText.RETURN_INFO:
        action = () =>
          orderClaimList.redirectToOrderClaimDetail({
            orderClaimId: order?.orderClaimId,
            orderClaimGroupId: order?.orderClaimGroupId,
          });
        break;

      default:
        break;
    }

    return (
      <OrderActionButton className={css.isColored} onClick={action}>
        {text}
      </OrderActionButton>
    );
  };

  const FixAddressButton = ({ order }) => (
    <OrderActionButton
      onClick={() => orderCompleteList.handleClickEditAddressButton(order)}
    >
      배송지 변경
    </OrderActionButton>
  );

  const CancelOrderButton = ({ order }) => (
    <OrderActionButton
      onClick={() => orderCompleteList.handleClickCancelOrderButton(order)}
    >
      주문 취소
    </OrderActionButton>
  );

  const ShowDeliveryButton = (text = '배송조회') => ({ order }) => (
    <OrderActionButton
      className={css.isColored}
      onClick={() =>
        myDelivery.openDeliveryTrackingModal({
          order,
        })
      }
    >
      {text}
    </OrderActionButton>
  );

  /**
   * 구매 확정 버튼은 주문 배송, 그리고 취소 ・ 교환 ・ 반품 목록에서 사용된다.
   * @param {*} param0
   */
  const ConfirmButton = ({ order }) => (
    <OrderActionButton
      className={css.isColored}
      onClick={() =>
        orderCompleteList.handleClickConfirmOrderButton({
          order,
          onSuccess: isClaim // 취소교환반품에 있는 확정이면
            ? orderClaimList.getMyCancelOrders // 취소목록 새로고침
            : orderCompleteList.getMyOrders,
        })
      }
    >
      구매 확정
    </OrderActionButton>
  );

  const ExchangeButton = ({ order }) => (
    <OrderActionButton
      onClick={() => orderCompleteList.handleClickExchangeOrderButton(order)}
    >
      교환 신청
    </OrderActionButton>
  );

  const TruningBackButton = ({ order }) => (
    <OrderActionButton
      onClick={() => orderCompleteList.handleClickReturnOrderButton(order)}
    >
      반품 신청
    </OrderActionButton>
  );

  const WriteReviewButton = ({ order }) => (
    <OrderActionButton
      className={css.isColored}
      onClick={() => orderCompleteList.handleClickWriteReviewButton(order)}
    >
      리뷰 작성
    </OrderActionButton>
  );

  const EditReviewButton = ({ order }) => (
    <OrderActionButton
      className={css.isColored}
      onClick={() => orderCompleteList.handleClickEditReviewButton(order)}
    >
      리뷰 수정
    </OrderActionButton>
  );

  //취소 철회
  const WithdrawCancelButton = ({ order }) => {
    return (
      <OrderActionButton
        onClick={() => orderCompleteList.handleClickWithdrawCancelButton(order)}
      >
        취소 철회
      </OrderActionButton>
    );
  };

  //반품 신청서 수정
  const EditReturnFormButton = ({ order }) => {
    return (
      <OrderActionButton
        onClick={() => orderCompleteList.handleClickEditReturnFormButton(order)}
      >
        신청서 수정
      </OrderActionButton>
    );
  };

  // 반품 철회
  const WithdrawReturnButton = ({ order }) => {
    return (
      <OrderActionButton
        onClick={() => orderCompleteList.handleClickWithdrawReturnButton(order)}
      >
        반품 철회
      </OrderActionButton>
    );
  };

  // 교환 신청서 수정
  const EditExchangeFormButton = ({ order }) => {
    return (
      <OrderActionButton
        onClick={() =>
          orderCompleteList.handleClickEditExchangeFormButton(order)
        }
      >
        신청서 수정
      </OrderActionButton>
    );
  };
  // 교환 철회
  const WithdrawExchangeButton = ({ order }) => {
    return (
      <OrderActionButton
        onClick={() =>
          orderCompleteList.handleClickWithdrawExchangeButton(order)
        }
      >
        교환 철회
      </OrderActionButton>
    );
  };

  let buttons = []; // 액션 버튼

  if (isTest) {
    buttons = [
      ShowOrderButton(),
      ShowOrderButton(actionButtonText.CANCEL_INFO),
      ShowOrderButton(actionButtonText.EXCHANGE_INFO),
      ShowOrderButton(actionButtonText.RETURN_INFO),
      FixAddressButton,
      CancelOrderButton,
      ShowDeliveryButton(),
      ConfirmButton,
      ExchangeButton,
      TruningBackButton,
      WriteReviewButton,
      EditReviewButton,
      WithdrawCancelButton,
      EditReturnFormButton,
      WithdrawReturnButton,
      EditExchangeFormButton,
      WithdrawExchangeButton,
    ];

    wrapperStyle = {
      position: 'relative',
      width: '90px',
      height: '550px',
    };
  } else if (buttonTypes.length > 0) {
    buttonTypes.forEach(buttonType => {
      // 배열에 지정된 타입의 버튼을 렌더링한다
      switch (buttonType) {
        case actionType.SHOW_ORDER:
          buttons.push(ShowOrderButton());
          break;

        case actionType.FIX_ADDRESS:
          buttons.push(FixAddressButton);
          break;

        case actionType.CANCEL_ORDER:
          buttons.push(CancelOrderButton);
          break;

        case actionType.SHOW_DELIVERY:
          buttons.push(ShowDeliveryButton());
          break;

        case actionType.CONFIRM:
          buttons.push(ConfirmButton);
          break;

        case actionType.EXCHANGE:
          buttons.push(ExchangeButton);
          break;

        case actionType.TRUNING_BACK:
          buttons.push(TruningBackButton);
          break;

        case actionType.WRITE_REVIEW:
          buttons.push(WriteReviewButton);
          break;

        case actionType.EDIT_REVIEW:
          buttons.push(EditReviewButton);
          break;

        default:
          break;
      }
    });
  } else {
    /**
     * UI에서 어떤 버튼을 표시할지는 claimStatus 값과의 조합이 필요함
     * 참조) https://temcolabs.atlassian.net/browse/TECH-898
     */
    switch (purchaseStatus) {
      /**
       * 주문 ~ 결제 ~ 배송완료
       */
      case purchaseStatusType.WAITING_PAYMENT.code: // "입금 대기중"
      case purchaseStatusType.COMPLETE_PAYMENT.code: // "결제 완료"
        buttons = [FixAddressButton, CancelOrderButton];
        break;

      // 상품 준비중
      case purchaseStatusType.SELLER_IDENTIFIED.code: // 주문 확인
      case purchaseStatusType.RELEASE_PRODUCT.code: // 출고
        // https://networksheadquarters.slack.com/archives/CF3K21EV6/p1569477805189400?thread_ts=1569477002.189100&cid=CF3K21EV6
        buttons = []; // 주문 내역은 상단의 주문번호 클릭으로 대체.
        break;

      case purchaseStatusType.DELIVERING.code: // 배송중
      case purchaseStatusType.DELIVERED.code: // 배송 완료
        if (!purchaseConfirm) {
          // 구매 확정 전
          buttons = [
            ShowDeliveryButton(),
            ConfirmButton,
            ExchangeButton,
            TruningBackButton,
          ];
        } else {
          // 구매 확정 후
          if (!isReviewUploaded) {
            // 리뷰 작성 전
            buttons = [ShowDeliveryButton(), WriteReviewButton];
          } else {
            // 리뷰 작성 후
            buttons = [ShowDeliveryButton(), EditReviewButton];
          }
        }
        break;

      /**
       * 취소
       */
      case purchaseStatusType.REQUEST_CANCEL.code: // "취소 요청"
        buttons = [
          // ShowOrderButton(actionButtonText.CANCEL_INFO),
          // ! WithdrawCancelButton, 취소 철회 버튼은 API가 없어 표시하지 않음.
        ];
        break;

      case purchaseStatusType.SALE_CANCEL.code: // "판매 취소"
      case purchaseStatusType.COMPLETE_CANCEL.code: // "취소 완료"
        buttons = [
          // ShowOrderButton(actionButtonText.CANCEL_INFO)
        ];
        break;

      /**
       * 교환
       */
      case purchaseStatusType.REQUEST_EXCHANGE.code: // "교환 요청"
        buttons = [EditExchangeFormButton, WithdrawExchangeButton];
        break;

      case purchaseStatusType.PICKING_EXCHANGE.code: // "교환 수거중"
        buttons = [
          // ShowOrderButton(actionButtonText.EXCHANGE_INFO),
          WithdrawExchangeButton,
        ];
        break;

      case purchaseStatusType.COMPLETE_PICK_EXCHANGE.code: // "교환 수거완료"
        buttons = [
          // ShowOrderButton(actionButtonText.EXCHANGE_INFO)
        ];
        break;

      case purchaseStatusType.RESEND_EXCHANGE.code: // "교환 재배송중"
      case purchaseStatusType.COMPLETE_EXCHANGE.code: // "교환완료"
        if (!purchaseConfirm) {
          // 구매 확정 전
          buttons = [
            ShowDeliveryButton(actionButtonText.CHECK_RESEND),
            ConfirmButton,
          ];
        } else {
          // 구매 확정 후
          if (!isReviewUploaded) {
            // 리뷰 업로드 전
            buttons = [
              ShowDeliveryButton(actionButtonText.CHECK_RESEND),
              WriteReviewButton,
            ];
          } else {
            // 리뷰 업로드 후
            buttons = [
              ShowDeliveryButton(actionButtonText.CHECK_RESEND),
              EditReviewButton,
            ];
          }
        }
        break;

      /**
       * 반품
       */
      case purchaseStatusType.REQUEST_RETURN.code: // "반품 요청"
        buttons = [EditReturnFormButton, WithdrawReturnButton];
        break;

      case purchaseStatusType.PICKING_RETURN.code: // "반품 수거중"
        buttons = [
          ShowOrderButton(actionButtonText.RETURN_INFO),
          WithdrawReturnButton,
        ];
        break;

      case purchaseStatusType.COMPLETE_PICK_RETURN.code: // "반품 수거완료"
      case purchaseStatusType.COMPLETE_RETURN.code: // "반품 완료"
        buttons = [ShowOrderButton(actionButtonText.RETURN_INFO)];
        break;

      default:
        break;
    }
  }

  return useObserver(() => (
    <div className={css.wrap} style={wrapperStyle}>
      {buttons.map((ActionButton, index) => {
        return <ActionButton key={index} order={order} />;
      })}
    </div>
  ));
}

export default OrderActionButtonConductor;
