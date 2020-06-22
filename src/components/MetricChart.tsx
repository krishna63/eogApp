import React, { useEffect, useState, useMemo } from "react";
import { useQuery } from "urql";
// import { useDispatch } from 'react-redux';
import { LineChart, Line, Label, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const getAllMeticChartData = `
  query ($input: [MeasurementQuery]) {
    getMultipleMeasurements(input: $input){
        metric,
        measurements {
          value,
          at,
          unit
        }
      }
  }
`;

const CustomizedAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const ctx = new Date(payload.value).toISOString().substring(11, 16);
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" transform="rotate(0)">
        {ctx}
      </text>
    </g>
  );
};

const MetricChart = (props: any) => {
  // const dispatch = useDispatch();
  const [graphData, setGraphData] = useState<Array<any>>([]);
  const { chartsForMetrics } = props;

  const timeBeforeThirtyMins: number = useMemo(() => {
    return new Date(Date.now() - 30 * 60000).getTime();
  }, [chartsForMetrics]);

  const input = chartsForMetrics.map((eachMetric: string, metricIndex: number) => {
    return {
      metricName: eachMetric,
      after: timeBeforeThirtyMins,
    };
  });

  const [metricChartQry] = useQuery({
    query: getAllMeticChartData,
    variables: {
      input,
    },
  });
  const { data, error } = metricChartQry;

  useEffect(() => {
    if (error) {
      // dispatch(actions.weatherApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;

    setGraphData(data.getMultipleMeasurements);
  }, [error, data, chartsForMetrics]);
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#d0ed57", "#83a6ed", "#8884d8"];
  return (
    <>
      {graphData.length > 0 && (
        <LineChart
          width={1000}
          height={400}
          margin={{
            top: 30,
            right: 20,
            bottom: 20,
            left: 20,
          }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="at"
            name="time"
            scale="time"
            type="number"
            domain={["auto", "auto"]}
            interval="preserveStartEnd"
            tick={<CustomizedAxisTick />}
          />
          {graphData.map((eachMetric, yIndex) => {
            const { measurements } = eachMetric;
            return (
              <YAxis type="number" dataKey="value" key={yIndex} interval={0} yAxisId={eachMetric.metric}>
                <Label value={measurements[0].unit} offset={15} position="top" />
              </YAxis>
            );
          })}

          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Legend />
          {graphData.map((eachMetric, graphIndex) => {
            return (
              <Line
                dataKey="value"
                data={eachMetric.measurements}
                name={eachMetric.metric}
                dot={false}
                yAxisId={eachMetric.metric}
                stroke={colors[graphIndex]}
                key={eachMetric.metric}
              />
            );
          })}
        </LineChart>
      )}
    </>
  );
};

export default MetricChart;
