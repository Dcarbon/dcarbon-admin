import SubmitButton from '@components/common/button/submit-button.tsx';

type ButtonSubmitProps = {
  children: React.ReactNode | string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  [key: string]: any;
};
const SubmitButtonAction = ({
  children,
  onClick,
  ...props
}: ButtonSubmitProps) => {
  return (
    <SubmitButton htmlType="submit" onClick={onClick} {...props}>
      {children}
    </SubmitButton>
  );
};

export default SubmitButtonAction;
