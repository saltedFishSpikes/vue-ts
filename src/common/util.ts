import { ClassType } from './init'
export const setObjectAttr = (obj: object, key: number | string, value: any) => {
  Object.defineProperties(obj, {
    [key]: {
      value: value,
      writable: true,
      enumerable: true
    }
  })
}
export const mergeClass = (currCls: ClassType, otherCls: ClassType): object => {
  let res = {}
  if (currCls instanceof Array) {
    currCls.forEach(i => {
      setObjectAttr(res, i, true)
    })
  } else if (typeof currCls === 'object') {
    const vals = Object.values(currCls)
    const keys = Object.keys(currCls)
    for (let i = 0; i < keys.length; i++) {
      setObjectAttr(res, keys[i], vals[i])
    }
  } else {
    setObjectAttr(res, currCls, true)
  }

  if (otherCls instanceof Array) {
    otherCls.forEach(i => {
      setObjectAttr(res, i, true)
    })
  } else if (typeof otherCls === 'object') {
    const vals = Object.values(otherCls)
    const keys = Object.keys(otherCls)
    for (let i = 0; i < keys.length; i++) {
      setObjectAttr(res, keys[i], vals[i])
    }
  } else {
    setObjectAttr(res, otherCls, true)
  }
  return res
}
// scroll宽度
let scrollWidth: null|number = null
export const getScrollWidth = () => {
  if (scrollWidth || scrollWidth === 0) return scrollWidth
  let noScrollWidth = document.documentElement.clientWidth
  const body: HTMLBodyElement = document.getElementsByTagName('body')[0]
  let div = document.createElement('div')
  div.style.height = '10000px'
  div.style.overflow = 'scroll'
  div.style.opacity = '0'
  body.appendChild(div)
  let hasScrollWidth = document.documentElement.clientWidth
  body.removeChild(div)
  scrollWidth = noScrollWidth - hasScrollWidth
  return scrollWidth
}