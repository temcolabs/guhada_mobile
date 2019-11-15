import Form from './_.extends';

// hooks
import SignupHooks from './hooks/login/SignupHooks';
import SigninHooks from './hooks/login/SigninHooks';
import FindIdMyinfoHooks from './hooks/login/findid/MyinfoHooks';
import FindIdMobileHooks from './hooks/login/findid/MobileHooks';
import FindPasswordMobileHooks from './hooks/login/findpassword/MobileHooks';
import FindPasswordMobileAuthHooks from './hooks/login/findpassword/MobileAuthHooks';
import FindPasswordEmailHooks from './hooks/login/findpassword/EmailHooks';
import FindPasswordResultHooks from './hooks/login/findpassword/ResultHooks';
import TermAgreeHooks from './hooks/login/TermAgreeHooks';
import SearchHooks from './hooks/Search';
import ModifyHooks from 'stores/form-store/hooks/login/luckydraw/ModifyHooks';
import LuckySignupHooks from 'stores/form-store/hooks/login/luckydraw/SignupHooks';
import LuckySigninHooks from 'stores/form-store/hooks/login/luckydraw/SigninHooks';
import LuckySignupSNSHooks from 'stores/form-store/hooks/login/luckydraw/SignupSNSHooks';

// forms
import signUp from './setup/login/signup';
import signIn from './setup/login/signin';
import idfind from './setup/login/findid/idfind';
import idfindmobile from './setup/login/findid/idfindmobile';
import findpasswordmobile from './setup/login/findpassword/mobile';
import findpasswordmobileauth from './setup/login/findpassword/mobileauth';
import findpasswordemail from './setup/login/findpassword/email';
import findpasswordresult from './setup/login/findpassword/result';
import termagree from './setup/login/termagree';

import search from './setup/search';
import signinluckydraw from './setup/login/luckydraw/signin';
import signupluckydraw from './setup/login/luckydraw/signup';
import modifyluckydraw from './setup/login/luckydraw/modify';
import signupsnsluckydraw from './setup/login/luckydraw/signupsns';

export default {
  search: new Form({ ...search }, { hooks: SearchHooks, name: 'Search' }),
  signUp: new Form({ ...signUp }, { hooks: SignupHooks, name: 'SignUp' }),
  termAgree: new Form(
    { ...termagree },
    { hooks: TermAgreeHooks, name: 'TermAgree' }
  ),
  signIn: new Form({ ...signIn }, { hooks: SigninHooks, name: 'SignIn' }),
  idFind: new Form({ ...idfind }, { hooks: FindIdMyinfoHooks, name: 'IdFind' }),
  idFindMobile: new Form(
    { ...idfindmobile },
    { hooks: FindIdMobileHooks, name: 'idFindMobile' }
  ),
  findPasswordMobile: new Form(
    { ...findpasswordmobile },
    { hooks: FindPasswordMobileHooks, name: 'findPasswordMobile' }
  ),
  findPassword0MobileAuth: new Form(
    { ...findpasswordmobileauth },
    { hooks: FindPasswordMobileAuthHooks, name: 'findPasswordMobileAuth' }
  ),
  findPasswordEmail: new Form(
    { ...findpasswordemail },
    { hooks: FindPasswordEmailHooks, name: 'findPasswordEmail' }
  ),
  findPasswordResult: new Form(
    { ...findpasswordresult },
    { hooks: FindPasswordResultHooks, name: 'findPasswordResult' }
  ),
  signInLuckydraw: new Form(
    { ...signinluckydraw },
    { hooks: LuckySigninHooks, name: 'signInLuckydraw' }
  ),
  signUpLuckydraw: new Form(
    { ...signupluckydraw },
    { hooks: LuckySignupHooks, name: 'signUpLuckydraw' }
  ),
  signUpSNSLuckydraw: new Form(
    { ...signupsnsluckydraw },
    { hooks: LuckySignupSNSHooks, name: 'signUpSNSLuckydraw' }
  ),
  modifyLuckydraw: new Form(
    { ...modifyluckydraw },
    { hooks: ModifyHooks, name: 'modifyLuckydraw' }
  ),
};
