import { Input } from 'antd';
import styled from 'styled-components';

const MyInput = styled(Input).attrs((props) => ({
  ...props,
  allowClear: true,
}))`
  background-color: var(--main-gray);
`;
export default MyInput;
