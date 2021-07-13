import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, select, number } from '@storybook/addon-knobs';
import SlideIn, { slideDirection } from './SlideIn';

const stories = storiesOf('common/SlideIn', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);

stories.add('default', () => {
  return (
    <SlideIn
      isVisible={boolean('isVisible', false)}
      direction={select(
        'direction',
        Object.keys(slideDirection).map((k) => slideDirection[k]),
        slideDirection.LEFT
      )}
      zIndex={number('zIndex', null)}
    >
      <div style={{ width: '300px', margin: '0 auto', background: '#eee' }}>
        <h1>title</h1>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facere est,
        nam, dolores iure vel consequuntur cumque asperiores itaque possimus
        adipisci veritatis incidunt ipsam hic quidem. Quo, cupiditate quidem!
        Recusandae, at! Lorem ipsum dolor sit, amet consectetur adipisicing
        elit. Commodi quas excepturi sed at? Ipsam molestiae possimus nobis
        doloribus dolorum eveniet deserunt voluptatibus facere ullam,
        repudiandae, quod, ab magnam sit minus fuga! Vitae fugiat iusto eius
        earum nam facilis rem ex, ducimus quae consequatur ratione quod autem
      </div>
    </SlideIn>
  );
});
