export function mcpError(message) {
  return {
    content: [{ type: "text", text: message }],
    isError: true,
  };
}
