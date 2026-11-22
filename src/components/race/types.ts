export interface LapEntry {
  /** Permanent horse number (1-20). */
  number: number
  /** Runner color used by the marker and dot. */
  color: string
  name: string
  /** Formatted finish time, e.g. `12.84s`. */
  time: string
}
