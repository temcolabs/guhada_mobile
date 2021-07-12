export function devLog(v) {
  if (process.env.NODE_ENV === 'development') {
    console.log(...arguments);
  }
}

export function devWarn(v) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(...arguments);
  }
}

export function devDir(v) {
  if (process.env.NODE_ENV === 'development') {
    console.dir(...arguments);
  }
}

export function devGroup(v) {
  if (process.env.NODE_ENV === 'development') {
    console.group(...arguments);
  }
}

export function devGroupEnd(v) {
  if (process.env.NODE_ENV === 'development') {
    console.groupEnd(...arguments);
  }
}

export function devTable(v) {
  if (process.env.NODE_ENV === 'development') {
    console.table(...arguments);
  }
}
