import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";
import { getAllHistory } from "../../store/historySlice";

const AllHistoryTable = () => {
  const dispatch = useAppDispatch();

  const { history } = useAppSelector((state: RootState) => state.history);

  useEffect(() => {
    dispatch(getAllHistory());
  }, [dispatch]);

  console.log("getAllHistory", history); // я вивожу масив в консоль
  return <div>index</div>;
};
export default AllHistoryTable;
