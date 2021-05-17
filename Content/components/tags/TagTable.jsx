import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button, Container } from '@material-ui/core';
import TagAddField from './TagAddField.jsx';
import TagDelButton from './TagDelButton.jsx'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  root:{
    width: 1000,
  },
});

export default function TagTable(props) {
  const classes = useStyles();
	let [state, updateState]= React.useState({
		tags:[],
	});
  useEffect(()=>{
    loadTagsFromServer()
  },[]);

  
  useEffect(()=>{
    const interval = setInterval(()=>{
      loadTagsFromServer()
    },60000);
    return ()=> clearInterval(interval);
  },[]);
  

  const loadTagsFromServer=()=>{
    console.log("Loading tags:")
    let itemurl='/inventory/tags'
    let xhr = new XMLHttpRequest();
    xhr.open('GET',itemurl,true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.onload = ()=>{

      console.log("Updated tags");
      console.log(xhr.responseText);

      let data = JSON.parse(xhr.responseText);
      updateState({
        tags: data.tags
      });
      console.log(data.tags);
      
    };
    xhr.send();
    
  }
  const onTagSubmit=()=>{
    loadTagsFromServer();
  }
  return (

    <Grid container className={classes.root} spacing={5} direction="column"
          justify="flex-start"
          alignItems="stretch">
      <Grid item xs={12}>
        <Grid container justify="center" spacing={2} direction="row" alignItems = "flex-start">
          <Grid item xs={12}>
            <TagAddField onTagSubmit={onTagSubmit}/>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.tags.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row" align="center">
                        {row.name}
                      </TableCell>
                      <TableCell align="center">
                        <TagDelButton tag={row} onClick={loadTagsFromServer}/>
						          </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>

      
          
    </Grid>
  );
}