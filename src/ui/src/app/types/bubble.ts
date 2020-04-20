import Timeout = NodeJS.Timeout;

export type Bubble<T> = {
  coordinates: { x: number | string, y: number | string },
  data: T,
  hidden: boolean,
  timeout: Timeout
}
