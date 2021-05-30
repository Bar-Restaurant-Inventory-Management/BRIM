import React, { useEffect } from "react";
import {
  Drawer as MUIDrawer,
  ListItem,
  List,
  ListItemIcon,
    ListItemText,
    Divider
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InsertChartIcon from '@material-ui/icons/InsertChart';
import LocalBarIcon from '@material-ui/icons/LocalBar';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import { withRouter } from "react-router-dom";

//https://codesandbox.io/s/winter-brook-fnepe?file=/src/Drawer.jsx:0-1323
const useStyles = makeStyles({
  drawer: {
    width: "150px",
    marginLeft: "50px"
  }
});

const NavDrawer = props => {
  const { history } = props;
  const classes = useStyles();
  const itemsList = [
    {
      text: "Inventory Items",
      icon: <LocalBarIcon />,
      onClick: () => history.push("/")
    },
    {
      text: "Recipe Book",
      icon: <LibraryBooksIcon />,
      onClick: () => history.push("/recipes")
    },
    {
      text: "Statistics",
      icon: <InsertChartIcon />,
      onClick: () => history.push("/stat")
    },
    {
      text: "Tags",
      icon: <InboxIcon />,
      onClick:()=>history.push("/tags")
    },
  ];
  return (
    <MUIDrawer variant="permanent" className={classes.drawer}>
      <List>
        {itemsList.map((item, index) => {
          const { text, icon, onClick } = item;
            return (
              <div>
                <ListItem button key={text} onClick={onClick}>
                  {icon && <ListItemIcon>{icon}</ListItemIcon>}
                  <ListItemText primary={text} />
                </ListItem>
               
                <Divider />
               </div>
          );
        })}
      </List>
    </MUIDrawer>
  );
};

export default withRouter(NavDrawer);