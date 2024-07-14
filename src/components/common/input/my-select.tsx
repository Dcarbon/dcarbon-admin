import { Select } from 'antd';
import styled from 'styled-components';

const MySelect = styled(Select).attrs((props) => ({
  ...props,
}))`
  & div {
    background-color: var(--main-gray) !important;
  }
  font-size: 14px;
  font-weight: 100;
`;
export default MySelect;
