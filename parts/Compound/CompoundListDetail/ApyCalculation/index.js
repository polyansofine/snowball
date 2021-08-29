import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  boldSubtitle: {
    fontWeight: 600,
  },
}));

const ApyCalculation = ({
  dailyAPR,
  yearlyAPY,
  performanceFees,
}) => {
  const classes = useStyles();

  return (
    <Grid className={classes.root}>
      <Typography variant="subtitle1" className={classes.boldSubtitle}>
        Compounded APY
      </Typography>
      <div className={classes.container}>
        <Typography variant="body2">Base APR</Typography>
        <Typography variant="subtitle2">
          {typeof(dailyAPR) === 'number' ? (dailyAPR * 365)?.toFixed(2) : dailyAPR}%
        </Typography>
      </div>
      <div className={classes.container}>
        <Typography variant="body2">Compounded APY</Typography>
        <Typography variant="subtitle2">{typeof(yearlyAPY) === 'number' ? yearlyAPY?.toFixed(2): yearlyAPY}%</Typography>
      </div>
      <div className={classes.container}>
        <Typography variant="body2">Performance Fee</Typography>
        <Typography variant="subtitle2">{performanceFees}%</Typography>
      </div>
    </Grid>
  );
};

export default memo(ApyCalculation);
