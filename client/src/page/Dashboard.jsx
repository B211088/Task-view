import { Outlet, useLoaderData } from "react-router-dom";
import Header from "../component/Header/Header";
import Sidebar from "../component/Sidebar/Sidebar";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { plans } = useLoaderData(); // Dữ liệu ban đầu từ loader
  const [updatedPlans, setUpdatedPlans] = useState(plans);

  // Hàm xử lý xóa plan
  const handleDeletePlan = (deletedPlanId) => {
    setUpdatedPlans((prevPlans) =>
      prevPlans.filter((plan) => plan.id !== deletedPlanId)
    );
  };

  return (
    <div className="w-full h-[100vh] flex flex-col bg-bg-window">
      <Header />
      <div className="w-full flex sm:gap-[10px] gap-[5px] justify-between mt-5 sm:px-[10px] px-[5px]">
        <div className="w-[18%] flex-[0.18] sm:block">
          <Sidebar plans={updatedPlans} />
        </div>
        <div className="w-[81%] flex-[0.82] flex height-container-plans">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
