import {describe, expect, it} from 'vitest'

import {processSetSynchronization, SetBuilder, type SetSynchronization} from './set'

function buildSync<Type extends string>(
  type: Type,
  fn: (builder: SetBuilder) => void,
): SetSynchronization<Type> {
  const builder = new SetBuilder()
  fn(builder)
  return builder.build<Type>(type)
}

describe(processSetSynchronization.name, () => {
  const child = buildSync('test.set', (builder) => {
    builder.addObject('test.obj', {name: 'pears'})
  })

  const sync = buildSync('test.set', (builder) => {
    builder.addObject('test.obj', {name: 'hello'})
    builder.addObject('test.obj', {name: 'world'})
    builder.addSet(child)
  })

  it('requests minimally in the first request', () => {
    expect(processSetSynchronization(sync, null)).toEqual({id: sync.set.id})
  })

  it('returns null on succeess', () => {
    const request = processSetSynchronization(sync, {type: 'complete'})
    expect(request).toBeNull()
  })

  it('passes along the set if requesetd', () => {
    const request = processSetSynchronization(sync, {type: 'incomplete', missingIds: [sync.set.id]})
    expectNotNull(request)
    expect(request).toHaveProperty('descriptors')
    expect(request.descriptors).toEqual([sync.set])
  })

  it('passes along the child set if requested', () => {
    const request = processSetSynchronization(sync, {
      type: 'incomplete',
      missingIds: [child.set.id],
    })
    expectNotNull(request)
    expect(request).toHaveProperty('descriptors')
    expect(request.descriptors).toEqual([child.set])
  })

  it('passes along object values if requested', () => {
    // The top-level set contains two objects + one other set.
    // Remove the other set.

    const keys = sync.set.keys.filter((id) => id !== child.set.id)
    const request = processSetSynchronization(sync, {type: 'incomplete', missingIds: keys})
    expectNotNull(request)
    expect(request.descriptors).toEqual(keys.map((id) => sync.objectValues[id]))
  })

  it('passes along object values in child sets if requested', () => {
    const request = processSetSynchronization(sync, {
      type: 'incomplete',
      missingIds: child.set.keys,
    })
    expectNotNull(request)
    expect(request.descriptors).toEqual(child.set.keys.map((id) => child.objectValues[id]))
  })
})

function expectNotNull<T>(val: T | null): asserts val is T {
  expect(val).not.toBeNull()
}
