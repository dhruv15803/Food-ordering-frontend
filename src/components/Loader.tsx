import { Oval } from "react-loader-spinner";

type LoaderProps = {
  height: string;
  width: string;
};

const Loader = ({ height, width }: LoaderProps) => {
  return (
    <>
      <Oval
        visible={true}
        height={height}
        width={width}
        color="#3B82F6"
        secondaryColor="white"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </>
  );
};

export default Loader;
