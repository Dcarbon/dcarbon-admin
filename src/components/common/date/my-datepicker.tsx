import { DatePicker } from 'antd';
import styled from 'styled-components';

const MyDatePicker = styled(DatePicker).attrs((props) => ({
  ...props,
}))`
  background-color: var(--main-gray);
  height: 35px;
`;
export default MyDatePicker;
