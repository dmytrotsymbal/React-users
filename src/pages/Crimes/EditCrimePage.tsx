import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { CriminalRecords } from "../../types/criminalRecordsTypes";
import { getCriminalRecordById } from "../../redux/criminalRecordSlice";
import { useParams } from "react-router-dom";

const EditCrimePage = () => {
  const { crimeId } = useParams<{ crimeId: string }>(); // Отримуємо параметр carId з URL

  const dispatch = useAppDispatch();

  const criminalRecord = useAppSelector((state: RootState) =>
    state.crime.criminalRecords.find(
      (criminalRecord: CriminalRecords) =>
        criminalRecord.criminalRecordID === Number(crimeId)
    )
  );

  useEffect(() => {
    dispatch(getCriminalRecordById(Number(crimeId)));
  }, [dispatch, crimeId]);

  console.log("criminalRecord = ", criminalRecord);
  return <div>EditCrimePage</div>;
};
export default EditCrimePage;
