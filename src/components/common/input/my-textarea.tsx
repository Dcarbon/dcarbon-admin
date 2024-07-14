import { Input } from 'antd';
import styled from 'styled-components';

const MyInputTextArea = styled(Input.TextArea).attrs((props) => ({
  ...props,
}))`
  background-color: var(--main-gray);
`;
export default MyInputTextArea;
