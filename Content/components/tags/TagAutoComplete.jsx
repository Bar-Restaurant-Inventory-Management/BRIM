/* eslint-disable no-use-before-define */
import React from 'react';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
}));

export default function TagsAutoComplete(props) {
  const classes = useStyles();
	console.log("props:");
	console.log(props);

	const [allValues,setAllValues]=React.useState(props.allValues);
	const [selValues,setSelVaules]=React.useState(props.selValues);

  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        id="tags-outlined"

        filterSelectedOptions
        options={allValues.list}
		value={selValues.list}
        getOptionLabel={(option) => option.name}
		getOptionSelected={(option,value)=>value.id===option.id}
		renderTags={(value,getTagProps)=>
			value.map((option,index)=>(
				<Chip variant="outlined" label={option.name} {...getTagProps({index})}/>
			))
		}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Add or Remove Tags"
          />
        )}
		onChange={props.onChange}
		style={{width:300}}

      />
    </div>
  );
}

