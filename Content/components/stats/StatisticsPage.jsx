import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';


export default function StatisticsPage(props) {

    let [state, updateState] = React.useState({
        items: [],
    });

    const [selectedDate, setSelectedDate] = React.useState(new Date());

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

    const handleDateChange = (date) => {
        setSelectedDate(date);
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
                            value={selectedDate}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            />
                    </Grid>

                    <Grid item xs={3}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="end-date-stat-picker"
                            label="End Date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </Grid>

                </MuiPickersUtilsProvider>

            </Grid>
        </Grid>
    );
}
