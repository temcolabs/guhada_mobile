import { useEffect } from 'react';
import API from 'childs/lib/API';
import isServer from 'childs/lib/common/isServer';
import sessionStorage from 'childs/lib/common/sessionStorage';
import PaymentLoading from 'components/orderpayment/modal/PaymentLoading';
import { useRouter } from 'next/router';

/**
 * returnUrl dummy page from NAVER_PAY
 * 네이버 페이 결제 후 도달 지점
 * valid일시 최종 결제 POST request 완료 후 orderpayment 완료페이지로 redirect함
 * error일시 기존 장바구니 정보 및 에러메세지와 함께 결제페이지로 redirect함
 */
function DirectPrivyCertifyPage() {
  const router = useRouter();

  useEffect(() => {
    handler();
    return () => {
      sessionStorage.remove('approvalData');
    };
  }, []);

  const handler = () => {
    if (isServer) {
      return;
    }

    const approvalData = sessionStorage.get('approvalData');
    const { cartList, resultCode, paymentId } = router.query;
    const returnUrl = `/orderpayment?cartList=${cartList}&resultMsg=`;

    if (approvalData) {
      Object.assign(approvalData, {
        resultMsg: resultCode,
        cno: paymentId,
        returnUrl,
      });
      API.order
        .post('/order/orderApproval', approvalData)
        .then((res) => {
          const data = res.data.data;
          window.location.href = '/orderpaymentsuccess?id=' + data;
        })
        .catch((err) => {
          sessionStorage.remove('approvalData');
          console.error(
            'privyCertifyResult error at /order/orderApproval',
            err.message
          );
          window.location.href = returnUrl + err.message;
        });
      sessionStorage.remove('approvalData');
    } else {
      sessionStorage.remove('approvalData');
      window.location.href = returnUrl + '결제 오류!';
    }
  };

  return <PaymentLoading isVisible />;
}

DirectPrivyCertifyPage.getInitialProps = (ctx) => {
  if (isServer) {
    // TODO: payment security layer to execute on nextjs server
  }
  return {};
};

export default DirectPrivyCertifyPage;
