import { TableContainer } from "@mui/material";
import { styled } from "@mui/system";

export const ResponsiveTable = styled(TableContainer)(({ theme }) => ({
    [theme.breakpoints.down("md")]: {
        overflowX: "auto",
    },
}));