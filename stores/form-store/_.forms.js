import Form from './_.extends';

// hooks
import SignupHooks from './hooks/login/SignupHooks';
import SignupSellerHooks from './hooks/login/SignupSellerHooks';
import SignupBusinessHooks from './hooks/login/SignupBusinessHooks';
import SigninHooks from './hooks/login/SigninHooks';
import FindIdMyinfoHooks from './hooks/login/findid/MyinfoHooks';
import FindIdMobileHooks from './hooks/login/findid/MobileHooks';
import FindPasswordMobileHooks from './hooks/login/findpassword/MobileHooks';
import FindPasswordMobileAuthHooks from './hooks/login/findpassword/MobileAuthHooks';
import FindPasswordEmailHooks from './hooks/login/findpassword/EmailHooks';
import FindPasswordResultHooks from './hooks/login/findpassword/ResultHooks';
import TermAgreeHooks from './hooks/login/TermAgreeHooks';
import TermSellerHooks from './hooks/login/TermSellerHooks';
import TermBusinessHooks from './hooks/login/TermBusinessHooks';

import SearchHooks from './hooks/Search';
import ProductAddHooks from './hooks/product/ProductAddHooks';

// forms
import signUp from './setup/login/signup';
import signupseller from './setup/login/signupseller';
import signIn from './setup/login/signin';
import idfind from './setup/login/findid/idfind';
import idfindmobile from './setup/login/findid/idfindmobile';
import findpasswordmobile from './setup/login/findpassword/mobile';
import findpasswordmobileauth from './setup/login/findpassword/mobileauth';
import findpasswordemail from './setup/login/findpassword/email';
import findpasswordresult from './setup/login/findpassword/result';
import termagree from './setup/login/termagree';
import termseller from './setup/login/termseller';
import termbusiness from './setup/login/termbusiness';
import signupbusiness from './setup/login/signupbusiness';

import search from './setup/search';
import productadd from './setup/product/productadd';

// //store
// import { inject, observer } from 'mobx-react';
// import ProductAdd from '../ProductAddStore';
// import RootStore from '../Root';

// login
class TermAgreeForm extends Form {}
class TermSellerForm extends Form {}
class TermBusinessForm extends Form {}

class SignupForm extends Form {}
class SignupSellerForm extends Form {}
class SignupBusinessForm extends Form {}
class SigninForm extends Form {}

class FindIdMyinfoForm extends Form {}

class FindIdMobileForm extends Form {}

class FindPasswordMobileForm extends Form {}
class FindPasswordMobileAuthForm extends Form {}
class FindPasswordEmailForm extends Form {}
class FindPasswordResultForm extends Form {}

// product
class ProductAddForm extends Form {}

// main
class SearchForm extends Form {}
export default {
  productAdd: new ProductAddForm(
    { ...productadd },
    { hooks: ProductAddHooks, name: 'ProductAdd' }
  ),
  search: new SearchForm({ ...search }, { hooks: SearchHooks, name: 'Search' }),
  termAgree: new TermAgreeForm(
    { ...termagree },
    { hooks: TermAgreeHooks, name: 'TermAgree' }
  ),
  termSeller: new TermSellerForm(
    { ...termseller },
    { hooks: TermSellerHooks, name: 'TermSeller' }
  ),
  termBusiness: new TermBusinessForm(
    { ...termbusiness },
    { hooks: TermBusinessHooks, name: 'TermBusiness' }
  ),
  signUp: new SignupForm({ ...signUp }, { hooks: SignupHooks, name: 'SignUp' }),
  signUpSeller: new SignupSellerForm(
    { ...signupseller },
    { hooks: SignupSellerHooks, name: 'SignUpSeller' }
  ),
  signUpBusiness: new SignupBusinessForm(
    { ...signupbusiness },
    { hooks: SignupBusinessHooks, name: 'SignUpBusiness' }
  ),
  signIn: new SigninForm({ ...signIn }, { hooks: SigninHooks, name: 'SignIn' }),
  idFind: new FindIdMyinfoForm(
    { ...idfind },
    { hooks: FindIdMyinfoHooks, name: 'IdFind' }
  ),
  idFindMobile: new FindIdMobileForm(
    { ...idfindmobile },
    { hooks: FindIdMobileHooks, name: 'idFindMobile' }
  ),
  findPasswordMobile: new FindPasswordMobileForm(
    { ...findpasswordmobile },
    { hooks: FindPasswordMobileHooks, name: 'findPasswordMobile' }
  ),
  findPassword0MobileAuth: new FindPasswordMobileAuthForm(
    { ...findpasswordmobileauth },
    { hooks: FindPasswordMobileAuthHooks, name: 'findPasswordMobileAuth' }
  ),
  findPasswordEmail: new FindPasswordEmailForm(
    { ...findpasswordemail },
    { hooks: FindPasswordEmailHooks, name: 'findPasswordEmail' }
  ),
  findPasswordResult: new FindPasswordResultForm(
    { ...findpasswordresult },
    { hooks: FindPasswordResultHooks, name: 'findPasswordResult' }
  ),
};
