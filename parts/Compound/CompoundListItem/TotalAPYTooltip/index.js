import { memo } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  info: {
    display: 'flex',
    flexDirection: 'column',
    width: 400,
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: 350
    }
  },
}));

const TotalAPYTooltip = () => {
  const classes = useStyles();

  return (
    <div className={classes.info}>
      <Typography>Total APY includes the Compounded APY, which accrues in the form of LP tokens and the SNOB APR, which accrues in the form of Snowball tokens.</Typography>
    </div>
  );
};

export default memo(TotalAPYTooltip);
