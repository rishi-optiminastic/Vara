import pino from 'pino'

const isDev = process.env.NODE_ENV === 'development'

export const logger = pino({
  level: isDev ? 'debug' : 'info',
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        ignore: 'pid,hostname',
        translateTime: 'HH:MM:ss',
      },
    },
  }),
})

/**
 * Create a child logger scoped to a specific module.
 *
 * Usage:
 *   const log = createLogger('UserService')
 *   log.info({ userId }, 'User created')
 */
export function createLogger(module: string): pino.Logger {
  return logger.child({ module })
}
