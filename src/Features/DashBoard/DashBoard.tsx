import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import MetricDropDown from '../../components/MetricDropDown';
import MetricCard from '../../components/MetricCard';
import MetricChart from '../../components/MetricChart';
import { Provider } from 'urql';
import client from '../../common/client';
import { IState } from '../../store';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 400,
    marginRight: theme.spacing(6),
    '& > * + *': {
      marginTop: theme.spacing(6),
    },
  },
  graph__Root: {
    marginTop: theme.spacing(0),
  },
}));

const getMetricsList = (state: IState) => {
  const { selectedMetricsList } = state.dashboard;
  return {
    selectedMetricsList,
  };
};
export default () => {
  return (
    <Provider value={client}>
      <DashBoard />
    </Provider>
  );
};

const DashBoard: React.FC = () => {
  const classes = useStyles();
  const { selectedMetricsList } = useSelector(getMetricsList);
  return (
    <>
      <Box display="flex" component="div" p={1} bgcolor="background.paper">
        <Box p={1} display="flex" flexWrap="wrap" flexGrow={1}>
          {selectedMetricsList &&
            selectedMetricsList.length > 0 &&
            selectedMetricsList[0] !== '' &&
            selectedMetricsList.map((echSelMetric: string, metricIndex: number) => {
              return <MetricCard key={metricIndex} metricName={echSelMetric} />;
            })}
        </Box>
        <Box p={1} className={classes.root} flexWrap="nowrap">
          <MetricDropDown />
        </Box>
      </Box>
      <Box bgcolor="background.paper" component="div" p={3} className={classes.graph__Root}>
        {selectedMetricsList && selectedMetricsList.length > 0 && selectedMetricsList[0] !== '' && (
          <MetricChart chartsForMetrics={[...selectedMetricsList]} />
        )}
      </Box>
    </>
  );
};
