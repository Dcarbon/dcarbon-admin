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

  &:disabled {
    background-color: rgba(0, 0, 0, 0.04) !important;
    border-color: #f6f6f6 !important;
  }

  padding: 16px 32px;
  font-weight: 500;
`;
export default SubmitButton;
