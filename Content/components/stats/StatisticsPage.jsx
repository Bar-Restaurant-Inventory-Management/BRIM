import 'date-fns';
import React, { useEffect } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import Chart from './Chart.jsx';

const useStyles = makeStyles({
    dropdown: {
        marginTop: "1rem",
        marginBottom: "1rem",
    },
    datepicker: {
        marginTop: "1rem",
        marginBottom: "1rem",
        width: "100%",
    },
});

export default function StatisticsPage(props) {
    const classes = useStyles();

    let [state, updateState] = React.useState({
        items: [],
    });
    const [inventoryItem, setInventoryItem] = React.useState(null);
    var previousWeek = new Date();
    previousWeek.setDate( previousWeek.getDate() - 7 );
    const [startDate, setStartDate] = React.useState(previousWeek);
    const [endDate, setEndDate] = React.useState(new Date());

    const loadItemsFromServer = () => {
        let dataurl = "/inventory/itemnames"
        let xhr = new XMLHttpRequest();
        xhr.open('GET', dataurl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = () => {
            let data = JSON.parse(xhr.responseText);
            updateState({
                items: data.items
            });
            setInventoryItem(data.items[0])
        };
        xhr.send();
    }

    const getDrinkStatsByDate = (newValue) => {
        let data = new FormData;
        let dataurl = "inventory/drinkstatsbydate" + "-" + (newValue.id);
        data.append("drinkId", newValue.id);
        let xhr = new XMLHttpRequest();
        xhr.open('GET', dataurl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        console.log(newValue);

        xhr.onload = () => {
            let stats = JSON.parse(xhr.responseText);
            console.log(stats);
        };
        xhr.send();
    }

    useEffect(() => {
        loadItemsFromServer()
    }, []);

    return (
        <Grid container>
            <Grid container item xs={12} md={10} justify="space-evenly"> 
                <Grid item xs={3}> 
                    <Autocomplete
                        className={classes.dropdown}
                        id="Inventory Item"
                        options={state.items}
                        getOptionLabel={(option) => option.name}
                        value={inventoryItem}
                        onChange={(event, newValue) => {
                            setInventoryItem(newValue);
                            getDrinkStatsByDate(newValue)
                        }}
                        renderInput={(params) => <TextField {...params} label="Inventory Item" variant="outlined" />}
                        />
                </Grid>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>

                    <Grid item xs={3}>
                        <KeyboardDatePicker
                            className={classes.datepicker}
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="start-date-stat-picker"
                            label="Start Date"
                            disableFuture={true}
                            autoOk={true}
                            maxDate={endDate}
                            value={startDate}
                            onChange={(event, newValue) => {
                                setStartDate(newValue);
                            }}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            />
                    </Grid>

                    <Grid item xs={3}>
                        <KeyboardDatePicker
                            className={classes.datepicker}
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="end-date-stat-picker"
                            label="End Date"
                            disableFuture={true}
                            autoOk={true}
                            minDate={startDate}
                            value={endDate}
                            onChange={(event, newValue) => {
                                setEndDate(newValue);
                            }}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </Grid>
                </MuiPickersUtilsProvider>
            </Grid>

            <Grid container item xs={10} lg={11}>
                <Chart />
            </Grid>

        </Grid>
    );
}
