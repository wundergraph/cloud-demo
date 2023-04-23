import { FiLoader } from "react-icons/fi";
import Button from "./Button";

const ScreenState = ({
  title,
  subtitle,
  button,
  onHandleClick,
  loading = true,
}: {
  title?: string;
  subtitle?: string;
  button?: string;
  onHandleClick?: () => void;
  loading?: boolean;
}) => (
  <div className="bg-dark-500 fixed left-0 top-0 z-10 flex min-h-screen w-screen flex-col items-center justify-center p-4">
    {loading && <FiLoader className="h-8 w-8 animate-spin" />}

    <div style={{ maxWidth: 256 }}>
      {title && (
        <h2 className="mt-8 mb-2 text-center text-2xl font-bold text-gray-100">
          {title}
        </h2>
      )}
      {subtitle && (
        <h4 className="text-center text-base text-gray-200">{subtitle}</h4>
      )}
    </div>
    {button && (
      <Button className="mt-4" onClick={onHandleClick}>
        {button}
      </Button>
    )}
  </div>
);

ScreenState.defaultProps = {
  title: undefined,
  subtitle: undefined,
  button: undefined,
  onHandleClick: undefined,
  loading: true,
};

export default ScreenState;
