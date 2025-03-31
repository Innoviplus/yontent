
interface SubmitButtonProps {
  isLoading: boolean;
  text?: string;
}

export const SubmitButton = ({ isLoading, text = "Create Account" }: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full btn-primary flex justify-center items-center"
    >
      {isLoading ? (
        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        text
      )}
    </button>
  );
};
