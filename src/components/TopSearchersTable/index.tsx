import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";
import { getTopSearchers } from "../../store/authSlice";

const TopSearchersTable = () => {
  const dispatch = useAppDispatch();

  const { topSearchers } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(getTopSearchers());
  }, [dispatch]);

  console.log(topSearchers);

  return (
    <div>
      {topSearchers.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Нікнейм</th>
              <th>Кількість пошуків</th>
            </tr>
          </thead>
          <tbody>
            {topSearchers.map((user) => (
              <tr key={user.staffID}>
                <td>{user.nickname}</td>
                <td>{user.searchCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Немає даних</p>
      )}
    </div>
  );
};
export default TopSearchersTable;
