import { Button } from 'antd';
import styled from 'styled-components';

const MyButton = styled(Button).attrs((props) => ({
  ...props,
}))`
  padding: 16px 32px;
`;
export default MyButton;
