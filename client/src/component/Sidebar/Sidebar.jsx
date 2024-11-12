import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import AddPlan from "../Modal/AddPlan";
import Plan from "../Plan/Plan";
import ConfirmModal from "../Modal/ConfirmModal";
import { deletePlan } from "../../utils/plansUtils";

const Sidebar = ({ plans, handleModalClick, refSideBar }) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);
  const [plansData, setPlansData] = useState(plans);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const [searchParams, setSearchParams] = useSearchParams();
  const [confirmModal, setConfirmModal] = useState(false);
  const [notify, setNotify] = useState({ payload: "", type: "" });
  const [planId, setPlanId] = useState("");
  const popupName = searchParams.get("popup");
  const navigate = useNavigate();
  const filterRef = useRef(null);

  const closeConfirmModal = () => {
    setConfirmModal(false);
  };

  const openConfirmModal = (planId) => {
    setNotify({
      payload: "Bạn có chắc chắn muốn xóa kế hoạch này?",
      type: "error",
    });
    setConfirmModal(true);
    setPlanId(planId);
  };

  const onConfirm = async () => {
    try {
      await deletePlan(planId);
      closeConfirmModal();
      setPlansData((prevPlans) =>
        prevPlans.filter((plan) => plan.id !== planId)
      );
      navigate("/");
    } catch (error) {
      console.error("Lỗi khi xóa kế hoạch:", error);
      alert("Xóa kế hoạch không thành công.");
    }
  };

  const toggleFilterModal = (e) => {
    e.stopPropagation();
    setIsFilterVisible((prev) => !prev);
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
    if (isFilterVisible) {
      setIsFilterVisible(false);
    }
  };

  const openAddPlanModal = () => {
    if (popupName !== "add-plan") {
      setSearchParams({ popup: "add-plan" });
    }
  };

  const closeAddPlanModal = () => {
    navigate(-1);
  };

  const handleAddPlan = (newPlan) => {
    setPlansData((prevPlans) => [...prevPlans, newPlan]);
    setSortOrder("newest");
  };

  useEffect(() => {
    setPlansData(plans);
    setSortOrder("newest");
  }, [plans]);

  const sortPlans = () => {
    const sortedPlans = plansData
      .filter(
        (plan) =>
          plan &&
          plan.name &&
          plan.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOrder === "newest") {
          return b.updatedAt - a.updatedAt;
        } else if (sortOrder === "oldest") {
          return a.updatedAt - b.updatedAt;
        }
        return 0;
      });
    return sortedPlans;
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
  }, [popupName, sortOrder]);

  return (
    <div
      className="w-[100%]  height-container flex flex-col gap-[10px] sm:px-[8px] sm:py-[10px] py-[15px] px-[5px] border-1 shadow rounded-[5px] bg-bg-light "
      onClick={handleModalClick}
      ref={refSideBar}
    >
      <div className="flex items-center gap-[10px] justify-between ">
        <h3 className="text-[0.8rem] font-Montserrat font-bold sm:block">
          Kế hoạch của bạn
        </h3>
        <div>
          <div
            className="square-container-m flex items-center justify-center bg-color-dark-700 text-[1.3rem] font-bold cursor-pointer rounded-[5px]"
            onClick={openAddPlanModal}
          >
            <i className="fa-solid fa-plus"></i>
          </div>
          {isAddPlanModalOpen && (
            <AddPlan
              onCloseModal={closeAddPlanModal}
              onAddPlan={handleAddPlan}
            />
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-[15px] flex-row ">
        <div className="flex w-full items-center justify-between ] h-[34px] text-[13px] rounded-[5px] bg-color-dark-900 cursor-pointer sm:p-[5px] p-[0px] sm:pr-[0px]">
          <div className=" flex items-center sm:h-full h-[34px] rounded-[5px] bg-color-dark-900  sp-[0px] p-[5px] sm:border-none">
            <input
              className="outline-none w-full rounded-[5px] px-[5px] search-input h-full"
              type="text"
              placeholder="Tìm kiếm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="square-container-m flex items-center justify-center">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
        <div className="square-container-m flex items-center justify-center bg-color-dark-700 rounded-[5px] relative">
          <div
            className="square-container-m flex items-center justify-center text-[1rem] font-bold cursor-pointer"
            onClick={toggleFilterModal}
          >
            <i className="fa-solid fa-filter"></i>
          </div>
          {isFilterVisible && (
            <div
              className="absolute w-[120px] top-[110%]  left-[-250%] font-Nunito z-20 font-bold bg-bg-light border-1 border-cl-border rounded-[5px] text-[0.9rem] text-text-dark-700"
              ref={filterRef}
            >
              <div
                className="w-full h-[34px] flex items-center justify-center text-center px-[10px] hover:bg-color-dark-900 cursor-pointer"
                onClick={() => handleSortOrderChange("newest")}
              >
                <span>Tạo gần đây</span>
              </div>
              <div
                className="w-full h-[34px] flex items-center justify-center text-center px-[10px] hover:bg-color-dark-900 cursor-pointer"
                onClick={() => handleSortOrderChange("oldest")}
              >
                <span>Cũ nhất</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex flex-col height-container-plans custom-scrollbar overflow-auto gap-[5px] mt-[20px]">
        {sortPlans().map((plan) => (
          <Link
            key={plan.id}
            to={`plans/${plan.id}`}
            onClick={() => setSelectedPlanId(plan.id)}
          >
            <Plan
              plan={plan}
              isActive={selectedPlanId === plan.id}
              openConfirmModal={openConfirmModal}
            />
          </Link>
        ))}

        {confirmModal && (
          <ConfirmModal
            onClose={closeConfirmModal}
            onConfirm={onConfirm}
            notify={notify}
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
