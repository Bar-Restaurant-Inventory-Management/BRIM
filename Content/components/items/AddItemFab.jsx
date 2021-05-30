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
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import TagsAutoComplete from '../tags/TagAutoComplete.jsx';

export default function ItemDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [tags,setTags]=React.useState({
    list:[],
  })
  const [selectedTags,setSelectedTags]=React.useState({
    list:[]
  })
  const [values, setValues] = React.useState({
    newItemName:null, 
    newItemEst:null, 
    newItemIdeal: null,
    newItemPar: null,
    newItemBrand:null, 
    newItemPrice:null, 
    newItemBotSize:null, 
    newItemUPC:null, 
    newItemVintage: 0,
    newItemUnits: 1,
    newItemID: -1,
    newItemTags:[],
  })

  const handleClickOpen = () => {
    let dataurl = "/inventory/tags";
		let xhr = new XMLHttpRequest();
		xhr.open('GET', dataurl, true);

		xhr.onload = () => {
			let data = JSON.parse(xhr.responseText);
			console.log(data);
			setTags({
				list: data.tags,
			});
		};
		xhr.send();
		setOpen(true);
  };
  const handleCancel = () => {

    setOpen(false);
  }
  const handleClose = () => {
    handleSave()
    /*
    let data = new FormData();
    let submitUrl = "/inventory/newitem" 
    data.append('name', values.newItemName);
    data.append('estimate', values.newItemLoEst);
    data.append('ideal', values.newItemIdeal);
    data.append('par', values.newItemPar);
    data.append('brand', values.newItemBrand);
    data.append('price', values.newItemPrice);
    data.append('size', values.newItemBotSize);
    data.append('upc', values.newItemUPC);
    data.append('vintage', values.newItemVintage);
    data.append('units', values.newItemUnits);
    data.append('id',values.newItemID);
    let xhr = new XMLHttpRequest(); 

    xhr.open('POST',submitUrl,true);
    xhr.onload = () =>{
      props.onNewItem();
      console.log("Done");
    }
    xhr.send(data);
    setOpen(false);
    */
    
  };
  const handleSave=()=>{
    let submitUrl="/inventory/newitem"
    let combined={
      name:values.newItemName,
      estimate:values.newItemEst,
      ideal:values.newItemIdeal,
      par:values.newItemPar,
      brand:values.newItemBrand,
      price:values.newItemPrice,
      size:values.newItemBotSize,
      upc:values.newItemUPC,
      vintage:values.newItemVintage,
      units:values.newItemUnits,
      id:values.newItemID,
      tags:selectedTags.list,
    }
    
    let xhr = new XMLHttpRequest();
    xhr.open('POST',submitUrl,true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.onload= () =>{
      props.onItemSubmit();
      console.log("done");
    }
    console.log("combined");
    console.log(JSON.stringify(combined));
    xhr.send(JSON.stringify(combined))
    setOpen(false);
  }

  const handleChangeText =(event)=>{
    setValues({...values,[event.target.id]:event.target.value});
  };
  const handleChangeSelect = (event)=>{
    setValues({...values,newItemUnits:event.target.value});
  }
  const handleChangeTags = (event,newValue)=>{
    console.log("New value");
    console.log(newValue);
    selectedTags.list=newValue;
    setSelectedTags({
      ...selectedTags
    });
    console.log("Selected tags");
    console.log(selectedTags);
  }
  const handleChangeSwitch =(event)=>{

    setValues({...values,[event.target.id]:event.target.checked});
  };
  const displayValues = ()=>{
    console.log(values);
  };
  //console.log(props);
  return (
    <Container>
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
          <ItemTextFeild id={"newItem" + "Est"} label = "Estimate" dbl={false}onChange = {handleChangeText}/> 
          <ItemTextFeild id={"newItem" + "Ideal"} label = "Ideal Level" dbl={false}onChange = {handleChangeText}/> 
          <ItemTextFeild id={"newItem" + "Par"} label = "Par Level" dbl={false}onChange = {handleChangeText}/> 
          <ItemTextFeild id={"newItem" + "Brand"} label = "Brand" dbl={false}onChange = {handleChangeText}/> 
          <ItemTextFeild id={"newItem" + "Price"} label = "Price"  dbl={false}onChange = {handleChangeText}/> 
          <ItemTextFeild id={"newItem" + "BotSize"} label = "Bottle Size" dbl={false}onChange = {handleChangeText}/> 
          <ItemTextFeild id={"newItem" + "UPC"} label = "Units per Case" dbl={false}onChange = {handleChangeText}/> 
          <ItemUnitSelect id={"newItem" + "Units"} value={values.newItemUnits} onChange={handleChangeSelect}/>
          <ItemTextFeild id={"newItem" + "Vintage"} label = "Vintage" dbl={false} onChange={handleChangeText}/>
          <TagsAutoComplete allValues={tags} selValues={selectedTags} onChange={handleChangeTags}/>
        </DialogContent>
        <DialogActions>
          <Button variant = "contained" onClick={handleCancel} color="secondary" startIcon={<CloseIcon/>}>
            Cancel
          </Button>
          <Button variant = "contained" onClick={handleClose} color="primary" startIcon={<DoneIcon/>}>
            Create Item
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}