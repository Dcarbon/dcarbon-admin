import { Button } from 'antd';
import styled from 'styled-components';

const CancelButton = styled(Button).attrs((props) => ({
  ...props,
}))`
  padding: 16px 32px;
  font-weight: 500;
  height: 40px;
`;
export default CancelButton;
