import { Grid } from "@mui/material";
import UsersTable from "../../components/UsersTable";
import TopSearchersTable from "../../components/TopSearchersTable";

const UsersPage = () => {
  return (
    <>
      <UsersTable />

      <Grid container spacing={2} sx={{ height: "300px", mb: 2 }}>
        <Grid item xs={6}>
          <TopSearchersTable />
        </Grid>

        <Grid item xs={6}></Grid>
      </Grid>
    </>
  );
};
export default UsersPage;
