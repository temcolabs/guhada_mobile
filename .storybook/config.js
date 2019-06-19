import { configure } from '@storybook/react';
import '../style.scss';
import 'react-dates/initialize';
import moment from 'moment';
moment.locale('ko');

// automatically import all files ending in *.stories.js
const req = require.context('../components', true, /\.stories\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
