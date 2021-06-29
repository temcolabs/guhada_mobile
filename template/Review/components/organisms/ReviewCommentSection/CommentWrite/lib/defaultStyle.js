export default {
  width: '100%',
  fontFamily: 'Roboto',
  control: {
    backgroundColor: '#fff',
    fontSize: 14,
    width: '100%',
    fontWeight: 'normal',
  },

  '&multiLine': {
    control: {
      fontFamily: 'Roboto',
    },
    input: {
      border: 'none',
      width: '100%',
    },
  },

  suggestions: {
    list: {
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 14,
    },
    item: {
      margin: '5px 5px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',
      '&focused': {
        backgroundColor: '#cee4e5',
      },
    },
  },
};
