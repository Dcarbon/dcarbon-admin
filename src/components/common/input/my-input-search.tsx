import { Input } from 'antd';
import styled from 'styled-components';

const MyInputSearch = styled(Input.Search).attrs((props) => ({
  ...props,
}))`
  span > span {
    background-color: var(--main-gray) !important;
  }
`;
export default MyInputSearch;
