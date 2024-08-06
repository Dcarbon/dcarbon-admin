import { ErrorComponentProps } from '@tanstack/react-router';
import { Flex, Typography } from 'antd';

const Error = (error: ErrorComponentProps) => {
  return (
    <Flex
      justify="center"
      vertical
      align="center"
      className="not-found-layout"
      gap={10}
    >
      <Typography.Title level={1} type="danger">
        500
      </Typography.Title>
      <Typography.Title level={2}>An error has occurred</Typography.Title>
      <p>{error.error.message}</p>
    </Flex>
  );
};

export default Error;
