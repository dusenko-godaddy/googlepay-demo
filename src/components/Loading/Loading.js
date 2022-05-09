import ClipLoader from "react-spinners/ClipLoader";

import "./Loading.css";

const Loading = ({loading}) => {
  return (
    <div className={loading ? "loading-center" : "loading-none"}>
      <ClipLoader className="loader" loading={loading} size={150} />
    </div>
  )
};

export default Loading;
