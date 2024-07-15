import { Skeleton } from 'antd';
import styled from 'styled-components';

const MySkeletonInput = styled(Skeleton.Input).attrs((props) => ({
  ...props,
}))`
  width: 100% !important;

  & > span {
    height: 35px !important;
    background-color: var(--main-gray) !important;
  }
`;
export default MySkeletonInput;
