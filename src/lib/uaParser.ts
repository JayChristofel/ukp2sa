import { UAParser } from "ua-parser-js";

export const parseUserAgent = (uaString: string) => {
  const parser = new UAParser(uaString);
  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();

  return {
    browser: `${browser.name || "Unknown"} ${browser.version || ""}`.trim(),
    os: `${os.name || "Unknown"} ${os.version || ""}`.trim(),
    device: device.model || (os.name === "Android" || os.name === "iOS" ? "Mobile" : "Desktop"),
    isMobile: os.name === "Android" || os.name === "iOS" || device.type === "mobile",
  };
};
