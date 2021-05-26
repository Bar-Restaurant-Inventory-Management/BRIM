import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import Chart from './Chart.jsx';


export default function StatisticsPage(props) {

    let [state, updateState] = React.useState({
        items: [],
    });

    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());

    let dataurl = "/inventory/itemnames"
    let xhr = new XMLHttpRequest();
    xhr.open('GET', dataurl, true);

    xhr.onload = () => {
        let data = JSON.parse(xhr.responseText);
        updateState({
            items: data.items
        });
    };
    xhr.send();


    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };



    return (
        <Grid container>
            <Grid container item xs={10}> 
                <Grid item xs={3}> 
                    <Autocomplete
                        id="Inventory Item"
                        options={state.items}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
                        />
                </Grid>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>

                    <Grid item xs={3}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="start-date-stat-picker"
                            label="Start Date"
                            disableFuture={true}
                            autoOk={true}
                            value={startDate}
                            onChange={handleStartDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            />
                    </Grid>

                    <Grid item xs={4}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="end-date-stat-picker"
                            label="End Date"
                            disableFuture={true}
                            autoOk={true}
                            value={endDate}
                            onChange={handleEndDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </Grid>

                </MuiPickersUtilsProvider>
                <Grid container item xs={10}> 
                    <Chart />
                </Grid>
            </Grid>
        </Grid>
    );
}
