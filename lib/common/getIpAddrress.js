/**
 * 서버 리퀘스트 객체로부터 ip를 가져온다
 * @param {express req object} req
 */
export default function getIpAddrress(req = {}) {
  const ip =
    req.headers['x-forwarded-for'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress;

  return ip;
}
