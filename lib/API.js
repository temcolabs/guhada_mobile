const axios = require('axios');
const Cookies = require('js-cookie');
const omit = require('lodash/omit');
const get = require('lodash/get');
const moment = require('moment');
const Router = require('next/router');
const qs = require('qs');
const key = require('../constant/key');
const merge = require('lodash/merge');
const _ = require('lodash');
const getGuhadaCustomHeaders = require('./getGuhadaCustomHeaders');
// const devLog = require('../lib/devLog');

/**
 * 마이크로 서비스에 사용할 수 있는 커스텀 인스턴스.
 *
 * ex) 유저 API 호출
 * API.user.get('/users/1234')
 *
 * error interceptor를 사용해서 인증에 오류가 발생하면 refreshToken으로 accessToken을 재발급
 */
class ApiFactory {
  constructor() {
    this.DEFAULT_HEADERS = {
      'Content-Type': 'application/json',
    };
    this.axios = null;
    this.headers = {};
    this.baseURL = process.env.API_PRODUCT_URL; // 기본 baseURL은 상품 API

    this.initInstance();
  }

  /**
   * axios config
   */
  get config() {
    return {
      baseURL: this.baseURL,
      headers: this.headers,
      timeout: 10000,
    };
  }

  /**
   * 헤더를 완전히 대체
   * @param {*} header
   */
  setHeaders(header = {}) {
    this.headers = Object.assign({}, this.DEFAULT_HEADERS, header);
  }

  // 헤더 객체 덮어씌움
  addHeaders(header = {}) {
    this.headers = Object.assign(this.headers, header);
  }

  // 헤더에서 특정 키 제거
  omitHeaders(keys = []) {
    for (const key of keys) {
      this.headers = omit(this.headers, key);
    }
  }

  /**
   * axios instance 최초 생성
   */
  initInstance() {
    this.setHeaders(this.DEFAULT_HEADERS);

    const accessToken = Cookies.get(key.ACCESS_TOKEN);
    if (!!accessToken) {
      this.addAuthHeader(accessToken);
    }

    // 인증 헤더 붙여서 인스턴스 생성
    this.createInstance();
  }

  /**
   * 새로운 axios 인스턴스 생성
   */
  createInstance() {
    this.axios = axios.create(this.config);

    // request interceptor
    this.axios.interceptors.request.use(
      async config => {
        console.log('[axios.interceptors.request]', config.headers);

        return merge(config, {
          headers: merge(config.headers, await getGuhadaCustomHeaders()),
        });
      },
      error => {
        return Promise.reject(error);
      }
    );

    // response interceptor
    this.axios.interceptors.response.use(
      response => {
        const guhadaResultCode = _.get(response, 'data.resultCode');

        // resultCode가 있다면 확인한다
        if (!!guhadaResultCode) {
          // resultCode가 200이면 성공, 아니라면 catch 블럭에서 잡을 수 있도록 Promise.reject
          if (guhadaResultCode === 200) {
            return response;
          } else {
            console.error(
              `resultCode is ${response.data.resultCode} at ${_.get(
                response,
                'request.responseURL'
              )}`
            );

            return Promise.reject(response);
          }
        } else {
          // resultCode가 없다면 결과를 그대로 넘긴다
          return response;
        }
      },
      err => {
        this.createGuhadaServerError(err.response);

        // TODO: accessToken 인증 오류 status 코드 확인
        if (
          get(err, 'response.status') === 401 &&
          Cookies.get(key.REFRESH_TOKEN)
        ) {
          // devLog('access token expired. refresh starts.');

          this.refreshAccessToken().then(res => {
            // 토큰 재발급에 성공하면 실패한 요청을 다시 호출한다
            // devLog(`axios error interceptors`);
            return axios.request(err.config);
          });
        } else {
          // devLog(`axios error interceptors`);
          return Promise.reject(err);
        }
      }
    );
  }

