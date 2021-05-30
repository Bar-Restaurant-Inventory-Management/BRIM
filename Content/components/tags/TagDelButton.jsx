import React from 'react';

import { Button  } from '@material-ui/core';
export default  function DelTagButton(props){

	const DelTag=()=>{
		let data = new FormData;
		let submitUrl = "/inventory/deltag"
		data.append('name',props.tag.name);
		data.append('id',props.tag.id);
		console.log(data);

		let xhr= new XMLHttpRequest();

		xhr.open('POST',submitUrl,true);
		xhr.onload=()=>{

			props.onClick();
			console.log("Tag Deleted");
		}
		xhr.send(data);
	}
	return (
		<Button variant="contained" color="secondary" onClick={DelTag}>
			Delete
		</Button>
	)
}