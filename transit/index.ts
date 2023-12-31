import { Stop, getData } from "./transit_data";
import dayjs, { Dayjs } from "dayjs";
import { Bus, drawBuses } from "./transit_render";

// .filter(notWithin)
function notWithin(minutes: number) {
  return (time) => time.getTime() > Date.now() + 1000 * 60 * minutes;
}

// .sort(byTime)
function byTime(a: Date, b: Date) {
  return a.getTime() - b.getTime();
}

(async () => {
  const nextStopTimes = await getData();

  const nextNorthBoundIon = nextStopTimes
    .get(Stop.IONNorthbound)
    ?.map((time) => time[1])
    .sort(byTime)
    .filter(notWithin(4));

  const nextSouthBoundIon = nextStopTimes
    .get(Stop.IONSouthbound)
    ?.map((time) => time[1])
    .sort(byTime)
    .filter(notWithin(4));

  const next201 = nextStopTimes
    .get(Stop.PhillipAcrossFromICON)
    ?.filter((time) => time[0] === "201")
    ?.map((time) => time[1])
    .sort(byTime)
    .filter(notWithin(2));

  const next31 = nextStopTimes
    .get(Stop.PhillipAcrossFromICON)
    ?.filter((time) => time[0] === "31")
    ?.map((time) => time[1])
    .sort(byTime)
    .filter(notWithin(2));

  const buses: Bus[] = [
    { route: "301n", colour: "blue", arrivalTime: dayjs(nextNorthBoundIon?.shift()) },
    { route: "301S", colour: "blue", arrivalTime: dayjs(nextSouthBoundIon?.shift()) },
    { route: "201", colour: "grey", arrivalTime: dayjs(next201?.shift()) },
    { route: "31", colour: "tan", arrivalTime: dayjs(next31?.shift()) },
  ];
  drawBuses(buses);
})();
