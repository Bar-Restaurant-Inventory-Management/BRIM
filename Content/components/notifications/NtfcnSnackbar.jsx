import React,{useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export default function NtfcnSnackbar() {
	const [open, setOpen] = React.useState(false);
	const [message,setMessage]=React.useState("");


	useEffect(() => {
		const sse = new EventSource('/notification/get', { withCredentials: true });
		function getRealtimeData(data) {
			console.log(data);
			console.log("sse success");
			setMessage(data);
			setOpen(true);
			// process the data here,
			// then pass it to state to be rendered
		}
		sse.onmessage = e => getRealtimeData((e.data));
		sse.onerror = () => {
			console.log("error");
			// error log here 

			//sse.close();
		}
		return () => {
			console.log("sse dead")
			sse.close();
		};
	}, []);
	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			setOpen(false);
			return;
		}

		setOpen(false);
	};

	return (
		<div>
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				open={open}
				autoHideDuration={6000}
				onClose={handleClose}
				message={message}
				action={
					<React.Fragment>
						<IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
							<CloseIcon fontSize="small" />
						</IconButton>
					</React.Fragment>
				}
			/>
		</div>
	);
}