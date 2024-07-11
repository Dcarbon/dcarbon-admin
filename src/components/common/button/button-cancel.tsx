import { Button } from 'antd';

type ButtonCancelProps = {
  children: React.ReactNode | string;
  onClick?: () => void;
  [key: string]: any;
};
const ButtonCancel = ({ children, onClick, ...props }: ButtonCancelProps) => {
  return (
    <Button danger htmlType="reset" onClick={onClick} {...props}>
      {children}
    </Button>
  );
};

export default ButtonCancel;
