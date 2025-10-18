export default {
  unresolvedParameterReference: {
    input: {
      resources: [
        {
          name: 'a-function',
          type: 'cloud-function',
          config: {memory: '$.parameters.memory'},
        },
      ],
      parameters: [
        {
          name: 'memory',
          type: 'env-var',
          input: 'MEM',
        },
      ],
    },
    expected: {
      resources: [
        {
          name: 'a-function',
          type: 'cloud-function',
          config: {memory: '$.parameters.memory'},
        },
      ],
      parameters: [
        {
          name: 'memory',
          type: 'env-var',
          input: 'MEM',
        },
      ],
    },
  },

  unresolvedParameterReferenceAndRegularReference: {
    input: {
      resources: [
        {
          name: 'a-function',
          type: 'cloud-function',
          config: {
            memory: '$.parameters.memory',
            disk: '$.values.disk',
          },
        },
      ],
      parameters: [
        {
          name: 'memory',
          type: 'env-var',
          input: 'MEM',
        },
      ],
    },
    expected: {
      resources: [
        {
          name: 'a-function',
          type: 'cloud-function',
          config: {
            memory: '$.parameters.memory',
            disk: '$.values.disk',
          },
        },
      ],
      parameters: [
        {
          name: 'memory',
          type: 'env-var',
          input: 'MEM',
        },
      ],
    },
    unresolved: [
      {
        path: 'resources.a-function.config.disk',
        property: 'disk',
        ref: '$.values.disk',
        item: {
          memory: '$.parameters.memory',
          disk: '$.values.disk',
        },
      },
    ],
  },
}
