import validatorjs from 'validatorjs';
// import validatorjs from '../../js/validatorjs';
import MobxReactForm from 'mobx-react-form';
import dvr from 'mobx-react-form/lib/validators/DVR';

export default class Form extends MobxReactForm {
  plugins() {
    validatorjs.useLang('ko');
    return {
      dvr: dvr({
        package: validatorjs,
        extend: ({ validator, form }) => {
          /**
           * custom rules 및 error text 정의 방법
           * rules 변수 내부에 validation 관련 rule을 정의하시면 됩니다.
           * 그리고 fields를 setup 하는 부분에서 field에 rule을 추가하시면 작동합니다.
           * 이렇게 하시면 따로 validatorjs 파일을 /node_modules에서 빼놓지 않아도 custom error text 정의가 가능합니다.
           *
           * ex)
           *  password: {
           *     rules: 'required|password',
           *  }
           */

          let rules = {
            password: {
              function: function(val) {
                return val.match(
                  /^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/
                );
              },
              message:
                '특수문자, 영문 대소문자 그리고 숫자로 구성되어 있어야 합니다.',
            },
          };

          Object.keys(rules).forEach(key =>
            validator.register(key, rules[key].function, rules[key].message)
          );
        },
      }),
    };
  }

  options() {
    return {
      defaultGenericError: 'Invalid Data',
      autoParseNumbers: true,
      validateOnBlur: false,
      validateOnInit: true,
    };
  }
}
