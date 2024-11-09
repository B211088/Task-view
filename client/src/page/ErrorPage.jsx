import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="w-full h-[100vh] flex  justify-center">
      <div className="flex flex-col justify-center items-center gap-[10px]">
        <h1 className="text-[2rem] font-bold">Sorry!!!</h1>
        <p>Không thể truy cập được trang web!!!</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
