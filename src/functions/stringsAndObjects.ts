export function getParseMessageError(obj: any, path: any) {
  const travel = (regexp: any) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce(
        (res, key) => (res !== null && res !== undefined ? res[key] : res),
        obj,
      )

  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)

  return result
}

export const saveMenuToStorage = (data: any) => {
  try {
    let _data = JSON.stringify(data)
    _data = Buffer.from(_data.toString()).toString('base64')
    localStorage.setItem('menus', _data)
  } catch (error) {}
}

export const getMenuToStorage = () => {
  let data = localStorage.getItem('menus')
  if (data !== undefined && data != null) {
    data = Buffer.from(data, 'base64').toString('utf8')
    data = JSON.parse(data)
    return data
  }
}
