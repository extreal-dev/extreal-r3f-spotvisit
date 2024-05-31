import { FallbackProps } from "react-error-boundary";

const ErrorPage = ({ error }: FallbackProps) => {
  return (
    <div>
      <h3 style={{ color: "red" }}>Error occurred.</h3>
      <pre>{error.message}</pre>
    </div>
  );
};
export default ErrorPage;
