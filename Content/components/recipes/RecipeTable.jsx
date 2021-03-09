import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import RecipeCard from './RecipeCard.jsx';
import RecipeCreationFab from './RecipeCreationFab.jsx';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
}));

export default function RecipeTable(props){
  let cdate = new Date();
  let [state,updateState]=React.useState({
    recipes:[],
    curdate:cdate.toLocaleString()
  });
	const loadRecipesFromServer=()=>{
		console.log("Loading items:")
    let itemurl='/inventory/recipes'
    let xhr = new XMLHttpRequest();
    xhr.open('GET',itemurl,true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.onload = ()=>{
      /*
      console.log("##################################################################################")
      console.log(xhr.responseText);

      console.log("##################################################################################")
      */
      let data = JSON.parse(xhr.responseText);
      updateState(prevState=>({
        ...prevState,
        recipes: data.recipes,
        curdate: cdate.toLocaleString()
      }));
    };
    xhr.send();
	}
	useEffect(()=>{
		loadRecipesFromServer();
	},[]);
  console.log(state.recipes)
  //let currentdate= new Date().toLocaleString();

  //  console.log("Last Load: " + currentdate);         
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid container justify="flex-start" alignItems="stretch" >
                <Grid container item xs={10} direction="row"
                    justify="space-around" >
                    {state.recipes.map((row) => (
                        <RecipeCard key={row.id} {...row}></RecipeCard>
                        ))}
                </Grid>

                <Grid container item xs={1} alignItems="flex-end">
                    <Grid item xs={12}> 
                        <RecipeCreationFab />
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );

}