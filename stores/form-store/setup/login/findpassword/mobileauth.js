import hooks from "../../../hooks/login/findid/MobileHooks";
import customOption from "../../customOption";
export default {
  fields: {
    name: {
      name: "name",
      label: "name",
      placeholder: "이름"
    },
    birthday: {
      type: "tel",
      name: "birthday",
      label: "birthday",
      placeholder: "생년월일 (예:19990101)"
    },
    mobile: {
      type: "tel",
      name: "mobile",
      label: "mobile",
      placeholder: "본인 명의 휴대폰번호"
    },
    country: {
      label: "country",
      value: "내국인",
      extra: customOption.country
    },
    gender: { label: "gender", value: "남자", extra: customOption.gender },
    telecom: { label: "telecom", value: "SKT", extra: customOption.telecom },
    allagree_term: {
      type: "checkbox",
      id: "allagree_term",
      name: "allagree_term",
      label: "모두 동의",
      hooks
    },
    require_term1: {
      type: "checkbox",
      id: "require_term1",
      name: "require_term1",
      label: "개인정보수집 / 이용동의",
      rules: "boolean|accepted",
      hooks
    },
    require_term2: {
      type: "checkbox",
      id: "require_term2",
      name: "require_term2",
      label: "고유식별정보 처리동의",
      rules: "boolean|accepted",
      hooks
    },
    require_term3: {
      type: "checkbox",
      id: "require_term3",
      name: "require_term3",
      label: "통신사 이용약관 동의",
      rules: "boolean|accepted",
      hooks
    },
    require_term4: {
      type: "checkbox",
      id: "require_term4",
      name: "require_term4",
      label: "서비스 이용약관",
      rules: "boolean|accepted",
      hooks
    },
    require_term5: {
      type: "checkbox",
      id: "require_term5",
      name: "require_term5",
      label: "본인인증 목적으로 상기 정보를 통신사에 제공함을 동의",
      rules: "boolean|accepted",
      hooks
    }
  }
};
