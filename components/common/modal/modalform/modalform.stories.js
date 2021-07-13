import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  withKnobs,
  text,
  boolean,
  number,
  color,
  select,
  object,
} from '@storybook/addon-knobs';
import ModalForm, {
  ModalFormField,
  ModalFormLabel,
  ModalFormValue,
  ModalFormTextValue,
} from 'components/common/modal/modalform/ModalForm';
import ModalFormTitle from 'components/common/modal/modalform/ModalFormTitle';
import ModalFormSubmit from 'components/common/modal/modalform/ModalFormSubmit';
import ModalFormAttachment from 'components/common/modal/modalform/ModalFormAttachment';

import Input from 'components/mypage/form/Input';
import Select from 'components/mypage/form/Select';
import Checkbox from 'components/mypage/form/Checkbox';
import RadioGroup from 'components/mypage/form/RadioGroup';
import TextArea from 'components/mypage/form/TextArea';

const stories = storiesOf('common/ModalForm', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);

stories.add('ModalForm', () => {
  return (
    <ModalForm isOpen>
      <ModalFormTitle>Sample Title</ModalFormTitle>
      <div>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut vel fugiat
        laborum ex possimus, amet optio recusandae soluta sed sapiente, delectus
        officia culpa voluptatem hic, neque consequuntur provident nostrum
        nulla.
      </div>

      <ModalFormSubmit
        cancelButtonText="취소"
        submitButtonText="신청"
        onCancel={action('onCancel')}
        onSubmit={action('onSubmit')}
      />
    </ModalForm>
  );
});

stories.add('ModalForm with value only', () => {
  return (
    <ModalForm isOpen>
      <ModalFormTitle>Sample Title</ModalFormTitle>
      <div>
        <ModalFormField>
          <ModalFormValue>
            <ModalFormTextValue>ModalFormTextValue</ModalFormTextValue>
          </ModalFormValue>
        </ModalFormField>

        <ModalFormField>
          <ModalFormValue>
            <Select
              name="sampleselect"
              options={[
                { value: 'option1 ', label: 'option1' },
                { value: 'option2 ', label: 'option2' },
                { value: 'option3 ', label: 'option3' },
              ]}
              placeholder="선택하세요?"
              onChange={action('onChange')}
            />
          </ModalFormValue>
        </ModalFormField>

        <ModalFormField>
          <ModalFormValue>
            <Input initialValue="value" />
          </ModalFormValue>
        </ModalFormField>

        <ModalFormField>
          <ModalFormValue>
            <ModalFormAttachment
              onChangeFile={action('onChangeFile')}
              onDeleteImage={action('onDeleteImage')}
              imageUrls={[
                'https://dolh13ote4loq.cloudfront.net/images/products/detail/97676de1e3204f5abc17c6aa66399c79',
                'https://dolh13ote4loq.cloudfront.net/images/products/detail/97676de1e3204f5abc17c6aa66399c79',
                'https://dolh13ote4loq.cloudfront.net/images/products/detail/97676de1e3204f5abc17c6aa66399c79',
                'https://dolh13ote4loq.cloudfront.net/images/products/detail/97676de1e3204f5abc17c6aa66399c79',
                'https://dolh13ote4loq.cloudfront.net/images/products/detail/97676de1e3204f5abc17c6aa66399c79',
                'https://dolh13ote4loq.cloudfront.net/images/products/detail/97676de1e3204f5abc17c6aa66399c79',
              ]}
            />
          </ModalFormValue>
        </ModalFormField>
      </div>

      <ModalFormSubmit
        cancelButtonText="취소"
        submitButtonText="신청"
        onCancel={action('onCancel')}
        onSubmit={action('onSubmit')}
      />
    </ModalForm>
  );
});

stories.add('ModalForm with label-value', () => {
  return (
    <ModalForm isOpen>
      <ModalFormTitle>Sample Title</ModalFormTitle>
      <div>
        <ModalFormField>
          <ModalFormLabel>label</ModalFormLabel>
          <ModalFormValue>
            <ModalFormTextValue>value</ModalFormTextValue>
          </ModalFormValue>
        </ModalFormField>

        <ModalFormField>
          <ModalFormLabel>label</ModalFormLabel>
          <ModalFormValue>
            <Input initialValue="value" />
          </ModalFormValue>
        </ModalFormField>

        <ModalFormField>
          <ModalFormLabel>label</ModalFormLabel>
          <ModalFormValue>
            <Select
              name="sampleselect"
              options={[
                { value: 'option1 ', label: 'option1' },
                { value: 'option2 ', label: 'option2' },
                { value: 'option3 ', label: 'option3' },
              ]}
              placeholder="선택하세요?"
              onChange={action('onChange')}
            />
          </ModalFormValue>
        </ModalFormField>

        <ModalFormField>
          <ModalFormLabel>label</ModalFormLabel>
          <ModalFormValue>
            <RadioGroup
              name="sampleRadio"
              options={object('radios', [
                {
                  label: '신규배송지',
                  value: 'new',
                },
                {
                  label: '기존배송지',
                  value: 'default',
                },
                {
                  label: '제 3의 배송지',
                  value: 'another',
                },
              ])}
              onChange={action('onChange')}
              initialValue={'another'}
            />
          </ModalFormValue>
        </ModalFormField>

        <ModalFormField>
          <ModalFormLabel>label</ModalFormLabel>
          <ModalFormValue>
            <Checkbox
              name="SMS 수신동의"
              initialValue={true}
              onChange={action('onChange')}
              icon={select(
                'icon',
                ['', 'naver', 'google', 'facebook', 'kakao'],
                ''
              )}
            />
          </ModalFormValue>
        </ModalFormField>

        <ModalFormField>
          <ModalFormLabel>label</ModalFormLabel>
          <ModalFormValue>
            <TextArea textAreaStyle={{ minHeight: '50px' }} />
          </ModalFormValue>
        </ModalFormField>
      </div>

      <ModalFormSubmit
        cancelButtonText="취소"
        submitButtonText="신청"
        onCancel={action('onCancel')}
        onSubmit={action('onSubmit')}
      />
    </ModalForm>
  );
});
