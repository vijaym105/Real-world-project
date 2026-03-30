import { useApp } from "../context/AppContext.jsx";

export default function Toast() {
  const { state, dispatch } = useApp();
  if (!state.toast) return null;

  return (
    <div
      className={`toast toast--${state.toast.type}`}
      onClick={() => dispatch({ type: "CLEAR_TOAST" })}
    >
      <span>{state.toast.type === "success" ? "✅" : "❌"}</span>
      <span>{state.toast.message}</span>
    </div>
  );
}
