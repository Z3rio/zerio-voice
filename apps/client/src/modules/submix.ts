import { Submix } from "../classes/submix";

export const RadioSubmix = new Submix(
  "Radio",
  0,
  {
    frontLeftVolume: 1,
    frontRightVolume: 0.25,
    rearLeftVolume: 0,
    rearRightVolume: 0,
    channel5Volume: 1,
    channel6Volume: 1
  },
  "default"
);

export const CallSubmix = new Submix("Call", 1, {
  frontLeftVolume: 0.1,
  frontRightVolume: 0.5,
  rearLeftVolume: 0,
  rearRightVolume: 0,
  channel5Volume: 1,
  channel6Volume: 1
});
