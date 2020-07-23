import { useRef } from "react";
import { useFetcher } from "./useFetcher";
import useSWR, { responseInterface, ConfigInterface } from "swr";

export type TransformFn<Data, TransformedData> = (
  data: Data
) => TransformedData | Promise<TransformedData>;
export type DecodeParams = object | string;

type KeyFunction = () => string | [string, DecodeParams] | null;
type SWRKey = string | KeyFunction | null;
export type FetchKey = SWRKey | [string, DecodeParams] | KeyFunction;

function useDecode<Data = any>(
  firstArg: FetchKey
): responseInterface<Data, any>;
function useDecode<Data = any>(
  firstArg: FetchKey,
  config?: ConfigInterface<Data>
): responseInterface<Data, any>;
function useDecode<Data = any>(
  firstArg: FetchKey,
  fn: TransformFn<Data, unknown>,
  config?: ConfigInterface<Data>
): responseInterface<ReturnType<typeof fn>, any>;
function useDecode<Data = any, TransformedData = any>(...args: any[]) {
  let fn: TransformFn<Data, TransformedData> | undefined | null,
    config: undefined | ConfigInterface<Data> = {};

  let [key, params] = parseFirstArg(args[0]);

  if (args.length > 2) {
    fn = args[1];
    config = args[2];
  } else {
    if (typeof args[1] === "function") {
      fn = args[1];
    } else if (typeof args[1] === "object") {
      config = args[1];
    }
  }
  let fetcher = fn ? useFetcher<Data, TransformedData>(fn) : useFetcher();

  let useSWRFirstArg = params ? [key, JSON.stringify(params)] : key;

  return useSWR<Data>(useSWRFirstArg, fetcher, config);
}

let parseFirstArg = (arg: FetchKey): [SWRKey, DecodeParams | null] => {
  let key: SWRKey, params: DecodeParams | null;
  if (typeof arg === "function") {
    try {
      arg = arg();
    } catch (err) {
      // dependencies not ready
      key = "";
      return [key, null];
    }

    return parseFirstArg(arg);
  }

  if (Array.isArray(arg)) {
    key = arg[0];
    params = arg[1];
  } else {
    key = arg;
    params = null;
  }
  return [key, params];
};

export { useDecode };
