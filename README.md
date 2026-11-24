<p align="center"><img src="icon.jpg" alt="Nimbus logo" width="21%"></p>

# Nimbus on StartOS

Experimental Ethereum consensus client package for StartOS.

## Image and Container Runtime

`statusim/nimbus-eth2:multiarch-v26.10.2`; x86_64 and aarch64 images (`emulateMissing: false`). One `nimbus` daemon with `sigtermTimeout: 60_000` so SQLite/chaindag state flushes cleanly on stop.

## System Resources

- **Minimum RAM**: Manifest sets `hardwareRequirements.ram` to 12 GiB (excluding 8 GB devices while permitting 16 GB hosts with StartOS's 1 GiB reserve and iGPU carve-outs).
- **Runtime scaling**: At startup, `computeResourceBudget()` inspects container RAM (`os.totalmem()`) and CPU count (`os.availableParallelism()`) and sets `--num-threads` (half of cores, clamped 1–4), `--rest-statecache-size` (`1` on <12 GiB container RAM, `3` otherwise), `--rest-statecache-ttl` (`30`s / `60`s), and caps `--max-peers` (`100` on <12 GiB container RAM, `250` otherwise).
- **Disk protection**: The Settings action displays free/total space on the StartOS data drive and refuses to select it when total capacity is under 150 GiB. The `Disk Space` health check monitors `/chain` (`df -PB1 /chain`) and flags <40 GiB free as low and <15 GiB free as critical (`failure`).

## Volume and Data Layout

`config` stores settings; the selected `chain` or granted shared volume is mounted at `/chain` and uses `/chain/nimbus`. Missing or read-only grants prevent startup.

## File Models

`config/store.json` stores the settings (`storage`, `consensusPort`, `quicPort`, `consensusPeers`, `checkpointUrl`, `trustedBlockRoot`) and `fullySynced` flag. Startup watches only startup-relevant settings, so recording `fullySynced` never restarts the service.

## Dependencies

Nethermind is a required running dependency. Its bridge-only `engine-api` binding is resolved dynamically with `sdk.host.getBridgeAddress`; its `engine-auth` volume is mounted read-only. A missing address leaves a visible execution health failure. The contract uses a package ID, host ID, internal port, and volume ID; future execution providers need their own dependency selection.

## Network Access and Interfaces

Beacon API 5052 is bound without an exported interface, so it is reachable only on the host bridge. Adjacent consensus P2P and QUIC ports share one range interface, `peer-network`, using TCP and UDP on both ports. Nimbus listens on peer TCP and discovery UDP at the peer port and QUIC UDP at the next port (`+1`); TCP on the QUIC port has no Nimbus listener. A range allows one public-address choice per gateway for both ports.

Nimbus runs with `--nat=none --enr-auto-update=true`: StartOS drops container UPnP/NAT-PMP, and automatic ENR updates let Nimbus discover and refresh its external IP from peers over whichever outbound gateway is active. Because `main.ts` does not `.const()` the outbound gateway or interface host, enabling/disabling gateways (e.g., switching between StartTunnel and local WAN) never forces intermediate restarts of Nimbus. Instead, the `Peer Network` health check subscribes reactively via `.onChange()` and `sdk.host.getAddressGateways()` to report gateway mismatches and live ENR advertisement status.

Changing the peer port retires the previous range binding and resets its public address selection.

## Installation and First-Run Flow

Grant and select storage, set the peer port (QUIC automatically uses port + 1), and start. Install Nethermind on the same StartOS server first. Nimbus declares it as a dependency, resolves its Engine API over the StartOS bridge, and mounts its JWT volume read-only. No manual secret copying or public Engine port is needed.

## Actions

- **Configuration → Settings**: Selects storage, initial checkpoint sync source (curated HTTPS community endpoints, custom beacon API URL, or genesis sync, plus an optional `--trusted-block-root`), peer port, and target peers (capped on low-RAM hosts). Warns on hosts with less than 16 GB of RAM and never returns a JWT. Initial checkpoint sync flags (`--external-beacon-api-url` / `--trusted-block-root`) apply only when `/chain/nimbus/db` is empty.
- **Maintenance → Checkpoint Sync** (`only-stopped`): Deletes `/chain/nimbus/db` (leaving validator keys untouched) and runs `nimbus_beacon_node trustedNodeSync --backfill=false` in a temporary subcontainer (`sdk.SubContainer.withTemp`) against a curated community endpoint or custom beacon API URL, with optional `--trusted-block-root` verification.
- **Maintenance → Log Summary** (`any`): Reads the rolling log-health telemetry (`config/log-health.json`, excluded from backups) and displays a copyable summary of recent categorized warnings/errors and up to 12 notable log lines.
- **Network → Test Ports**: Checks local TCP and UDP sockets and lists local and enabled public peer and QUIC addresses, plus the outbound gateway. Local socket checks cannot prove WAN reachability or test UDP across a firewall.

## Tasks and Notifications

A critical task requests configuration if selected storage is unset, unavailable, revoked, or read-only. Notifications (`sdk.notification.create`) are sent once per run for initial `Consensus Sync Complete` and for critical log-health failures (database/disk errors, fatal/OOM errors, persistent JWT auth mismatches, and sustained clock drift/slot lag), with Markdown recovery steps attached.

## Health Checks

- **Execution RPC**: Reports Nimbus's `el_offline` status from its Beacon API.
- **Consensus API**: Readiness check on port 5052.
- **Consensus Sync**: Combines Beacon API sync state with Nimbus's live `Slot start` log telemetry (`ConsensusLogTracker`) to show the active stage (forward sync, waiting for peers, optimistic at head with slot number, or historical backfill), percentage, slot rate, and ETA; fires a one-time notification once fully synced.
- **Peer Network**: Reactive check combining port-assignment verification, `sdk.host.getAddressGateways()` inbound/outbound gateway consistency, and live ENR discovery IP from `/eth/v1/node/identity`.
- **Peers**: Connected inbound and outbound peer counts.
- **Disk Space**: Free/total space on `/chain` (warns below 40 GiB, fails below 15 GiB).
- **Log Health**: Real-time sliding-window log scanner (`LogHealthMonitor`) that filters known benign startup/peer messages and flags actionable database/disk, fatal/OOM, JWT auth, Engine API, clock-drift/slot-lag, and recurring uncategorized errors in plain English.

## Backups and Restore

`config` only; blockchain data excluded. Shared volumes are separate backup items; restore grants and selects the new ID.

## Limitations and Differences

Experimental; full mainnet synchronization, UDP discovery, wallet compatibility and backup/restore require real-server verification. No validator, archive-state node, bandwidth cap, or public wallet-RPC authentication is included. A package supports only explicitly listed dependencies.

## Quick Reference for AI Consumers

```yaml
package_id: nimbus
images: [statusim/nimbus-eth2:multiarch-v26.10.2]
subcontainers: [nimbus]
shared_volumes: [selected-chain]
dependencies: [nethermind]
actions: [configure, checkpoint-sync, log-summary, test-ports]
```
