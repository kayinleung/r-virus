import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type LoadingSpinnerProps = {
  text?: string;
};
const LoadingSpinner = ({ text }: LoadingSpinnerProps) => {
  return (
    <div>
      <FontAwesomeIcon icon={faSpinner} spin /> {text}
    </div>
  );
};

export { LoadingSpinner}