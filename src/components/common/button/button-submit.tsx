import { Button } from 'antd';

type ButtonSubmitProps = {
  children: React.ReactNode | string;
  onClick?: () => void;
  loading?: boolean;
  [key: string]: any;
};
const ButtonSubmit = ({ children, onClick, ...props }: ButtonSubmitProps) => {
  return (
    <Button type="primary" htmlType="submit" onClick={onClick} {...props}>
      {children}
    </Button>
  );
};

export default ButtonSubmit;
