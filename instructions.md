# Nimbus

## Documentation

- [Nimbus documentation](https://nimbus.guide/) — upstream operations, checkpoint sync, and client options
- [Ethereum Checkpoint Sync Endpoints](https://eth-clients.github.io/checkpoint-sync-endpoints/) — community-maintained mainnet checkpoint sync providers and verification roots

## Getting set up

1. Install and start **Nethermind** on the same StartOS server first. Nimbus connects to Nethermind automatically with no manual JWT configuration.
2. Open **Configuration → Settings** and choose **Blockchain storage**: either the StartOS data drive (requires at least 150 GiB) or a shared volume with read/write access granted. Changing storage later does not move existing data.
3. Choose an **Initial checkpoint sync** source. A curated community endpoint is selected by default so Nimbus reaches the beacon chain head in a few minutes instead of 2–3+ weeks from genesis. Optionally enter a **Trusted block root** (`0x...`) from an independent source to pin light-client verification; an unverified checkpoint provider could mislead your node about the chain.
4. Choose a **Consensus peer port** (TCP and UDP; QUIC UDP automatically uses the next port, `+1`) and a **Target consensus peers** value. On servers with less than 16 GB of RAM, the peer target is capped at 100 and worker threads and REST state caching are scaled down automatically.
5. Start Nimbus and watch its health checks: **Execution RPC**, **Consensus API**, **Consensus Sync**, **Peer Network**, **Peers**, **Disk Space**, and **Log Health**.

## Syncing and health checks

- While catching up on slots, **Consensus Sync** shows the active sync stage, an approximate percentage, slot rate, and estimated time remaining.
- Once Nimbus reaches the beacon chain tip while Nethermind is still syncing, **Consensus Sync** reports that Nimbus is at head waiting for execution sync (along with historical backfill progress when active). Wait for both Nimbus and Nethermind to show synced before relying on balances or sending transactions.
- **Log Health** scans Nimbus's live logs automatically, ignores normal startup and peer chatter, and alerts you in plain language (and via StartOS notifications for critical failures) if it spots database/disk errors, JWT authentication mismatches, clock drift, or recurring failures. Run **Maintenance → Log Summary** any time to view or copy a categorized summary of recent issues.
- You will receive a StartOS notification when initial consensus sync finishes.

### Re-syncing from a checkpoint

The **Initial checkpoint sync** setting in **Settings** applies only when the consensus database is empty. If Nimbus is already syncing from genesis or you want to re-sync from a fresh finalized state, run **Maintenance → Checkpoint Sync**. This deletes the consensus database (`/chain/nimbus/db`), leaves validator keys untouched, and downloads a recent finalized state in 1–2 minutes.

## Peer connections and StartTunnel

Choose a peer port (and its adjacent `+1` QUIC port) not used by other nodes on your network, then enable the public address you want on the **Peer Network** interface:

- **Home gateway:** Forward the peer TCP and UDP port and the QUIC UDP (`+1`) port on your router to your StartOS server. The grouped **Peer Network** interface requests TCP and UDP for both ports; Nimbus does not listen on the QUIC TCP port.
- **StartTunnel:** If you publish **Peer Network** through a tunnel such as StartTunnel to keep your home IP private, send Nimbus's outbound traffic through that same tunnel too — otherwise Ethereum peers that Nimbus dials out to will see your home IP. If you use a tunnel only because your router cannot forward ports, you have nothing extra to change.

You can switch **Peer Network** and outbound traffic between StartTunnel and your home gateway without triggering intermediate restarts of Nimbus. While inbound and outbound gateways differ, **Peer Network** waits until both use the same gateway, and Nimbus updates its advertised discovery address automatically once outbound traffic moves (or immediately if you restart Nimbus).

Changing the **Consensus peer port** in **Settings** restarts Nimbus and resets the public address selection on **Peer Network**; enable your desired public address again afterward.

Use **Network → Test Ports** to confirm Nimbus is listening locally on TCP, discovery UDP, and QUIC UDP and to inspect enabled addresses and the active outbound gateway. Local socket checks do not test whether your ports are reachable from the internet.

## Backups

Backups include Nimbus's settings only; the reconstructible consensus database is excluded. Shared volumes are backed up separately. If you restore a shared volume, grant Nimbus read/write access and select its new identity in **Settings**. If Nethermind's authentication changes after a restore, restart Nimbus.
