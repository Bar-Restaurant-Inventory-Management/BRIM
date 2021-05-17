import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import EditRecipe from './EditRecipeDialog.jsx'

const useStyles = makeStyles({
  root: {
		minWidth: "200px",
		margin: "10px",
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});


export default function RecipeCard(props){
	const classes = useStyles();
	console.log(props);
	return(
		<Card className={classes.root} variant="outlined">
			<CardContent>
				<Typography className={classes.title} variant="h5" component="h2" gutterBottom>
					{props.name}	
				</Typography>

				{props.components.map((component) => (
					<Typography key={component.id} variant="body2" component="p">
						{component.name}
					</Typography>
				))}


			</CardContent>

			<CardActions>
				<EditRecipe {...props}/>
			</CardActions>

		</Card>
	);
}