import { Grid } from "@mui/material";
import UsersTable from "../../components/UsersTable";
import TopSearchersTable from "../../components/TopSearchersTable";

const UsersPage = () => {
  return (
    <>
      <UsersTable />

      <br />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TopSearchersTable />
        </Grid>

        <Grid item xs={6}>
          <div
            style={{ height: "100%", width: "100%", backgroundColor: "red" }}
          ></div>
        </Grid>
      </Grid>
    </>
  );
};
export default UsersPage;
