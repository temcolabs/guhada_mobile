import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  withKnobs,
  text,
  boolean,
  number,
  color,
  select,
} from '@storybook/addon-knobs';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
import withCenteredDeco from '.storybook/decorators/withCenteredDeco';
import ReportModal from './ReportModal';
import reportTarget from 'lib/constant/reportTarget';

const stories = storiesOf('claim/report', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));
stories.addDecorator(withCenteredDeco);

stories.add('ReportModal', () => {
  return (
    <div style={{ height: '200vh' }}>
      <ReportModal
        isOpen={boolean('isOpen', true)}
        reportTarget={select(
          'reportTarget',
          Object.keys(reportTarget),
          reportTarget.BOARD
        )}
        relatedData={[
          { label: '게시글번호', value: '09910231' },
          { label: '게시글제목', value: '허위사실이다!' },
          { label: '게시글번호', value: '09910231' },
          { label: '게시글제목', value: '허위사실이다!' },
        ]}
      />
    </div>
  );
});
