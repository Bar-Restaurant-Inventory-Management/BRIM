import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ItemTextFeild from './ItemTextFeild.jsx';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import GreenSwitch from '../widgets/GreenSwitch.jsx';
import ItemUnitSelect from './ItemUnitSelect.jsx';

export default function ItemDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState({
    newItemName: '',
    newItemLoEst: '',
    newItemHiEst: '',
    newItemIdeal: '',
    newItemPar: '',
    newItemBrand: '',
    newItemPrice: '',
    newItemBotSize: '',
    newItemUPC: '',
    newItemVintage: false,
    newItemUnits: 1,
  })

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleCancel = () => {

    setOpen(false);
  }
  const handleClose = () => {
    let data = new FormData();
    let submitUrl = "/inventory/newitem" 
    data.append('name', values.newItemName);
    data.append('lo', values.newItemLoEst);
    data.append('hi', values.newItemHiEst);
    data.append('ideal', values.newItemIdeal);
    data.append('par', values.newItemPar);
    data.append('brand', values.newItemBrand);
    data.append('price', values.newItemPrice);
    data.append('size', values.newItemBotSize);
    data.append('upc', values.newItemUPC);
    data.append('vinatage', values.newItemVintage);
    data.append('units', values.newItemUnits);
    let xhr = new XMLHttpRequest(); 

    xhr.open('POST',submitUrl,true);
    xhr.onload = () =>{
      console.log("Done");
    }
    xhr.send(data);
    setOpen(false);
    
  };

  const handleChangeText =(event)=>{
    setValues({...values,[event.target.id]:event.target.value});
  };
  const handleChangeSelect = (event)=>{
    setValues({...values,newItemUnits:event.target.value});
  }
  const handleChangeSwitch =(event)=>{

    setValues({...values,[event.target.id]:event.target.checked});
  };
  const displayValues = ()=>{
    console.log(values);
  };
  //console.log(props);
  return (
    <div>
        <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
            <AddIcon />
        </Fab>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create New Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Item information:
          </DialogContentText>
          <ItemTextFeild id={"newItem" + "Name"} label = "Name" dbl={false} onChange = {handleChangeText}/> 
          <ItemTextFeild id={"newItem" + "LoEst"} label = "Lower Estimate" dbl={false}onChange = {handleChangeText}/> 
          <ItemTextFeild id={"newItem" + "HiEst"} label = "Upper Estimate" dbl={false}onChange = {handleChangeText}/> 
          <ItemTextFeild id={"newItem" + "Ideal"} label = "Ideal Level" dbl={false}onChange = {handleChangeText}/> 
          <ItemTextFeild id={"newItem" + "Par"} label = "Par Level" dbl={false}onChange = {handleChangeText}/> 
          <ItemTextFeild id={"newItem" + "Brand"} label = "Brand" dbl={false}onChange = {handleChangeText}/> 
          <ItemTextFeild id={"newItem" + "Price"} label = "Price"  dbl={false}onChange = {handleChangeText}/> 
          <ItemTextFeild id={"newItem" + "BotSize"} label = "Bottle Size" dbl={false}onChange = {handleChangeText}/> 
          <ItemTextFeild id={"newItem" + "UPC"} label = "Units per Case" dbl={false}onChange = {handleChangeText}/> 
          <ItemUnitSelect id={"newItem" + "Units"} value={values.newItemUnits} onChange={handleChangeSelect}/>
          <GreenSwitch id={"newItem"+"Vintage"} checked={values.newItemVintage} onChange={handleChangeSwitch} label={"Vintage"} />
        </DialogContent>
        <DialogActions>
          <Button variant = "contained" onClick={handleCancel} color="secondary" startIcon={<CloseIcon/>}>
            Cancel
          </Button>
          <Button variant = "contained" onClick={handleClose} color="primary" startIcon={<DoneIcon/>}>
            Create Item
          </Button>
          <Button variant = "contained" onClick={displayValues} color = "primary">ViewValues</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}