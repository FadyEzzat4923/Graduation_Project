import { useRouteError } from "react-router-dom";

export default function ErrorCard() {
  const error = useRouteError();

  let title = "An error occurred!";
  let message = "Something went wrong!";

  if (error.status === 500) {
    message = error.data.message;
  }

  if (error.status === 404) {
    title = "Page Not Found!";
    message = "Could not find resource or page, Please try again later.";
  }
  return (
    <div className="error-page text-center mt-20">
      <h1 className="text-6xl font-bold mb-10">{title}</h1>
      <p>{message}</p>
    </div>
  );
}
