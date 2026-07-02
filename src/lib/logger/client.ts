export const logger = {
  info: (...args: Parameters<typeof console.log>) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args)
    }
  },

  error: (...args: Parameters<typeof console.error>) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(...args)
    }
  }
}
