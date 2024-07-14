import { InputNumber } from 'antd';
import styled from 'styled-components';

const MyInputNumber = styled(InputNumber).attrs((props) => ({
  ...props,
}))`
  background-color: var(--main-gray);
`;
export default MyInputNumber;
