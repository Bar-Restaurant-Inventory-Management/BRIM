import React from 'react';
import { BrowserRouter, Route,StaticRouter, Switch } from "react-router-dom";
import ItemTableBasic from './items/ItemTable.jsx'
import RecipeTable from './recipes/RecipeTable.jsx'
import TagTable from './tags/TagTable.jsx'
import NavDrawer from "./NavDrawer.jsx";
import { makeStyles } from "@material-ui/core/styles";
import { Helmet} from 'react-helmet';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const useStyles = makeStyles({
  container: {
    display: "flex"
  }
});
const theme = createMuiTheme({
  palette:{
    type: "dark",
  }
})

export default function App(props) {
  console.log("App Props: ");
  console.log(props);
  let [state, updateState]= React.useState({
		items:props.initialItems
	});
  const classes = useStyles();
  const app = (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
    <div className={classes.container}>
      <Helmet>
        <title>
          BRIM
        </title>
      </Helmet>
      <NavDrawer />
      <Switch>
        <Route exact from="/" render={props => <ItemTableBasic initialItems={state.items}  />} />
      </Switch>
      <Switch>
        <Route exact from="/recipes" render={props => <RecipeTable  />} />
      </Switch>
      <Switch>
        <Route exact from="/tags" render={props=> <TagTable/>}/>
      </Switch>
    </div>
  </ThemeProvider>
  );
  if (typeof window === 'undefined') {
    console.log("Undefined window");
			return (
				<StaticRouter
					context={props.context}
					location={props.location}
				>
					{app}
				</StaticRouter>
			);
		}
  return <BrowserRouter>{app}</BrowserRouter>
}