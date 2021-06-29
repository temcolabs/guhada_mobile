import styled from 'styled-components';

// Wrapper
export const Wrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
`;

// Sections
export const EmojiSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 16px 0 20px 0;
`;

export const InputSection = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin: 0 5px 20px 5px;
`;

// Avatar
export const Avatar = styled.div`
  width: 30px;
  margin-right: 10px;
`;

// Form
export const Form = styled.div`
  border: 1px solid #eeeeee;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(100% - 40px);
  padding: 12px 15px 11px 15px;
`;

export const InputWrapper = styled.div`
  font-family: Roboto;
  font-size: 14px;
  line-height: 1.29;
  display: flex;
  align-items: center;
  width: 100%;
`;

export const TextDiv = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% - 15% - 15px);
`;

export const SubmitDiv = styled.div`
  display: flex;
  justify-content: center;
  width: 15%;
  margin-left: 15px;
`;

export const Text = styled.textarea`
  border: none;
  resize: none;
  width: 100%;
  height: 17px;
`;

export const Submit = styled.button`
  color: #5d2ed1;
  font-weight: bold;
  height: 17px;
`;
