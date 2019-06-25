import { autoHypenTele, autoHypenPhone } from "utils";
/**
 * field.onChange에서 사용할 전화번호에 - 넣는 라이브러리
 * 
 * api 콜을 하기위해서는 
 * form.values().mobile.replace(/-/gi, ''),
 * 위와 같은 방식으로 - 제거가 필요하다.
 */
default function autoTelNumber(field) {
    if (field.get('type') === 'tel') {
        if (field.path === 'managerTelephone' || field.path === 'fax') {
          field.set(autoHypenTele(field.value));
        } else {
          field.set(autoHypenPhone(field.value));
        }
      }
}