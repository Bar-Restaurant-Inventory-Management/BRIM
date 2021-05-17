import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import ItemTextFeild from '../items/ItemTextFeild.jsx'

export default function EditRecipeDialog(props) {

	const [open, setOpen] = React.useState(false);
	const [values, setValues] = React.useState({
		recipeName: props.name,
		components: [],
	});
	const [selections, setSelections] = React.useState({
		comps: [],
	});
	React.useEffect(()=>{
		let c = props.components;
		setSelections({
			comps: c,
		})
	},[]);

	const handleClickOpen = () => {
		let dataurl = "/inventory/itemnames"
		let xhr = new XMLHttpRequest();
		xhr.open('GET', dataurl, true);

		xhr.onload = () => {
			let data = JSON.parse(xhr.responseText);
			console.log(data);
			setValues({
				...values,
				components: data.items,
			});
		};
		xhr.send();
		setOpen(true);

		//fetch recipe data and populate
	};
	const handleCancel = () => {

		setOpen(false);
	}
	const handleSave = () => {
		/*let submitUrl = "/inventory/newrecipe"
		let combined = {
			name: values.newRecipeName,
			components: selections.comps
		}

		let xhr = new XMLHttpRequest();
		console.log(selections.comps);
		xhr.open('POST', submitUrl, true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = () => {
			console.log("Done");
		}
		xhr.send(JSON.stringify(combined));

		setOpen(false);*/
	};

	const handleChangeText = (event) => {
		setValues({ ...values, [event.target.id]: event.target.value });
	};
	console.log(selections.comps);
	return (
		<div>
			<Button variant="contained" color="primary" aria-label="add" onClick={handleClickOpen}>
				Details
			</Button>

			<Dialog open={open} onClose={handleSave} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Edit Recipe</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Recipe Information:
          				</DialogContentText>
					<ItemTextFeild id={"newRecipe" + "Name"} label="Name" dbl={false} onChange={handleChangeText} value={values.recipeName} />
					<Autocomplete
						id="component_select"
						multiple
						filterSelectedOptions
						value={selections.comps}
						options={values.components}
						getOptionLabel={(option) => option.name}
						getOptionSelected={(option,value)=>value.id === option.id}
						style={{ width: 300 }}
						renderTags={(value, getTagProps) =>
							value.map((option, index) => (
								<Chip variant="outlined" label={option.name} {...getTagProps({ index })} />
							))
						}
						renderInput={(params) =>
							<TextField
								{...params}
								label="Select Recipe Components"
								variant="filled"
							/>
						}
						onChange={(event, newValue) => {
							console.log(newValue);
							selections.comps = newValue
							setSelections({ ...selections })
							console.log(selections);
						}}
					/>
					<TableContainer component={Paper}>
						<Table size="small">
							<TableHead>
								<TableRow>
									<TableCell align="center">Component</TableCell>
									<TableCell align="center">Quantity</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{
									selections.comps.map((row) => (
										<TableRow key={row.id}>
											<TableCell component="th" scope="row">
												{row.name}
											</TableCell>
											<TableCell align="center">
												<TextField
													variant="filled"
													type="number"
													defaultValue={row.quantity}
													onChange={(event) => {
														selections.comps[selections.comps.indexOf(row)].quantity = event.target.value;
														console.log(selections.comps[selections.comps.indexOf(row)]);
													}}
												/>
											</TableCell>
										</TableRow>
									))
								}
							</TableBody>
						</Table>
					</TableContainer>
				</DialogContent>
				<DialogActions>
					<Button variant="contained" onClick={handleCancel} color="secondary" startIcon={<CloseIcon />}>
						Cancel
          				</Button>
					<Button variant="contained" onClick={handleSave} color="primary" startIcon={<DoneIcon />}>
						Save Item
          				</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}