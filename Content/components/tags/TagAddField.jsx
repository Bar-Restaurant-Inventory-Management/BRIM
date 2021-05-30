import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddCircle from '@material-ui/icons/AddCircle';
import TextField from '@material-ui/core/TextField';

export default function TagAddField(props){
	const [text,setText]=React.useState("");
	const handleChange = (event) =>{
		setText(event.target.value)
	}
	const submitTag = () =>{
		let data = new FormData;
		let submitUrl = "/inventory/addtag"
		data.append('name',text);
		data.append('id',1);
		 console.log(data);

		let xhr= new XMLHttpRequest();

		xhr.open('POST',submitUrl,true);
		xhr.onload=()=>{
			props.onTagSubmit();
			console.log("Tag Submitted");
		}
		xhr.send(data);
	}
	const AddButton = (props) =>(
		<IconButton onClick={props.onClick}>
			<AddCircle />
		</IconButton>
	)
	return(
		<TextField
			margin="dense"
			id="tagadd"
			placeholder="Add Tag"
			variant="filled"
			fullWidth
			style={{margin: 8}}
			InputProps={{endAdornment: <AddButton onClick={submitTag}/>}}
			onChange={handleChange}
		/>
	);
}