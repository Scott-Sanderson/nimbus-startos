import { readFile } from 'node:fs/promises'
import { sdk } from '../sdk'
import { i18n } from '../i18n'
import { storeJson } from '../fileModels/store.json'
import { adjacentPeerPorts, peerRangeStart } from '../utils'

async function socketBound(
  port: number,
  protocol: 'tcp' | 'udp',
): Promise<boolean> {
  for (const path of [`/proc/net/${protocol}`, `/proc/net/${protocol}6`]) {
    const lines = (await readFile(path, 'utf8')).split('\n').slice(1)
    for (const line of lines) {
      const columns = line.trim().split(/\s+/)
      const local = columns[1]?.split(':')
      if (local?.length !== 2) continue
      if (
        Number.parseInt(local[1], 16) === port &&
        (protocol === 'udp' || columns[3] === '0A')
      )
        return true
    }
  }
  return false
}

export const testPorts = sdk.Action.withoutInput(
  'test-ports',
  async () => ({
    name: i18n('Test Ports'),
    description: i18n(
      'Check local listeners, enabled addresses, and the outbound gateway.',
    ),
    warning: null,
    allowedStatuses: 'only-running',
    group: i18n('Network'),
    visibility: 'enabled',
  }),
  async ({ effects }) => {
    const config = await storeJson.read().once()
    if (!config?.storage) throw new Error(i18n('Choose a storage location.'))
    const grouped = adjacentPeerPorts(config.consensusPort, config.quicPort)
    const startPort = peerRangeStart(config.consensusPort, config.quicPort)
    const [tcp, discovery, quic, peerHost, quicHost, gateway] =
      await Promise.all([
        socketBound(config.consensusPort, 'tcp'),
        socketBound(config.consensusPort, 'udp'),
        socketBound(config.quicPort, 'udp'),
        sdk.host
          .getOwn(effects, grouped ? 'peer-network' : 'consensus-peers')
          .once(),
        grouped
          ? Promise.resolve(null)
          : sdk.host.getOwn(effects, 'consensus-quic').once(),
        sdk.getOutboundGateway(effects).once(),
      ])
    const peerBinding = peerHost?.bindings[config.consensusPort]
    const quicBinding = quicHost?.bindings[config.quicPort]
    const range = grouped ? peerHost?.bindingRanges[startPort] : null
    const state = (bound: boolean) =>
      bound ? i18n('Listening locally') : i18n('Not listening locally')
    const lines = [
      i18n('Peer TCP ${port}: ${state}', {
        port: String(config.consensusPort),
        state: state(tcp),
      }),
      i18n('Discovery UDP ${port}: ${state}', {
        port: String(config.consensusPort),
        state: state(discovery),
      }),
      i18n('QUIC UDP ${port}: ${state}', {
        port: String(config.quicPort),
        state: state(quic),
      }),
    ]
    const addresses =
      (grouped
        ? range?.addresses.effective
        : peerBinding?.addresses.effective) ?? []
    const localAddresses = [
      ...new Set(
        addresses
          .filter(
            (address) =>
              !address.public &&
              address.metadata.kind === 'ipv4' &&
              address.metadata.gateway !== 'lo' &&
              address.metadata.gateway !== 'lxcbr0',
          )
          .map(
            (address) =>
              `${address.hostname} (${address.metadata.kind === 'ipv4' ? address.metadata.gateway : ''})`,
          ),
      ),
    ]
    const publicAddresses = [
      ...new Set(
        addresses
          .filter(
            (address) => address.public && address.metadata.kind === 'ipv4',
          )
          .map(
            (address) =>
              `${address.hostname}:${grouped ? config.consensusPort : address.port} (${address.metadata.kind === 'ipv4' ? address.metadata.gateway : ''})`,
          ),
      ),
    ]
    lines.push(
      i18n('Local addresses: ${addresses}', {
        addresses: localAddresses.join(', ') || i18n('None'),
      }),
    )
    lines.push(
      i18n('Enabled public peer addresses: ${addresses}', {
        addresses: publicAddresses.join(', ') || i18n('None'),
      }),
    )
    const publicQuicAddresses = [
      ...new Set(
        (grouped ? addresses : (quicBinding?.addresses.effective ?? []))
          .filter(
            (address) => address.public && address.metadata.kind === 'ipv4',
          )
          .map(
            (address) =>
              `${address.hostname}:${grouped ? config.quicPort : address.port} (${address.metadata.kind === 'ipv4' ? address.metadata.gateway : ''})`,
          ),
      ),
    ]
    lines.push(
      i18n('Enabled public QUIC addresses: ${addresses}', {
        addresses: publicQuicAddresses.join(', ') || i18n('None'),
      }),
      i18n('Outbound gateway: ${gateway}', { gateway }),
    )
    if (
      (grouped && range != null && range.externalStartPort !== startPort) ||
      (peerBinding?.net.assignedPort != null &&
        peerBinding.net.assignedPort !== config.consensusPort) ||
      (quicBinding?.net.assignedPort != null &&
        quicBinding.net.assignedPort !== config.quicPort)
    )
      lines.push(
        i18n(
          'An external peer port differs from Settings. Make them match; saving Settings restarts Nimbus automatically.',
        ),
      )
    return {
      version: '1',
      title: i18n('Port diagnostics'),
      message: grouped
        ? i18n(
            'These checks only test local listeners. StartOS does not currently provide an external port test for grouped ports; UDP and QUIC reachability are not tested.',
          )
        : i18n(
            'These checks only test local listeners. To test public TCP, open Interfaces → Consensus Peers → the public address → Address Requirements (gear) → Test. This does not test UDP or QUIC from the internet.',
          ),
      result: {
        type: 'multiline',
        value: lines.join('\n'),
        copyable: true,
        qr: false,
        masked: false,
        filename: null,
      },
    }
  },
)
