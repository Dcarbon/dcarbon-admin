import { HTMLAttributes } from 'react';
import styled from 'styled-components';

interface IProps extends HTMLAttributes<HTMLSpanElement> {
  width?: string;
}

const SpanOneLine = styled(`span`).attrs<IProps>((props) => ({
  ...props,
}))`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: ${(props) => (props.width ? props.width : 'auto')};
`;
export default SpanOneLine;
