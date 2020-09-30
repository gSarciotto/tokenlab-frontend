import React, { useState } from "react";
import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { LoginAndRegisterPage } from "./pages/LoginAndRegister";
import { CalendarPage } from "./pages/Calendar";

const useStyles = makeStyles({
    globalContainer: (theme: Theme) => ({
        height: "100vh",
        width: "100vw",
        padding: "10% 0",
        backgroundColor: theme.palette.primary.main
    })
});

function App(): JSX.Element {
    const theme = useTheme();
    const classes = useStyles(theme);
    const [userToken, setUserToken] = useState("");
    const changeUserToken = (newToken: string): void => {
        setUserToken(newToken);
    };
    return (
        <Grid
            className={classes.globalContainer}
            container
            justify="center"
            alignItems="center"
            color="primary"
        >
            {userToken === "" ? (
                <LoginAndRegisterPage
                    updateAuthenticatedUser={changeUserToken}
                />
            ) : (
                <CalendarPage
                    token={userToken}
                    updateAuthenticatedUser={changeUserToken}
                />
            )}
        </Grid>
    );
}

export default App;
