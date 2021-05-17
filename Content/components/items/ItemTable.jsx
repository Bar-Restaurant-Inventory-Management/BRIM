import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ItemDialog from './ItemDialog.jsx'
import AddItemFab from './AddItemFab.jsx'
import { Button, Container } from '@material-ui/core';
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

export default function ItemTableBasic(props) {
  const classes = useStyles();
	let [state, updateState]= React.useState({
		items:[],
	});
  useEffect(()=>{
    loadItemsFromServer()
  },[]);

  
  useEffect(()=>{
    const interval = setInterval(()=>{
      loadItemsFromServer()
    },60000);
    return ()=> clearInterval(interval);
  },[]);
  

  const loadItemsFromServer=()=>{
    console.log("Loading items:")
    let itemurl='/inventory/items'
    let xhr = new XMLHttpRequest();
    xhr.open('GET',itemurl,true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.onload = ()=>{

      console.log("Updated items");

      let data = JSON.parse(xhr.responseText);
      updateState({
        items: data.items
      });
      //console.log(data.items);
      
    };
    xhr.send();
    
  }
  const setStatus=(status)=>{
    switch(status){
      case 0:
        return "Empty";
      case 1:
        return "Below Par";
      case 2:
        return "Below Ideal";
      case 3:
        return "Above Ideal";
      default:
        return "Failed to parse";
    }
  }
  /*
  useEffect(()=>{
    //loadItemsFromServer();
    //window.setInterval(loadItemsFromServer,1000);
  });
  */

      //console.log(state.items);
  return (

      <Grid container className={classes.root} spacing={3}
          direction="column"
          justify="flex-start"
          alignItems="stretch">

          <Grid item xs={12}>
            <Grid container justify="center" spacing={2} direction="row" alignItems = "flex-start">
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Drink</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Details</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {state.items.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell component="th" scope="row" align="center">
                            {row.name}
                          </TableCell>
                          <TableCell align="center">{row.estimate}</TableCell>
                          <TableCell align="center">{setStatus(row.status)}</TableCell>
                          <TableCell align="center"><ItemDialog item={row} onItemSubmit={loadItemsFromServer}/></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Grid>

          <Grid container item xs={10} justify="flex-end">
            <Grid item xs={1}>
                <AddItemFab onNewItem={loadItemsFromServer}/>
            </Grid>
          </Grid>
          
    </Grid>
  );
}