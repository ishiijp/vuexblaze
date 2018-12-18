export const actionName = (name, baseName) => {
  return `${name.toUpperCase()}_${baseName.toUpperCase()}`
}

export const isObject = o => o && typeof o === 'object'
export const isReference = o => o && o.onSnapshot
export const isDocumentReference = o => isReference(o) && !o.doc
export const isCollectionReference = o => isReference(o) && o.doc