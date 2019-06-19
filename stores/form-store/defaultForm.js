export default {
  onInit(form) {
    console.log('-> onInit Form HOOK');
  },

  onSubmit(instance) {
    console.log(instance);
    console.log(
      '-> onSubmit HOOK -',
      instance.path || 'form',
      '- isValid?',
      instance.isValid
    );
  },
};
