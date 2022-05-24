/* eslint-disable no-param-reassign */
// import type {Status} from './issue';
// type Status = string;
import debug from 'debug';

const log = debug('app:server:summary:format');
type UnformattedSummary<Status> = {_id:{owner:string, status:Status}, count:number}[]
export type FormattedSummary<Status> = {owner:{[S in Status]?:number}}[]

export function addPath(obj:Object, path:string[], value:unkown) {
// let cur= obj;
  path.reduce((cur, prop, i) => {
    if (i === path.length - 1) {
      cur[prop] = value;
    } else {
      if (cur[prop] === undefined) {
        cur[prop] = {};
      }
      return cur[prop];
    }
  }, obj);
}

export function formatSummary(
  unformattedSummary:UnformattedSummary<string>,
):FormattedSummary<string> {
  const formattedSummary = {};
  unformattedSummary.forEach((entry) => {
    const { _id: { owner, status }, count } = entry;
    addPath(formattedSummary, [owner, status], count);
  });

  return formattedSummary;
}
