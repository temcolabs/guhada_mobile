import { observable, action, toJS, computed } from "mobx";

export default class ProductAddStore {
  @observable selectOptions = [{ label: "", attributes: [] }];
  @observable selectColors = [];
  @observable selectSize = [];
  @observable selectOptionResults = [
    // {
    //   //   label1: "",
    //   //   attribute1: "",
    //   //   label2: "",
    //   //   attribute2: "",
    //   //   label3: "",
    //   //   attribute3: ""
    // }
  ];
  @observable selectOptionLength = [];

  @action
  addOption = index => {
    if (this.selectOptions.length < 3) {
      this.selectOptions.push({
        label: "",
        attributes: []
      });
      // console.log(toJS(this.selectOptions));
    } else {
      alert("더 이상 추가가 안됩니다.");
    }
  };

  @action
  removeOption = index => {
    if (this.selectOptions.length > 1) {
      this.selectOptions.splice(index, 1);
    }
  };

  @action
  setSelectOptions = (option, index) => {
    this.selectOptions[index] = {
      label: option.value,
      attributes: []
    };
    console.log(toJS(this.selectOptions));
  };

  @action
  setSelectColors = color => {
    let returnFlag = true;

    for (let i = 0; i < this.selectColors.length; i++) {
      if (this.selectColors[i].rgb === color.rgb) {
        this.selectColors.splice(i, 1);
        returnFlag = false;
      }
    }

    if (returnFlag)
      this.selectColors.push({ name: color.name, rgb: color.rgb });
  };

  @action
  setSelectOptionColors = index => {
    this.selectOptions[index] = {
      label: "색상",
      attributes: this.selectColors
    };
  };

  @action
  setSelectSize = size => {
    let returnFlag = true;

    for (let i = 0; i < this.selectSize.length; i++) {
      if (this.selectSize[i].name === size.name) {
        this.selectSize.splice(i, 1);
        returnFlag = false;
      }
    }

    if (returnFlag) this.selectSize.push({ name: size.name });
  };

  @action
  setSelectOptionSize = index => {
    this.selectOptions[index] = {
      label: "사이즈",
      attributes: this.selectSize
    };
  };

  @action
  optionLength = () => {
    // 초기화
    this.selectOptionResults = [];
    console.log(this.selectOptions.length);
    // 옵션의 길이 값 확인
    let countOption = [];
    for (let i = 0; i < this.selectOptions.length; i++) {
      countOption[i] = this.selectOptions[i].attributes.length;
      if (this.selectOptions.length === 1) {
        countOption[1] = 1;
        countOption[2] = 1;
      } else if (this.selectOptions.length === 2) {
        countOption[2] = 1;
      }
    }
    this.selectOptionLength = countOption;

    let resultIndex = 0;

    // s 값이 옵션 값
    // 현재는 2개를 기준으로 짜여져 있슴

    for (let firstLen = 0; firstLen < countOption[0]; firstLen++) {
      for (let secondLen = 0; secondLen < countOption[1]; secondLen++) {
        for (let optionLen = 0; optionLen < countOption.length; optionLen++) {
          console.log(firstLen, secondLen, optionLen);
          console.log(resultIndex);
          if (optionLen === 0) {
            this.selectOptionResults.push({
              ["label" + (optionLen + 1)]: this.selectOptions[optionLen].label,
              ["attribute" + (optionLen + 1)]: this.selectOptions[optionLen]
                .attributes[firstLen].name,
              ["rgb" + (optionLen + 1)]: this.selectOptions[optionLen]
                .attributes[firstLen].rgb
                ? this.selectOptions[optionLen].attributes[firstLen].rgb
                : null,
              price: 0,
              stock: 0,
              status: "SALE",
              managingCode: "",
              used: true,
              image: ""
            });
          } else if (optionLen === 1) {
            if (this.selectOptions.length > 1) {
              let optionResult = Object.assign(
                toJS(this.selectOptionResults[resultIndex]),
                {
                  ["label" + (optionLen + 1)]: this.selectOptions[optionLen]
                    .label,
                  ["attribute" + (optionLen + 1)]: this.selectOptions[optionLen]
                    .attributes[secondLen].name,
                  ["rgb" + (optionLen + 1)]: this.selectOptions[optionLen]
                    .attributes[secondLen].rgb
                    ? this.selectOptions[optionLen].attributes[secondLen].rgb
                    : null
                }
              );
              this.selectOptionResults[resultIndex] = optionResult;
            }
          }
        }
        resultIndex++;
      }
    }

    console.log(toJS(this.selectOptionResults));
  };

  @action
  setOptionStatus = index => {
    console.log(index);
    if (this.selectOptionResults[index].status === "SALE")
      this.selectOptionResults[index].status = "SOLD_OUT";
    else this.selectOptionResults[index].status = "SALE";
  };

  @action
  setUsed = index => {
    this.selectOptionResults[index].used = !this.selectOptionResults[index]
      .used;
  };

  @action
  setDeleteSelectOption = index => {
    this.selectOptionResults.splice(index, 1);
  };

  @computed get optionLengthCount() {
    let length = 1;

    for (let i = 0; i < this.selectOptions.length; i++) {
      if (this.selectOptions[i].attributes.length !== 0) {
        length *= this.selectOptions[i].attributes.length;
      } else {
        length *= 1;
      }
    }

    if (this.selectOptions[0].attributes.length === 0) length = 0;

    return length;
  }

  @action setPrice = (price, index) => {
    this.selectOptions[index].price = price;
  };
}
