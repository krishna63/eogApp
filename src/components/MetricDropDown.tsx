import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useQuery } from "urql";
import { actions } from "../Features/DashBoard/reducer";

const query = `
query {
  getMetrics
}`;

const getSelectedMetricQuery = `
  query($a: String!) {
    getMeasurements(input: {metricName: $a}){
      metric,
      value,
      at,
      unit
    }
  }
`;
export type Metric = {
  title: string;
  value: string;
};

const MetricDropDown = (props: any) => {
  const dispatch = useDispatch();
  const [metricList, setMetricsList] = useState<Array<string>>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<Array<string>>([]);
  const [result] = useQuery({
    query,
  });
  const [metricResults] = useQuery({
    query: getSelectedMetricQuery,
    variables: {
      a: "waterTemp",
    },
    pause: true,
  });
  const { data, error } = result;
  const { fetching: selMetFetching, data: selData, error: selDataError } = metricResults;
  useEffect(() => {
    if (error) {
      // dispatch(actions.weatherApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMetrics } = data;

    setMetricsList([...getMetrics]);
    // dispatch(actions.weatherDataRecevied(getWeatherForLocation));
  }, [dispatch, data, error]);

  useEffect(() => {
    console.log(selMetFetching, selData, selDataError);
  }, [selMetFetching, selData, selDataError]);

  return (
    <Autocomplete
      multiple
      id="tags-standard"
      onChange={(event: any, choosenMetrics: Array<string>) => {
        const filteredMetrics = metricList.filter((eachMetric) => choosenMetrics.indexOf(eachMetric) === -1);
        setSelectedMetrics([...filteredMetrics]);
        // const test: string[] = ["waterTemp"];
        dispatch(actions.userSelectedMetrics({ selectedMetricsList: choosenMetrics }));
      }}
      options={selectedMetrics.length ? selectedMetrics : metricList}
      getOptionLabel={(option) => option}
      renderInput={(params) => <TextField {...params} variant="standard" placeholder="Select ..." />}
    />
  );
};

export default MetricDropDown;
