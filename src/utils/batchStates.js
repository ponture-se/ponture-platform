import ReactDOM from "react-dom";
export default function batchStates(callback) {
  ReactDOM.unstable_batchedUpdates(callback);
}
