import type {Message} from '@sanity/comlink'

/**
 * @public
 */
export interface PathChangeMessage extends Message {
  type: 'dashboard/v1/history/change-path'
  data: {
    path: string
    type: 'push' | 'pop' | 'replace'
  }
}

/**
 * @public
 */
export type WindowMessages = PathChangeMessage
