import { configure } from '@storybook/react';
import '../style.scss';
import 'react-dates/initialize';
import moment from 'moment';
moment.locale('ko');

// automatically import all files ending in *.stories.js
const req1 = require.context('../components', true, /\.stories\.js$/);
const req2 = require.context('../template', true, /\.stories\.js$/);
function loadStories() {
  req1.keys().forEach((filename) => req1(filename));
  req2.keys().forEach((filename) => req2(filename));
}
configure(loadStories, module);
