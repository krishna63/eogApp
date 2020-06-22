import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Card, CardContent, Typography, makeStyles } from "@material-ui/core";
import { useQuery, useSubscription } from "urql";

const getMetricValue = `
  query ($selectedMetricValue: String!) {
    getLastKnownMeasurement(metricName: $selectedMetricValue) {
      value,
      at
    }
  }
`;
const getLastestMetricValue = `
  subscription {
    newMeasurement {
      metric,
      value
    }
  }
`;
const handleMetricValue = (messages: any, response: any) => {
  // console.log(response, messages)
  return response;
};

const useStyles = makeStyles((theme) => {
  // console.log(theme)
  return {
    root: {
      minWidth: 200,
      marginRight: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    "card--title": {
      fontSize: 14,
      fontWeight: theme.typography.fontWeightBold,
    },
  };
});

const MetricCard = (props: any) => {
  const { metricName } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [metricValue, setMetricValue] = useState<number>();
  const [res] = useSubscription({ query: getLastestMetricValue }, handleMetricValue);
  console.log(res);
  if (res.data && res.data.newMeasurement.metric === metricName) {
    console.log(res.data.newMeasurement);
    // setMetricValue(res.data.newMeasurement.value);
  }
  const [metricQryResult] = useQuery({
    query: getMetricValue,
    variables: {
      selectedMetricValue: metricName,
    },
    requestPolicy: "network-only",
  });
  const { data, error } = metricQryResult;
  useEffect(() => {
    if (error) {
      // dispatch(actions.weatherApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    setMetricValue(data.getLastKnownMeasurement.value);
  }, [dispatch, data, error]);

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes["card--title"]} variant="h4" component="h2">
          <strong>{metricName}</strong>
        </Typography>
        <Typography variant="h2" component="div">
          {res.data && res.data.newMeasurement.metric === metricName ? res.data.newMeasurement.value : metricValue}
        </Typography>
      </CardContent>
    </Card>
  );
};
export default MetricCard;
