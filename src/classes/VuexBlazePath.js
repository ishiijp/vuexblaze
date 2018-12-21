import { flatten } from 'lodash'

export default class VuexBlazePath {
  constructor(parentPath, selfPaths, options) {
    this.parentPath = parentPath
    this.selfPaths = selfPaths
    this.options = options
  }

  static createRoot(options) {
    return new VuexBlazePath(null, [], options)
  }

  get() {
    return this.parentPath
      ? flatten([this.parentPath.get(), this.selfPaths])
      : this.selfPaths
  }

  createChild(paths) {
    return new VuexBlazePath(this, paths, this.options)
  }

  update(paths) {
    this.selfPaths = Array.isArray(paths) ? paths : [paths]
    return this
  }

  get length() {
    return this.get().length
  }

  get isRefLimit() {
    return !(this.length < this.options.refDepth)
  }
}
