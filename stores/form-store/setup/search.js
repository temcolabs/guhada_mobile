import hooks from "../hooks/Search";

export default {
  fields: {
    search: {
      type: "text",
      name: "fields",
      placeholder: "Find your pleasant shopping moment",
      label: "통합 검색",
      hooks
    }
  }
};
