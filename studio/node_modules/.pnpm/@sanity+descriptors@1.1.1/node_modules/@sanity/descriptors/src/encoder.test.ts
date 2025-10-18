import {describe, expect, test} from 'vitest'

import testDescriptors from './__fixtures__/descriptors.json'
import {encode, type Encoded} from './encoder'

describe('Fixtures', () => {
  test.each(
    [...Object.entries(testDescriptors as Record<string, Encoded<string>>)].filter(
      ([_, val]) => val['$invalid'] !== true,
    ),
  )('%s', (_, {id, type, ...restContent}) => {
    const encoded = encode(type, restContent)
    expect(encoded.id).toBe(id)
  })
})
