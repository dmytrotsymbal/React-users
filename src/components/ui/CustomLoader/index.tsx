import "./CustomLoader.scss";

type Props = {
  size?: string;
};

const CustomLoader = ({ size }: Props) => {
  return (
    <>
      <div className={size === "small" ? "spinner-small" : "spinner"}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  );
};
export default CustomLoader;