  /**
   * 인증 토큰을 헤더에 추가
   * 쿠키에 저장
   * 인스턴스 재생성
   *
   * @param {} accessToken
   * @param {} refreshToken
   * @param {} expiresIn 유효기간
   */
  updateAccessToken({ accessToken, expiresIn, refreshToken }) {
    this.saveAuthTokens({ accessToken, expiresIn, refreshToken });
    this.addAuthHeader(accessToken);
    // 인증 헤더 붙여서 인스턴스 생성
    this.createInstance();
  }

  addAuthHeader(accessToken) {
    this.addHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
  }

  /**
   * TODO: refreshToken으로 accessToken 재발급
   */
  refreshAccessToken() {
    return new Promise((resolve, reject) => {
      const refreshToken = Cookies.get(key.REFRESH_TOKEN);

      this.user
        .post(
          `/oauth/token`,
          qs.stringify({
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
            scope: 'read',
          }),
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
          }
        )
        .then(res => {
          const { data } = res;
          const { accessToken, expiresIn, refreshToken } = data.data;

          this.updateAccessToken({
            accessToken,
            expiresIn,
            refreshToken,
          });

          resolve({ accessToken, refreshToken, expiresIn });
        })
        .catch(err => {
          // 토큰 갱신에 실패했으므로 로그인으로 보낸다.
          // refreshToken도 만료되었다면, 로그인을 다시 해야 한다.
          // devLog('refresh token expired. redirect to login');
          this.removeAccessToken();
          Router.push(`/login/login`, '/login');
          reject();
        });
    });
  }

  saveAuthTokens({ accessToken, expiresIn, refreshToken }) {
    if (window.location.hostname === 'localhost') {
      Cookies.set(key.ACCESS_TOKEN, accessToken, {
        expires: moment()
          .add(expiresIn, 'seconds')
          .toDate(),
      });

      Cookies.set(key.REFRESH_TOKEN, refreshToken, {
        expires: moment()
          .add(1, 'day')
          .toDate(),
      });
    } else {
      // subdomain 간의 쿠키 공유를 위한 코드
      Cookies.set(key.ACCESS_TOKEN, accessToken, {
        expires: moment()
          .add(expiresIn, 'seconds')
          .toDate(),
        domain: '.guhada.com',
      });

      Cookies.set(key.REFRESH_TOKEN, refreshToken, {
        expires: moment()
          .add(1, 'day')
          .toDate(),
        domain: '.guhada.com',
      });
    }
  }

  /**
   * access token 제거.
   */
  removeAccessToken() {
    Cookies.remove(key.ACCESS_TOKEN);
    Cookies.remove(key.REFRESH_TOKEN);
    Cookies.remove(key.ACCESS_TOKEN, { domain: '.guhada.com' });
    Cookies.remove(key.REFRESH_TOKEN, { domain: '.guhada.com' });
    this.omitHeaders(['Authorization']);
    this.createInstance();
  }

  createGuhadaServerError(response) {
    const resultCode =
      _.get(response, 'data.resultCode') || _.get(response, 'data.status');
    const message = _.get(response, 'data.message');
    const responseURL = _.get(response, 'request.responseURL');

    console.error(
      `[GUHADA API] ${!!resultCode ? `${resultCode} ` : ''}${
        !!message ? `"${message}"` : ''
      } at ${_.get(response, 'config.method') || ''} ${responseURL}`
    );
  }

  get user() {
    return this.getApiInstance(process.env.API_USER);
  }

  get product() {
    return this.getApiInstance(process.env.API_PRODUCT_URL);
  }

  get search() {
    return this.getApiInstance(process.env.API_SEARCH);
  }

  get order() {
    return this.getApiInstance(process.env.API_ORDER);
  }

  get claim() {
    return this.getApiInstance(process.env.API_CLAIM);
  }

  get benefit() {
    return this.getApiInstance(process.env.API_BENEFIT);
  }

  get cloud() {
    return this.getApiInstance(process.env.API_CLOUD);
  }

  getApiInstance(baseURL) {
    if (this.baseURL !== baseURL) {
      // baseURL이 다르면 인스턴스를 새로 만든다.
      this.baseURL = baseURL;
      this.createInstance();
    }

    return this.axios;
  }
}

// 앱 전역에서 싱글 인스턴스만 사용하기 위함.
const API = new ApiFactory();

module.exports = API;
