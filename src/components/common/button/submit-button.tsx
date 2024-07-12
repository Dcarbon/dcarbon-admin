import { Button } from 'antd';
import styled from 'styled-components';

const SubmitButton = styled(Button).attrs((props) => ({
  ...props,
}))`
  background-color: var(--submit-button-bg);

  &:hover {
    background-color: var(--submit-button-bg-hover) !important;
    border-color: var(--submit-button-bg-hover) !important;
  }

  padding: 16px 32px;
  font-weight: 500;
  height: 40px;
`;
export default SubmitButton;
