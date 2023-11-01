export function ipv6ToIpv4(ipv6Address: string): string {
    if (ipv6Address.startsWith('::ffff:')) {
        return ipv6Address.substring(7);
    }
    return ipv6Address;
}
