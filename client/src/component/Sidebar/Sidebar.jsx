import AddPlan from "../Modal/AddPlan";
import Plan from "../Plan/Plan";
import Filter from "./Filter";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const Sidebar = ({ plans }) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);
  const [plansData, setPlansData] = useState(plans);
  const filterRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const popupName = searchParams.get("popup");
  const navigate = useNavigate();

  const toggleFilterModal = (e) => {
    e.stopPropagation();
    setIsFilterVisible(!isFilterVisible);
  };

  const openAddPlanModal = () => {
    setSearchParams({ popup: "add-plan" });
  };

  const closeAddPlanModal = () => {
    navigate(-1);
  };

  const handleAddPlan = (newPlan) => {
    setPlansData((prevPlans) => [...prevPlans, newPlan]);
  };

  useEffect(() => {
    if (popupName === "add-plan") {
      setIsAddPlanModalOpen(true);
      return;
    }
    setIsAddPlanModalOpen(false);

    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [plans, popupName]);
  console.log("PlanData", plansData);
  return (
    <div className="sm:w-full w-[62px] min-w-[62px]  height-container flex flex-col gap-[10px] sm:px-[8px] sm:py-[10px] py-[15px] px-[5px] border-1 shadow rounded-[5px] bg-bg-light">
      <div className="flex items-center gap-[10px] sm:justify-between justify-center">
        <h3 className="text-[0.8rem] font-Montserrat font-bold hidden sm:block">
          Kế hoạch của bạn
        </h3>
        <div className="">
          <div
            className="square-container-m flex items-center justify-center bg-color-dark-700 text-[1.3rem] font-bold cursor-pointer rounded-[5px]"
            onClick={openAddPlanModal}
          >
            <i className="fa-solid fa-plus"></i>
          </div>
          {isAddPlanModalOpen && (
            <AddPlan onClose={closeAddPlanModal} onAddPlan={handleAddPlan} />
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-[15px] sm:flex-row flex-col">
        <div className="flex sm:w-full items-center justify-between w-[34px] h-[34px] text-[13px] rounded-[5px] bg-color-dark-900 cursor-pointer sm:p-[5px] p-[0px] sm:pr-[0px]">
          <div className="hidden sm:flex items-center sm:h-full h-[34px] rounded-[5px] sm:bg-color-dark-900 bg-bg-light sm:p-[0px] p-[5px] sm:border-none">
            <input
              className="outline-none w-full rounded-[5px] px-[5px] search-input h-full"
              type="text"
              placeholder="Tìm kiếm"
            />
          </div>
          <div className="square-container-m flex items-center justify-center">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
        <div className="square-container-m flex items-center justify-center relative">
          <div
            className="square-container-m flex items-center justify-center bg-color-dark-700 text-[1rem] font-bold cursor-pointer rounded-[5px]"
            onClick={toggleFilterModal}
            ref={filterRef}
          >
            <i className="fa-solid fa-filter"></i>
          </div>
          {isFilterVisible && <Filter />}
        </div>
      </div>
      <div className="w-full flex flex-col height-container-plans custom-scrollbar overflow-auto gap-[5px] mt-[20px]">
        {plansData.map((plan, index) => (
          <Link key={plan.id} to={`plans/${plan.id}`}>
            <Plan
              plan={plan}
              key={plan.id}
              isActive={selectedPlanId === plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
