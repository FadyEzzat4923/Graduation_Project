/* eslint-disable react/prop-types */
export default function ErrorBlock({ title, message, end }) {
  return (
    <div
      className={`relative flex ${
        end ? "justify-end" : "justify-center"
      } w-full`}
    >
      <div className="error-block rounded-md animate-bounce">
        <div className="error-block-icon ms-5">!</div>
        <div className="error-block-text me-5">
          <h2>{title}</h2>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}
