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

export function clearCharacters(text: string) {
  if (typeof text === 'string') {
    return text?.replace(/[^\w\sÀ-ÖØ-öø-ÿ]/gi, '')
  }

  return 'A operação falhou'
}
