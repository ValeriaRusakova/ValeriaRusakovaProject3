// Reusable spinner — shown while data is loading.
// CSS defined in styles/globals.css (.spinner-wrap, .spinner)

export default function LoadingSpinner() {
  return (
    <div className="spinner-wrap">
      <div className="spinner" />
    </div>
  );
}
