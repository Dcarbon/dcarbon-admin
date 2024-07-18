import { Skeleton, SkeletonProps } from 'antd';
import styled from 'styled-components';

interface IProps extends SkeletonProps {
  height?: string;
}

const MySkeletonInput = styled(Skeleton.Input).attrs<IProps>(
  (props: IProps) => ({
    ...props,
  }),
)`
  width: 100% !important;

  & > span {
    height: ${(props) => props.height || '35px'} !important;
    background-color: var(--main-gray) !important;
  }
`;
export default MySkeletonInput;
