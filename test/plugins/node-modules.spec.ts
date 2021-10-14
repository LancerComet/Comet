import { transformImportPath } from '../../lib/plugins/node-modules'

describe('Typescript Plugin test.', () => {
  it('handleAbsoluteImportPath', () => {
    const code = `
      import aa from "aa/a"
      import a, { ab } from 'x3x4a.jpg'
      import { ab }, a from '12xx/a_a.jpg'
      import a from '@bilibili-firebird/a'
      import v from 'vue.a'

      import aa from '../../aaa'
      import aa from '/abc'
      import from from './1aa.jpg'
    `
    const replacedCode = transformImportPath(code)
    expect(replacedCode).toBe(`
      import aa from '/node_modules/aa/a'
      import a, { ab } from '/node_modules/x3x4a.jpg'
      import { ab }, a from '/node_modules/12xx/a_a.jpg'
      import a from '/node_modules/@bilibili-firebird/a'
      import v from '/node_modules/vue.a'

      import aa from '../../aaa'
      import aa from '/abc'
      import from from './1aa.jpg'
    `)
  })
})
