import { Table, TableProps } from 'antd';
import styled from 'styled-components';

interface IProps extends TableProps {}

const MyTable = styled(Table).attrs<IProps>((props: IProps) => ({
  ...props,
}))`
  tbody > tr > td {
    border-bottom: 0 !important;
    padding: 14px 8px !important;
    font-size: 14px;
  }

  tbody > tr:nth-child(even) {
    background-color: var(--main-gray);
  }
  tbody > tr:nth-child(even) > td {
    background-color: var(--main-gray) !important;
  }
  tbody > tr:nth-child(odd) {
    background-color: #ffffff;
  }
  tbody > tr:nth-child(odd) > td {
    background-color: #ffffff !important;
  }
  thead {
    height: 56px;
  }
  thead > tr > th {
    background-color: rgba(255, 255, 255, 1) !important;
    font-size: 14px;
    color: rgba(79, 79, 79, 1);
  }

  thead > tr > th::before {
    background-color: unset !important;
  }
  .disabled-td {
    color: rgb(172 172 172);
  }
  ul.ant-table-pagination,
  div.ant-select-selector {
    font-size: 14px;
  }
`;
export default MyTable;
