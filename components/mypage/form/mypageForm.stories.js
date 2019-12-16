import React from 'react';
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
import Input, { inputStatTypes } from './Input';
import Select from './Select';
import SubmitButton, {
  CancelButton,
  SubmitButtonWrapper,
} from './SubmitButton';
import QuantityControl from './QuantityControl';
import KeyValueTable from './KeyValueTable';
import RadioGroup from './RadioGroup';
import Checkbox from './Checkbox';
import FormButton from './FormButton';
import Text from './Text';
import withCenteredDeco from '.storybook/decorators/withCenteredDeco';

const stories = storiesOf('mypage/form', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);
stories.addDecorator(withCenteredDeco);

stories.add('Input', () => {
  return (
    <div style={{ width: '300px', margin: '20px' }}>
      <Input
        onChange={action('onChange')}
        placeholder="취소 사유를 간략히 적어주세요."
        status={select(
          'status',
          [inputStatTypes.NORMAL, inputStatTypes.ERROR, inputStatTypes.OK],
          inputStatTypes.OK
        )}
      />
    </div>
  );
});

stories.add('Select', () => {
  return (
    <div style={{ width: '300px', margin: '20px' }}>
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
    </div>
  );
});

stories.add('SubmitButton + SubmitButtonWrapper', () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <SubmitButtonWrapper>
        <CancelButton onClick={action('cancel')}>취소</CancelButton>
        <SubmitButton onClick={action('submit')} type="submit">
          주문취소 신청
        </SubmitButton>
      </SubmitButtonWrapper>
    </div>
  );
});

stories.add('SubmitButton + SubmitButtonWrapper(responsive)', () => {
  return (
    <SubmitButtonWrapper responsive wrapperStyle={{ width: '300px' }}>
      <CancelButton onClick={action('cancel')}>취소</CancelButton>
      <SubmitButton onClick={action('submit')} type="submit">
        주문취소 신청
      </SubmitButton>
    </SubmitButtonWrapper>
  );
});

stories.add('QuantityControl', () => {
  return <QuantityControl initialValue={2} onChange={action('onchange')} />;
});

stories.add('KeyValueTable', () => {
  return (
    <KeyValueTable>
      <tr>
        <td>받는 분</td>
        <td>조준희</td>
      </tr>
      <tr>
        <td>배송주소</td>
        <td>(우:06247) 서울시 강남구 논현로 75길 비드빌딩 6층</td>
      </tr>
    </KeyValueTable>
  );
});

stories.add('RadioGroup', () => {
  return (
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
      isSingleItemInLine={boolean('isSingleItemInLine', true)}
    />
  );
});

stories.add('Checkbox', () => {
  return (
    <Checkbox
      name="SMS 수신동의"
      initialValue={true}
      onChange={action('onChange')}
      icon={select('icon', ['', 'naver', 'google', 'facebook', 'kakao'], '')}
    />
  );
});

stories.add('FormButton', () => {
  return (
    <FormButton color={select('color', ['default', 'purple'], 'purple')}>
      테스트
    </FormButton>
  );
});

stories.add('Text (only)', () => {
  return (
    <Text
      hasBorder={boolean('hasBorder', false)}
      disabled={boolean('disabled', false)}
    >
      테스트
    </Text>
  );
});
