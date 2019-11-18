import _ from 'lodash';

const nilToZero = v => (_.isNil(v) ? 0 : v);

export const nilToEmptyStr = v => (_.isNil(v) ? '' : v);

export default nilToZero;
