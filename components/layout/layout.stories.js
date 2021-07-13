import { useCallback } from 'react';
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
import DefaultLayout from './DefaultLayout';
import DetailPageLayout from './DetailPageLayout';
import ModalLayout, { useModalLayoutState } from './ModalLayout';

const stories = storiesOf('layout', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

stories.add('DefaultLayout', () => {
  return <DefaultLayout />;
});

stories.add('DetailPageLayout', () => {
  return (
    <DetailPageLayout pageTitle={text('pageTitle', '상세페이지')}>
      <div>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus,
        asperiores! Quo dolor enim similique? Corporis provident similique sed
        magnam odit, nobis voluptas doloribus ipsa dolorem reiciendis ratione
        dolores maiores delectus?
      </div>
    </DetailPageLayout>
  );
});

stories.add('ModalLayout', () => {
  const StoryComp = ({ children }) => {
    const {
      isModalLayoutOpen,
      openModalLayout,
      closeModalLayout,
    } = useModalLayoutState({
      isOpenOnMount: false,
      onClose: useCallback(() => {
        alert('onClose in useModalLayoutState');
      }, []),
    });

    return (
      <div>
        <button onClick={openModalLayout}>open modalLayout</button>

        <ModalLayout
          pageTitle={text('pageTitle', '상세페이지')}
          isOpen={isModalLayoutOpen}
          onClose={closeModalLayout}
        >
          <div>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus,
            asperiores! Quo dolor enim similique? Corporis provident similique
            sed magnam odit, nobis voluptas doloribus ipsa dolorem reiciendis
            ratione dolores maiores delectus?
          </div>
        </ModalLayout>
      </div>
    );
  };

  return <StoryComp />;
});
