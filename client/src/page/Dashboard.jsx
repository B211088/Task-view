import { Outlet, useLoaderData } from "react-router-dom";
import Header from "../component/Header/Header";
import Sidebar from "../component/Sidebar/Sidebar";
import { useEffect, useState, useRef } from "react";

const Dashboard = () => {
  const sideBardefauthCss = "w-[18%] flex-[0.18] sm:block hidden";
  const { plans } = useLoaderData() || {}; // Ensure plans exists
  const [updatedPlans, setUpdatedPlans] = useState(plans || []);
  const [sidebar, setSideBar] = useState(sideBardefauthCss);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const modalRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      if (window.innerWidth > 740) {
        setSideBar(sideBardefauthCss);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const openSideBar = () => {
    setSideBar(
      "fixed w-full flex items-center justify-start top-0 bottom-0 right-0 bg-overlay"
    );
  };

  const closeSideBar = () => {
    setSideBar(sideBardefauthCss);
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleOverlayClick = () => {
    closeSideBar();
  };

  return (
    <div className="w-full h-[100vh] flex flex-col bg-bg-window 0">
      <Header openSideBar={openSideBar} />
      <div className="w-full flex sm:gap-[10px] gap-[5px] justify-between mt-5 px-[10px]">
        <div className={sidebar} onClick={handleOverlayClick}>
          <Sidebar
            plans={updatedPlans}
            refSideBar={modalRef}
            handleModalClick={handleModalClick}
            closeSideBar={handleOverlayClick}
          />
        </div>
        <div className="sm:w-[81%] w-full sm:flex-[0.82] flex-1 flex height-container-plans">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
