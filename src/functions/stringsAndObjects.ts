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

export function haveData(value: any) {
  return (
    value !== undefined && value != null && value !== '' && value.length !== 0
  )
}
