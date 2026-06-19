/**
 * Serialize a JSON-LD object for `dangerouslySetInnerHTML`, escaping "<" as
 * its unicode escape so a value containing "</script>" can't break out of the
 * surrounding <script> block. JSON.stringify alone does not escape "<".
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
