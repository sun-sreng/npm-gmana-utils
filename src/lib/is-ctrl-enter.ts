export function isCtrlEnter(event: KeyboardEvent) {
  return event.key === "Enter" && (event.metaKey || event.ctrlKey)
}
