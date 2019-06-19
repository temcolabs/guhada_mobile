import Form from "../../_.forms";

export default {
  onInit() {},

  onSuccess(field) {
    console.log(field);
    console.log("-> onSubmit HOOK -", field.path, field.value);
  },

  onError(field) {
    console.log("Form Values", field.values());
    console.log("Form Errors", field.errors());
  },

  onSubmit(instance) {
    console.log(
      "-> onSubmit HOOK -",
      instance.path || "form",
      "- isValid?",
      instance.isValid
    );
  },

  onClear(instance) {
    console.log("-> onClear HOOK -", instance.path || "form");
  },

  onReset(instance) {
    console.log("-> onReset HOOK -", instance.path || "form");
  },

  onChange(field) {
    console.log("-> onChange HOOK -", field.path, field.value);
    let value = Form.productAdd.get("value");

    let reg = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\*]+$/;
    if (field.path === "serialNumber") {
      if (!reg.test(field.value)) {
        field.value = field.value.substring(0, field.value.length - 1);
      }
    }
    /// 숫자에 , 콤마 붙이기
    else if (field.path === "sellPrice" || field.path === "totalStock") {
      field.value = field.value.replace(/\,/g, "");

      if (field.path === "totalStock" && field.value > 99999999) {
        field.value = Number(99999999).toLocaleString();
      } else {
        field.value = Number(field.value).toLocaleString();
      }
    } else if (field.path === "discountValue") {
      if (value.discountType === "FIXED_AMOUNT") {
        let sellPrice = value.sellPrice.replace(/\,/g, "");
        console.log(sellPrice);
        if (field.value > sellPrice) {
          field.value = sellPrice;
        }
      } else if (value.discountType === "FIXED_RATE") {
        if (field.value > 99) field.value = 99;
      }
    }
  },

  onFocus: field => {
    console.log("-> onFocus HOOK -", field.path, field.value);
  },

  onBlur: field => {
    console.log("-> onBlur HOOK -", field.path, field.value);
    let value = Form.productAdd.get("value");

    if (field.path === "discountValue") {
      if (value.discountType === "FIXED_AMOUNT") {
        if (field.value.length > 2)
          field.value = Math.floor(field.value / 10) * 10;
        else field.value = 10;
      }
    } else if (field.path === "sellPrice") {
      if (field.value === "0") field.value = "";
    }
  }
};
