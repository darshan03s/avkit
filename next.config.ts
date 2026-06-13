import type { NextConfig } from 'next'
import os from 'node:os'

function getLocalIPs() {
  const ips = Object.values(os.networkInterfaces())
    .flat()
    .filter((iface): iface is NonNullable<typeof iface> =>
      Boolean(iface && iface.family === 'IPv4' && !iface.internal)
    )
    .map((iface) => iface.address)

  return ips
}

const nextConfig: NextConfig = {
  allowedDevOrigins: getLocalIPs()
}

export default nextConfig
