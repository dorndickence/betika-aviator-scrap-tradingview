import { createChart, ColorType } from "lightweight-charts";
import React, { useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import useStore from "./store";

export const ChartComponent = (props) => {
  const {
    data,
    colors: {
      backgroundColor = "white",
      lineColor = "#2962FF",
      textColor = "black",
      areaTopColor = "#2962FF",
      areaBottomColor = "rgba(41, 98, 255, 0.28)",
    } = {},
  } = props;

  const chartContainerRef = useRef();
  const chartRef = useRef();
  const seriesRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: chartContainerRef.current.clientWidth,
      height: 600,
      timeScale: {
        timeVisible: true, // Ensures time is visible on the x-axis
        secondsVisible: true, // Ensures seconds are visible if applicable
      },
    });
    chart.timeScale().fitContent();

    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.time || !param.seriesData) return;

      const hoveredValue = param.seriesData.get(seriesRef.current);
      const hoveredTime = param.time;

      if (hoveredValue !== undefined) {
        console.log(`Crosshair Time: ${hoveredTime}, Value: ${hoveredValue}`);
        // You can use these values to draw a line or perform other actions
      }
    });

    const newSeries = chart.addAreaSeries({
      lineColor,
      topColor: areaTopColor,
      bottomColor: areaBottomColor,
    });
    seriesRef.current = newSeries;

    chartRef.current = chart;

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
  ]);

  useEffect(() => {
    if (seriesRef.current) {
      seriesRef.current.setData(data);
    }
  }, [data]);

  return <div ref={chartContainerRef} />;
};

export function Chart(props) {
  const { selectedPeriod } = useStore();
  const [socket, setSocket] = useState(null)
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log(selectedPeriod, "from chart.js");
    if(socket)
    socket.emit("period",selectedPeriod)
  }, [selectedPeriod]);

  useEffect(() => {

    const socket = io("http://localhost:3000",{
      transports: ['polling', 'websocket'],
    });
    setSocket(socket)
    socket.on("connect", (con) => {
      console.log(`Connected to server ${socket.id}`);
    });
    socket.on("data", (data) => {
      // console.log(data);
      
      setData(data);
    });
  }, []);

  const parsedData = data
    .map(({ closed_at, value }) => {
      return {
        time: new Date(closed_at) / 1000,
        value,
      };
    })
    .sort((a, b) => a.time - b.time);

  // console.log(parsedData);

  return <ChartComponent {...props} data={parsedData}></ChartComponent>;
}