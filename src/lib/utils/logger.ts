export const logger = {
  info: (message: string, meta?: any) => {
    if (process.env.NODE_ENV !== "test") {
      console.log(`[INFO] ${message}`, meta ? meta : "")
    }
  },
  error: (message: string, error?: any) => {
    if (process.env.NODE_ENV !== "test") {
      console.error(`[ERROR] ${message}`, error ? error : "")
    }
  },
  warn: (message: string, meta?: any) => {
    if (process.env.NODE_ENV !== "test") {
      console.warn(`[WARN] ${message}`, meta ? meta : "")
    }
  },
}
