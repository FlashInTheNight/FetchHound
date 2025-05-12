import { useErrorStore } from "../../../store";
import { CancelIcon } from "../icons/CancelIcon";

export const ErrorNotification = () => {
  const { error, setError } = useErrorStore();
  return (
    <div>
      <p>{error}</p>
      <button type="button" onClick={() => setError("")}>
        <CancelIcon />
      </button>
    </div>
  );
};
