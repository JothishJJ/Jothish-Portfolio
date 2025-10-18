import type {Message} from '@sanity/comlink'

import type {Resource} from '../types'

/**
 * @public
 */
export interface Context_v1 {
  organizationId: string
  /**
   * Information about the current application
   */
  resource: Resource
  /**
   * All the resources available to the current user
   */
  availableResources: Resource[]
}

/**
 * Message sent to fetch the context of the
 * current application within the dashboard.
 * @public
 */
export interface ContextMessage_v1 extends Message {
  type: 'dashboard/v1/context'
  response: {
    context: Context_v1
  }
}
